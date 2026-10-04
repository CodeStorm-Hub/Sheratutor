import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ai, MODELS } from '@/ai/genkit';
import { preFilterSafety, SAFE_ESCALATION_MESSAGE_BN } from '@/ai/flows/tutor-chat';

export const maxDuration = 60;

const CHAPTER_1_CONTEXT = `
Context: NCTB Class 9-10 General Math, Chapter 1: বাস্তব সংখ্যা (Real Numbers).
Key concepts:
1. Real Numbers (ℝ): All rational and irrational numbers.
2. Rational Numbers (ℚ): Numbers in form p/q (p, q ∈ ℤ, q ≠ 0). Decimals are finite or recurring. 0 is rational (0 = 0/1).
3. Irrational Numbers (ℚ'): Numbers not in form p/q. Infinite non-recurring decimals (e.g. √2, √3, π = 3.14159...).
4. Natural Numbers (ℕ): 1, 2, 3, 4, 5... (0 is NOT natural).
5. Integers (ℤ): ... -3, -2, -1, 0, 1, 2, 3 ...
6. √2 is irrational proof: Assumption √2 = p/q (coprime, q > 1) -> 2 = p^2/q^2 -> 2q = p^2/q. 2q is integer, p^2/q is fraction, contradiction.
7. Recurring decimals 9-0 rule: Numerator = (Full number - Non-repeating part), Denominator = (9s for repeating digits followed by 0s for non-repeating digits).
8. Red line addition: Align repeating decimals, draw vertical red line with at least 2 buffer digits to catch carry propagation.

Teacher persona: You are SheraTutor's warm, patient, Socratic AI Teacher for Bangladeshi Class 9-10 SSC students.
Respond in natural, encouraging Bengali (বাংলা).
Use LaTeX for math symbols enclosed in dollar signs ($...$ or $$...$$). Never put Bengali words inside dollar signs.
Explain intuitively without dumping overwhelming text. Keep responses concise (2 to 4 sentences).
`;

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body?.message || '';
    const lesson = body?.lesson || 1;

    if (!message || typeof message !== 'string') {
      return NextResponse.json({ error: 'Message is required' }, { status: 400 });
    }

    // Safety pre-filter
    const safety = preFilterSafety(message);
    if (safety.flagged) {
      return NextResponse.json({
        reply: SAFE_ESCALATION_MESSAGE_BN,
        safety: true,
      });
    }

    // Check user authentication (optional: gracefully handles both logged in and guest mode)
    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Call Genkit AI with Chapter 1 context
    const response = await ai.generate({
      model: MODELS.reasoning,
      prompt: `${CHAPTER_1_CONTEXT}
Student question about Lesson ${lesson}:
"${message}"

Provide a warm, encouraging, Socratic response in clear Bengali with LaTeX math notation.`,
      config: {
        temperature: 0.3,
      },
    });

    const reply = response.text?.trim() || 'বাস্তব সংখ্যার ধারণা বেশ মজার! যেকোনো সংখ্যা সংখ্যারেখায় স্থাপন করা গেলে তা বাস্তব সংখ্যা। তোমার আর কোনো প্রশ্ন থাকলে বলো!';

    // Optional: Log message to database if user is logged in
    if (user) {
      try {
        const { data: profile } = await supabase
          .from('student_profiles')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (profile) {
          // Record or audit if needed
        }
      } catch (logErr) {
        console.warn('Playground chat DB logging skipped:', logErr);
      }
    }

    return NextResponse.json({
      reply,
      status: 'ok',
    });
  } catch (error) {
    console.error('Playground chat API error:', error);

    // Fallback smart responses for offline / timeout
    return NextResponse.json({
      reply: 'বাস্তব সংখ্যা (Real Numbers) অধ্যায়ে যেকোনো সংখ্যাকে p/q (যেখানে q ≠ 0) আকারে লেখা গেলে তা মূলদ। আর যা এভাবে লেখা যায় না (যেমন: $\\sqrt{2}$, $\\pi$), তা অমূলদ সংখ্যা। আর কিছু জানতে চাও?',
      status: 'fallback',
    });
  }
}
