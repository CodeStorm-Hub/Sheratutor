import os
from huggingface_hub import HfApi

api = HfApi()

README_16BIT = """---
base_model: Qwen/Qwen2.5-7B-Instruct
tags:
- nctb
- education
- rubric-evaluation
- bengali
- stem
- math
- higher-math
- unsloth
- transformers
- text-generation
- qwen2
license: apache-2.0
language:
- bn
- en
pipeline_tag: text-generation
---

# SheraTutor Qwen 2.5 7B — NCTB Sovereign Grading Engine

**SheraTutor Qwen 2.5 7B** is a domain-specialized, instruction-tuned language model designed for sovereign grading and pedagogical evaluation of Bangladeshi Secondary and Higher Secondary (NCTB SSC & HSC) STEM exams (General Mathematics, Higher Mathematics, and Physics).

Finetuned on top of **Qwen 2.5 7B Instruct** using [Unsloth](https://github.com/unslothai/unsloth), this model acts as an expert Bangladeshi board examiner. It strictly adheres to structured rubric step evaluation, performs rigorous mathematical calculation verification, awards consequential partial credit (*ধারাবাহিক গণনা*), and produces encouraging Bengali pedagogical feedback.

## Key Capabilities

- **Strict Schema Adherence (`RubricEvaluationSchema`)**: Outputs clean, parseable JSON evaluation without conversational noise or preamble.
- **Consequential Credit (*ধারাবাহিক গণনা*)**: If a student makes an early calculation error but uses correct subsequent logic and formulas, the engine awards credit for subsequent steps.
- **Verbatim OCR Respect**: Never hallucinates omitted steps; evaluates precisely what the student wrote.
- **Step-by-Step Numerical Verification**: Validates formulas, substitutions, algebraic manipulation, and physical units ($m/s^2$, $N$, $J$, etc.).
- **Empathetic Pedagogical Bengali Feedback**: Summarizes score deductions in compassionate, constructive Bengali (`deduction_summary_bn`).

## Model Details

- **Base Model**: `Qwen/Qwen2.5-7B-Instruct`
- **Architecture**: Qwen2 (7 Billion parameters)
- **Fine-Tuning Method**: LoRA (Unsloth 4-bit QLoRA, merged into 16-bit)
- **Rank ($r$) / Alpha**: $r=16, \\alpha=32$
- **Target Modules**: `q_proj`, `k_proj`, `v_proj`, `o_proj`, `gate_proj`, `up_proj`, `down_proj`
- **Training Epochs**: 3 full epochs (Cosine learning rate schedule, AdamW 8-bit)
- **Training Hardware**: Tesla T4 GPU via Kaggle compute

## Evaluation Output Schema

The model responds in JSON conforming to the following structure:

```json
{
  "total_marks": 2.0,
  "max_marks": 3.0,
  "steps_breakdown": [
    {
      "step_name": "Formula F = ma",
      "marks_awarded": 1.0,
      "max_marks": 1.0,
      "feedback_bn": "সঠিক সূত্র $F = ma$ প্রয়োগ করা হয়েছে।"
    },
    {
      "step_name": "Calculation",
      "marks_awarded": 0.0,
      "max_marks": 1.0,
      "feedback_bn": "গণনায় ভুল হয়েছে: $10/5 = 2$ হবে, কিন্তু ৩ লেখা হয়েছে।"
    },
    {
      "step_name": "Unit m/s^2",
      "marks_awarded": 1.0,
      "max_marks": 1.0,
      "feedback_bn": "ত্বরণের একক $m/s^2$ সঠিক।"
    }
  ],
  "deduction_summary_bn": "সূত্রের প্রয়োগ ও একক লেখার জন্য ২ নম্বর প্রদান করা হয়েছে। তবে ভাগের হিসাবটি পুনরায় খেয়াল করো।"
}
```

## Quickstart (Transformers)

```python
import torch
from transformers import AutoModelForCausalLM, AutoTokenizer

model_id = "syed181/sheratutor-qwen2.5-7b"

tokenizer = AutoTokenizer.from_pretrained(model_id)
model = AutoModelForCausalLM.from_pretrained(
    model_id,
    torch_dtype=torch.bfloat16,
    device_map="auto"
)

system_prompt = (
    "You are an expert Bangladeshi SSC/HSC board examiner and AI grading engine for SheraTutor. "
    "Your task is to evaluate a student's transcribed exam answer against the provided NCTB rubric. "
    "Verify all mathematical derivations step-by-step for numerical accuracy. "
    "If a student makes an early calculation error but uses correct subsequent logic, "
    "award consequential partial credit (ধারাবাহিক গণনা). "
    "Write deduction_summary_bn in natural, encouraging Bengali suitable for high school students. "
    "Output ONLY a raw, valid JSON object conforming exactly to the RubricEvaluationSchema."
)

prompt = (
    "QUESTION (max 3.0 marks): 5 kg ভরের একটি বস্তুর ওপর 10 N বল প্রয়োগ করলে ত্বরণ কত হবে?\\n\\n"
    "OFFICIAL RUBRIC: [{\\"step_name\\": \\"Formula F = ma\\", \\"max_step_marks\\": 1}, "
    "{\\"step_name\\": \\"Calculation\\", \\"max_step_marks\\": 1}, "
    "{\\"step_name\\": \\"Unit m/s^2\\", \\"max_step_marks\\": 1}]\\n\\n"
    "STUDENT'S TRANSCRIBED ANSWER:\\nআমরা জানি, F = ma\\na = F/m = 10/5 = 3 m/s^2"
)

messages = [
    {"role": "system", "content": system_prompt},
    {"role": "user", "content": prompt}
]

inputs = tokenizer.apply_chat_template(messages, tokenize=True, add_generation_prompt=True, return_tensors="pt").to(model.device)
outputs = model.generate(inputs, max_new_tokens=512, temperature=0.1)
print(tokenizer.decode(outputs[0][inputs.shape[1]:], skip_special_tokens=True))
```

## Associated Models
- **Quantized GGUF Version (Ollama / llama.cpp)**: [`syed181/sheratutor-qwen2.5-7b-gguf`](https://huggingface.co/syed181/sheratutor-qwen2.5-7b-gguf)

## Citation & Attribution
Developed for the **SheraTutor** AI education project by **Syed and Afsan (CodeStorm Hub)** for sovereign, equitable exam evaluation in Bangladesh.

- **Website**: [https://www.sheratutor.tech](https://www.sheratutor.tech)
- **Syed Salman Reza**: [https://syed-reza98.github.io](https://syed-reza98.github.io)
- **Afsan Chowdhury**: [https://afsan123.github.io](https://afsan123.github.io)
"""

