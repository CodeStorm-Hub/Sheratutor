/**
 * Domain Type Definitions for SheraTutor Physics Playground
 * Architecture: Schema-driven, Declarative, Bilingual (Bangla / English)
 */

export type PhysicsDivision =
  | 'mechanics'
  | 'matter_thermal'
  | 'waves_optics'
  | 'electricity_magnetism'
  | 'modern_biomedical';

export interface PhysicsChapterMetadata {
  id: string; // Supabase chapter UUID if linked, or string key
  chapterNo: number;
  subjectCode: 'SSC-PHY';
  titleEn: string;
  titleBn: string;
  division: PhysicsDivision;
  divisionTitleEn: string;
  divisionTitleBn: string;
  iconName: string;
  estimatedMinutes: number;
  boardMarksAllocation: string; // e.g. "CQ ১০ নম্বর (ক: ১, খ: ২, গ: ৩, ঘ: ৪)"
  overviewEn: string;
  overviewBn: string;
  keyTopicsBn: string[];
  keyTopicsEn: string[];
  status: 'available' | 'in_development' | 'upcoming';
}

// Step 1: The Concept Universe
export interface ConceptNode {
  id: string;
  titleBn: string;
  titleEn: string;
  descriptionBn: string;
  descriptionEn: string;
  iconName?: string;
  realWorldExampleBn: string;
  realWorldExampleEn: string;
  formulaLatex?: string;
}

export interface Step1ConceptTreeData {
  summaryBn: string;
  summaryEn: string;
  nodes: ConceptNode[];
}

// Step 2: Interactive Sandbox Configuration
export type SimulatorType =
  | 'vernier'
  | 'motion'
  | 'force'
  | 'energy'
  | 'pressure'
  | 'thermal'
  | 'wave'
  | 'reflection'
  | 'refraction'
  | 'static_elec'
  | 'current_elec'
  | 'magnetism'
  | 'electronics';

export interface SimulatorControlParameter {
  key: string;
  labelBn: string;
  labelEn: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
  unit: string;
  descriptionBn?: string;
}

export interface Step2SandboxData {
  simulatorType: SimulatorType;
  instructionsBn: string;
  instructionsEn: string;
  controls: SimulatorControlParameter[];
  keyObservationTipBn: string;
  keyObservationTipEn: string;
}

// Step 3: Pattern & Formula Decoder
export interface DerivationStep {
  stepNumber: number;
  labelBn: string;
  labelEn: string;
  latexExpression: string;
  explanationBn: string;
  explanationEn: string;
}

export interface Step3FormulaDecoderData {
  coreFormulaLatex: string;
  variableDefinitions: Array<{
    symbol: string;
    nameBn: string;
    nameEn: string;
    siUnit: string;
  }>;
  derivationSteps: DerivationStep[];
  practicalCalculationExample: {
    problemBn: string;
    problemEn: string;
    solutionStepsBn: string[];
    solutionStepsEn: string[];
    finalAnswerWithUnit: string;
  };
}

// Step 4: The "Red Line" Board Traps (Examiner mark deduction traps)
export interface BoardTrapItem {
  id: string;
  titleBn: string;
  titleEn: string;
  lostMarks: number;
  frequentlyTestedIn: string; // e.g., "গ-অংশ (প্রয়োগমূলক)"
  commonMistakeBn: string;
  commonMistakeEn: string;
  correctApproachBn: string;
  correctApproachEn: string;
  examinerSecretTipBn: string;
  examinerSecretTipEn: string;
}

export interface Step4BoardTrapsData {
  traps: BoardTrapItem[];
}

// Step 5: Rapid Board Quiz
export interface BoardQuizItem {
  id: string;
  questionBn: string;
  questionEn: string;
  questionType: 'MCQ' | 'CQ_STEP';
  optionsBn: string[];
  optionsEn: string[];
  correctOptionIndex: number;
  explanationBn: string;
  explanationEn: string;
  boardSource?: string; // e.g., "Dhaka Board 2024"
}

export interface Step5BoardQuizData {
  quizzes: BoardQuizItem[];
}

// Complete Chapter Schema
export interface PhysicsChapterFullData extends PhysicsChapterMetadata {
  step1: Step1ConceptTreeData;
  step2: Step2SandboxData;
  step3: Step3FormulaDecoderData;
  step4: Step4BoardTrapsData;
  step5: Step5BoardQuizData;
}
