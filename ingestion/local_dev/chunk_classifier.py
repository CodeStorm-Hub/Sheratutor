"""
Chunk classifier and hierarchical parser for NCTB secondary curriculum textbooks.
Categorizes text into:
- theory: standard conceptual and expository sections
- worked_example: math/physics/chemistry problem with explicit solution
- cq_stimulus: Creative Question (সৃজনশীল প্রশ্ন) introductory scenario
- cq_subquestion: Sub-questions (ক, খ, গ, ঘ or a, b, c, d)
"""

import re
import uuid
from typing import List, Dict, Any, Optional
from pydantic import BaseModel, Field


class ClassifiedChunk(BaseModel):
    chunk_id: str
    chunk_type: str = Field(description="'theory' | 'worked_example' | 'cq_stimulus' | 'cq_subquestion' | 'table'")
    parent_chunk_id: Optional[str] = None
    section_no: Optional[str] = None
    section_title: Optional[str] = None
    content: str
    page_no: int
    chunk_index: int


# Patterns for NCTB Creative Questions
CQ_STIMULUS_PATTERNS = [
    r"(?i)\*\*\[?(?:উদ্দীপক|stimulus)\]?\*\*",
    r"(?:উদ্দীপকটি\s*পড়ে|নিচের\s*উদ্দীপক|উদ্দীপকের\s*আলোকে)",
    r"(?:read\s+the\s+stem|following\s+stimulus)",
]

CQ_SUBQ_PATTERNS = [
    r"^\s*[\(（]?([কখগঘabcdABCD])[\)）][\.\s]",
    r"^\s*([কখগঘ])\s*[\.\:\-]",
]

WORKED_EXAMPLE_PATTERNS = [
    r"(?i)(?:উদাহরণ|গাণিতিক\s*উদাহরণ|সমস্যা\s*ও\s*সমাধান|worked\s*example|example\s*\d+)",
    r"(?:সমাধান\s*[:ঃ]|solution\s*[:ঃ])",
]

SECTION_HEADING_PATTERN = re.compile(
    r"^(?:#{1,3})\s*(\d+(?:\.\d+)*)\s*[:\-\s]\s*(.+)$", re.MULTILINE
)


def extract_section_metadata(text: str) -> tuple[Optional[str], Optional[str]]:
    """Extract section number and title from markdown headers (e.g. ## 1.2 Atoms and Molecules)."""
    match = SECTION_HEADING_PATTERN.search(text)
    if match:
        return match.group(1).strip(), match.group(2).strip()
    return None, None


def classify_text_block(text: str) -> str:
    """Classify the primary content type of a markdown block."""
    # Check for CQ stimulus
    for pat in CQ_STIMULUS_PATTERNS:
        if re.search(pat, text):
            return "cq_stimulus"

    # Check for CQ subquestion
    for pat in CQ_SUBQ_PATTERNS:
        if re.search(pat, text, re.MULTILINE):
            return "cq_subquestion"

    # Check for worked example
    for pat in WORKED_EXAMPLE_PATTERNS:
        if re.search(pat, text):
            return "worked_example"

    # Check for markdown table
    if text.count("|") >= 6 and "-|-" in text:
        return "table"

    return "theory"


def build_hierarchical_chunks(
    markdown_text: str,
    subject_code: str,
    language: str,
    page_no: int,
    start_chunk_index: int = 0,
    max_chunk_chars: int = 1100
) -> List[ClassifiedChunk]:
    """
    Splits page markdown into semantically coherent chunks,
    detects section metadata, classifies chunk types,
    and establishes parent-child relationships for CQ questions.
    """
    paragraphs = [p.strip() for p in markdown_text.split("\n\n") if p.strip()]
    if not paragraphs:
        return []

    # Detect page-level default section
    current_sec_no, current_sec_title = extract_section_metadata(markdown_text)

    raw_blocks: List[str] = []
    current_block = ""

    for p in paragraphs:
        # If paragraph introduces a new section, capture it
        sec_no, sec_title = extract_section_metadata(p)
        if sec_no:
            current_sec_no, current_sec_title = sec_no, sec_title

        if len(current_block) + len(p) <= max_chunk_chars:
            current_block = f"{current_block}\n\n{p}" if current_block else p
        else:
            if current_block:
                raw_blocks.append(current_block)
            current_block = p

    if current_block:
        raw_blocks.append(current_block)

    # Secondary pass: classify and link parent-child CQ stimuli
    classified_chunks: List[ClassifiedChunk] = []
    active_stimulus_id: Optional[str] = None
    chunk_counter = start_chunk_index

    for idx, block in enumerate(raw_blocks):
        c_type = classify_text_block(block)
        chunk_uuid = str(uuid.uuid4())
        
        parent_id = None
        if c_type == "cq_stimulus":
            active_stimulus_id = chunk_uuid
        elif c_type == "cq_subquestion":
            parent_id = active_stimulus_id
        else:
            # Non-CQ block clears active stimulus if it's new theory
            if c_type == "theory" and len(block) > 400:
                active_stimulus_id = None

        classified_chunks.append(
            ClassifiedChunk(
                chunk_id=chunk_uuid,
                chunk_type=c_type,
                parent_chunk_id=parent_id,
                section_no=current_sec_no,
                section_title=current_sec_title,
                content=block,
                page_no=page_no,
                chunk_index=chunk_counter,
            )
        )
        chunk_counter += 1

    return classified_chunks
