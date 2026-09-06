#!/usr/bin/env python3
"""
SheraTutor: Embedding and Dual Vector Store Exporter.
Generates 1024-dim dense embeddings using Ollama bge-m3,
and writes to both a local ChromaDB instance and Supabase-ready SQL.
"""

import os
import sys
import json
from pathlib import Path
from typing import List, Dict, Any, Optional

import requests
import chromadb
from chromadb.config import Settings

from chunk_classifier import ClassifiedChunk

OLLAMA_BASE_URL = os.environ.get("OLLAMA_URL", "http://localhost:11434")
DEFAULT_EMBED_MODEL = os.environ.get("EMBED_MODEL", "bge-m3")
LOCAL_CHROMA_PATH = os.environ.get("CHROMA_PATH", str(Path(__file__).parent / "chroma_db"))


def get_embedding(
    text: str,
    model_name: str = DEFAULT_EMBED_MODEL,
    base_url: str = OLLAMA_BASE_URL,
    timeout: int = 60
) -> List[float]:
    """Generate 1024-dim embedding from Ollama /api/embed."""
    payload = {
        "model": model_name,
        "input": text
    }
    resp = requests.post(f"{base_url}/api/embed", json=payload, timeout=timeout)
    if resp.status_code != 200:
        raise RuntimeError(f"Ollama Embed error ({resp.status_code}): {resp.text}")
    
    embeddings = resp.json().get("embeddings", [])
    if not embeddings:
        raise ValueError("Ollama returned empty embeddings array.")
    return embeddings[0]


def get_chroma_collection(
    persist_dir: str = LOCAL_CHROMA_PATH,
    collection_name: str = "curriculum_chunks"
):
    """Initialize or load a local persistent ChromaDB collection."""
    os.makedirs(persist_dir, exist_ok=True)
    client = chromadb.PersistentClient(path=persist_dir)
    return client.get_or_create_collection(
        name=collection_name,
        metadata={"hnsw:space": "cosine"}
    )


def save_to_chroma(
    collection,
    chunks: List[ClassifiedChunk],
    embeddings: List[List[float]],
    subject_code: str,
    language: str,
    chapter_no: int,
    source_filename: str
):
    """Store classified chunks into local ChromaDB."""
    ids = []
    docs = []
    metas = []
    embs = []

    for chunk, emb in zip(chunks, embeddings):
        ids.append(chunk.chunk_id)
        docs.append(chunk.content)
        embs.append(emb)
        metas.append({
            "subject_code": subject_code,
            "language": language,
            "chapter_no": chapter_no,
            "page_no": chunk.page_no,
            "chunk_type": chunk.chunk_type,
            "parent_chunk_id": chunk.parent_chunk_id or "",
            "section_no": chunk.section_no or "",
            "section_title": chunk.section_title or "",
            "source_file": source_filename,
            "chunk_index": chunk.chunk_index
        })

    if ids:
        collection.upsert(
            ids=ids,
            documents=docs,
            embeddings=embs,
            metadatas=metas
        )


def sql_escape(val: Optional[str]) -> str:
    """Escape text for SQL single-quoted literals."""
    if val is None:
        return "NULL"
    return "'" + val.replace("'", "''") + "'"


def generate_supabase_sql(
    chunks: List[ClassifiedChunk],
    embeddings: List[List[float]],
    subject_code: str,
    language: str,
    chapter_id: str,
    edition_year: int = 2026,
    model_name: str = "bge-m3",
    model_version: str = "v1"
) -> str:
    """
    Generate batch SQL INSERT statements for Supabase:
    inserts into public.curriculum_chunks and public.chunk_embeddings.
    """
    curriculum_version_subquery = (
        f"(SELECT cv.id FROM public.curriculum_versions cv "
        f"JOIN public.subjects s ON s.id = cv.subject_id "
        f"WHERE s.code = '{subject_code}' AND cv.language_tag = '{language}' AND cv.edition_year = {edition_year} LIMIT 1)"
    )

    sql_statements = ["BEGIN;"]

    for chunk, emb in zip(chunks, embeddings):
        parent_id_expr = f"'{chunk.parent_chunk_id}'::uuid" if chunk.parent_chunk_id else "NULL"
        section_no_expr = sql_escape(chunk.section_no)
        section_title_expr = sql_escape(chunk.section_title)
        content_expr = sql_escape(chunk.content)
        page_ref_expr = sql_escape(str(chunk.page_no))
        emb_literal = "[" + ",".join(f"{x:.8f}" for x in emb) + "]"

        stmt = f"""
WITH new_chunk AS (
  INSERT INTO public.curriculum_chunks (
    id, chapter_id, curriculum_version_id, content_chunk, content_format,
    source_book_page_ref, chunk_index, chunk_type, parent_chunk_id,
    section_no, section_title
  ) VALUES (
    '{chunk.chunk_id}'::uuid,
    '{chapter_id}'::uuid,
    {curriculum_version_subquery},
    {content_expr},
    'markdown',
    {page_ref_expr},
    {chunk.chunk_index},
    '{chunk.chunk_type}',
    {parent_id_expr},
    {section_no_expr},
    {section_title_expr}
  )
  ON CONFLICT (id) DO UPDATE SET
    content_chunk = EXCLUDED.content_chunk,
    chunk_type = EXCLUDED.chunk_type,
    parent_chunk_id = EXCLUDED.parent_chunk_id
  RETURNING id
)
INSERT INTO public.chunk_embeddings (
  chunk_id, model_name, model_version, embedding
)
SELECT id, '{model_name}', '{model_version}', '{emb_literal}'::extensions.vector(1024)
FROM new_chunk
ON CONFLICT (chunk_id, model_name, model_version) DO UPDATE SET
  embedding = EXCLUDED.embedding;
"""
        sql_statements.append(stmt.strip())

    sql_statements.append("COMMIT;")
    return "\n\n".join(sql_statements)
