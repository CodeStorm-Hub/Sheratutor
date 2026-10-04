### What Has Been Completed

#### A. Database & Schema Architecture (`/supabase`)
*Verified directly via Supabase MCP (`qjottictwewysfcjirma`)*
- **12 Migrations Applied**: All 12 production migrations are active in PostgreSQL with RLS enabled across all 24 tables.
- **Provider & Model Decoupling (§7.2)**: `chunk_embeddings` is separated from `curriculum_chunks` with `model_name`, `model_version`, and 1024-dim vector support (`bge-m3`).
- **Versioned Rubrics (§7.4)**: `rubrics` table is independently versioned with `criteria_json` and step-by-step mark allocations.
- **Data Integrity & Marks (§7.5, §7.8)**: All marks are stored as `numeric(5,2)` (avoiding float accumulation bugs). `STUDENT_PROFILES.group` renamed to `academic_group`.
- **Multi-Tenancy (§7.9)**: `institution_id` denormalized onto `exam_submissions`, `submission_pages`, `grading_results`, `weakness_logs`, and `questions`.
- **Audit & Provenance (§7.12–7.14)**: `grading_results` stores `model_name`, `prompt_version`, `rubric_version_id`, `pipeline_version`. `grading_corrections` and `audit_log` tables exist.
- **Golden Set Schema (§8.1)**: Migration `00000000000011_golden_set.sql` provisioned `golden_set_items`, `golden_set_human_grades`, and `golden_set_model_runs`.
- **Vector Search Function (`match_curriculum_chunks`)**: PostgreSQL RPC handles cosine similarity filtered by subject, curriculum version, and language tag (`bn` / `en`).

---

#### B. Ingestion & RAG Pipeline (`/ingestion`)
- **Marker 2.0 Parser Alignment (§1.1, §1.2)**: Removed obsolete flags, aligned parser with Marker 2.0 block schema, and added `--page-range` support.
- **Ollama Embedding Integration**: Updated `embed_text()` to use `POST /api/embed` with `bge-m3:latest` (eliminating cloud API rate limits and providing native 1024-dim Bengali semantic embeddings).
- **Ingestion State Tracking (§5.1)**: `ingestion_jobs` records every run, page range, chunk count, and execution status.
- **Bilingual Extraction & Vector Search Verified**: Successfully ingested and verified retrieval for NCTB SSC Physics in both English (`physics_en.pdf`) and Bangla (`physics_bn.pdf`) with LaTeX equations ($\vec{A}, \vec{B}$, $v = s/t$, $37^{\circ}\text{C}$).

---

#### C. AI Core & Genkit Flows (`/web/src/ai`)
- **Provider Pivot (§1.4, §5.2)**: Configured Genkit 1.41.0 with OpenAI-compatible adapters for **NVIDIA NIM** (`nemotron-nano-12b-v2-vl`), **Fireworks AI**, and local **Ollama** (`bge-m3`).
- **`retrieve-grounding.ts` (Layer 2)**: Queries Supabase pgvector and returns grounded curriculum chunks with exact book page references.
- **`transcribe.ts` (Layer 1)**: Verbatim handwritten transcription prompt designed with anti-correction constraints (§3).
- **`grade-submission.ts` & `evaluate-rubric.ts` (Layers 3 & 4)**: Multi-layer grading pipeline enforcing Zod schema output, deduction explanations in Bengali and English, and rubric criteria evaluations.
- **`tutor-chat.ts` (Layer 5)**: Socratic AI tutor with academic topic guardrails.
- **Minor-Safety Pre-filter (§8.4)**: Self-harm and crisis keyword detection with fallback escalation to Bangladesh's national helpline (*Kaan Pete Roi: ০৯৬১৩৪২৭৮০০*).

---

