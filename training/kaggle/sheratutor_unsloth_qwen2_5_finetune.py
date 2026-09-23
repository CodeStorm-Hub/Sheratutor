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
from trl import SFTTrainer
from transformers import TrainingArguments, DataCollatorForSeq2Seq

# ---------------------------------------------------------------------------
# 3. Authentication & Configuration
# ---------------------------------------------------------------------------
# Retrieve Hugging Face token from Kaggle Secrets or environment
HF_TOKEN = os.environ.get("HF_TOKEN", "")
try:
    from kaggle_secrets import UserSecretsClient
    user_secrets = UserSecretsClient()
    token = user_secrets.get_secret("HF_TOKEN")
    if token:
        HF_TOKEN = token
        print("[*] HF_TOKEN retrieved from Kaggle Secrets.")
except Exception:
    if HF_TOKEN:
        print("[*] HF_TOKEN active for Hugging Face upload.")
    else:
        print("[!] HF_TOKEN not found. Remote push will be skipped.")

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

# Load dataset: prioritize rubric grading dataset
import glob
dataset_path = None
candidates = glob.glob("/kaggle/input/**/sheratutor_rubric_train.jsonl", recursive=True)
if candidates:
    dataset_path = candidates[0]
else:
    for cand in [
        "sheratutor_rubric_train.jsonl",
        "training/dataset/kaggle_dataset/sheratutor_rubric_train.jsonl",
        "training/dataset/sheratutor_rubric_train.jsonl",
        "../dataset/kaggle_dataset/sheratutor_rubric_train.jsonl",
        "/kaggle/working/sheratutor_rubric_train.jsonl",
    ]:
        if os.path.exists(cand):
            dataset_path = cand
            break

# Direct download fallback via GitHub raw if not found locally or in Kaggle mounts
if not dataset_path or not os.path.exists(dataset_path):
    print("[*] Fetching sheratutor_rubric_train.jsonl directly from GitHub raw...")
    import urllib.request
    remote_url = "https://raw.githubusercontent.com/CodeStorm-Hub/Sheratutor/fine-tuning-math-hmath-bn/training/dataset/kaggle_dataset/sheratutor_rubric_train.jsonl"
    try:
        urllib.request.urlretrieve(remote_url, "sheratutor_rubric_train.jsonl")
        dataset_path = "sheratutor_rubric_train.jsonl"
        print(f"[*] Successfully downloaded dataset ({os.path.getsize(dataset_path)} bytes).")
    except Exception as e:
        print(f"[!] Warning: Failed to download from GitHub: {e}")

if dataset_path and os.path.exists(dataset_path):
    print(f"[*] Loading dataset from: {dataset_path}")
    raw_dataset = load_dataset("json", data_files=dataset_path, split="train")
else:
    print("[!] No dataset file found. Using minimal fallback dataset...")
    raw_dataset = Dataset.from_list([
        {
            "messages": [
                {"role": "system", "content": "You are an expert Bangladeshi SSC/HSC board examiner and AI grading engine for SheraTutor. Output ONLY a raw, valid JSON object conforming exactly to the RubricEvaluationSchema."},
                {"role": "user", "content": "QUESTION (max 1.0 marks): বলের SI একক কী?\n\nOFFICIAL RUBRIC: [{\"step_name\": \"Correct Option\", \"matching_rules\": \"Student must select খ) N\", \"max_step_marks\": 1}]\n\nSTUDENT'S TRANSCRIBED ANSWER:\nবলের SI একক হলো kg \\cdot m/s^2"},
                {"role": "assistant", "content": "{\"question_id\": \"seed-001\", \"max_marks\": 1.0, \"score_obtained\": 0.0, \"criteria_evaluations\": [{\"step_name\": \"Correct Option\", \"max_step_marks\": 1.0, \"awarded_marks\": 0.0, \"status\": \"INCORRECT\", \"observation\": \"ছাত্র বলের মূল SI একক 'নিউটন' (N) এর পরিবর্তে এর মাত্রাভিত্তিক একক লিখেছে।\", \"cited_rubric_rule\": \"Student must select খ) N\"}], \"deduction_summary_bn\": \"বলের একক নিউটন (N), কিন্তু আপনি মাত্রাভিত্তিক একক লিখেছেন।\", \"deduction_summary_en\": \"The student wrote the dimensional unit instead of the standard SI unit Newton (N).\", \"grounding_confidence\": 0.95, \"transcript_mismatch_detected\": false, \"mistake_category\": \"CALCULATION_ERROR\", \"arithmetic_verified\": true}"}
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
        num_train_epochs = 3,           # Train 3 full epochs across all 208 samples (~78 steps)
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
print("\n[*] Testing Rubric Grading Inference with fine-tuned model...")
FastLanguageModel.for_inference(model)

test_messages = [
    {
        "role": "system",
        "content": "You are an expert Bangladeshi SSC/HSC board examiner and AI grading engine for SheraTutor. Your task is to evaluate a student's transcribed exam answer against the provided NCTB rubric. Verify all mathematical derivations step-by-step for numerical accuracy. If a student makes an early calculation error but uses correct subsequent logic, award consequential partial credit (ধারাবাহিক গণনা). Write deduction_summary_bn in natural, encouraging Bengali suitable for high school students. Output ONLY a raw, valid JSON object conforming exactly to the RubricEvaluationSchema."
    },
    {
        "role": "user",
        "content": "QUESTION (max 3.0 marks): 5 kg ভরের একটি বস্তুর ওপর 10 N বল প্রয়োগ করলে ত্বরণ কত হবে?\n\nOFFICIAL RUBRIC: [{\"step_name\": \"Formula F = ma\", \"max_step_marks\": 1}, {\"step_name\": \"Calculation\", \"max_step_marks\": 1}, {\"step_name\": \"Unit m/s^2\", \"max_step_marks\": 1}]\n\nSTUDENT'S TRANSCRIBED ANSWER:\nআমরা জানি, F = ma\na = F/m = 10/5 = 3 m/s^2"
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
    max_new_tokens = 512,
    use_cache = True,
    temperature = 0.2,
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
