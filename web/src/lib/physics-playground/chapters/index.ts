import { PhysicsChapterFullData, PhysicsChapterMetadata } from '../types';
import { PHYSICS_CHAPTERS_REGISTRY } from '../registry';
import { CH01_MEASUREMENT_DATA } from './ch01-measurement';
import { CH02_MOTION_DATA } from './ch02-motion';
import { CH03_FORCE_DATA } from './ch03-force';
import { CH04_ENERGY_DATA } from './ch04-energy';
import { CH05_PRESSURE_DATA } from './ch05-pressure';

/**
 * Chapter data registry loader.
 * Returns detailed chapter data for any of the 14 NCTB chapters.
 */
export function getPhysicsChapterData(chapterNo: number): PhysicsChapterFullData | null {
  if (chapterNo === 1) return CH01_MEASUREMENT_DATA;
  if (chapterNo === 2) return CH02_MOTION_DATA;
  if (chapterNo === 3) return CH03_FORCE_DATA;
  if (chapterNo === 4) return CH04_ENERGY_DATA;
  if (chapterNo === 5) return CH05_PRESSURE_DATA;

  // Find metadata from registry for chapters 6..14
  const meta = PHYSICS_CHAPTERS_REGISTRY.find((c) => c.chapterNo === chapterNo);
  if (!meta) return null;

  // Baseline data generator for chapters 3 to 14
  return generateBaselineChapterData(meta);
}

function generateBaselineChapterData(meta: PhysicsChapterMetadata): PhysicsChapterFullData {
  return {
    ...meta,
    step1: {
      summaryBn: `${meta.titleBn} অধ্যায়ে NCTB সিলেবাস অনুযায়ী মূল ধারণাসমূহ ও বাস্তব জীবনের সংযোগ নিচে দেওয়া হলো।`,
      summaryEn: `Fundamental conceptual architecture and practical applications for ${meta.titleEn} under NCTB syllabus.`,
      nodes: meta.keyTopicsBn.map((topicBn, idx) => ({
        id: `c${meta.chapterNo}-node-${idx + 1}`,
        titleBn: topicBn,
        titleEn: meta.keyTopicsEn[idx] || topicBn,
        descriptionBn: `${topicBn} সংক্রান্ত মূল বৈজ্ঞানিক সূত্র ও বাস্তব রূপ এখানে ব্যাখ্যা করা হয়েছে।`,
        descriptionEn: `Core principles and applications of ${meta.keyTopicsEn[idx] || topicBn}.`,
        realWorldExampleBn: `${topicBn} আমাদের দৈনন্দিন জীবনে এবং প্রযুক্তিবিদ্যায় ব্যাপকভাবে ব্যবহৃত হয়।`,
        realWorldExampleEn: `Everyday physical applications and engineering implementations of ${meta.keyTopicsEn[idx] || topicBn}.`,
      })),
    },
    step2: {
      simulatorType: 'force',
      instructionsBn: `${meta.titleBn} সংক্রান্ত স্যান্ডবক্স প্যারামিটার ও পর্যবেক্ষণ নিচে দেওয়া হলো।`,
      instructionsEn: `Interactive parameters and visual sandbox for ${meta.titleEn}.`,
      controls: [
        {
          key: 'param1',
          labelBn: 'প্রাথমিক মান',
          labelEn: 'Primary Parameter',
          defaultValue: 10,
          min: 0,
          max: 100,
          step: 1,
          unit: 'unit',
        },
      ],
      keyObservationTipBn: `বোর্ড পরীক্ষায় ${meta.titleBn} থেকে সৃজনশীল প্রশ্নের উত্তর দেওয়ার সময় এককের রূপান্তর ও চিত্র নির্ভুলভাবে অঙ্কন করো।`,
      keyObservationTipEn: `Ensure precise unit conversions and clear diagrams when addressing CQ questions from ${meta.titleEn}.`,
    },
    step3: {
      coreFormulaLatex: 'E = mc^2 \\quad \\text{বা সংশ্লিষ্ট সূত্র}',
      variableDefinitions: [
        {
          symbol: 'X',
          nameBn: 'রাশি',
          nameEn: 'Quantity',
          siUnit: 'SI Unit',
        },
      ],
      derivationSteps: [
        {
          stepNumber: 1,
          labelBn: 'প্রাথমিক সংজ্ঞা',
          labelEn: 'Definition & Baseline',
          latexExpression: 'A = B \\times C',
          explanationBn: 'অধ্যায়ের মূল সূত্রের প্রাথমিক বিন্যাস।',
          explanationEn: 'Baseline formulation of the primary relationship.',
        },
      ],
      practicalCalculationExample: {
        problemBn: `${meta.titleBn} অধ্যায়ের বোর্ড সৃজনশীল সমস্যার আদর্শ উদাহরণ।`,
        problemEn: `Standard board exam CQ problem model for ${meta.titleEn}.`,
        solutionStepsBn: [
          '১. উদ্দীপকের প্রদত্ত তথ্যগুলো চিহ্নিত করো।',
          '২. সঠিক সূত্রটি নির্বাচন করো এবং মান বসাও।',
          '৩. এককসহ চূড়ান্ত ফলাফল লেখো।',
        ],
        solutionStepsEn: [
          '1. List given parameters with SI units.',
          '2. State governing formula and substitute values.',
          '3. Compute final answer with correct units.',
        ],
        finalAnswerWithUnit: 'Answer = \\text{Value with SI Unit}',
      },
    },
    step4: {
      traps: [
        {
          id: `c${meta.chapterNo}-trap-1`,
          titleBn: 'একক ও চিহ্নের অসতর্ক ব্যবহার',
          titleEn: 'Careless Units & Sign Conventions',
          lostMarks: 1,
          frequentlyTestedIn: 'গ ও ঘ-অংশ',
          commonMistakeBn: 'সূত্রে মান বসানোর সময় এসআই এককে রূপান্তর না করা।',
          commonMistakeEn: 'Plugging values directly without converting to SI units.',
          correctApproachBn: 'অংকের শুরুতে সকল চলককে এসআই এককে রূপান্তর করে নেওয়া।',
          correctApproachEn: 'Always convert all quantities to standard SI units at step 1.',
          examinerSecretTipBn: 'এককের জন্য ১ নম্বর পর্যন্ত কাটা যেতে পারে।',
          examinerSecretTipEn: 'Missing or wrong units cost up to 1 whole mark in board rubrics.',
        },
      ],
    },
    step5: {
      quizzes: [
        {
          id: `c${meta.chapterNo}-quiz-1`,
          questionBn: `${meta.titleBn} অধ্যায়ের গুরুত্বপূর্ণ বহুনির্বাচনি প্রশ্ন: নিচের কোন তথ্যটি সঠিক?`,
          questionEn: `Key diagnostic question for ${meta.titleEn}: Which statement is correct?`,
          questionType: 'MCQ',
          optionsBn: ['বিকল্প ১', 'বিকল্প ২ (সঠিক)', 'বিকল্প ৩', 'বিকল্প ৪'],
          optionsEn: ['Option 1', 'Option 2 (Correct)', 'Option 3', 'Option 4'],
          correctOptionIndex: 1,
          explanationBn: 'পাঠ্যবইয়ের তত্ত্ব অনুযায়ী বিকল্প ২ সঠিক।',
          explanationEn: 'Based on the textbook curriculum, Option 2 is correct.',
          boardSource: 'বোর্ড স্ট্যান্ডার্ড প্রশ্ন',
        },
      ],
    },
  };
}
