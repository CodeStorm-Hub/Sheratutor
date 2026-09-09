#!/usr/bin/env python3
"""
NCTB Multimodal Azure AI Pipeline
Author: SheraTutor AI Team
Integrates:
- Cropped Chemistry Visual Figures (Apparatus, Circuits, Graphs, Molecular models)
- Azure OpenAI Vision (gpt-4o-mini / gpt-5 architecture) for bilingual (BN/EN) scientific captioning
- Azure OpenAI text-embedding-3-large (1024-d) for multimodal semantic search
"""

import os
import json
import base64
import time
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

# Load environment
env_path = Path(__file__).parent / ".env"
load_dotenv(dotenv_path=env_path)

AZURE_ENDPOINT = os.getenv("AZURE_OPENAI_ENDPOINT", "https://sheratutor-ai-a6e24.openai.azure.com/")
AZURE_KEY = os.getenv("AZURE_OPENAI_API_KEY")
VISION_MODEL = os.getenv("AZURE_OPENAI_DEPLOYMENT_VISION", "gpt-4o-mini")
EMBEDDING_MODEL = os.getenv("AZURE_OPENAI_DEPLOYMENT_EMBEDDING", "text-embedding-3-large")
API_VERSION = "2024-12-01-preview"

client = AzureOpenAI(
    azure_endpoint=AZURE_ENDPOINT,
    api_key=AZURE_KEY,
    api_version=API_VERSION,
)

SYSTEM_PROMPT = """You are an expert AI multimodal curriculum annotator for Bangladesh NCTB Secondary Chemistry (Class 9-10).
Analyze the provided textbook figure and output STRICT JSON format with the following keys:
{
  "title_bn": "Short Bengali title describing the diagram",
  "title_en": "Short English title describing the diagram",
  "diagram_type": "apparatus_setup | molecular_structure | energy_graph | periodic_trend | lab_experiment | industrial_process",
  "apparatus_and_reagents": ["list", "of", "items", "visible"],
  "scientific_description_bn": "Concise 2-sentence explanation of what this figure teaches a student in Bengali.",
  "scientific_description_en": "Concise 2-sentence explanation of what this figure teaches a student in English."
}
Do NOT enclose in markdown backticks. Return valid JSON only."""

def encode_image(image_path: str) -> str:
    with open(image_path, "rb") as image_file:
        return base64.b64encode(image_file.read()).decode('utf-8')

def caption_diagram(image_path: str) -> dict:
    """Invokes Azure OpenAI Vision to produce structured bilingual captions."""
    b64 = encode_image(image_path)
    response = client.chat.completions.create(
        model=VISION_MODEL,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {
                "role": "user",
                "content": [
                    {"type": "text", "text": "Analyze this NCTB chemistry textbook diagram and return the JSON annotation."},
                    {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
                ]
            }
        ],
        max_completion_tokens=2500
    )
    raw_text = response.choices[0].message.content.strip()
    if raw_text.startswith("```json"):
        raw_text = raw_text[7:]
    if raw_text.startswith("```"):
        raw_text = raw_text[3:]
    if raw_text.endswith("```"):
        raw_text = raw_text[:-3]
    return json.loads(raw_text.strip())

def generate_embedding(text: str, dimensions: int = 1024) -> list:
    """Generates 1024-d embedding using Azure OpenAI text-embedding-3-large."""
    response = client.embeddings.create(
        input=[text],
        model=EMBEDDING_MODEL,
        dimensions=dimensions
    )
    return response.data[0].embedding

def process_batch(manifest_path: str, output_path: str, limit: int = 3):
    """Processes a batch of extracted diagrams and produces enriched multimodal catalog."""
    with open(manifest_path, "r", encoding="utf-8") as f:
        data = json.load(f)

    items = data if isinstance(data, list) else data.get("items", [])
    
    # Filter for chapter diagrams (chapter_no >= 1)
    ch_items = [it for it in items if it.get("chapter_no", 0) >= 1]
    print(f"Loaded master manifest with {len(items)} items ({len(ch_items)} chapter diagrams). Processing {min(limit, len(ch_items))} items...")

    enriched_items = []
    for idx, item in enumerate(ch_items[:limit]):
        print(f"\n[{idx+1}/{min(limit, len(ch_items))}] Processing {item['entity_id']} ({item['subject']} - Ch {item['chapter_no']}: {item['chapter_title_en']})...")
        
        img_rel = item.get("bn_asset_path") or item.get("en_asset_path")
        if not img_rel:
            continue

        # Adjust path if relative to repo root
        if img_rel.startswith("ingestion/"):
            full_img_path = Path(__file__).parent.parent / img_rel
        else:
            full_img_path = Path(__file__).parent / img_rel

        if not full_img_path.exists():
            print(f"Warning: File not found {full_img_path}")
            continue

        try:
            print(f" -> Calling Azure OpenAI Vision ({VISION_MODEL}) on {full_img_path.name}...")
            caption_data = caption_diagram(str(full_img_path))
            print(f"    Title BN: {caption_data.get('title_bn')}")
            print(f"    Title EN: {caption_data.get('title_en')}")
            print(f"    Type: {caption_data.get('diagram_type')}")
            print(f"    Apparatus: {caption_data.get('apparatus_and_reagents')}")

            # Composite semantic representation for embedding
            composite_text = f"{caption_data.get('title_bn')} | {caption_data.get('title_en')}\n" \
                             f"Components: {', '.join(caption_data.get('apparatus_and_reagents', []))}\n" \
                             f"BN: {caption_data.get('scientific_description_bn')}\n" \
                             f"EN: {caption_data.get('scientific_description_en')}"

            print(f" -> Generating 1024-d embedding via {EMBEDDING_MODEL}...")
            emb = generate_embedding(composite_text, dimensions=1024)
            print(f"    Embedding vector length: {len(emb)}")

            enriched_record = {
                **item,
                "ai_caption": caption_data,
                "embedding_1024d_preview": emb[:8],
                "embedding_dimensions": len(emb),
                "processed_at": time.strftime("%Y-%m-%dT%H:%M:%SZ")
            }
            enriched_items.append(enriched_record)

        except Exception as e:
            print(f"Error processing {item['entity_id']}: {e}")

    # Save enriched catalog
    out_file = Path(output_path)
    out_file.parent.mkdir(parents=True, exist_ok=True)
    with open(out_file, "w", encoding="utf-8") as f:
        json.dump({
            "total_processed": len(enriched_items),
            "azure_resource": AZURE_ENDPOINT,
            "vision_model": VISION_MODEL,
            "embedding_model": EMBEDDING_MODEL,
            "items": enriched_items
        }, f, ensure_ascii=False, indent=2)

    print(f"\n[SUCCESS] Successfully enriched {len(enriched_items)} diagrams. Saved to {out_file}")

if __name__ == "__main__":
    manifest = Path(__file__).parent / "output/figures/chemistry/chemistry_multimodal_master_catalog.json"
    output = Path(__file__).parent / "output/figures/chemistry/chemistry_enriched_multimodal_sample.json"
    process_batch(str(manifest), str(output), limit=3)