README_GGUF = """---
base_model: syed181/sheratutor-qwen2.5-7b
tags:
- gguf
- ollama
- llama.cpp
- nctb
- education
- rubric-evaluation
- bengali
- stem
- math
- unsloth
license: apache-2.0
language:
- bn
- en
---

# SheraTutor Qwen 2.5 7B (GGUF) — NCTB Exam Grading Engine

This repository provides **Q4_K_M GGUF** quantized weights of **SheraTutor Qwen 2.5 7B**, optimized for fast local CPU/GPU inference via **Ollama**, **llama.cpp**, and local AI engines.

The model is specialized for Bangladeshi NCTB Secondary & Higher Secondary (SSC/HSC) STEM exam grading, featuring:
- Strict **`RubricEvaluationSchema`** JSON output
- Step-by-step mathematical verification
- Consequential marking (*ধারাবাহিক গণনা*)
- Constructive pedagogical feedback in Bengali

## Available Quantization Formats
- `Qwen2.5-7B-Instruct.Q4_K_M.gguf` (~4.68 GB) — High performance 4-bit medium quantization with optimal perplexity.

## Quickstart with Ollama

Run directly via Ollama from Hugging Face Hub:

```bash
# Pull the model directly
ollama pull hf.co/syed181/sheratutor-qwen2.5-7b-gguf

# (Optional) Create a short local alias
ollama cp hf.co/syed181/sheratutor-qwen2.5-7b-gguf sheratutor-qwen2.5:7b

# Run an interactive prompt
ollama run sheratutor-qwen2.5:7b
```

### Python Ollama Integration

```python
import ollama

system_prompt = (
    "You are an expert Bangladeshi SSC/HSC board examiner and AI grading engine for SheraTutor. "
    "Your task is to evaluate a student's transcribed exam answer against the provided NCTB rubric. "
    "Verify all mathematical derivations step-by-step for numerical accuracy. "
    "If a student makes an early calculation error but uses correct subsequent logic, "
    "award consequential partial credit (ধারাবাহিক গণনা). "
    "Write deduction_summary_bn in natural, encouraging Bengali suitable for high school students. "
    "Output ONLY a raw, valid JSON object conforming exactly to the RubricEvaluationSchema."
)

user_prompt = \"\"\"
QUESTION (max 3.0 marks): 5 kg ভরের একটি বস্তুর ওপর 10 N বল প্রয়োগ করলে ত্বরণ কত হবে?

OFFICIAL RUBRIC: [{"step_name": "Formula F = ma", "max_step_marks": 1}, {"step_name": "Calculation", "max_step_marks": 1}, {"step_name": "Unit m/s^2", "max_step_marks": 1}]

STUDENT'S TRANSCRIBED ANSWER:
আমরা জানি, F = ma
a = F/m = 10/5 = 3 m/s^2
\"\"\"

response = ollama.chat(
    model="sheratutor-qwen2.5:7b",
    messages=[
        {"role": "system", "content": system_prompt},
        {"role": "user", "content": user_prompt}
    ],
    options={"temperature": 0.1}
)

print(response["message"]["content"])
```

## Associated Models
- **Full Merged 16-Bit Model (PyTorch / vLLM)**: [`syed181/sheratutor-qwen2.5-7b`](https://huggingface.co/syed181/sheratutor-qwen2.5-7b)

## Citation & Attribution
Developed for the **SheraTutor** AI education project by **Syed and Afsan (CodeStorm Hub)** for sovereign, equitable exam evaluation in Bangladesh.

- **Website**: [https://www.sheratutor.tech](https://www.sheratutor.tech)
- **Syed Salman Reza**: [https://syed-reza98.github.io](https://syed-reza98.github.io)
- **Afsan Chowdhury**: [https://afsan123.github.io](https://afsan123.github.io)
"""

print("[*] Uploading README.md to syed181/sheratutor-qwen2.5-7b...")
api.upload_file(
    path_or_fileobj=README_16BIT.encode("utf-8"),
    path_in_repo="README.md",
    repo_id="syed181/sheratutor-qwen2.5-7b",
    repo_type="model",
    commit_message="docs: Update SheraTutor Qwen 2.5 7B Model Card with NCTB rubric capabilities and quickstart"
)
print("[OK] Uploaded to syed181/sheratutor-qwen2.5-7b")

print("[*] Uploading README.md to syed181/sheratutor-qwen2.5-7b-gguf...")
api.upload_file(
    path_or_fileobj=README_GGUF.encode("utf-8"),
    path_in_repo="README.md",
    repo_id="syed181/sheratutor-qwen2.5-7b-gguf",
    repo_type="model",
    commit_message="docs: Update SheraTutor Qwen 2.5 7B GGUF Model Card with Ollama quickstart and usage examples"
)
print("[OK] Uploaded to syed181/sheratutor-qwen2.5-7b-gguf")
