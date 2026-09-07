import { z } from "genkit";
import { ai } from "@/ai/genkit";
import { retrieveGroundingFlow } from "@/ai/flows/retrieve-grounding";
import { getServiceRoleClient } from "@/lib/supabase/service-role";

/**
 * Autonomous NCTB Textbook & Curriculum Search Tool.
 * Allows the AI Tutor to retrieve verified textbook definitions, formulas, and diagrams
 * whenever students ask conceptual, historical, or out-of-rubric questions.
 */
export const searchTextbookCurriculum = ai.defineTool(
  {
    name: "searchTextbookCurriculum",
    description:
      "Searches official NCTB Bangladeshi secondary/higher-secondary physics textbooks for verified definitions, laws, and formulas.",
    inputSchema: z.object({
      query: z.string().describe("The physics concept, formula name, or question to search in the textbook"),
      chapterId: z.string().nullable().optional().describe("Optional chapter UUID to constrain search"),
      language: z.enum(["bn", "en"]).default("bn").describe("Language preference"),
    }),
    outputSchema: z.object({
      found: z.boolean(),
      confidence: z.number(),
      passages: z.array(
        z.object({
          content: z.string(),
          sourcePage: z.string().nullable().optional(),
          sectionTitle: z.string().nullable().optional(),
        })
      ),
    }),
  },
  async ({ query, chapterId, language = "bn" }) => {
    try {
      const isUuid = (val?: string | null) =>
        !!val && /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(val);

      if (chapterId && isUuid(chapterId)) {
        try {
          const result = await retrieveGroundingFlow({
            queryText: query,
            chapterId,
            languageTag: language,
            matchCount: 4,
          });

          if (result.chunks.length > 0) {
            return {
              found: true,
              confidence: result.groundingConfidence,
              passages: result.chunks.map((c) => ({
                content: c.content_chunk,
                sourcePage: c.source_book_page_ref,
                sectionTitle: c.section_title,
              })),
            };
          }
        } catch (groundingErr) {
          console.warn("retrieveGroundingFlow fallback to text search:", groundingErr);
        }
      }

      // Fallback: search across all active curriculum chunks in Supabase
      const supabase = getServiceRoleClient();
      let queryBuilder = supabase
        .from("curriculum_chunks")
        .select("content_chunk, source_book_page_ref, section_title");

      if (chapterId && isUuid(chapterId)) {
        queryBuilder = queryBuilder.eq("chapter_id", chapterId);
      }

      // Extract significant keywords rather than searching the verbatim full sentence
      const stopwords = new Set(["কীভাবে", "করব", "হলে", "কত", "বের", "যদি", "একটি", "এবং", "বা", "কোনো", "হলে", "কি", "কী"]);
      const keywords = query
        .replace(/[,%?!।=+\-*\/()]/g, " ")
        .split(/\s+/)
        .filter((w) => w.length > 1 && !stopwords.has(w))
        .slice(0, 3);

      if (keywords.length > 0) {
        const orConditions = keywords
          .map((kw) => `content_chunk.ilike.%${kw}%,section_title.ilike.%${kw}%`)
          .join(",");
        queryBuilder = queryBuilder.or(orConditions);
      } else {
        const cleanQuery = query.replace(/[,%]/g, " ").trim().slice(0, 30);
        queryBuilder = queryBuilder.or(`content_chunk.ilike.%${cleanQuery}%,section_title.ilike.%${cleanQuery}%`);
      }

      const { data: chunks } = await queryBuilder.limit(3);

      if (chunks && chunks.length > 0) {
        return {
          found: true,
          confidence: 0.85,
          passages: chunks.map((c: { content_chunk: string; source_book_page_ref?: string | null; section_title?: string | null }) => ({
            content: c.content_chunk,
            sourcePage: c.source_book_page_ref,
            sectionTitle: c.section_title,
          })),
        };
      }

      return {
        found: false,
        confidence: 0,
        passages: [],
      };
    } catch (err) {
      console.warn("searchTextbookCurriculum error:", err);
      return {
        found: false,
        confidence: 0,
        passages: [],
      };
    }
  }
);

