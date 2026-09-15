#!/usr/bin/env python3
"""
SheraTutor: Unsloth Qwen-2.5-7B-Instruct Fine-Tuning Pipeline for Kaggle.

This script fine-tunes Qwen 2.5 7B (or 3B) using Unsloth's ultra-fast Triton kernels,
QLoRA 4-bit quantization, and ChatML formatting on a free Kaggle Tesla T4 GPU.
It exports the model directly to Hugging Face in both 16-bit Merged (vLLM) and
GGUF (Ollama) formats for production deployment.

Requirements on Kaggle:
- Accelerator: GPU T4 x2 or GPU T4 x1
- Internet: ON
- Secrets: 'HF_TOKEN' (Hugging Face write token)
"""

import os
import sys
import subprocess
import torch

print("=" * 60)
print("SheraTutor — Unsloth Fine-Tuning Pipeline on Kaggle")
print("=" * 60)

# ---------------------------------------------------------------------------
# 1. Hardware & Environment Check
# ---------------------------------------------------------------------------
if not torch.cuda.is_available():
    raise SystemError("CUDA GPU is not available! In Kaggle, go to Settings -> Accelerator -> GPU T4 x2 (or GPU T4 x1).")

cap = torch.cuda.get_device_capability()
device_name = torch.cuda.get_device_name(0)
print(f"[*] Detected GPU: {device_name} (Compute Capability {cap[0]}.{cap[1]})")

if cap[0] < 7:
    raise SystemError(
        f"GPU capability {cap} is older than Turing (sm_75). Unsloth Triton kernels require "
        f"Compute Capability >= 7.0 (Tesla T4). Please switch Accelerator from P100 to T4 in Kaggle Settings."
    )

# ---------------------------------------------------------------------------
# 2. Dependency Installation (Optimized for Kaggle)
# ---------------------------------------------------------------------------
def ensure_unsloth():
    try:
        import unsloth
        print(f"[*] Unsloth already installed (version {unsloth.__version__})")
    except ImportError:
        print("[*] Installing Unsloth and dependencies for Kaggle environment...")
        cmd = [
            sys.executable, "-m", "pip", "install", "-q",
            "unsloth",
            "torch", "torchvision", "torchaudio",
            "datasets", "trl", "transformers", "accelerate", "bitsandbytes"
        ]
        subprocess.run(cmd, check=True)
        print("[*] Unsloth installed successfully.")

ensure_unsloth()

from unsloth import FastLanguageModel, is_bfloat16_supported
from unsloth.chat_templates import get_chat_template, train_on_responses_only
from datasets import load_dataset, Dataset
from trl import SFTTrainer, DataCollatorForSeq2Seq
from transformers import TrainingArguments

# ---------------------------------------------------------------------------
# 3. Authentication & Configuration
# ---------------------------------------------------------------------------
# Retrieve Hugging Face token from Kaggle Secrets or environment
HF_TOKEN = os.environ.get("HF_TOKEN", "")
try:
    from kaggle_secrets import UserSecretsClient
    user_secrets = UserSecretsClient()
    HF_TOKEN = user_secrets.get_secret("HF_TOKEN")
    print("[*] HF_TOKEN retrieved from Kaggle Secrets.")
except Exception:
    if HF_TOKEN:
        print("[*] HF_TOKEN retrieved from environment variable.")
    else:
        print("[!] HF_TOKEN not found in Kaggle Secrets. Remote push to Hub will be skipped.")

# Target Hugging Face Repositories (Change 'YOUR_USERNAME' to your HF handle)
HF_USERNAME = os.environ.get("HF_USERNAME", "syed181")
MODEL_BASE_ID = "unsloth/Qwen2.5-7B-Instruct-bnb-4bit"
MAX_SEQ_LENGTH = 2048  # Supports up to 8192 with Unsloth RoPE scaling
OUTPUT_MODEL_NAME = f"{HF_USERNAME}/sheratutor-qwen2.5-7b"

