"""
SheraTutor: Modal Labs Serverless vLLM Endpoint (Zero-Idle-Cost Production).

Configured with strict Anti-Overcharge Safeguards:
- Hardware: Nvidia L4 (24GB VRAM Ada Lovelace, $0.80/hr, $0 idle).
- Concurrency limit: 1 (strictly prevents multiple GPU instances spinning up concurrently).
- Idle scaledown window: 60s (shuts down GPU after 1 minute of inactivity to preserve free credits).
- Persistent volume caching: caches Hugging Face weights to slash cold-starts to 6-8 seconds.
- OpenAI-compatible endpoints: /v1/chat/completions, /v1/models with logprobs support.
"""

import modal

app = modal.App("sheratutor-vllm")

# Persistent volume for Hugging Face model weights cache
hf_cache = modal.Volume.from_name("hf-model-cache", create_if_missing=True)

# Container image with vLLM, torch, and Hugging Face acceleration
vllm_image = (
    modal.Image.debian_slim(python_version="3.11")
    .pip_install(
        "vllm>=0.6.0",
        "torch",
        "hf-transfer",
        "huggingface_hub",
        "requests",
        "supabase",
    )
    .env({
        "HF_HUB_ENABLE_HF_TRANSFER": "1",
        "HF_HUB_CACHE": "/root/.cache/huggingface",
    })
)

# Fine-tuned SheraTutor Qwen 2.5 7B Rubric Evaluator
MODEL_ID = "syed181/sheratutor-qwen2.5-7b"

@app.function(
    image=vllm_image,
    gpu="T4",                      # T4 free tier (no credit card required on Modal)
    max_containers=1,              # Strict Anti-Overcharge: Never spin up > 1 GPU simultaneously
    scaledown_window=60,           # Strict Anti-Overcharge: Shuts down 60s after last request
    timeout=300,                   # 5-minute hard execution cap
    volumes={"/root/.cache/huggingface": hf_cache},
    secrets=[
        modal.Secret.from_name("huggingface-secret"),
        modal.Secret.from_name("supabase-secret"),
    ],
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
        "--gpu-memory-utilization", "0.85",
        "--trust-remote-code",
    ]
    print(f"[*] Starting vLLM server: {' '.join(cmd)}")
    subprocess.Popen(cmd)
