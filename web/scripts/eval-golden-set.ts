/**
 * Golden-set eval harness (docs/review §8.1, §6.1). Runs the real pipeline
 * (transcribePageFlow, evaluateRubricFlow — no RAG grounding, deliberately:
 * docs/review §9.1 says test "does AI grading work at all" before a single
 * textbook is ingested) against every active `golden_set_items` row, scores
 * the output two ways, and writes one `golden_set_model_runs` row per item:
 *
 *   1. Transcription fidelity — character error rate (CER) of the model's
 *      transcription against the human ground-truth transcription. A model
 *      that silently "corrects" a student's mistake (docs/review §3) shows
 *      up as anomalously LOW CER specifically on wrong-answer scripts; this
 *      harness prints CER per item so that pattern is visible, not averaged away.
 *
 *   2. Grading agreement — mean absolute error (MAE) in marks and
 *      quadratic-weighted kappa (QWK) between the AI score and the human
 *      *consensus* (mean of the 3 blind examiner grades), plus human-human
 *      QWK as the ceiling to compare against. This replaces the original,
 *      unachievable "Pearson r >= 0.95" NFR (docs/review §6.1) — MAE in
 *      marks is the number to actually take to a school; QWK is the
 *      standard statistic for ordinal mark agreement.
 *
 * This does NOT populate golden_set_items with real data — that's a human
 * data-collection step (find ~30 real scripts, get 3 examiners to grade them
 * blind, see ingestion/README.md "Golden dataset"), not something a script
 * can do. Run this AFTER golden_set_items/golden_set_human_grades have real
 * rows in them; against zero rows it just reports "no active golden set items".
 *
 * Usage:
 *   cd web && npx tsx scripts/eval-golden-set.ts
 */
import { config } from "dotenv";
config({ path: ".env.local" });
import { transcribePageFlow } from "../src/ai/flows/transcribe";
import { evaluateRubricFlow } from "../src/ai/flows/evaluate-rubric";
import { MODELS, PIPELINE_VERSION, PROMPT_VERSION } from "../src/ai/genkit";
import { getServiceRoleClient } from "../src/lib/supabase/service-role";

/** Levenshtein-distance-based character error rate: edits / reference length. */
function characterErrorRate(reference: string, hypothesis: string): number {
  const ref = reference.trim();
  const hyp = hypothesis.trim();
  if (ref.length === 0) return hyp.length === 0 ? 0 : 1;

  let prev = Array.from({ length: hyp.length + 1 }, (_, j) => j);
  for (let i = 1; i <= ref.length; i++) {
    const curr = [i];
    for (let j = 1; j <= hyp.length; j++) {
      curr.push(
        ref[i - 1] === hyp[j - 1]
          ? prev[j - 1]
          : 1 + Math.min(prev[j - 1], prev[j], curr[j - 1])
      );
    }
    prev = curr;
  }
  return prev[hyp.length] / ref.length;
}

/** Quadratic-weighted kappa over scores bucketed into half-mark bins [0, maxMarks]. */
function quadraticWeightedKappa(a: number[], b: number[], maxMarks: number): number {
  const bins = Math.round(maxMarks * 2) + 1; // half-mark resolution
  const bucket = (score: number) => Math.min(bins - 1, Math.max(0, Math.round(score * 2)));

  const observed = Array.from({ length: bins }, () => new Array(bins).fill(0));
  const histA = new Array(bins).fill(0);
  const histB = new Array(bins).fill(0);
  for (let i = 0; i < a.length; i++) {
    const bi = bucket(a[i]);
    const bj = bucket(b[i]);
    observed[bi][bj] += 1;
    histA[bi] += 1;
    histB[bj] += 1;
  }

  let numerator = 0;
  let denominator = 0;
  const n = a.length;
  for (let i = 0; i < bins; i++) {
    for (let j = 0; j < bins; j++) {
      const weight = ((i - j) ** 2) / (bins - 1) ** 2;
      const expected = (histA[i] * histB[j]) / n;
      numerator += weight * observed[i][j];
      denominator += weight * expected;
    }
  }
  return denominator === 0 ? 1 : 1 - numerator / denominator;
}

function mean(xs: number[]): number {
  return xs.reduce((a, b) => a + b, 0) / xs.length;
}