# ---------------------------------------------------------------------------
# 4. Load Base Model in 4-bit via Unsloth
# ---------------------------------------------------------------------------
print(f"[*] Loading {MODEL_BASE_ID} in 4-bit precision...")
model, tokenizer = FastLanguageModel.from_pretrained(
    model_name = MODEL_BASE_ID,
    max_seq_length = MAX_SEQ_LENGTH,
    dtype = None,           # Auto-detects float16 for T4
    load_in_4bit = True,    # 4-bit QLoRA reduces VRAM by 70%
)

# ---------------------------------------------------------------------------
# 5. Apply LoRA Parameter-Efficient Adapters
# ---------------------------------------------------------------------------
print("[*] Configuring LoRA Adapters...")
model = FastLanguageModel.get_peft_model(
    model,
    r = 16,                 # Suggested: 8, 16, 32, 64
    target_modules = [
        "q_proj", "k_proj", "v_proj", "o_proj",
        "gate_proj", "up_proj", "down_proj",
    ],
    lora_alpha = 16,
    lora_dropout = 0,       # 0 is mathematically optimized in Unsloth
    bias = "none",
    use_gradient_checkpointing = "unsloth",  # Saves 30% extra VRAM
    random_state = 3407,
    use_rslora = False,
    loftq_config = None,
)

# ---------------------------------------------------------------------------
# 6. Apply Chat Template & Format Dataset
# ---------------------------------------------------------------------------
print("[*] Setting up Qwen-2.5 Chat Template...")
tokenizer = get_chat_template(
    tokenizer,
    chat_template = "qwen-2.5",
)

# Load dataset: from local file or generate fallback seed data
dataset_path = "sheratutor_train_dataset.jsonl"
if not os.path.exists(dataset_path):
    # Try finding in parent directory or Kaggle input
    for candidate in [
        "/kaggle/input/sheratutor-dataset/sheratutor_train_dataset.jsonl",
        "../dataset/sheratutor_train_dataset.jsonl",
        "training/dataset/sheratutor_train_dataset.jsonl"
    ]:
        if os.path.exists(candidate):
            dataset_path = candidate
            break

if os.path.exists(dataset_path):
    print(f"[*] Loading dataset from: {dataset_path}")
    raw_dataset = load_dataset("json", data_files=dataset_path, split="train")
else:
    print("[!] No dataset file found. Using minimal fallback dataset...")
    raw_dataset = Dataset.from_list([
        {
            "messages": [
                {"role": "system", "content": "তুমি সেরাটিউটর — এসএসসি পর্যায়ের বিজ্ঞান ও গণিত শিক্ষক।"},
                {"role": "user", "content": "নিউটনের দ্বিতীয় সূত্রটি কি?"},
                {"role": "assistant", "content": "নিউটনের দ্বিতীয় সূত্র: বস্তুর ভরবেগের পরিবর্তনের হার তার উপর প্রযুক্ত বলের সমানুপাতিক এবং বল যেদিকে ক্রিয়া করে ভরবেগের পরিবর্তনও সেদিকে ঘটে। অর্থাৎ \\( F = ma \\)।"}
            ]
        }
    ])

def formatting_prompts_func(examples):
    convos = examples["messages"]
    texts = [
        tokenizer.apply_chat_template(
            convo,
            tokenize = False,
            add_generation_prompt = False
        ) for convo in convos
    ]
    return {"text": texts}

dataset = raw_dataset.map(formatting_prompts_func, batched=True)
print(f"[*] Dataset processed: {len(dataset)} samples ready for training.")

# ---------------------------------------------------------------------------
# 7. SFTTrainer Setup with train_on_responses_only
# ---------------------------------------------------------------------------
print("[*] Initializing SFTTrainer...")
trainer = SFTTrainer(
    model = model,
    tokenizer = tokenizer,
    train_dataset = dataset,
    dataset_text_field = "text",
    max_seq_length = MAX_SEQ_LENGTH,
    dataset_num_proc = 2,
    data_collator = DataCollatorForSeq2Seq(tokenizer = tokenizer),
    args = TrainingArguments(
        per_device_train_batch_size = 2,
        gradient_accumulation_steps = 4,
        warmup_steps = 5,
        max_steps = 60,                 # Adjust based on dataset size (e.g., 60-300)
        learning_rate = 2e-4,
        fp16 = not is_bfloat16_supported(),
        bf16 = is_bfloat16_supported(),
        logging_steps = 5,
        optim = "adamw_8bit",
        weight_decay = 0.01,
        lr_scheduler_type = "cosine",
        seed = 3407,
        output_dir = "outputs",
        report_to = "none",
    ),
)

