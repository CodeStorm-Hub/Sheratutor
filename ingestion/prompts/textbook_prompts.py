"""
Domain-specific extraction prompts for NCTB SSC Textbooks.
Optimized for meta/llama-3.2-11b-vision-instruct and meta/llama-3.2-90b-vision-instruct
with Multimodal Diagram, Graph Handling, and Strict Language Isolation.
"""

from typing import Optional

def build_textbook_prompt(
    subject: str,
    lang: str = "en",
    ch_no: Optional[int] = None,
    ch_title: Optional[str] = None
) -> str:
    """
    Builds a highly grounded, language-locked, and chapter-scoped OCR prompt.
    Eliminates few-shot token regurgitation (e.g. hardcoded wax/candle examples)
    and enforces zero-tolerance for cross-lingual and cross-chapter hallucination.
    """
    lang = lang.lower()
    subject = subject.lower()
    
    if lang == "en":
        lang_directive = """1. STRICT LANGUAGE REQUIREMENT:
   - This is strictly an ENGLISH VERSION textbook.
   - You MUST transcribe ALL content in English.
   - Absolutely NEVER output any Bengali script or Bengali characters (Unicode range \\u0980-\\u09FF).
   - Use standard English punctuation, Arabic numerals, and English terms for all labels, figures, tables, and questions."""
        fig_example = f"Fig {ch_no}.XX" if ch_no else "Fig X.XX"
        cq_directive = """7. EXERCISES & QUESTIONS:
   - Mark question stems or case stems as **[STIMULUS]**.
   - Mark sub-questions clearly as (a), (b), (c), (d)."""
    else:
        lang_directive = """1. LANGUAGE REQUIREMENT:
   - This is a BANGLA VERSION textbook (বাংলা সংস্করণ).
   - Transcribe all text in authentic Bengali script (বাংলা বর্ণমালা ও যুক্তবর্ণ) verbatim.
   - Retain Bengali numerals in narrative text, headers, and table labels."""
        fig_example = f"চিত্র {ch_no}.XX" if ch_no else "চিত্র X.XX"
        cq_directive = """7. EXERCISES & CREATIVE QUESTIONS:
   - Mark question stems as **[উদ্দীপক]**.
   - Mark sub-questions clearly as (ক), (খ), (গ), (ঘ)."""

    if ch_no is not None and ch_title:
        ch_directive = f"""2. STRICT CHAPTER SCOPE (ZERO TOLERANCE FOR CROSS-CHAPTER HALLUCINATION):
   - This page is strictly from Chapter {ch_no}: '{ch_title}'.
   - Section numbers on this page MUST strictly start with '{ch_no}.' (e.g. {ch_no}.1, {ch_no}.2).
   - Figures on this page MUST strictly match Chapter {ch_no} (e.g. {fig_example}).
   - NEVER transcribe, invent, or hallucinate sections, figures, or topics from other chapters (e.g. do NOT output sections or diagrams from other chapters)."""
    else:
        ch_directive = """2. STRICT HEADING SCOPE:
   - Transcribe ONLY section numbers and headings physically visible on this page.
   - NEVER invent, infer, or hallucinate synthetic subheadings."""

    prompt = f"""You are an expert OCR and document layout engine specialized in NCTB secondary school textbooks (Bangladesh National Curriculum Class 9-10).
Transcribe the exact content of this page image into clean, structured GitHub-flavored Markdown following these strict instructions:

{lang_directive}

{ch_directive}

3. FIGURE & DIAGRAM AUDIT:
   - Carefully check if any photograph, diagram, molecular model, graph, or apparatus illustration is physically printed on this page.
   - If NO photograph, diagram, or illustration is physically printed on this page, do NOT output any [DIAGRAM] blocks. Absolutely NEVER invent, assume, or hallucinate synthetic diagrams.
   - For EACH real printed figure found, transcribe it into a clean block:
     ```
     [DIAGRAM]
     Caption: <Exact printed figure number and caption as printed on page>
     Callouts: <All labels, pointers, text inside or around the diagram>
     Description: <Concise factual description of what is visually depicted>
     ```
   - MULTI-COLUMN & WRAPPED TEXT: When a figure appears alongside narrative text (in columns or wrapped), transcribe BOTH: the complete narrative text verbatim AND the complete diagram block. Never omit text for a diagram or omit a diagram for text.
   - NO REPETITIVE LOOPS: Output each diagram block exactly ONCE. NEVER repeat diagram tags or captions in loops.

4. ACCURACY & HEADING FIDELITY:
   - Transcribe ONLY headings physically printed on the page. Never invent or infer subheadings like 'Introduction' or 'Overview'.
   - Never change heading levels or numbering. If text flows directly under a heading, transcribe the text directly.

5. CHEMICAL & SCIENTIFIC FORMULAS:
   - Convert all chemical formulas, equations, and reactions to clean LaTeX (e.g. $\\text{{CaCO}}_3 \\to \\text{{CaO}} + \\text{{CO}}_2$).
   - Represent physical states properly (s, l, g, aq).
   - Use standard sub/superscripts for isotopes ($^{{12}}_{{6}}\\text{{C}}$) and ions ($\\text{{Na}}^+$, $\\text{{Cl}}^-$).

6. TABLES & DATA:
   - Convert periodic tables, data tables, and property lists into clean Markdown tables (| Col 1 | Col 2 |).
   - Transcribe all cells accurately. Never output empty dummy rows.

{cq_directive}

8. OUTPUT ONLY MARKDOWN:
   - Transcribe only the page content. Do not include greetings, markdown code block wrappers (```markdown ... ```), or conversational commentary.
"""
    return prompt

# Default fallback prompt generators for backwards compatibility
CHEMISTRY_PROMPT = build_textbook_prompt("chemistry", "en")
MATHEMATICS_PROMPT = build_textbook_prompt("mathematics", "bn")
ENGLISH_PROMPT = build_textbook_prompt("english", "en")

PROMPTS = {
    "chemistry": CHEMISTRY_PROMPT,
    "mathematics": MATHEMATICS_PROMPT,
    "math": MATHEMATICS_PROMPT,
    "english": ENGLISH_PROMPT,
}
