import os
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI
import base64

env_path = Path(__file__).resolve().parent / ".env"
load_dotenv(dotenv_path=env_path)

api_key = os.getenv("AZURE_OPENAI_KEY") or os.getenv("AZURE_OPENAI_API_KEY")
endpoint = os.getenv("AZURE_OPENAI_ENDPOINT", "https://sheratutor-ai-a6e24.openai.azure.com/")
client = AzureOpenAI(azure_endpoint=endpoint, api_key=api_key, api_version="2024-12-01-preview")

for p in range(9, 17):
    path = f"/tmp/inspect_p9_16/full_bn_p{p:02d}.png"
    with open(path, "rb") as f:
        b64 = base64.b64encode(f.read()).decode("utf-8")
    resp = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "user", "content": [
                {"type": "text", "text": "What visual diagrams or figures (if any) are on this chemistry textbook page? If there are NO diagrams and it is only text/tables/headers, say 'NO DIAGRAMS - ONLY TEXT/TABLE'. If there ARE diagrams, describe them precisely."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64}"}}
            ]}
        ],
        max_completion_tokens=1500
    )
    print(f"=== FULL BN PAGE {p} ===")
    print(resp.choices[0].message.content.strip())
    print()