# Mask instruction tokens: Loss is computed ONLY on the assistant's responses
trainer = train_on_responses_only(
    trainer,
    instruction_part = "<|im_start|>user\n",
    response_part = "<|im_start|>assistant\n",
)

# ---------------------------------------------------------------------------
# 8. Run Training
# ---------------------------------------------------------------------------
print("[*] Starting Unsloth Training...")
trainer_stats = trainer.train()
print(f"[*] Training finished! Run time: {trainer_stats.metrics['train_runtime']:.2f} seconds.")

# ---------------------------------------------------------------------------
# 9. Verification & Fast Inference Test
# ---------------------------------------------------------------------------
print("\n[*] Testing Socratic Inference with fine-tuned model...")
FastLanguageModel.for_inference(model)

test_messages = [
    {
        "role": "system",
        "content": "তুমি সেরাটিউটর — এসএসসি পর্যায়ের একজন সহানুভূতিশীল এআই শিক্ষক। সরাসরি উত্তর না দিয়ে শিক্ষার্থীকে ধাপে ধাপে সংকেত দাও এবং সমীকরণ LaTeX এ লেখ।"
    },
    {
        "role": "user",
        "content": "স্যার, সমবেগে চললে ত্বরণ কত হয়? বুঝতে পারছি না।"
    }
]

inputs = tokenizer.apply_chat_template(
    test_messages,
    tokenize = True,
    add_generation_prompt = True,
    return_tensors = "pt"
).to("cuda")

outputs = model.generate(
    input_ids = inputs,
    max_new_tokens = 256,
    use_cache = True,
    temperature = 0.3,
)
response_text = tokenizer.batch_decode(outputs)
print("\n=== Fine-Tuned Model Response ===")
print(response_text[0].split("<|im_start|>assistant\n")[-1].replace("<|im_end|>", "").strip())
print("=================================\n")

# ---------------------------------------------------------------------------
# 10. Model Export (16-bit Merged & GGUF for Ollama / vLLM)
# ---------------------------------------------------------------------------
local_output_dir = "/kaggle/working/sheratutor_model"

if HF_TOKEN:
    print(f"[*] Exporting 16-bit merged model to Hugging Face Hub: {OUTPUT_MODEL_NAME}...")
    try:
        model.push_to_hub_merged(
            OUTPUT_MODEL_NAME,
            tokenizer,
            save_method = "merged_16bit",
            token = HF_TOKEN,
        )
        print(f"[OK] Merged 16-bit model uploaded to: https://huggingface.co/{OUTPUT_MODEL_NAME}")
    except Exception as e:
        print(f"[!] Warning uploading merged model: {e}")

    print(f"[*] Exporting Q4_K_M GGUF format for Ollama: {OUTPUT_MODEL_NAME}-gguf...")
    try:
        model.push_to_hub_gguf(
            f"{OUTPUT_MODEL_NAME}-gguf",
            tokenizer,
            quantization_method = "q4_k_m",
            token = HF_TOKEN,
        )
        print(f"[OK] GGUF Q4_K_M uploaded to: https://huggingface.co/{OUTPUT_MODEL_NAME}-gguf")
    except Exception as e:
        print(f"[!] Warning uploading GGUF model: {e}")
else:
    print(f"[*] Saving LoRA weights and GGUF locally to {local_output_dir}...")
    os.makedirs(local_output_dir, exist_ok=True)
    model.save_pretrained_merged(f"{local_output_dir}/merged_16bit", tokenizer, save_method="merged_16bit")
    model.save_pretrained_gguf(f"{local_output_dir}/gguf", tokenizer, quantization_method="q4_k_m")
    print(f"[OK] Local files saved at: {local_output_dir}")

print("\n" + "=" * 60)
print("[*] PIPELINE COMPLETE! Model is ready for production deployment.")
print("=" * 60)
