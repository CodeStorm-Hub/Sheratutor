import os
import base64
from pathlib import Path
from dotenv import load_dotenv
from openai import AzureOpenAI

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

test_img_path = "/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/bn/ch_01/p015_fig_01.png"
with open(test_img_path, "rb") as f:
    b64_img = base64.b64encode(f.read()).decode("utf-8")

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Describe this chemistry textbook diagram in Bengali and English."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_img}"}}
            ]
        }
    ],
    max_completion_tokens=3000
)
print("Choice 0 message content:")
print(resp.choices[0].message.content)
