const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const dotenv = require('dotenv');

const envPath = fs.existsSync('.env.local') ? '.env.local' : 'web/.env.local';
const env = dotenv.parse(fs.readFileSync(envPath));
const supabase = createClient(env.NEXT_PUBLIC_SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY);

async function seedMathPapers() {
  console.log('[*] Seeding NCTB SSC Model Test Papers for General Math and Higher Math...');

  // 1. Fetch subject IDs
  const { data: subjects, error: subErr } = await supabase
    .from('subjects')
    .select('id, code, name_en')
    .in('code', ['SSC-MATH', 'SSC-HMATH']);
  
  if (subErr || !subjects || subjects.length < 2) {
    throw new Error('Could not find SSC-MATH and SSC-HMATH subjects in database.');
  }

  const mathSub = subjects.find(s => s.code === 'SSC-MATH');
  const hmathSub = subjects.find(s => s.code === 'SSC-HMATH');

  // 2. Fetch chapter IDs
  const { data: chapters } = await supabase
    .from('chapters')
    .select('id, subject_id, chapter_no, title_en')
    .in('subject_id', [mathSub.id, hmathSub.id]);

  const findChapter = (subId, chNo) => chapters.find(c => c.subject_id === subId && c.chapter_no === chNo);

  const papersToSeed = [
    {
      subject_id: mathSub.id,
      title: 'SSC General Math Model Test 2026 — Chapter 3 & 13 (Algebra & Series)',
      paper_type: 'CQ',
      difficulty: 'MEDIUM',
      total_marks: 20,
      is_public_template: true,
      questions: [
        {
          chapter_id: findChapter(mathSub.id, 3).id,
          question_number: 1,
          question_type: 'CQ',
          max_marks: 10,
          stimulus_bn: '$x^2 - 3 = 2\\sqrt{2}$ এবং $p^3 + p^{-3} = 18\\sqrt{3}$ যেখানে $x > 0, p > 0$ দুটি বীজগাণিতিক সম্পর্ক।',
          stimulus_en: '$x^2 - 3 = 2\\sqrt{2}$ and $p^3 + p^{-3} = 18\\sqrt{3}$ where $x > 0, p > 0$ are two algebraic relations.',
          sub_questions: [
            {
              part: 'ক',
              marks: 2,
              text_bn: '$x$-এর মান নির্ণয় করো।',
              text_en: 'Find the value of $x$.',
              rubric_step_rules: 'প্রদত্ত সমীকরণ $x^2 = 3 + 2\\sqrt{2} = (\\sqrt{2}+1)^2$ আকারে রূপান্তরের জন্য ১ নম্বর, $x = \\sqrt{2}+1$ সঠিক মানের জন্য ১ নম্বর।'
            },
            {
              part: 'খ',
              marks: 4,
              text_bn: 'প্রমাণ করো যে, $x^6 - \\frac{1}{x^6} = 140\\sqrt{2}$।',
              text_en: 'Prove that $x^6 - \\frac{1}{x^6} = 140\\sqrt{2}$.',
              rubric_step_rules: '$\\frac{1}{x} = \\sqrt{2}-1$ বের করার জন্য ১ নম্বর, $x + \\frac{1}{x} = 2\\sqrt{2}$ ও $x - \\frac{1}{x} = 2$ নির্ণয়ের জন্য ১ নম্বর, ঘন বা উৎপাদক সূত্রে প্রয়োগের জন্য ১ নম্বর, চূড়ান্ত মান $140\\sqrt{2}$ প্রমাণের জন্য ১ নম্বর।'
            },
            {
              part: 'গ',
              marks: 4,
              text_bn: 'দেখাও যে, $p = \\sqrt{3} + \\sqrt{2}$।',
              text_en: 'Show that $p = \\sqrt{3} + \\sqrt{2}$.',
              rubric_step_rules: 'সমীকরণকে $p^6 - 18\\sqrt{3}p^3 + 1 = 0$ দ্বিঘাত আকারে রূপান্তরের জন্য ১ নম্বর, $p^3$ এর মান নির্ণয়ের জন্য ১ নম্বর, ঘনমূল নির্ণয়ের ধাপের জন্য ১ নম্বর, চূড়ান্ত ফলাফল $p = \\sqrt{3}+\\sqrt{2}$ এর জন্য ১ নম্বর।'
            }
          ]
        },
        {
          chapter_id: findChapter(mathSub.id, 13).id,
          question_number: 2,
          question_type: 'CQ',
          max_marks: 10,
          stimulus_bn: 'একটি সমান্তর ধারার ১০ম পদ $52$ এবং ১৬তম পদ $82$। অপর একটি গুণোত্তর ধারার ১ম পদ $3$ এবং সাধারণ অনুপাত $2$।',
          stimulus_en: 'The 10th term of an arithmetic series is 52 and the 16th term is 82. Another geometric series has first term 3 and common ratio 2.',
          sub_questions: [
            {
              part: 'ক',
              marks: 2,
              text_bn: 'গুণোত্তর ধারাটির ৫ম পদ নির্ণয় করো।',
              text_en: 'Find the 5th term of the geometric series.',
              rubric_step_rules: 'গুণোত্তর ধারার $n$-তম পদের সূত্র $ar^{n-1}$ লেখার জন্য ১ নম্বর, মান বসিয়ে ৫ম পদ $3 \\times 2^4 = 48$ নির্ণয়ের জন্য ১ নম্বর।'
            },
            {
              part: 'খ',
              marks: 4,
              text_bn: 'সমান্তর ধারাটির ১ম পদ ($a$) ও সাধারণ অন্তর ($d$) নির্ণয় করো।',
              text_en: 'Determine the first term and common difference of the arithmetic series.',
              rubric_step_rules: 'শর্তমতে $a+9d=52$ ও $a+15d=82$ সমীকরণ গঠনের জন্য ১ নম্বর, সমীকরণ বিয়োগ করে $d=5$ নির্ণয়ের জন্য ১.৫ নম্বর, ১ম পদ $a=7$ নির্ণয়ের জন্য ১.৫ নম্বর।'
            },
            {
              part: 'গ',
              marks: 4,
              text_bn: 'সমান্তর ধারাটির প্রথম ২৫টি পদের সমষ্টি নির্ণয় করো।',
              text_en: 'Find the sum of the first 25 terms of the arithmetic series.',
              rubric_step_rules: 'সমান্তর ধারার সমষ্টির সূত্র $S_n = \\frac{n}{2}[2a+(n-1)d]$ লেখার জন্য ১ নম্বর, $n=25, a=7, d=5$ মান বসানোর জন্য ১ নম্বর, ধাপভিত্তিক সঠিক হিসাবের জন্য ১ নম্বর, চূড়ান্ত ফলাফল $1675$ লেখার জন্য ১ নম্বর।'
            }
          ]
        }
      ]
    },
    {
      subject_id: hmathSub.id,
      title: 'SSC Higher Math Model Test 2026 — Chapter 7 & 11 (Series & Coordinate Geometry)',
      paper_type: 'CQ',
      difficulty: 'MEDIUM',
      total_marks: 20,
      is_public_template: true,
      questions: [
        {
          chapter_id: findChapter(hmathSub.id, 7).id,
          question_number: 1,
          question_type: 'CQ',
          max_marks: 10,
          stimulus_bn: '$\\frac{1}{2x+1} + \\frac{1}{(2x+1)^2} + \\frac{1}{(2x+1)^3} + \\dots$ একটি অনন্ত গুণোত্তর ধারা।',
          stimulus_en: '$\\frac{1}{2x+1} + \\frac{1}{(2x+1)^2} + \\frac{1}{(2x+1)^3} + \\dots$ is an infinite geometric series.',
          sub_questions: [
            {
              part: 'ক',
              marks: 2,
              text_bn: '$x = 1$ হলে ধারাটির সাধারণ অনুপাত নির্ণয় করো।',
              text_en: 'If $x = 1$, find the common ratio of the series.',
              rubric_step_rules: '$x=1$ বসিয়ে ধারাটির ১ম ও ২য় পদ নির্ণয়ের জন্য ১ নম্বর, সাধারণ অনুপাত $r = \\frac{1}{3}$ সঠিকভাবে নির্ণয়ের জন্য ১ নম্বর।'
            },
            {
              part: 'খ',
              marks: 4,
              text_bn: '$x$-এর ওপর কী শর্ত আরোপ করলে ধারাটির অসীমতক সমষ্টি থাকবে এবং সেই সমষ্টি নির্ণয় করো।',
              text_en: 'Under what condition on $x$ will the series have a sum to infinity, and find that sum?',
              rubric_step_rules: 'অসীমতক সমষ্টির শর্ত $|r| < 1$ প্রয়োগের জন্য ১ নম্বর, অসমতা সমাধান করে $x > 0$ অথবা $x < -1$ শর্তের জন্য ১.৫ নম্বর, অসীমতক সমষ্টির সূত্র $S_\\infty = \\frac{a}{1-r}$ প্রয়োগ করে $S_\\infty = \\frac{1}{2x}$ নির্ণয়ের জন্য ১.৫ নম্বর।'
            },
            {
              part: 'গ',
              marks: 4,
              text_bn: 'ধারাটির ১০ম পদ নির্ণয় করো এবং দেখাও যে পদ সংখ্যা বৃদ্ধির সাথে সাথে পদের মান শূন্যের দিকে ধাবিত হয়।',
              text_en: 'Find the 10th term of the series and show that as $n \\to \\infty$, the terms approach zero.',
              rubric_step_rules: 'সাধারণ পদের সূত্রে $n=10$ বসানোর জন্য ১ নম্বর, ১০ম পদ $\\frac{1}{(2x+1)^{10}}$ লেখার জন্য ১ নম্বর, $|2x+1|>1$ বিবেচনায় সীমার বিশ্লেষণ বা ব্যাখ্যার জন্য ২ নম্বর।'
            }
          ]
        },
        {
          chapter_id: findChapter(hmathSub.id, 11).id,
          question_number: 2,
          question_type: 'CQ',
          max_marks: 10,
          stimulus_bn: 'সমতলে চারটি বিন্দু $A(1, 2)$, $B(-3, 5)$, $C(-1, -1)$ এবং $D(3, -4)$ অবস্থিত।',
          stimulus_en: 'Four points $A(1, 2)$, $B(-3, 5)$, $C(-1, -1)$ and $D(3, -4)$ lie in a plane.',
          sub_questions: [
            {
              part: 'ক',
              marks: 2,
              text_bn: '$AB$ রেখাংশের দৈর্ঘ্য নির্ণয় করো।',
              text_en: 'Find the length of the line segment $AB$.',
              rubric_step_rules: 'দূরত্বের সূত্র $d = \\sqrt{(x_2-x_1)^2 + (y_2-y_1)^2}$ লেখার জন্য ১ নম্বর, মান বসিয়ে দৈর্ঘ্য $5$ একক নির্ণয়ের জন্য ১ নম্বর।'
            },
            {
              part: 'খ',
              marks: 4,
              text_bn: '$CD$ রেখার সমীকরণ এবং এর ঢাল নির্ণয় করো।',
              text_en: 'Find the equation and slope of the line $CD$.',
              rubric_step_rules: 'ঢালের সূত্র $m = \\frac{y_2-y_1}{x_2-x_1}$ প্রয়োগ করে $m = -\\frac{3}{4}$ নির্ণয়ের জন্য ১.৫ নম্বর, সরলরেখার সমীকরণ সূত্রে মান বসানোর জন্য ১.৫ নম্বর, সরলরেখার প্রমিত সমীকরণ $3x + 4y + 7 = 0$ লেখার জন্য ১ নম্বর।'
            },
            {
              part: 'গ',
              marks: 4,
              text_bn: 'শীর্ষবিন্দুগুলোর ঘড়ির কাঁটার বিপরীত দিক বিবেচনা করে চতুর্ভুজ $ABCD$-এর ক্ষেত্রফল নির্ণয় করো।',
              text_en: 'Calculate the area of quadrilateral $ABCD$ considering the vertices in anti-clockwise order.',
              rubric_step_rules: 'শীর্ষবিন্দুসমূহ স্থানাঙ্ক ছকে বিন্যস্ত করার জন্য ১ নম্বর, ক্ষেত্রফলের নির্ণায়ক/বহুভুজ সূত্র লেখার জন্য ১ নম্বর, সঠিক হিসাবের জন্য ১ নম্বর, চূড়ান্ত ক্ষেত্রফল $24$ বর্গ একক লেখার জন্য ১ নম্বর।'
            }
          ]
        }
      ]
    }
  ];

  for (const p of papersToSeed) {
    // Check if exists
    const { data: existing } = await supabase
      .from('question_papers')
      .select('id')
      .eq('title', p.title)
      .maybeSingle();

    let paperId = existing?.id;
    if (!paperId) {
      const { data: newPaper, error: pErr } = await supabase
        .from('question_papers')
        .insert({
          subject_id: p.subject_id,
          title: p.title,
          paper_type: p.paper_type,
          difficulty: p.difficulty,
          total_marks: p.total_marks,
          is_public_template: p.is_public_template
        })
        .select('id')
        .single();

      if (pErr) throw pErr;
      paperId = newPaper.id;
      console.log(`[+] Created Question Paper: ${p.title} (${paperId})`);
    } else {
      console.log(`[*] Paper already exists: ${p.title} (${paperId})`);
    }

    // Insert rubrics and questions
    for (const q of p.questions) {
      const rubricCriteria = q.sub_questions.map(sq => ({
        step_name: `Part (${sq.part})`,
        max_step_marks: sq.marks,
        matching_rules: sq.rubric_step_rules
      }));

      // Check if question already exists
      const { data: existingQ } = await supabase
        .from('questions')
        .select('id')
        .eq('question_paper_id', paperId)
        .eq('question_number', q.question_number)
        .maybeSingle();

      if (!existingQ) {
        const { data: rubric, error: rErr } = await supabase
          .from('rubrics')
          .insert({
            chapter_id: q.chapter_id,
            title: `${p.title} — Q${q.question_number}`,
            criteria_json: rubricCriteria,
            is_active: true
          })
          .select('id')
          .single();

        if (rErr) throw rErr;

        const { error: qErr } = await supabase
          .from('questions')
          .insert({
            question_paper_id: paperId,
            chapter_id: q.chapter_id,
            rubric_id: rubric.id,
            question_number: q.question_number,
            max_marks: q.max_marks,
            question_type: q.question_type,
            stimulus_bn: q.stimulus_bn,
            stimulus_en: q.stimulus_en,
            sub_questions_json: q.sub_questions,
            question_text_bn: q.stimulus_bn,
            question_text_en: q.stimulus_en
          });

        if (qErr) throw qErr;
        console.log(`  -> Inserted Q${q.question_number} with rubric ${rubric.id}`);
      } else {
        console.log(`  -> Q${q.question_number} already exists.`);
      }
    }
  }

  console.log('[✓] Math Question Papers seeded successfully!');
}

seedMathPapers().catch(console.error);
