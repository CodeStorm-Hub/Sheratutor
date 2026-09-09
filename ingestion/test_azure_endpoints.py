import os
import json
import base64
from openai import AzureOpenAI

from dotenv import load_dotenv
load_dotenv(Path(__file__).resolve().parent / ".env")
api_key = os.getenv("AZURE_OPENAI_KEY") or os.getenv("AZURE_OPENAI_API_KEY")
endpoint = "https://sheratutor-ai-a6e24.openai.azure.com/"
api_version = "2024-12-01-preview"

print(f"Connecting to Azure OpenAI at {endpoint}...")
client = AzureOpenAI(
    azure_endpoint=endpoint,
    api_key=api_key,
    api_version=api_version,
)

# Test Embedding
print("\n1. Testing text-embedding-3-large (1024-d)...")
resp = client.embeddings.create(
    input=["পরমাণুর গঠন এবং ইলেকট্রন বিন্যাস (Structure of Atom and Electron Configuration)"],
    model="text-embedding-3-large",
    dimensions=1024
)
embedding = resp.data[0].embedding
print(f"Embedding success! Length: {len(embedding)}, first 5 values: {embedding[:5]}")

# Test Chat / Vision on a cropped Chemistry diagram!
test_img_path = "/home/syed/workspace/Sheratutor/ingestion/output/figures/chemistry/bn/ch_01/p015_fig_01.png"
print(f"\n2. Testing vision captioning on {test_img_path}...")
with open(test_img_path, "rb") as f:
    b64_img = base64.b64encode(f.read()).decode("utf-8")

resp = client.chat.completions.create(
    model="gpt-4o-mini",
    messages=[
        {"role": "system", "content": "You are an expert NCTB Chemistry multimodal curriculum educator. Describe diagrams with scientific precision in both English and Bengali."},
        {
            "role": "user",
            "content": [
                {"type": "text", "text": "Analyze this chemistry textbook diagram. Provide:\n1. Title (BN & EN)\n2. Diagram Type\n3. Key Chemical / Apparatus Components\n4. Pedagogical description for student tutoring in 2-3 sentences."},
                {"type": "image_url", "image_url": {"url": f"data:image/png;base64,{b64_img}"}}
            ]
        }
    ],
    max_completion_tokens=400
)
content = resp.choices[0].message.content
print(f"\nVision & Reasoning Analysis:\n{content}")
