# SheraTutor — Model Fine-Tuning & Production Deployment Guide

This directory contains the complete pipeline for fine-tuning open-weights LLMs for SheraTutor using **Unsloth** on **Kaggle** (or Google Colab / RunPod / Modal), exporting merged weights and GGUF quantizations, and serving in production for the Next.js app.

---

## 1. Quick Overview

| Component | Choice | Reason |
| :--- | :--- | :--- |
| **Framework** | **Unsloth (FastLanguageModel)** | 2x-5x faster training, 70% less VRAM, 0% accuracy loss |
| **Base Model** | **Qwen 2.5 7B-Instruct** (`unsloth/Qwen2.5-7B-Instruct-bnb-4bit`) | Best open-weight Bengali & STEM reasoning, superior tokenization |
| **Cloud Training** | **Kaggle (GPU T4 x2 / T4 x1)** | 30 hrs/week free GPU, background jobs up to 12 hrs, Kaggle CLI support |
| **Production Serving** | **Ollama / vLLM / Modal Serverless** | OpenAI-compatible API, GGUF or 16-bit merged weights, scale-to-zero |
| **Frontend** | **Next.js 16 + Genkit** | Swappable via `GENKIT_REASONING_MODEL` or OpenAI-compatible endpoint |

---

## 2. Directory Structure

```text
training/
├── dataset/
│   ├── prepare_training_data.py          # Formats Q&A and NCTB data into ChatML JSONL
│   └── sheratutor_train_dataset.jsonl    # Seed training dataset
├── kaggle/
│   ├── sheratutor_unsloth_qwen2_5_finetune.py # Main Kaggle training script
│   └── kernel-metadata.json              # Kaggle CLI metadata for 1-click execution
├── deploy/
│   ├── Modelfile                         # Ollama configuration for GGUF
│   ├── docker-compose.vllm.yml           # vLLM Docker container for dedicated GPU
│   └── modal_vllm_serverless.py          # Modal Labs scale-to-zero serverless deployment
└── README.md
```

---

## 3. Step-by-Step Kaggle Workflow

### Step 1: Set Hugging Face Token in Kaggle Secrets
1. Go to [Hugging Face Settings -> Tokens](https://huggingface.co/settings/tokens) and create a **Write** token.
2. In Kaggle, open any notebook, click **Add-ons** -> **Secrets**.
3. Add a secret with label `HF_TOKEN` and paste your Hugging Face write token.

### Step 2: Launch via Kaggle Web or CLI
#### Option A: Via Kaggle CLI (From this directory)
```bash
# Push directly from your local terminal:
cd training/kaggle
kaggle kernels push
```

#### Option B: Via Kaggle Web UI
1. Create a new notebook on [Kaggle](https://www.kaggle.com/code).
2. Set **Accelerator** to **GPU T4 x2** (or GPU T4 x1).
   > **CRITICAL**: Do **NOT** select P100! Unsloth's Triton kernels require Compute Capability $\ge 7.0$ (T4).
3. Set **Internet** to **ON** in the right-hand panel.
4. Copy-paste the code from [`sheratutor_unsloth_qwen2_5_finetune.py`](kaggle/sheratutor_unsloth_qwen2_5_finetune.py).
5. Click **Run All** (or **Save and Run All** for background execution).

---

## 4. Production Serving Options

### Option A: Ollama (Easiest & Cost-Effective)
Once pushed to Hugging Face, run directly on your server or CPU VPS:
```bash
# Pull and run directly from Hugging Face Hub (No manual file download required!)
ollama run hf.co/syed181/sheratutor-qwen2.5-7b-gguf:Q4_K_M
```
In `web/.env.local`:
```env
OLLAMA_BASE_URL=http://your-server-ip:11434
GENKIT_REASONING_MODEL=ollama/hf.co/syed181/sheratutor-qwen2.5-7b-gguf:Q4_K_M
```

### Option B: Modal Labs (100% Serverless, Scales to Zero)
Zero fixed monthly costs — GPU turns on only when a student chats, turns off after 5 mins of idle time:
```bash
pip install modal
modal setup
modal secret create huggingface-secret HF_TOKEN=your_token
modal deploy training/deploy/modal_vllm_serverless.py
```

### Option C: Dedicated vLLM on RunPod / Cloud GPU ($0.20 - $0.35/hr)
```bash
cd training/deploy
HF_TOKEN=your_token docker compose -f docker-compose.vllm.yml up -d
```
Exposes OpenAI-compatible API at `http://host:8000/v1`.
