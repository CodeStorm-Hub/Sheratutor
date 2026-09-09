import os
from pathlib import Path
from dotenv import load_dotenv
from PIL import Image
from openai import AzureOpenAI
import base64

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("AZURE_OPENAI_KEY") or os.getenv("AZURE_OPENAI_API_KEY")
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "https://sheratutor-ai-a6e24.openai.azure.com/")
api_version = "2024-12-01-preview"

client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=api_key,
    api_version=api_version,
)

def inspect_image(path):
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")
    
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": [
                {"type": "text", "text": "What is in this cropped image? Is it an actual scientific diagram/illustration, or is it cropped text/table/side margin/fragment? Describe it in 1 sentence."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
            ]}
        ],
        max_completion_tokens=1500
    )
    return resp.choices[0].message.content.strip()

# Inspect Bengali crops for pages 9 to 16
ch_dir_bn = "/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/bn/ch_01"
files = sorted([f for f in os.listdir(ch_dir_bn) if any(f"p0{p:02d}" in f for p in range(9, 17))])

print("--- Inspecting BN Crops (Pages 9 to 16) ---")
for f in files:
    res = inspect_image(os.path.join(ch_dir_bn, f))
    print(f"{f}: {res}\n")
