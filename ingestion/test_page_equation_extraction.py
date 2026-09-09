import fitz
import base64
import os
from openai import AzureOpenAI

api_key = os.getenv("AZURE_OPENAI_KEY") or os.getenv("AZURE_OPENAI_API_KEY")
endpoint = "https://sheratutor-ai-a6e24.openai.azure.com/"

client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=api_key,
    api_version="2024-12-01-preview",
)

# Render page 116 of chemistry_bn.pdf (Mole chapter with formulas)
doc = fitz.open("/home/syed/workspace/Sheratutor/ingestion/textbooks/chemistry_bn.pdf")
page = doc.load_page(115) # Page 116
pix = page.get_pixmap(dpi=200)
img_bytes = pix.tobytes("jpeg")
b64_img = base64.b64encode(img_bytes).decode("utf-8")

prompt = """You are an expert scientific OCR and LaTeX typesetter for NCTB Secondary Chemistry textbooks.
Transcribe this textbook page into high-quality Markdown:
1. Preserve all Bengali text accurately.
2. Format ALL chemical formulas and equations in standard LaTeX syntax (e.g., $H_2O$, $2H_2 + O_2 \\rightarrow 2H_2O$, $n = \\frac{W}{M}$, $6.023 \\times 10^{23}$).
3. Maintain headings (##, ###), bullet points, and tables.
4. If a diagram is present, note it as `![Diagram Title](diagram_url)` with a concise caption.
Output ONLY the clean Markdown content."""

print("Calling Azure OpenAI gpt-4o-mini to extract page with formulas...")
resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "user", "content": [
            {"type": "text", "text": prompt},
            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{b64_img}"}}
        ]}
    ],
    max_completion_tokens=3000
)

print("\n--- EXTRACTED MARKDOWN & EQUATIONS ---")
print(resp.choices[0].message.content)