#### D. Frontend & Compliance (`/web/src/app`)
- **Bengali Typography (§8.6)**: Configured font stack in [layout.tsx](file:///home/syed/workspace/Sheratutor/web/src/app/layout.tsx) with **Baloo Da 2** (Bengali Display), **Hind Siliguri** (Bengali Body), **Baloo 2** (Latin Display), **Inter** (Latin Body), and **Space Mono** (Stats/Eyebrows).
- **PDPA 2026 Minor Consent Flow (§2.1)**: [onboarding/page.tsx](file:///home/syed/workspace/Sheratutor/web/src/app/onboarding/page.tsx) includes an age gate (`dateOfBirth` < 18 detection), parent/guardian phone number field, and statutory consent confirmation.
- **B2C Pages**: Responsive Landing page with waitlist capture, Supabase Auth (`/login`, `/signup`, `/auth`), Student Dashboard (`/dashboard`), and Upload portal (`/dashboard/upload`).
- **Interactive Playground & NCTB Board Master Guide (§8.7)**:
  - **Version 1 (Quest Arena)**: Live at `/dashboard/playground` with Class 9–10 General Math Chapter 1 (বাস্তব সংখ্যা), Chapter 2 (সেট ও ফাংশন), Chapter 3 (বীজগাণিতিক রাশি), and Chapter 4 (সূচক ও লগারিদম).
  - **Version 2 (Virtual Interactive Guidebook & Subject Hierarchy)**: Live at `/dashboard/playground/v2` with Calm Discovery, hideable drawer, and 5-Step Learning Framework (`[ 1 Learn Concept ] [ 2 See Example ] [ 3 Try Yourself ] [ 4 Check Understanding ] [ 5 Summary ]`):
    - **General Mathematics**: Chapter 1 (বাস্তব সংখ্যা / Real Numbers)
    - **General Mathematics**: Chapter 2 (সেট ও ফাংশন / Sets & Functions — Set Notations Roster/Builder, Venn Diagrams & De Morgan Laws, Disjoint Sets, Power Set P(A) & 2ⁿ Subsets Proof, Cartesian Product Relations Grid & Arrow Graph, Function Machine & Mother-Child Domain-Range, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 6 Formula Cards & Socratic AI Tutor)
    - **General Mathematics**: Chapter 3 (বীজগাণিতিক রাশি / Algebraic Expressions — Geometric Tiles Partition & Identities, Symmetrical $x \pm 1/x$ Reciprocal Power Ladder with Zero Cube Trap, Middle-Term Factor Splitter with $p, q$ Match Badges & Factoring Grid, Remainder & Factor Theorem Vanishing Machine with 3-Line NCTB Technique, Cyclic & Symmetric Permutations $a \to b \to c \to a$, 3 Worked Board CQs with Examiner Rubrics, 3 Numeric Challenges, 5 Board MCQs, 6 Formula Cards, 4 Examiner Traps & Socratic AI Companion)
    - **General Mathematics**: Chapter 4 (সূচক ও লগারিদম / Exponents & Logarithms — Laws of Indices & Exponent Power Scale with a⁰=1 (a≠0) & a⁻ⁿ Division Ladder, Logarithm Definition & Balance Machine with aˣ=N ⇔ x=logₐ N & Base a=1 / Negative N Trap Sentinel, Laws of Logs Product/Quotient/Change of Base with Fatal Trap log(M+N)≠log M+log N Live Contrast, Exponential Equations Solver with 4 Board Models, Scientific Notation, Characteristic & Mantissa Converter with Bar Notation & Negative Log Mantissa Trap, 3 Worked Board CQs with Examiner Rubrics & Secrets, 3 Numeric Challenges, 5 Board MCQs, 6 Formula Cards, 4 Examiner Traps & Socratic AI Companion)
    - **General Mathematics**: Chapter 5 (এক চলকবিশিষ্ট সমীকরণ / Equations in One Variable — Equation vs Identity Balance Scale with 5 Fundamental Differences, Linear Equations & Transposition Swapping Machine, Sridhar Acharya's Quadratic Formula & Discriminant Collider D = b² - 4ac with 4 Nature Presets, Radical Equations & Extraneous Root Detector with Verification Test Gate & Empty Set Trap, Word Problems Modeling for Boat-Stream Velocity, Fractions & Cistern Work, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 6 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 6 (রেখা, কোণ ও ত্রিভুজ / Lines, Angles & Triangles — Lines, Angles & Linear Pair / Vertically Opposite Angles with Ray Rotator, Parallel Lines & Transversal Angles with Alternate Z-shape, Corresponding F-shape & Consecutive Interior 180° C/U-shape, Triangle Angle Sum 180° Theorem 16 & Exterior Angle Theorem 17, 4 Congruence Criteria SAS/SSS/ASA/RHS with AAA & SSA Trap Sentinel, Pythagoras Theorem & Triangle Inequality Collider with Acute/Right/Obtuse Classifier & Pythagorean Triples, 3 Worked Board CQs with Rubrics, 3 Numeric Challenges, 5 Board MCQs, 6 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 7 (ব্যবহারিক জ্যামিতি / Practical Geometry — Triangle Constructions: Sum of Sides & Perimeter Labs, Difference of Sides Case 1 & Case 2 Opposite Ray, Right Triangle Hypotenuse & Side, 5 Independent Quadrilateral Conditions Hierarchy & Minimum Data Matrix, Rhombus Diagonals & Trapezoid Simulator, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 6 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 8 (বৃত্ত / Circle — Circle Center & Chords Theorems 17, 18, 19 with SSS Congruence & Pythagoras, Theorem 20 Central vs Inscribed Angle ∠BOC = 2∠BAC with Corollaries 1 & 2 Semi-circle = 90°, Theorems 23 & 24 Cyclic Quadrilateral Opposite Supplementary Angles & Exterior Ray ∠BCE = ∠BAD, Theorems 25, 26, 27 Tangents & Secants Pair PA = PB & Touching Circles d = R ± r, Constructions 8, 9, 10 Circumcircle, Incircle & Excircle Simulator, 3 Worked Board CQs with Mark Rubrics & Secrets, 3 Challenges, 5 MCQs, 6 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 9 (ত্রিকোণমিতিক অনুপাত / Trigonometric Ratios — Right Triangle & 6 Fundamental Trig Ratios sin, cos, tan, csc, sec, cot with Live Theta Slider & Bangla Rhyme Cards, 3 Fundamental Identities sin²θ + cos²θ = 1, sec²θ - tan²θ = 1, csc²θ - cot²θ = 1 with Dynamic Balancer & Derived Forms, Standard Trig Values 0°, 30°, 45°, 60°, 90° with Left Hand 5-Finger Formula & Undefined Detector tan 90°, Trigonometric Equations 2cos²θ + 3sinθ - 3 = 0 with Acute 0° < θ < 90° vs Non-negative Constraints Filter, Complementary Angles sin(90° - θ) = cos θ with Perspective Swap Simulator, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 4 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 10 (দূরত্ব ও উচ্চতা / Distance & Elevation — Angle of Elevation & Depression Horizontal Sight Line Simulator, Tower Height & NCTB 30°-45°-60° Angle Geometry Drawing Rules, River Width Two-Observation Points & 60° to 30° Half-Distance Shortcut, Broken Storm Tree & Pole Modeling h = (H sin θ)/(1 + sin θ), Aerial Balloon Dual Object Observation Opposite vs Same Side, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 4 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 11 (বীজগাণিতিক অনুপাত ও সমানুপাত / Algebraic Ratio & Proportion — Ratio & Proportion Fundamentals with Cross-Multiplication, Componendo & Dividendo Master Balancer, Continued Proportion & k-Method Proof Lab with Geometric Area Equality, Compound Ratio "দ" Method & Money Distribution, Radical Algebraic Equation Solver via Repeated Componendo-Dividendo, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 4 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 12 (দুই চলকবিশিষ্ট সরল সহসমীকরণ / Simultaneous Linear Equations in Two Variables — System Consistency & 3 Golden Conditions $a_1/a_2 \ne b_1/b_2$, Substitution vs Elimination Step-by-Step Solver, Cross-Multiplication Determinant Matrix $x/(b_1c_2-b_2c_1)=y/(c_1a_2-c_2a_1)=1/(a_1b_2-a_2b_1)$, SVG Cartesian Coordinate Graph & Intersection Pin $P(2,1)$, Real-Life Upstream-Downstream Boat Speed Word Problem, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 4 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 13 (সসীম ধারা / Finite Series — Arithmetic Progression AP & $n$-th Term Growth Ladder $a+(n-1)d$, AP Sum & Gauss Pairing Visualizer $(u_1+u_n)$, Special Series $\sum n, \sum n^2, \sum n^3$ with Golden Identity $\sum n^3 = (\sum n)^2$, Geometric Progression GP Exponential Scale $a \cdot r^{n-1}$, GP Summation & Logarithmic Series Converter, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 4 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 14 (অনুপাত, সদৃশতা ও প্রতিসমতা / Ratio, Similarity & Symmetry — Thales's Theorem 28 & Line Segment Proportionality $AD/DB = AE/EC$ with Dynamic SVG Parallel Ray $DE \parallel BC$, Angle Bisector Theorem 30 $BD/DC = AB/AC$, Equiangular Similar Triangles $\Delta ABC \sim \Delta DEF$ with Scaler $k$, Similar Triangles Area Ratio Theorem 33 $\Delta_1/\Delta_2 = (a_1/a_2)^2 = k^2$ with Tile Visualizer, Line & Rotational Symmetry Orders for Equilateral Triangle, Square, Rectangle & Circle, 3 Worked Board CQs with Examiner Rubrics & Secrets, 3 Numeric Challenges, 5 Board MCQs, 4 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 15 (ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য / Area Theorems & Constructions — Parallelograms on Same Base & Parallel Lines Theorem 35 Area Balancer, Triangles on Same Base & Half-Parallelogram Area Theorem 36 Peak Slider, Median Bisects Triangle Area Equally Corollary, Pythagoras Theorem & Garfield's Trapezoid Dissection Theorem 39 $c^2 = a^2 + b^2$, Area-Conserving Construction 13 Triangle to Parallelogram with Preserved Area, 3 Worked Board CQs with Examiner Rubrics, 3 Numeric Challenges, 5 Board MCQs, 5 Formula Cards & Socratic AI Companion)
    - **General Mathematics**: Chapter 16 (পরিমিতি / Mensuration — Triangles Multifaceted Lab 16.1 with Equilateral $\frac{\sqrt{3}}{4}a^2$, Right-angled $\frac{1}{2}bh$, Isosceles $\frac{b}{4}\sqrt{4a^2-b^2}$, Heron's Formula $\sqrt{s(s-a)(s-b)(s-c)}$, Two Sides & Included Angle $\frac{1}{2}ab\sin\theta$; Quadrilaterals & Trapezoid Simulator 16.2 with Parallelogram $bh$, Rhombus $\frac{1}{2}d_1 d_2$, Trapezoid $\frac{1}{2}(a+b)h$; Regular Polygons Lab 16.2 with $n$-gon Formula $\frac{na^2}{4}\cot\frac{180^\circ}{n}$, Apothem, Interior & Central Angles for $n=3,4,5,6,8$; Circles & Sectors Lab 16.3 with Circumference $2\pi r$, Area $\pi r^2$, Arc Length $s=\frac{\pi r\theta}{180^\circ}$, Sector Area $A=\frac{\theta}{360^\circ}\pi r^2=\frac{1}{2}sr$, Circular Ring Pathway, Wheel Revolutions $N=\frac{D}{2\pi r}$; 3D Solids Lab 16.4 with Rectangular Cuboid $abc, 2(ab+bc+ca), \sqrt{a^2+b^2+c^2}$, Cube $a^3, 6a^2, \sqrt{3}a$, Cylinder $\pi r^2 h, 2\pi rh, 2\pi r(r+h)$; 3 Worked Board CQs with Rubrics & Secrets, 3 Numeric Challenges, 5 Board MCQs, Formula Cheat Sheet & Socratic AI Companion)
    - **General Mathematics**: Chapter 17 (পরিসংখ্যান / Statistics — Short-cut Method Arithmetic Mean $\bar{x} = a + \frac{\sum f_i u_i}{N} \times h$ Assumed Mean Simulator, Cumulative Frequency $F_c$ Table & Median $L + (\frac{N}{2} - F_c)\frac{h}{f_m}$ Lab, Mode Simulator $L + \frac{f_1}{f_1+f_2} \times h$ with 1st Class & Last Class Boundary Traps, Ogive Curve Graph with Upper Class Boundaries, Origin Broken Line & Median $N/2$ Graphical Projection Ray, Continuous Class Boundaries Histogram & Frequency Polygon with Midpoint Anchoring & Modal Diagonal Cross-Lines, 3 Worked Board CQs (Dhaka 2024, Chattogram 2024, Rajshahi 2024), 3 Numeric Challenges, 5 Board MCQs, 5 Formula Cards, 4 Examiner Traps & Socratic AI Companion) — **100% Completion of General Mathematics (All 17 Chapters Live & Verified)**
    - **Physics**: Chapter 1 (ভৌত রাশি ও পরিমাপ / Physical Quantities & Measurement)

    - **Physics**: Chapter 2 (গতি / Motion)
    - **Physics**: Chapter 3 (বল / Force — Inertia, F=ma, Gun Recoil, Momentum Conservation & Friction)
    - **Physics**: Chapter 4 (কাজ, ক্ষমতা ও শক্তি / Work, Power & Energy — Work & Angle $\theta$, $E_k$ & Momentum, Spring $E_p$, Conservation Tower, Motor Efficiency)
    - **Physics**: Chapter 5 (পদার্থের অবস্থা ও চাপ / States of Matter & Pressure — Pressure & Density, Liquid Pressure $h\rho g$, Archimedes Buoyancy, Pascal Hydraulic Lift, Young's Modulus)
    - **Physics**: Chapter 6 (বস্তুর ওপর তাপের প্রভাব / Effect of Heat on Matter — Temperature Scales & Kinetic Theory, Solid Expansion & Rail Gaps $\alpha, \beta, \gamma$, Real vs Apparent Liquid Expansion & Anomalous Water, Calorimetry & Thermal Equilibrium, Latent Heat Heating Curve & Pressure Cooker)
    - **Physics**: Chapter 7 (তরঙ্গ ও শব্দ / Waves & Sound — Simple Harmonic Motion $T=2\pi\sqrt{l/g}$, Transverse vs Longitudinal Waves $v=f\lambda$, Speed of Sound across Mediums & Bell Jar Vacuum, Echo Reflection & Well Depth $2d=vt$, Audible Spectrum 20 Hz – 20 kHz & SONAR Survey)
    - **Physics**: Chapter 8 (আলোর প্রতিফলন / Reflection of Light — Laws of Reflection & Plane Mirror $H/2$, Concave Mirror 6-Position Ray Tracing, Convex Mirror & Driver FOV, Mirror Formula Solver $\frac{1}{u}+\frac{1}{v}=\frac{1}{f}$, Dangerous Mountain Curve & Real-World Optical Devices)
    - **Physics**: Chapter 10 (স্থির তড়িৎ / Static Electricity — Triboelectric Friction & Humidity Leakage, Gold-leaf Electroscope 4-Step Induction Wizard, Coulomb Force Collider $F=k\frac{q_1 q_2}{r^2}$, Electric Field $E=k\frac{Q}{r^2}$ Dipole & Null Point, Parallel Plate Capacitor $C=\frac{\varepsilon A}{d}$, Electric Potential & Potential Difference, Lightning Rod & Earthing Safety)
    - **Physics**: Chapter 11 (চল তড়িৎ / Current Electricity — Ohm's Law $V = IR$ Live Circuit & Formula Triangle, Resistivity & 3D Wire Geometry $R = \rho L/A$ with Metal vs Semiconductor Temperature Dynamics, Series & Parallel Simulator with Internal Resistance & Lost Volts $v = Ir$, Electricity Bill Calculator $W = \frac{Pt}{1000}\text{ kWh}$ with High-Voltage Grid System Loss $P_{\text{loss}} = I^2R$, Household Electrical Safety with Live/Neutral Switches, Earth Grounding & Bird vs Bat Electrocution Mystery, 3 Worked Board CQs with Examiner Rubrics, 3 Challenges, 5 MCQs, Formula Bank Cheat Sheet & Socratic AI Tutor)
    - **Physics**: Chapter 12 (বিদ্যুতের চৌম্বক ক্রিয়া / Magnetic Effects of Current — Oersted Experiment & Right-Hand Thumb Rule with Compass Deflection $B = \frac{\mu_0 I}{2\pi r}$, Solenoid & Electromagnet Magnetic Domains $\mu_r$ with Temporary Soft Iron Demagnetization vs Permanent Steel, DC Motor & Fleming's Left-Hand Rule with Split-Ring Commutator & Fault-Injection Stalling at $90^\circ$ Neutral Plane, Electromagnetic Induction & Lenz's Law Opposition with Center-Zero Galvanometer, AC / DC Generator with Sinusoidal Waveform Oscilloscope, Dual-Coil Transformer with Fatal DC Battery Trap Warning $V_s = 0\text{ V}$, High-Voltage 132 kV Grid Transmission Loss Calculator Slashing Line Collapse Down to 2.87 W with 99.99% Efficiency, 3 Worked Board CQs with Examiner Secrets, 3 Numeric Challenges, 5 Board MCQs, 6 Formula Cards & Socratic AI Tutor)
    - **Physics**: Chapter 13 (আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স / Modern Physics & Electronics) — *Next In-Progress*

---

### Remaining Technical Deliverables (Engineering & Product)

Excluding Compliance and Legal items, here is the detailed breakdown of the remaining engineering tasks required for the **SheraTutor B2C Web Portal (SSC Phase)**:

---

### 1. Ingestion & Curriculum RAG Pipeline

#### A. Full 8-Book Ingestion (Core SSC Subjects)
* **Status**: Chapter 2 & 3 of Physics (BN & EN) are ingested and verified.
* **Remaining**: Scale the ingestion pipeline across the remaining chapters of the **4 core SSC subjects** (8 textbooks total):
  1. **Physics** (*পদার্থবিজ্ঞান*) — Bangla & English versions (Ch 1 to Ch 14)
  2. **Chemistry** (*রসায়ন*) — Bangla & English versions
  3. **General Mathematics** (*সাধারণ গণিত*) — Bangla & English versions
  4. **English** (*English for Today*) — Classes 9 & 10
* **Technical Detail**: Use batch chunking with Marker 2.0 and local `bge-m3:latest` embedding generation, tracked via `ingestion_jobs`.

---

### 2. OCR, Transcription & Question Mapping

#### A. Question-to-Region / Page Association
* **Current State**: All uploaded pages of a submission are concatenated into a single text block during grading.
* **Remaining**:
  * **Question Picker on Upload**: Allow students to indicate which page or section corresponds to which question (e.g., *Question 1 (ক, খ) on Page 1*, *Question 1 (গ, ঘ) on Page 2*).
  * **Structured Question Mapping**: Update `submission_answers` to map individual question IDs to specific page slices and transcript chunks.

#### B. Student Transcription Review & Correction UI
* **Problem**: Vision-Language Models (VLMs) can occasionally misread messy handwriting or silently normalize student mistakes.
* **Remaining**:
  * In `/dashboard/submissions/[id]`, display the **Raw Transcribed Text & LaTeX** alongside the original uploaded image.
  * Provide a **"Report OCR Error" / "Edit Transcription"** toggle so the student can verify what the AI read before or after grading.

---

### 3. Asynchronous Grading Queue & Real-Time UX

#### A. Background Worker (`pgmq` / Asynchronous Processing)
* **Current State**: `gradeSubmissionFlow` runs sequentially inside server actions. Multi-page submissions can exceed HTTP request timeouts on slow connections.
* **Remaining**:
  * **Queue Enqueue**: When a student clicks "Submit for Evaluation", enqueue the job with an `idempotency_key` in PostgreSQL (`pgmq` or background worker).
  * **Supabase Realtime Progress**: Stream the evaluation status in real-time to the student's browser:
    $$\text{UPLOADED} \longrightarrow \text{OCR\_PROCESSING} \longrightarrow \text{RETRIEVING\_GROUNDING} \longrightarrow \text{EVALUATING} \longrightarrow \text{COMPLETED}$$

#### B. Visual Rubric Breakdown Display
* **Remaining**:
  * Render the 4-part Creative Question (CQ) rubric breakdown:
    * **ক (Knowledge / জ্ঞানমূলক):** 1 Mark
    * **খ (Comprehension / অনুধাবনমূলক):** 2 Marks
    * **গ (Application / প্রয়োগমূলক):** 3 Marks
    * **ঘ (Higher Order Thinking / উচ্চতর দক্ষতামূলক):** 4 Marks
  * Highlight exact step-by-step deductions with bilingual explanations (*Bangla & English*).

---

### 4. Interactive Socratic Tutor Chat ("Explain It Simply")

#### A. In-Context Chat Drawer in Dashboard
* **Current State**: `tutorChatFlow` is written in `web/src/ai/flows/tutor-chat.ts` with minor-safety pre-filters.
* **Remaining**:
  * Build the interactive chat UI (drawer/modal) on the submission results page.
  * When a student clicks **"বুঝিয়ে বলো" (Explain this step)** on a deduction, automatically initialize the chat pre-loaded with:
    * The exact sub-question
    * The student's answer text
    * The specific rubric rule missed
    * Grounded textbook excerpts

---

### 5. Evaluation Harness & Golden Dataset

#### A. Golden Set Benchmark Runner
* **Current State**: Database tables (`golden_set_items`, `golden_set_human_grades`, `golden_set_model_runs`) are provisioned via migration `0011`.
* **Remaining**:
  * **Populate Corpus**: Insert ~30 real handwritten student exam answers with consensus grades from 3 human examiners.
  * **Automated CI Eval Script**: A CLI/test script (`eval_benchmark.ts` / Python) that runs the grading flow over the golden set and outputs:
    * **Mean Absolute Error (MAE)** in marks
    * **Quadratic Weighted Kappa (QWK)** against human examiners
    * **Character Error Rate (CER)** on messy handwriting vs clean handwriting

---

### 6. Client-Side Optimization & Abuse Prevention

#### A. Low-Bandwidth Image Compression
* **Problem**: Rural Bangladeshi students often upload 12MP–48MP smartphone photos over metered 3G/4G connections.
* **Remaining**:
  * Implement client-side Canvas/WebP downscaling in the upload component before upload (converting a 5MB JPEG/HEIC to ~300KB WebP without losing text readability).

#### B. Daily Grading Quotas & Telemetry
* **Remaining**:
  * Rate-limiting middleware: Limit free students to a generous daily quota (e.g. 5–10 script evaluations/day) to prevent bot scraping and API abuse.
  * Complete token & vision page logging in `grading_results` for operational cost tracking.

---

### Summary Checklist

```markdown
[ ] 1. Ingest remaining chapters for the 8 core SSC textbooks
[ ] 2. Build Question-to-Page mapping in upload flow
[ ] 3. Add Student OCR Review / Edit UI
[ ] 4. Connect Async Worker (`pgmq`) with Supabase Realtime progress
[ ] 5. Wire the "Explain It Simply" Socratic Chat drawer to submission results
[ ] 6. Populate the 30-script Golden Dataset & run the CI evaluation harness
[ ] 7. Add client-side WebP image compression (<300KB)
[ ] 8. Enforce daily student evaluation quotas
```