import { describe, it, expect } from 'vitest';
import { PHYSICS_CHAPTERS_REGISTRY } from './registry';
import { getPhysicsChapterData } from './chapters';

describe('Physics Playground Domain & Registry', () => {
  it('contains exactly 14 NCTB SSC Physics chapters in sequence', () => {
    expect(PHYSICS_CHAPTERS_REGISTRY).toHaveLength(14);
    PHYSICS_CHAPTERS_REGISTRY.forEach((ch, idx) => {
      expect(ch.chapterNo).toBe(idx + 1);
      expect(ch.subjectCode).toBe('SSC-PHY');
      expect(ch.titleBn).toBeTruthy();
      expect(ch.titleEn).toBeTruthy();
      expect(ch.divisionTitleBn).toBeTruthy();
      expect(ch.divisionTitleEn).toBeTruthy();
      expect(ch.keyTopicsBn.length).toBeGreaterThan(0);
      expect(ch.keyTopicsEn.length).toBeGreaterThan(0);
    });
  });

  it('loads rich chapter 1 data with all 5 steps', () => {
    const ch1 = getPhysicsChapterData(1);
    expect(ch1).not.toBeNull();
    if (!ch1) return;

    expect(ch1.chapterNo).toBe(1);
    expect(ch1.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch1.step2.simulatorType).toBe('vernier');
    expect(ch1.step2.controls.length).toBeGreaterThan(0);
    expect(ch1.step3.coreFormulaLatex).toContain('VC');
    expect(ch1.step3.variableDefinitions.length).toBeGreaterThanOrEqual(4);
    expect(ch1.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch1.step5.quizzes.length).toBeGreaterThanOrEqual(3);

    // Validate quiz options
    ch1.step5.quizzes.forEach((quiz) => {
      expect(quiz.correctOptionIndex).toBeGreaterThanOrEqual(0);
      expect(quiz.correctOptionIndex).toBeLessThan(quiz.optionsBn.length);
      expect(quiz.optionsBn.length).toBe(quiz.optionsEn.length);
    });
  });

  it('loads rich chapter 2 data with all 5 steps', () => {
    const ch2 = getPhysicsChapterData(2);
    expect(ch2).not.toBeNull();
    if (!ch2) return;

    expect(ch2.chapterNo).toBe(2);
    expect(ch2.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch2.step2.simulatorType).toBe('motion');
    expect(ch2.step3.coreFormulaLatex).toContain('v = u + at');
    expect(ch2.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch2.step5.quizzes.length).toBeGreaterThanOrEqual(3);

    // Trap structure
    ch2.step4.traps.forEach((trap) => {
      expect(trap.lostMarks).toBeGreaterThan(0);
      expect(trap.commonMistakeBn).toBeTruthy();
      expect(trap.correctApproachBn).toBeTruthy();
    });
  });

  it('loads rich chapter 3 (Force) data with collision simulator', () => {
    const ch3 = getPhysicsChapterData(3);
    expect(ch3).not.toBeNull();
    if (!ch3) return;

    expect(ch3.chapterNo).toBe(3);
    expect(ch3.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch3.step2.simulatorType).toBe('force');
    expect(ch3.step3.coreFormulaLatex).toContain('m_1u_1');
    expect(ch3.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch3.step5.quizzes.length).toBeGreaterThanOrEqual(3);
  });

  it('loads rich chapter 4 (Energy) data with energy conservation simulator', () => {
    const ch4 = getPhysicsChapterData(4);
    expect(ch4).not.toBeNull();
    if (!ch4) return;

    expect(ch4.chapterNo).toBe(4);
    expect(ch4.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch4.step2.simulatorType).toBe('energy');
    expect(ch4.step3.coreFormulaLatex).toContain('mgh');
    expect(ch4.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch4.step5.quizzes.length).toBeGreaterThanOrEqual(3);
  });

  it('loads rich chapter 5 (Pressure) data with hydraulic pressure simulator', () => {
    const ch5 = getPhysicsChapterData(5);
    expect(ch5).not.toBeNull();
    if (!ch5) return;

    expect(ch5.chapterNo).toBe(5);
    expect(ch5.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch5.step2.simulatorType).toBe('pressure');
    expect(ch5.step3.coreFormulaLatex).toContain('F_2');
    expect(ch5.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch5.step5.quizzes.length).toBeGreaterThanOrEqual(3);
  });

  it('loads rich chapter 6 (Heat) data with thermal expansion simulator', () => {
    const ch6 = getPhysicsChapterData(6);
    expect(ch6).not.toBeNull();
    if (!ch6) return;

    expect(ch6.chapterNo).toBe(6);
    expect(ch6.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch6.step2.simulatorType).toBe('thermal');
    expect(ch6.step3.coreFormulaLatex).toContain('\\Delta L');
    expect(ch6.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch6.step5.quizzes.length).toBeGreaterThanOrEqual(3);
  });

  it('loads rich chapter 7 (Waves) data with wave echo simulator', () => {
    const ch7 = getPhysicsChapterData(7);
    expect(ch7).not.toBeNull();
    if (!ch7) return;

    expect(ch7.chapterNo).toBe(7);
    expect(ch7.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch7.step2.simulatorType).toBe('wave');
    expect(ch7.step3.coreFormulaLatex).toContain('v = f\\lambda');
    expect(ch7.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch7.step5.quizzes.length).toBeGreaterThanOrEqual(3);
  });

  it('loads rich chapter 8 (Reflection) data with mirror ray simulator', () => {
    const ch8 = getPhysicsChapterData(8);
    expect(ch8).not.toBeNull();
    if (!ch8) return;

    expect(ch8.chapterNo).toBe(8);
    expect(ch8.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch8.step2.simulatorType).toBe('reflection');
    expect(ch8.step3.coreFormulaLatex).toContain('\\frac{1}{u}');
    expect(ch8.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch8.step5.quizzes.length).toBeGreaterThanOrEqual(3);
  });

  it('loads rich chapter 9 (Refraction) data with refraction ray simulator', () => {
    const ch9 = getPhysicsChapterData(9);
    expect(ch9).not.toBeNull();
    if (!ch9) return;

    expect(ch9.chapterNo).toBe(9);
    expect(ch9.step1.nodes.length).toBeGreaterThanOrEqual(4);
    expect(ch9.step2.simulatorType).toBe('refraction');
    expect(ch9.step3.coreFormulaLatex).toContain('\\sin i');
    expect(ch9.step4.traps.length).toBeGreaterThanOrEqual(3);
    expect(ch9.step5.quizzes.length).toBeGreaterThanOrEqual(3);
  });

  it('provides baseline fallback data for upcoming chapters 10-14 without failing', () => {
    for (let c = 10; c <= 14; c++) {
      const data = getPhysicsChapterData(c);
      expect(data).not.toBeNull();
      expect(data?.chapterNo).toBe(c);
      expect(data?.step1.nodes.length).toBeGreaterThan(0);
      expect(data?.step5.quizzes.length).toBeGreaterThan(0);
    }
  });

  it('returns null for non-existent chapter numbers', () => {
    expect(getPhysicsChapterData(0)).toBeNull();
    expect(getPhysicsChapterData(15)).toBeNull();
    expect(getPhysicsChapterData(-1)).toBeNull();
  });
});