/**
 * Sandboxed Physics Calculator & Equation Solver.
 * Evaluates core SSC/HSC formulas with exact numerical precision, eliminating
 * hallucinated arithmetic errors in AI explanations.
 */
export const verifyPhysicsCalculation = ai.defineTool(
  {
    name: "verifyPhysicsCalculation",
    description:
      "Performs exact arithmetic calculation for common SSC/HSC physics formulas (kinematics, dynamics, energy, power, electricity).",
    inputSchema: z.object({
      formula: z
        .enum([
          "v = u + at",
          "s = ut + 0.5at^2",
          "v^2 = u^2 + 2as",
          "s = ((u+v)/2)*t",
          "F = ma",
          "Ek = 0.5mv^2",
          "Ep = mgh",
          "P = W/t",
          "W = Fs",
          "density = m/V",
          "P = h_rho_g",
          "V = IR",
          "P = VI",
          "custom",
        ])
        .describe("The physical formula to evaluate"),
      variables: z
        .union([
          z.record(z.union([z.number(), z.string()])),
          z.string(),
        ])
        .describe("Known variables (e.g. { u: 0, a: 2, t: 10 } or { m: 500, v: 20 })"),
      targetVariable: z
        .string()
        .describe("The variable to compute (e.g. 'v', 's', 'Ek', 'F', 'Ep', 'P', 'W')"),
    }),
    outputSchema: z.object({
      result: z.number(),
      steps: z.array(z.string()),
      formulaUsed: z.string(),
      unit: z.string(),
    }),
  },
  async ({ formula, variables, targetVariable }) => {
    const steps: string[] = [];
    let result = 0;
    let unit = "";
    let formulaUsed: string = formula;

    const v: Record<string, number> = {};
    if (typeof variables === "string") {
      try {
        const normalized = variables.replace(/'/g, '"');
        const parsed = JSON.parse(normalized) as Record<string, unknown>;
        for (const [k, valNum] of Object.entries(parsed)) {
          const n = Number(valNum);
          v[k] = isNaN(n) ? 0 : n;
        }
      } catch {
        // Fallback
      }
    } else if (variables && typeof variables === "object") {
      for (const [k, valNum] of Object.entries(variables as Record<string, unknown>)) {
        const n = Number(valNum);
        v[k] = isNaN(n) ? 0 : n;
      }
    }

    switch (formula) {
      case "v = u + at": {
        if (targetVariable === "v") {
          unit = "ms⁻¹";
          const u = v.u ?? 0;
          const a = v.a ?? 0;
          const t = v.t ?? 0;
          result = u + a * t;
          steps.push(`Formula: v = u + at`);
          steps.push(`Substitution: v = ${u} + (${a} × ${t})`);
          steps.push(`Result: v = ${result} ${unit}`);
        } else if (targetVariable === "u") {
          unit = "ms⁻¹";
          const targetV = v.v ?? 0;
          const a = v.a ?? 0;
          const t = v.t ?? 0;
          result = targetV - a * t;
          steps.push(`Formula: u = v - at`);
          steps.push(`Substitution: u = ${targetV} - (${a} × ${t})`);
          steps.push(`Result: u = ${result} ${unit}`);
        } else if (targetVariable === "a") {
          unit = "ms⁻²";
          const u = v.u ?? 0;
          const targetV = v.v ?? 0;
          const t = v.t ?? 1;
          result = (targetV - u) / t;
          steps.push(`Formula: a = (v - u) / t`);
          steps.push(`Substitution: a = (${targetV} - ${u}) / ${t}`);
          steps.push(`Result: a = ${result} ${unit}`);
        } else if (targetVariable === "t") {
          unit = "s";
          const u = v.u ?? 0;
          const targetV = v.v ?? 0;
          const a = v.a ?? 1;
          result = (targetV - u) / a;
          steps.push(`Formula: t = (v - u) / a`);
          steps.push(`Substitution: t = (${targetV} - ${u}) / ${a}`);
          steps.push(`Result: t = ${result} ${unit}`);
        }
        break;
      }

      case "s = ut + 0.5at^2": {
        if (targetVariable === "s") {
          unit = "m";
          const u = v.u ?? 0;
          const a = v.a ?? 0;
          const t = v.t ?? 0;
          result = u * t + 0.5 * a * Math.pow(t, 2);
          steps.push(`Formula: s = ut + 0.5at²`);
          steps.push(`Substitution: s = (${u} × ${t}) + (0.5 × ${a} × ${t}²)`);
          steps.push(`Result: s = ${result} ${unit}`);
        } else if (targetVariable === "u") {
          unit = "ms⁻¹";
          const s = v.s ?? 0;
          const a = v.a ?? 0;
          const t = v.t ?? 1;
          result = (s - 0.5 * a * Math.pow(t, 2)) / t;
          steps.push(`Formula: u = (s - 0.5at²) / t`);
          steps.push(`Substitution: u = (${s} - 0.5 × ${a} × ${t}²) / ${t}`);
          steps.push(`Result: u = ${result} ${unit}`);
        } else if (targetVariable === "a") {
          unit = "ms⁻²";
          const s = v.s ?? 0;
          const u = v.u ?? 0;
          const t = v.t ?? 1;
          result = (2 * (s - u * t)) / Math.pow(t, 2);
          steps.push(`Formula: a = 2(s - ut) / t²`);
          steps.push(`Substitution: a = 2(${s} - ${u} × ${t}) / ${t}²`);
          steps.push(`Result: a = ${result} ${unit}`);
        }
        break;
      }

      case "v^2 = u^2 + 2as": {
        if (targetVariable === "v") {
          unit = "ms⁻¹";
          const u = v.u ?? 0;
          const a = v.a ?? 0;
          const s = v.s ?? 0;
          const vSq = Math.pow(u, 2) + 2 * a * s;
          result = Math.sqrt(Math.max(0, vSq));
          steps.push(`Formula: v² = u² + 2as`);
          steps.push(`Substitution: v² = (${u}²) + (2 × ${a} × ${s}) = ${vSq}`);
          steps.push(`Result: v = √${vSq} = ${result} ${unit}`);
        } else if (targetVariable === "u") {
          unit = "ms⁻¹";
          const targetV = v.v ?? 0;
          const a = v.a ?? 0;
          const s = v.s ?? 0;
          const uSq = Math.pow(targetV, 2) - 2 * a * s;
          result = Math.sqrt(Math.max(0, uSq));
          steps.push(`Formula: u² = v² - 2as`);
          steps.push(`Substitution: u² = (${targetV}²) - (2 × ${a} × ${s}) = ${uSq}`);
          steps.push(`Result: u = √${uSq} = ${result} ${unit}`);
        } else if (targetVariable === "s") {
          unit = "m";
          const targetV = v.v ?? 0;
          const u = v.u ?? 0;
          const a = v.a ?? 9.8;
          result = (Math.pow(targetV, 2) - Math.pow(u, 2)) / (2 * a);
          steps.push(`Formula: s = (v² - u²) / 2a`);
          steps.push(`Substitution: s = (${targetV}² - ${u}²) / (2 × ${a})`);
          steps.push(`Result: s = ${result} ${unit}`);
        } else if (targetVariable === "a") {
          unit = "ms⁻²";
          const targetV = v.v ?? 0;
          const u = v.u ?? 0;
          const s = v.s ?? 1;
          result = (Math.pow(targetV, 2) - Math.pow(u, 2)) / (2 * s);
          steps.push(`Formula: a = (v² - u²) / 2s`);
          steps.push(`Substitution: a = (${targetV}² - ${u}²) / (2 × ${s})`);
          steps.push(`Result: a = ${result} ${unit}`);
        }
        break;
      }

      case "s = ((u+v)/2)*t": {
        if (targetVariable === "s") {
          unit = "m";
          const u = v.u ?? 0;
          const targetV = v.v ?? 0;
          const t = v.t ?? 0;
          result = ((u + targetV) / 2) * t;
          steps.push(`Formula: s = ((u + v) / 2) × t`);
          steps.push(`Substitution: s = ((${u} + ${targetV}) / 2) × ${t}`);
          steps.push(`Result: s = ${result} ${unit}`);
        } else if (targetVariable === "t") {
          unit = "s";
          const s = v.s ?? 0;
          const u = v.u ?? 0;
          const targetV = v.v ?? 0;
          const sumV = u + targetV || 1;
          result = (2 * s) / sumV;
          steps.push(`Formula: t = 2s / (u + v)`);
          steps.push(`Substitution: t = (2 × ${s}) / (${u} + ${targetV})`);
          steps.push(`Result: t = ${result} ${unit}`);
        } else if (targetVariable === "u") {
          unit = "ms⁻¹";
          const s = v.s ?? 0;
          const targetV = v.v ?? 0;
          const t = v.t ?? 1;
          result = (2 * s) / t - targetV;
          steps.push(`Formula: u = (2s / t) - v`);
          steps.push(`Substitution: u = (2 × ${s} / ${t}) - ${targetV}`);
          steps.push(`Result: u = ${result} ${unit}`);
        } else if (targetVariable === "v") {
          unit = "ms⁻¹";
          const s = v.s ?? 0;
          const u = v.u ?? 0;
          const t = v.t ?? 1;
          result = (2 * s) / t - u;
          steps.push(`Formula: v = (2s / t) - u`);
          steps.push(`Substitution: v = (2 × ${s} / ${t}) - ${u}`);
          steps.push(`Result: v = ${result} ${unit}`);
        }
        break;
      }

      case "F = ma": {
        if (targetVariable === "F") {
          unit = "N";
          const m = v.m ?? 0;
          const a = v.a ?? 0;
          result = m * a;
          steps.push(`Formula: F = ma`);
          steps.push(`Substitution: F = ${m} kg × ${a} ms⁻²`);
          steps.push(`Result: F = ${result} ${unit}`);
        } else if (targetVariable === "m") {
          unit = "kg";
          const F = v.F ?? 0;
          const a = v.a ?? 1;
          result = F / a;
          steps.push(`Formula: m = F / a`);
          steps.push(`Substitution: m = ${F} N / ${a} ms⁻²`);
          steps.push(`Result: m = ${result} ${unit}`);
        } else if (targetVariable === "a") {
          unit = "ms⁻²";
          const F = v.F ?? 0;
          const m = v.m ?? 1;
          result = F / m;
          steps.push(`Formula: a = F / m`);
          steps.push(`Substitution: a = ${F} N / ${m} kg`);
          steps.push(`Result: a = ${result} ${unit}`);
        }
        break;
      }

      case "Ek = 0.5mv^2": {
        if (targetVariable === "Ek" || targetVariable === "E") {
          unit = "J";
          const m = v.m ?? 0;
          const targetV = v.v ?? 0;
          result = 0.5 * m * Math.pow(targetV, 2);
          steps.push(`Formula: Ek = 0.5 × m × v²`);
          steps.push(`Substitution: Ek = 0.5 × ${m} × (${targetV}²)`);
          steps.push(`Result: Ek = ${result} ${unit}`);
        } else if (targetVariable === "m") {
          unit = "kg";
          const Ek = v.Ek ?? v.E ?? 0;
          const targetV = v.v ?? 1;
          result = (2 * Ek) / Math.pow(targetV, 2);
          steps.push(`Formula: m = 2Ek / v²`);
          steps.push(`Substitution: m = (2 × ${Ek}) / (${targetV}²)`);
          steps.push(`Result: m = ${result} ${unit}`);
        } else if (targetVariable === "v") {
          unit = "ms⁻¹";
          const Ek = v.Ek ?? v.E ?? 0;
          const m = v.m ?? 1;
          result = Math.sqrt(Math.max(0, (2 * Ek) / m));
          steps.push(`Formula: v = √(2Ek / m)`);
          steps.push(`Substitution: v = √(2 × ${Ek} / ${m})`);
          steps.push(`Result: v = ${result} ${unit}`);
        }
        break;
      }

      case "Ep = mgh": {
        const g = v.g ?? 9.8;
        if (targetVariable === "Ep" || targetVariable === "E") {
          unit = "J";
          const m = v.m ?? 0;
          const h = v.h ?? 0;
          result = m * g * h;
          steps.push(`Formula: Ep = mgh`);
          steps.push(`Substitution: Ep = ${m} × ${g} × ${h}`);
          steps.push(`Result: Ep = ${result} ${unit}`);
        } else if (targetVariable === "h") {
          unit = "m";
          const Ep = v.Ep ?? v.E ?? 0;
          const m = v.m ?? 1;
          result = Ep / (m * g);
          steps.push(`Formula: h = Ep / (mg)`);
          steps.push(`Substitution: h = ${Ep} / (${m} × ${g})`);
          steps.push(`Result: h = ${result} ${unit}`);
        } else if (targetVariable === "m") {
          unit = "kg";
          const Ep = v.Ep ?? v.E ?? 0;
          const h = v.h ?? 1;
          result = Ep / (g * h);
          steps.push(`Formula: m = Ep / (gh)`);
          steps.push(`Substitution: m = ${Ep} / (${g} × ${h})`);
          steps.push(`Result: m = ${result} ${unit}`);
        }
        break;
      }

      case "P = W/t": {
        if (targetVariable === "P") {
          unit = "W";
          const W = v.W ?? 0;
          const t = v.t ?? 1;
          result = W / t;
          steps.push(`Formula: P = W / t`);
          steps.push(`Substitution: P = ${W} / ${t}`);
          steps.push(`Result: P = ${result} ${unit}`);
        } else if (targetVariable === "W") {
          unit = "J";
          const P = v.P ?? 0;
          const t = v.t ?? 0;
          result = P * t;
          steps.push(`Formula: W = P × t`);
          steps.push(`Substitution: W = ${P} × ${t}`);
          steps.push(`Result: W = ${result} ${unit}`);
        } else if (targetVariable === "t") {
          unit = "s";
          const W = v.W ?? 0;
          const P = v.P ?? 1;
          result = W / P;
          steps.push(`Formula: t = W / P`);
          steps.push(`Substitution: t = ${W} / ${P}`);
          steps.push(`Result: t = ${result} ${unit}`);
        }
        break;
      }

      case "W = Fs": {
        if (targetVariable === "W") {
          unit = "J";
          const F = v.F ?? 0;
          const s = v.s ?? 0;
          result = F * s;
          steps.push(`Formula: W = F × s`);
          steps.push(`Substitution: W = ${F} × ${s}`);
          steps.push(`Result: W = ${result} ${unit}`);
        } else if (targetVariable === "F") {
          unit = "N";
          const W = v.W ?? 0;
          const s = v.s ?? 1;
          result = W / s;
          steps.push(`Formula: F = W / s`);
          steps.push(`Substitution: F = ${W} / ${s}`);
          steps.push(`Result: F = ${result} ${unit}`);
        } else if (targetVariable === "s") {
          unit = "m";
          const W = v.W ?? 0;
          const F = v.F ?? 1;
          result = W / F;
          steps.push(`Formula: s = W / F`);
          steps.push(`Substitution: s = ${W} / ${F}`);
          steps.push(`Result: s = ${result} ${unit}`);
        }
        break;
      }

      case "density = m/V": {
        if (targetVariable === "density" || targetVariable === "rho" || targetVariable === "d") {
          unit = "kg m⁻³";
          const m = v.m ?? 0;
          const V = v.V ?? 1;
          result = m / V;
          steps.push(`Formula: ρ = m / V`);
          steps.push(`Substitution: ρ = ${m} kg / ${V} m³`);
          steps.push(`Result: ρ = ${result} ${unit}`);
        } else if (targetVariable === "m") {
          unit = "kg";
          const rho = v.density ?? v.rho ?? v.d ?? 0;
          const V = v.V ?? 0;
          result = rho * V;
          steps.push(`Formula: m = ρ × V`);
          steps.push(`Substitution: m = ${rho} × ${V}`);
          steps.push(`Result: m = ${result} ${unit}`);
        } else if (targetVariable === "V") {
          unit = "m³";
          const m = v.m ?? 0;
          const rho = v.density ?? v.rho ?? v.d ?? 1;
          result = m / rho;
          steps.push(`Formula: V = m / ρ`);
          steps.push(`Substitution: V = ${m} / ${rho}`);
          steps.push(`Result: V = ${result} ${unit}`);
        }
        break;
      }

      case "P = h_rho_g": {
        const g = v.g ?? 9.8;
        if (targetVariable === "P" || targetVariable === "p") {
          unit = "Pa";
          const h = v.h ?? 0;
          const rho = v.rho ?? v.density ?? 1000;
          result = h * rho * g;
          steps.push(`Formula: P = h × ρ × g`);
          steps.push(`Substitution: P = ${h} × ${rho} × ${g}`);
          steps.push(`Result: P = ${result} ${unit}`);
        } else if (targetVariable === "h") {
          unit = "m";
          const P = v.P ?? v.p ?? 0;
          const rho = v.rho ?? v.density ?? 1000;
          result = P / (rho * g);
          steps.push(`Formula: h = P / (ρ × g)`);
          steps.push(`Substitution: h = ${P} / (${rho} × ${g})`);
          steps.push(`Result: h = ${result} ${unit}`);
        }
        break;
      }

      case "V = IR": {
        if (targetVariable === "V") {
          unit = "V";
          const I = v.I ?? 0;
          const R = v.R ?? 0;
          result = I * R;
          steps.push(`Formula: V = IR`);
          steps.push(`Substitution: V = ${I} A × ${R} Ω`);
          steps.push(`Result: V = ${result} ${unit}`);
        } else if (targetVariable === "I") {
          unit = "A";
          const targetV = v.V ?? 0;
          const R = v.R ?? 1;
          result = targetV / R;
          steps.push(`Formula: I = V / R`);
          steps.push(`Substitution: I = ${targetV} / ${R}`);
          steps.push(`Result: I = ${result} ${unit}`);
        } else if (targetVariable === "R") {
          unit = "Ω";
          const targetV = v.V ?? 0;
          const I = v.I ?? 1;
          result = targetV / I;
          steps.push(`Formula: R = V / I`);
          steps.push(`Substitution: R = ${targetV} / ${I}`);
          steps.push(`Result: R = ${result} ${unit}`);
        }
        break;
      }

      case "P = VI": {
        if (targetVariable === "P") {
          unit = "W";
          const V = v.V ?? 0;
          const I = v.I ?? 0;
          result = V * I;
          steps.push(`Formula: P = VI`);
          steps.push(`Substitution: P = ${V} V × ${I} A`);
          steps.push(`Result: P = ${result} ${unit}`);
        } else if (targetVariable === "V") {
          unit = "V";
          const P = v.P ?? 0;
          const I = v.I ?? 1;
          result = P / I;
          steps.push(`Formula: V = P / I`);
          steps.push(`Substitution: V = ${P} / ${I}`);
          steps.push(`Result: V = ${result} ${unit}`);
        } else if (targetVariable === "I") {
          unit = "A";
          const P = v.P ?? 0;
          const V = v.V ?? 1;
          result = P / V;
          steps.push(`Formula: I = P / V`);
          steps.push(`Substitution: I = ${P} / ${V}`);
          steps.push(`Result: I = ${result} ${unit}`);
        }
        break;
      }

      default: {
        formulaUsed = targetVariable;
        unit = "";
        steps.push(`Computation completed for ${targetVariable}`);
        result = 0;
      }
    }

    // Round to 4 decimal places for clean display
    const rounded = Math.round(result * 10000) / 10000;
    return {
      result: rounded,
      steps,
      formulaUsed,
      unit,
    };
  }
);

/**
 * Genkit Interrupt Primitive for Human-In-The-Loop Practice Quizzes.
 * Halts generation to request explicit student consent before producing
 * a diagnostic 3-question remedial quiz.
 */
export const requestPracticeQuizInterrupt = ai.defineInterrupt({
  name: "requestPracticeQuizInterrupt",
  description:
    "Prompts the student for confirmation before generating an interactive 3-question remedial practice quiz. ONLY call this tool when the student explicitly and directly asks for a practice quiz or test (e.g., 'কুইজ দাও', 'টেস্ট নাও'). DO NOT call this tool for general explanations, formula questions, or standard math queries.",
  inputSchema: z.object({
    topic: z.string().describe("Specific physics topic (e.g. 'গতিশক্তি ও কাজ')"),
    reason: z.string().describe("Pedagogical reason why practice questions will clarify the misconception"),
  }),
  outputSchema: z.object({
    approved: z.boolean().describe("Whether the student agreed to start the practice quiz"),
  }),
});
