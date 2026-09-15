"""
SheraTutor: Modal Labs Serverless vLLM Endpoint (Zero-Idle-Cost Production).

Deploy with:
  pip install modal
  modal setup
  modal deploy training/deploy/modal_vllm_serverless.py

This provides an OpenAI-compatible endpoint that scales to 0 GPUs when idle,
saving thousands of dollars in hosting fees.
"""

import modal

app = modal.App("sheratutor-vllm")

# Container image with vLLM
vllm_image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install("vllm>=0.6.0", "torch", "hf-transfer")
    .env({"HF_HUB_ENABLE_HF_TRANSFER": "1"})
)

MODEL_DIR = "/model"
MODEL_ID = "syed181/sheratutor-qwen2.5-7b"

@app.function(
    image=vllm_image,
    gpu="T4",               # T4 ($0.59/hr only when active, or A10G $1.10/hr)
    scaledown_window=300,   # Shuts down GPU after 5 minutes of inactivity
    timeout=600,
    secrets=[modal.Secret.from_name("huggingface-secret")],
)
@modal.web_server(port=8000, startup_timeout=180)
def serve_vllm():
    import subprocess
    cmd = [
        "vllm", "serve", MODEL_ID,
        "--host", "0.0.0.0",
        "--port", "8000",
        "--max-model-len", "4096",
        "--dtype", "half",
        "--trust-remote-code",
    ]
    subprocess.Popen(cmd)
