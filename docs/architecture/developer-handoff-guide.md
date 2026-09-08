# **Developer Hand-Off Guide: SheraTutor B2C Web Portal (SSC Phase)**

This document serves as the complete technical blueprint and execution plan for building the initial student-facing (B2C) web portal for SheraTutor. The target scope is the SSC curriculum, which encompasses 33 subjects across both Bangla and English versions (66 textbooks total). The goal is to deploy a responsive web application built with Next.js, React 18, Tailwind CSS, and Shadcn UI.

## **1\. Core Architecture & Tech Stack**

The platform is designed to provide an always-available AI board examiner that delivers instant vision-based grading and interactive tutoring.

* **Frontend:** Next.js (Web), replacing the Flutter mobile app requirement for the initial beta phase.  
* **Database & Storage:** Supabase (PostgreSQL 15+ with the pgvector extension for semantic search) and Supabase Storage for storing cropped diagrams.  
* **AI Orchestration:** Firebase Genkit (TypeScript), replacing n8n to provide code-centric, type-safe workflows directly within the Node.js backend.  
* **Data Ingestion (Free RAG Stack):** Google Colab CLI, Marker (marker-pdf), and Ollama running locally within a cloud-provisioned T4 GPU.

## **2\. Phase 1: The Golden Dataset Extraction (The 66 Textbooks)**

Before the web UI can function, the Retrieval-Augmented Generation (RAG) foundation must be populated. We will use the Google Colab CLI to process the 66 SSC textbooks without incurring premium API costs.

### **A. Infrastructure Provisioning**

Use the Colab CLI natively from your terminal to orchestrate a cloud GPU:

> 1. Initialize a T4 GPU instance: colab new \--gpu T4  
> 2. Open an interactive shell or execute commands remotely: colab exec "pip install 'marker-pdf\[full\]'; curl \-fsSL \[https://ollama.com/install.sh\](https://ollama.com/install.sh) | sh; nohup ollama serve &"  
> 3. Pull the required Vision-Language Model: colab exec "ollama pull llava"

### **B. Python Extraction Script (ingest.py)**

Write a Python script to iterate through the PDF textbooks and push the parsed chunks to Supabase. Execute it remotely via colab exec \-f ingest.py.

* **Hybrid OCR Extraction:** Utilize Marker in Hybrid Mode to extract text, convert equations to LaTeX, and handle tables. For Bangla-version books, append the language flag to ensure the underlying Surya engine prioritizes Bengali text detection:  
  Bash  
  marker\_single /path/to/textbook\_bn.pdf /output/dir \--langs bn,en \--use\_llm \--llm\_service marker.services.ollama.OllamaService \--ollama\_base\_url "http://localhost:11434" \--ollama\_model "llava" \--mode fast

* **Diagram Captioning:** For complex geometric diagrams or chemical structures, the script should use the llava model to generate semantic text descriptions. Upload the isolated image to Supabase Storage and link the generated URL to the text chunk.

## **3\. Phase 2: Database Schema & RBAC Isolation**

The database must maintain strict structure to support accurate RAG retrieval and future multi-tenant B2B isolation using Postgres Row-Level Security (RLS).

### **A. NCTB\_CURRICULUM\_EMBEDDINGS Table**

Configure the table to store the textbook chunks:

* chapter\_id (Foreign Key mapping to the specific SSC subject/chapter).  
* content\_chunk (The extracted LaTeX/Markdown text).  
* embedding (1536 dimensions utilizing pgvector).  
* official\_rubric\_rules (JSONB).  
* source\_book\_page\_ref (String for references, including Supabase Storage URLs for diagrams).  
* **Crucial Addition:** Add a language\_tag (bn or en) to explicitly separate the Bangla and English versions of the 66 textbooks.

### **B. Student Profiles & Tracking**

* **STUDENT\_PROFILES Table:** Capture onboarding data including the Education Board (e.g., Dhaka, Madrasah, Technical), Exam Type (SSC, HSC), Academic Group, and Target Exam Year.  
* **WEAKNESS\_LOGS Table:** Track ongoing student metrics by capturing the weakness\_score (ranging from 0.0 for Mastered to 1.0 for Critical Gap), total questions attempted, and marks lost.

## **4\. Phase 3: Genkit Orchestration (The 4-Layer AI Engine)**

Implement the AI logic within Next.js API routes using Firebase Genkit to handle the evaluation pipeline.

* **Layer 1: OCR / Vision:** Accept image uploads of handwritten scripts from the frontend. Pass the image to a Vision API (e.g., Gemini 1.5 Flash on the free tier or a local VLM) to transcribe Bangla, English, and mathematical equations.  
* **Layer 2: RAG Grounding:** Convert the transcribed answer into an embedding and execute a similarity search against the pgvector database to pull the relevant NCTB textbook chunks and official board marking rubrics.  
* **Layer 3: Bangla Reasoning:** Pass the context to the LLM to evaluate the logic and prepare pedagogical feedback.  
* **Layer 4: Rubric Evaluator (JSON Enforcer):** Utilize Genkit's native Zod integration to force the LLM to output a strict JSON Schema. The schema must return an array of criteria\_evaluations detailing step\_name, max\_step\_marks, awarded\_marks, status (e.g., MATCHED, PARTIAL), and an observation.

## **5\. Phase 4: B2C Frontend Implementation (Next.js)**

Construct the user interface focusing on low-friction engagement, aiming for a 2.5-second Largest Contentful Paint (LCP).

### **A. Authentication & Onboarding**

* Implement multi-provider authentication using Supabase Auth (Email/Password, Google OAuth 2.0, Phone OTP).  
* Build the onboarding flow to capture the student's target metadata.

### **B. The Student Progress Dashboard**

* Render the **Momentum Score** and **Board Prediction Score**.  
* Display a Subject Understanding Heatmap indicating Green (Mastered), Yellow (Review Needed), and Red (Critical Gap).  
* Surface an "AI Quick Wins" component showing the top 3 high-impact study actions based on data from WEAKNESS\_LOGS.  
* Build the Adaptive Study Planner that generates a daily schedule reallocating study hours toward chapters exhibiting high weakness scores.

### **C. Exam Generation & Evaluation Interface**

* **Mock Exam Builder:** Allow students to select specific chapters, define difficulty levels, or pull exact past board papers.  
* **Script Upload Utility:** Provide a file picker to handle multi-page uploads of handwritten scripts in JPG, PNG, HEIC, or PDF formats.  
* **Evaluation Breakdown:** Render the resulting Genkit JSON evaluation into a readable mark breakdown.  
* **"Explain It Simply" Chatbot:** Integrate an interactive chat modal beside every deducted mark. Pre-load this session with the student's answer chunk and the exact rubric failure reason, allowing the AI to reply with plain-language analogies in conversational Bangla or English.

## **6\. Execution Strategy: The "Vertical Slice"**

To accelerate development and validate the RAG pipeline quickly, follow this implementation order:

> 1. Digitize **one single Science textbook** (e.g., Physics, English version) using the Colab CLI Python script.  
> 2. Set up the Supabase database and construct the Genkit flow for that specific subject.  
> 3. Build the Next.js frontend to allow uploading a handwritten Physics script and rendering the resulting JSON evaluation.  
> 4. Once the vertical slice is proven successful and grading accuracy is validated, execute the Colab CLI ingestion loop to process the remaining 65 textbooks.