async function main() {
  const supabase = getServiceRoleClient();

  const { data: items, error } = await supabase
    .from("golden_set_items")
    .select("*, questions(id, question_text_bn, question_text_en, max_marks, rubrics(criteria_json))")
    .eq("is_active", true);
  if (error) throw new Error(`eval-golden-set: ${error.message}`);
  if (!items || items.length === 0) {
    console.log(
      "No active golden_set_items rows — populate the golden set first (see " +
        "ingestion/README.md 'Golden dataset'). Nothing to evaluate."
    );
    return;
  }

  const aiScores: number[] = [];
  const humanConsensusScores: number[] = [];
  const cers: number[] = [];
  const humanHumanQwkSamples: { examinerA: number; examinerB: number }[] = [];

  for (const item of items) {
    const question = item.questions as unknown as {
      id: string;
      question_text_bn: string | null;
      question_text_en: string | null;
      max_marks: number;
      rubrics: { criteria_json: unknown } | { criteria_json: unknown }[] | null;
    };
    const rubricCriteria = Array.isArray(question.rubrics)
      ? question.rubrics[0]?.criteria_json
      : question.rubrics?.criteria_json;

    const { data: grades } = await supabase
      .from("golden_set_human_grades")
      .select("examiner_label, score_obtained")
      .eq("golden_set_item_id", item.id);
    if (!grades || grades.length < 2) {
      console.warn(`[skip] item ${item.id}: fewer than 2 human grades on file, can't measure agreement.`);
      continue;
    }
    const humanConsensus = mean(grades.map((g) => Number(g.score_obtained)));
    for (let i = 0; i < grades.length; i++) {
      for (let j = i + 1; j < grades.length; j++) {
        humanHumanQwkSamples.push({
          examinerA: Number(grades[i].score_obtained),
          examinerB: Number(grades[j].score_obtained),
        });
      }
    }

    const transcription = await transcribePageFlow({
      imageUrl: item.script_image_url,
      expectedLanguage: "mixed",
    });
    const cer = characterErrorRate(item.human_transcription, transcription.transcribed_text);

    const evaluation = await evaluateRubricFlow({
      questionId: question.id,
      questionText: question.question_text_bn ?? question.question_text_en ?? "",
      maxMarks: Number(question.max_marks),
      transcribedAnswer: transcription.transcribed_text,
      rubricCriteria: rubricCriteria ?? [],
      groundingChunks: [], // deliberately no RAG — see file header
      studentLanguagePreference: "bn",
    });

    await supabase.from("golden_set_model_runs").insert({
      golden_set_item_id: item.id,
      model_transcription: transcription.transcribed_text,
      transcription_cer: cer,
      model_score: evaluation.score_obtained,
      max_marks: evaluation.max_marks,
      rubric_breakdown_json: evaluation.criteria_evaluations,
      model_name: MODELS.reasoning,
      model_version: "unpinned",
      prompt_version: PROMPT_VERSION,
      pipeline_version: PIPELINE_VERSION,
    });

    aiScores.push(evaluation.score_obtained);
    humanConsensusScores.push(humanConsensus);
    cers.push(cer);

    console.log(
      `item ${item.id}: CER=${cer.toFixed(3)}  AI=${evaluation.score_obtained}/${evaluation.max_marks}  ` +
        `human_consensus=${humanConsensus.toFixed(2)}  diff=${(evaluation.score_obtained - humanConsensus).toFixed(2)}`
    );
  }

  if (aiScores.length === 0) {
    console.log("No items had enough human grades to score. Nothing aggregated.");
    return;
  }

  const maxMarks = Number((items[0].questions as { max_marks: number }).max_marks);
  const mae = mean(aiScores.map((s, i) => Math.abs(s - humanConsensusScores[i])));
  const aiVsHumanQwk = quadraticWeightedKappa(aiScores, humanConsensusScores, maxMarks);
  const humanHumanQwk =
    humanHumanQwkSamples.length > 0
      ? quadraticWeightedKappa(
          humanHumanQwkSamples.map((s) => s.examinerA),
          humanHumanQwkSamples.map((s) => s.examinerB),
          maxMarks
        )
      : null;

  console.log("\n=== Aggregate ===");
  console.log(`n items scored:        ${aiScores.length}`);
  console.log(`mean CER:              ${mean(cers).toFixed(3)}`);
  console.log(`MAE (marks):           ${mae.toFixed(2)}`);
  console.log(`AI-vs-human QWK:       ${aiVsHumanQwk.toFixed(3)}`);
  console.log(
    `human-human QWK:       ${humanHumanQwk !== null ? humanHumanQwk.toFixed(3) : "n/a (need >=2 examiners per item)"}` +
      "  <- this is the ceiling; AI-vs-human QWK should land within this band, not exceed it (docs/review §6.1)"
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
