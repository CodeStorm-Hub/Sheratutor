'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import {
  Layers,
  ChevronRight,
  BookOpen,
  HelpCircle,
  RotateCcw,
  Sparkles,
  Award,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  Copy,
  Check,
  ShieldAlert,
  ArrowRight,
  X,
  Send,
  Sliders,
  MessageSquare,
  ShieldCheck,
  XCircle,
  Zap,
  Activity,
  Calculator,
  AlertTriangle,
  Info,
  Binary,
  GitBranch,
  Filter,
  CheckSquare,
  ArrowUpRight,
  Grid,
  Square,
  TrendingUp,
  Split,
  RefreshCw,
  Eye,
} from 'lucide-react';
import { RenderMathText } from '@/components/render-math-text';

// ---------------------------------------------------------------------------
// TYPES & DATA DEFINITIONS
// ---------------------------------------------------------------------------

interface LessonInfo {
  id: number;
  title: string;
  subtitle: string;
  nctbPage: string;
  badge: string;
  intro: string;
}

const LAB_LESSONS: LessonInfo[] = [
  {
    id: 1,
    title: 'জ্যামিতিক টাইলস ও বর্গ-ঘন সম্প্রসারণ ল্যাব',
    subtitle: 'Geometric Tiles Partition & Algebraic Identities',
    nctbPage: 'পৃষ্ঠা ৪৭-৫১',
    badge: 'ল্যাব ০১',
    intro:
      'বীজগাণিতিক সূত্রাবলি কেবল মুখস্থ করার বিষয় নয়, এটি জ্যামিতিক ক্ষেত্রফল ও আয়তনের বাস্তব বিভাজন। (a + b)² হলো (a + b) বাহুবিশিষ্ট একটি বর্গের ক্ষেত্রফল, যা a², দুটি ab এবং b² ক্ষেত্রফলবিশিষ্ট চারটি টাইলসে নিখুঁতভাবে বিভক্ত হয়।',
  },
  {
    id: 2,
    title: 'প্রতিসম x ± 1/x পাওয়ার সিঁড়ি ল্যাব',
    subtitle: 'Symmetrical x ± 1/x Reciprocal Power Ladder',
    nctbPage: 'পৃষ্ঠা ৫২-৫৫',
    badge: 'ল্যাব ০২',
    intro:
      'বোর্ড পরীক্ষার সৃজনশীলে প্রায় প্রতি বছর একটি দ্বিপদী শর্ত থেকে x + 1/x নির্ণয় করে x², x³, x⁴, x⁵ বা x⁶ এর মান প্রমাণ করতে বলা হয়। সিঁড়ির মতো ধাপে ধাপে কীভাবে উচ্চতর ঘাত নির্ণয় করতে হয় তা এই ল্যাবে লাইভ দেখুন।',
  },
  {
    id: 3,
    title: 'মিডল-টার্ম ও উৎপাদক স্প্লিটার ল্যাব',
    subtitle: 'Middle-Term Factor Splitter & Factoring Grid',
    nctbPage: 'পৃষ্ঠা ৫৬-৫৯',
    badge: 'ল্যাব ০৩',
    intro:
      'দ্বিঘাত রাশি ax² + bx + c কে উৎপাদকে বিশ্লেষণের মূল চাবিকাঠি হলো দুটি সংখ্যা p ও q বের করা যেন p + q = b এবং p × q = ac হয়। সঠিক জোড়া খুঁজে নিয়ে কীভাবে সাধারণ পদ কমন নিতে হয় তা ইন্টারেক্টিভভাবে যাচাই করুন।',
  },
  {
    id: 4,
    title: 'ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথড ল্যাব',
    subtitle: 'Remainder & Factor Theorem (Vanishing Method)',
    nctbPage: 'পৃষ্ঠা ৬০-৬৪',
    badge: 'ল্যাব ০৪',
    intro:
      'বহুপদী f(x) কে (x - a) দ্বারা ভাগ করলে ভাগশেষ সর্বদা f(a) হয়। যদি f(a) = 0 হয়, তবে (x - a) রাশিটি f(x) এর একটি সাধারণ উৎপাদক। ত্রিঘাত বহুপদীকে ভ্যানিশিং পদ্ধতিতে নিমেষেই উৎপাদকে রূপান্তর করার কৌশল শিখুন।',
  },
  {
    id: 5,
    title: 'চক্র-ক্রমিক ও প্রতিসম রাশি ল্যাব',
    subtitle: 'Cyclic & Symmetric Polynomial Expressions',
    nctbPage: 'পৃষ্ঠা ৬৫-৬৮',
    badge: 'ল্যাব ০৫',
    intro:
      'একাধিক চলকের রাশিতে যে কোনো দুটি চলক স্থান বিনিময় করলে যদি রাশির মান অপরিবর্তিত থাকে, তবে তাকে প্রতিসম রাশি বলে। আর চলকগুলো a → b → c → a ক্রমে আবর্তিত হলে অপরিবর্তিত থাকলে তা চক্র-ক্রমিক রাশি। এর অসাধারণ উৎপাদক রূপ দেখুন।',
  },
];

export function MathAlgebraicExpressionsGuidebook() {
  // Navigation State
  const [activeTab, setActiveTab] = useState<'learn' | 'example' | 'try' | 'quiz' | 'summary'>('learn');
  const [activeLessonId, setActiveLessonId] = useState<number>(1);

  // -------------------------------------------------------------------------
  // LAB 1 STATE: GEOMETRIC TILES & IDENTITIES
  // -------------------------------------------------------------------------
  type TileFormulaType = 'sumSquare' | 'diffSquare' | 'diffOfSquares' | 'sumCube' | 'trinomialSquare';
  const [tileFormula, setTileFormula] = useState<TileFormulaType>('sumSquare');
  const [tileA, setTileA] = useState<number>(4);
  const [tileB, setTileB] = useState<number>(2);
  const [tileC, setTileC] = useState<number>(2);

  // -------------------------------------------------------------------------
  // LAB 2 STATE: RECIPROCAL POWER LADDER
  // -------------------------------------------------------------------------
  type LadderPresetKey = 'p3' | 'sqrt5' | 'm4' | 'sqrt3';
  const [ladderPreset, setLadderPreset] = useState<LadderPresetKey>('sqrt5');
  const [ladderSign, setLadderSign] = useState<'+' | '-'>('+');
  const [activeLadderRung, setActiveLadderRung] = useState<number>(5);

  const getLadderDetails = () => {
    if (ladderPreset === 'p3') {
      // x + 1/x = 3
      const k = 3;
      const k2 = k * k - 2; // 7
      const k3 = k * k * k - 3 * k; // 18
      const k4 = k2 * k2 - 2; // 47
      const k5 = k2 * k3 - k; // 7 * 18 - 3 = 126 - 3 = 123
      const k6 = k3 * k3 - 2; // 18^2 - 2 = 322
      return {
        baseStr: '3',
        baseTex: '$x + \\frac{1}{x} = 3$',
        r1: { val: '3', tex: '$x + \\frac{1}{x} = 3$', formula: '$k = 3$' },
        r2: { val: String(k2), tex: '$x^2 + \\frac{1}{x^2} = 7$', formula: '$k^2 - 2 = 3^2 - 2 = 7$' },
        r3: { val: String(k3), tex: '$x^3 + \\frac{1}{x^3} = 18$', formula: '$k^3 - 3k = 27 - 9 = 18$' },
        r4: { val: String(k4), tex: '$x^4 + \\frac{1}{x^4} = 47$', formula: '$(x^2 + 1/x^2)^2 - 2 = 7^2 - 2 = 47$' },
        r5: { val: String(k5), tex: '$x^5 + \\frac{1}{x^5} = 123$', formula: '$(x^2+1/x^2)(x^3+1/x^3) - (x+1/x) = 7 \\times 18 - 3 = 123$' },
        r6: { val: String(k6), tex: '$x^6 + \\frac{1}{x^6} = 322$', formula: '$(x^3+1/x^3)^2 - 2 = 18^2 - 2 = 322$' },
      };
    } else if (ladderPreset === 'sqrt5') {
      // x + 1/x = sqrt(5)
      // k = sqrt(5)
      // k^2 - 2 = 5 - 2 = 3
      // k^3 - 3k = 5*sqrt(5) - 3*sqrt(5) = 2*sqrt(5)
      // k^4 = 3^2 - 2 = 7
      // k^5 = (3)(2*sqrt(5)) - sqrt(5) = 6*sqrt(5) - sqrt(5) = 5*sqrt(5)  [or 11*sqrt(5) if x-1/x used]
      // Wait: (x^2+1/x^2)(x^3+1/x^3) - (x+1/x) = 3 * 2sqrt(5) - sqrt(5) = 5sqrt(5)
      return {
        baseStr: '√5',
        baseTex: '$x + \\frac{1}{x} = \\sqrt{5}$',
        r1: { val: '√5', tex: '$x + \\frac{1}{x} = \\sqrt{5}$', formula: '$k = \\sqrt{5}$' },
        r2: { val: '3', tex: '$x^2 + \\frac{1}{x^2} = 3$', formula: '$(\\sqrt{5})^2 - 2 = 5 - 2 = 3$' },
        r3: { val: '2√5', tex: '$x^3 + \\frac{1}{x^3} = 2\\sqrt{5}$', formula: '$(\\sqrt{5})^3 - 3\\sqrt{5} = 5\\sqrt{5} - 3\\sqrt{5} = 2\\sqrt{5}$' },
        r4: { val: '7', tex: '$x^4 + \\frac{1}{x^4} = 7$', formula: '$3^2 - 2 = 9 - 2 = 7$' },
        r5: { val: '5√5', tex: '$x^5 + \\frac{1}{x^5} = 5\\sqrt{5}$', formula: '$3 \\times 2\\sqrt{5} - \\sqrt{5} = 6\\sqrt{5} - \\sqrt{5} = 5\\sqrt{5}$' },
        r6: { val: '18', tex: '$x^6 + \\frac{1}{x^6} = 18$', formula: '$(2\\sqrt{5})^2 - 2 = 20 - 2 = 18$' },
      };
    } else if (ladderPreset === 'm4') {
      // x - 1/x = 4 (negative base!)
      // x^2 + 1/x^2 = 4^2 + 2 = 18
      // x^3 - 1/x^3 = 4^3 + 3*4 = 64 + 12 = 76
      // x^4 + 1/x^4 = 18^2 - 2 = 324 - 2 = 322
      // x^5 - 1/x^5 = (x^2+1/x^2)(x^3-1/x^3) + (x-1/x) = 18 * 76 + 4 = 1368 + 4 = 1372
      return {
        baseStr: '4',
        baseTex: '$x - \\frac{1}{x} = 4$',
        r1: { val: '4', tex: '$x - \\frac{1}{x} = 4$', formula: '$k = 4$' },
        r2: { val: '18', tex: '$x^2 + \\frac{1}{x^2} = 18$', formula: '$(x - 1/x)^2 + 2 = 4^2 + 2 = 18$' },
        r3: { val: '76', tex: '$x^3 - \\frac{1}{x^3} = 76$', formula: '$(x - 1/x)^3 + 3(x - 1/x) = 64 + 12 = 76$' },
        r4: { val: '322', tex: '$x^4 + \\frac{1}{x^4} = 322$', formula: '$(x^2 + 1/x^2)^2 - 2 = 18^2 - 2 = 322$' },
        r5: { val: '1372', tex: '$x^5 - \\frac{1}{x^5} = 1372$', formula: '$(x^2+1/x^2)(x^3-1/x^3) + (x-1/x) = 18 \\times 76 + 4 = 1372$' },
        r6: { val: '5774', tex: '$x^6 + \\frac{1}{x^6} = 5774$', formula: '$(x^3-1/x^3)^2 + 2 = 76^2 + 2 = 5776 + 2 = 5778$' },
      };
    } else {
      // x + 1/x = sqrt(3) (The Famous Board Zero Trap!)
      // k^2 - 2 = 3 - 2 = 1
      // k^3 - 3k = 3*sqrt(3) - 3*sqrt(3) = 0! => x^6 = -1
      // k^4 = 1^2 - 2 = -1
      // k^5 = (1)(0) - sqrt(3) = -sqrt(3)
      // k^6 = 0^2 - 2 = -2
      return {
        baseStr: '√3',
        baseTex: '$x + \\frac{1}{x} = \\sqrt{3}$',
        r1: { val: '√3', tex: '$x + \\frac{1}{x} = \\sqrt{3}$', formula: '$k = \\sqrt{3}$' },
        r2: { val: '1', tex: '$x^2 + \\frac{1}{x^2} = 1$', formula: '$(\\sqrt{3})^2 - 2 = 3 - 2 = 1$' },
        r3: { val: '0', tex: '$x^3 + \\frac{1}{x^3} = 0$', formula: '$(\\sqrt{3})^3 - 3\\sqrt{3} = 3\\sqrt{3} - 3\\sqrt{3} = 0$' },
        r4: { val: '-1', tex: '$x^4 + \\frac{1}{x^4} = -1$', formula: '$1^2 - 2 = -1$' },
        r5: { val: '-√3', tex: '$x^5 + \\frac{1}{x^5} = -\\sqrt{3}$', formula: '$1 \\times 0 - \\sqrt{3} = -\\sqrt{3}$' },
        r6: { val: '-2', tex: '$x^6 + \\frac{1}{x^6} = -2$', formula: '$0^2 - 2 = -2$ (যেহেতু $x^6 = -1$)' },
      };
    }
  };

  const ladderDetails = getLadderDetails();

  // -------------------------------------------------------------------------
  // LAB 3 STATE: MIDDLE-TERM FACTOR SPLITTER
  // -------------------------------------------------------------------------
  interface QuadItem {
    id: number;
    expr: string;
    texExpr: string;
    a: number;
    b: number;
    c: number;
    correctP: number;
    correctQ: number;
    factoredTex: string;
  }

  const QUAD_DATA: QuadItem[] = [
    {
      id: 1,
      expr: 'x² + 5x + 6',
      texExpr: '$x^2 + 5x + 6$',
      a: 1,
      b: 5,
      c: 6,
      correctP: 2,
      correctQ: 3,
      factoredTex: '$(x + 2)(x + 3)$',
    },
    {
      id: 2,
      expr: 'x² - 7x + 12',
      texExpr: '$x^2 - 7x + 12$',
      a: 1,
      b: -7,
      c: 12,
      correctP: -3,
      correctQ: -4,
      factoredTex: '$(x - 3)(x - 4)$',
    },
    {
      id: 3,
      expr: 'x² + x - 20',
      texExpr: '$x^2 + x - 20$',
      a: 1,
      b: 1,
      c: -20,
      correctP: 5,
      correctQ: -4,
      factoredTex: '$(x + 5)(x - 4)$',
    },
    {
      id: 4,
      expr: 'x² - 2x - 15',
      texExpr: '$x^2 - 2x - 15$',
      a: 1,
      b: -2,
      c: -15,
      correctP: 3,
      correctQ: -5,
      factoredTex: '$(x + 3)(x - 5)$',
    },
    {
      id: 5,
      expr: '2x² + 9x + 10',
      texExpr: '$2x^2 + 9x + 10$',
      a: 2,
      b: 9,
      c: 10,
      correctP: 4,
      correctQ: 5,
      factoredTex: '$(2x + 5)(x + 2)$',
    },
  ];

  const [activeQuadId, setActiveQuadId] = useState<number>(1);
  const selectedQuad = QUAD_DATA.find((q) => q.id === activeQuadId) || QUAD_DATA[0];

  const [userP, setUserP] = useState<number>(2);
  const [userQ, setUserQ] = useState<number>(3);

  // Auto sync p and q when problem changes
  useEffect(() => {
    setUserP(selectedQuad.correctP);
    setUserQ(selectedQuad.correctQ);
  }, [activeQuadId, selectedQuad]);

  const pSumQ = userP + userQ;
  const pProdQ = userP * userQ;
  const targetProd = selectedQuad.a * selectedQuad.c;
  const isSumMatched = pSumQ === selectedQuad.b;
  const isProdMatched = pProdQ === targetProd;
  const isQuadSolved = isSumMatched && isProdMatched;

  // -------------------------------------------------------------------------
  // LAB 4 STATE: REMAINDER & FACTOR THEOREM (VANISHING METHOD)
  // -------------------------------------------------------------------------
  interface CubicPoly {
    id: number;
    exprTex: string;
    desc: string;
    roots: number[];
    evalFn: (x: number) => number;
    breakdownLines: {
      line1: string;
      line2: string;
      line3: string;
    };
  }

  const CUBIC_POLYS: CubicPoly[] = [
    {
      id: 1,
      exprTex: '$f(x) = x^3 - x - 6$',
      desc: 'ধ্রুবপদ -৬ এর উৎপাদক: ±১, ±২, ±৩, ±৬',
      roots: [2],
      evalFn: (x: number) => x * x * x - x - 6,
      breakdownLines: {
        line1: '$x^3 - x - 6$',
        line2: '$= x^2(x - 2) + 2x(x - 2) + 3(x - 2)$',
        line3: '$= (x - 2)(x^2 + 2x + 3)$',
      },
    },
    {
      id: 2,
      exprTex: '$f(x) = x^3 - 7x - 6$',
      desc: 'বোর্ড ফেভারিট! ধ্রুবপদ -৬ এর উৎপাদক: ±১, ±২, ±৩',
      roots: [-1, -2, 3],
      evalFn: (x: number) => x * x * x - 7 * x - 6,
      breakdownLines: {
        line1: '$x^3 - 7x - 6$',
        line2: '$= x^2(x + 1) - x(x + 1) - 6(x + 1)$',
        line3: '$= (x + 1)(x^2 - x - 6) = (x + 1)(x - 3)(x + 2)$',
      },
    },
    {
      id: 3,
      exprTex: '$f(x) = x^3 - 4x + 3$',
      desc: 'সহগগুলোর সমষ্টি ১ - ৪ + ৩ = ০, তাই x = ১ একটি মূল!',
      roots: [1],
      evalFn: (x: number) => x * x * x - 4 * x + 3,
      breakdownLines: {
        line1: '$x^3 - 4x + 3$',
        line2: '$= x^2(x - 1) + x(x - 1) - 3(x - 1)$',
        line3: '$= (x - 1)(x^2 + x - 3)$',
      },
    },
    {
      id: 4,
      exprTex: '$f(x) = x^3 + 2x^2 - 5x - 6$',
      desc: 'ধ্রুবপদ -৬ এর সম্ভাব্য উৎপাদক যাচাই',
      roots: [-1, 2, -3],
      evalFn: (x: number) => x * x * x + 2 * x * x - 5 * x - 6,
      breakdownLines: {
        line1: '$x^3 + 2x^2 - 5x - 6$',
        line2: '$= x^2(x + 1) + x(x + 1) - 6(x + 1)$',
        line3: '$= (x + 1)(x^2 + x - 6) = (x + 1)(x + 3)(x - 2)$',
      },
    },
  ];

  const [activePolyId, setActivePolyId] = useState<number>(2);
  const [testAVal, setTestAVal] = useState<number>(-1);
  const selectedPoly = CUBIC_POLYS.find((p) => p.id === activePolyId) || CUBIC_POLYS[1];
  const evalResult = selectedPoly.evalFn(testAVal);
  const isVanished = evalResult === 0;

  // -------------------------------------------------------------------------
  // LAB 5 STATE: CYCLIC & SYMMETRIC POLYNOMIAL LAB
  // -------------------------------------------------------------------------
  type CyclicExprKey = 'cyclic1' | 'cubeSumCondition' | 'heronFormula';
  const [activeCyclicKey, setActiveCyclicKey] = useState<CyclicExprKey>('cubeSumCondition');
  const [varA, setVarA] = useState<number>(3);
  const [varB, setVarB] = useState<number>(-1);
  const [varC, setVarC] = useState<number>(-2); // default sum is 0

  // -------------------------------------------------------------------------
  // STEP 2: SEE EXAMPLES (WORKED BOARD CQS WITH RUBRICS)
  // -------------------------------------------------------------------------
  const [activeCqType, setActiveCqType] = useState<1 | 2 | 3>(1);
  const [copiedCq, setCopiedCq] = useState<number | null>(null);

  const handleCopyText = (text: string, id: number) => {
    navigator.clipboard.writeText(text);
    setCopiedCq(id);
    setTimeout(() => setCopiedCq(null), 2000);
  };

  // -------------------------------------------------------------------------
  // STEP 3: TRY YOURSELF (3 CHALLENGES)
  // -------------------------------------------------------------------------
  interface ChallengeItem {
    id: number;
    title: string;
    questionBn: string;
    givenTex: string;
    targetTex: string;
    correctAnswer: string;
    hintBn: string;
    explanationTex: string;
  }

  const CHALLENGES: ChallengeItem[] = [
    {
      id: 1,
      title: 'চ্যালেঞ্জ ০১: ঘনের মান নির্ণয় অনুসিদ্ধান্ত',
      questionBn: 'a + b = 3 এবং ab = 2 হলে a³ + b³ এর মান কত?',
      givenTex: '$a + b = 3, \\quad ab = 2$',
      targetTex: '$a^3 + b^3 = ?$',
      correctAnswer: '9',
      hintBn: 'অনুসিদ্ধান্ত ব্যবহার করো: a³ + b³ = (a + b)³ - 3ab(a + b)',
      explanationTex: '$a^3 + b^3 = 3^3 - 3(2)(3) = 27 - 18 = 9$',
    },
    {
      id: 2,
      title: 'চ্যালেঞ্জ ০২: ঋণাত্মক শর্তে বর্গের অনুসিদ্ধান্ত',
      questionBn: 'x - 1/x = 4 হলে x² + 1/x² এর মান কত?',
      givenTex: '$x - \\frac{1}{x} = 4$',
      targetTex: '$x^2 + \\frac{1}{x^2} = ?$',
      correctAnswer: '18',
      hintBn: 'সতর্কতা! x² + 1/x² = (x - 1/x)² + 2 (এখানে +২ যোগ হবে, -২ নয়!)',
      explanationTex: '$x^2 + \\frac{1}{x^2} = 4^2 + 2 = 16 + 2 = 18$',
    },
    {
      id: 3,
      title: 'চ্যালেঞ্জ ০৩: বোর্ড ট্র্যাপ শূন্য ঘনক',
      questionBn: 'x + 1/x = √3 হলে x³ + 1/x³ এর মান কত?',
      givenTex: '$x + \\frac{1}{x} = \\sqrt{3}$',
      targetTex: '$x^3 + \\frac{1}{x^3} = ?$',
      correctAnswer: '0',
      hintBn: 'অনুসিদ্ধান্ত প্রয়োগ করো: (√3)³ - 3√3 = 3√3 - 3√3',
      explanationTex: '$x^3 + \\frac{1}{x^3} = (\\sqrt{3})^3 - 3\\sqrt{3} = 3\\sqrt{3} - 3\\sqrt{3} = 0$',
    },
  ];

  const [challengeInputs, setChallengeInputs] = useState<Record<number, string>>({
    1: '',
    2: '',
    3: '',
  });
  const [challengeChecked, setChallengeChecked] = useState<Record<number, boolean>>({
    1: false,
    2: false,
    3: false,
  });

  const handleChallengeSubmit = (id: number) => {
    setChallengeChecked((prev) => ({ ...prev, [id]: true }));
  };

  // -------------------------------------------------------------------------
  // STEP 4: CHECK UNDERSTANDING (5 MCQS)
  // -------------------------------------------------------------------------
  interface McqItem {
    id: number;
    questionBn: string;
    questionTex?: string;
    options: string[];
    correctIndex: number;
    explanationTex: string;
  }

  const MCQS: McqItem[] = [
    {
      id: 1,
      questionBn: 'a² - b² = 8 এবং a - b = 2 হলে a + b এর মান কত?',
      questionTex: '$a^2 - b^2 = 8, \\quad a - b = 2 \\implies a + b = ?$',
      options: ['২', '৪', '৬', '৮'],
      correctIndex: 1,
      explanationTex: '$a^2 - b^2 = (a+b)(a-b) \\implies 8 = (a+b)(2) \\implies a+b = 4$',
    },
    {
      id: 2,
      questionBn: 'x + 1/x = 3 হলে x² + 1/x² এর মান কত?',
      questionTex: '$x + \\frac{1}{x} = 3 \\implies x^2 + \\frac{1}{x^2} = ?$',
      options: ['৭', '৯', '১১', '১৩'],
      correctIndex: 0,
      explanationTex: '$x^2 + \\frac{1}{x^2} = (x + 1/x)^2 - 2 = 3^2 - 2 = 7$',
    },
    {
      id: 3,
      questionBn: 'x⁴ + x² + 1 এর একটি উৎপাদক নিচের কোনটি?',
      questionTex: '$x^4 + x^2 + 1 \\text{ এর একটি উৎপাদক নিচের কোনটি?}$',
      options: ['$x^2 + x + 1$', '$x^2 - 1$', '$x^2 + 2$', '$x + 1$'],
      correctIndex: 0,
      explanationTex: '$x^4 + x^2 + 1 = (x^2+1)^2 - x^2 = (x^2+x+1)(x^2-x+1)$',
    },
    {
      id: 4,
      questionBn: 'বহুপদী f(x) = x³ - 4x + 3 হলে f(1) এর মান কত?',
      questionTex: '$f(x) = x^3 - 4x + 3 \\implies f(1) = ?$',
      options: ['০', '২', '৪', '৬'],
      correctIndex: 0,
      explanationTex: '$f(1) = 1^3 - 4(1) + 3 = 1 - 4 + 3 = 0$ (অতএব (x - 1) একটি উৎপাদক)',
    },
    {
      id: 5,
      questionBn: 'যদি a + b + c = 0 হয়, তবে a³ + b³ + c³ এর মান কোনটি?',
      questionTex: '$a + b + c = 0 \\implies a^3 + b^3 + c^3 = ?$',
      options: ['০', '$abc$', '$3abc$', '$a^2+b^2+c^2$'],
      correctIndex: 2,
      explanationTex: '$a^3 + b^3 + c^3 - 3abc = (a+b+c)(a^2+b^2+c^2-ab-bc-ca) = 0 \\implies a^3+b^3+c^3 = 3abc$',
    },
  ];

  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<Record<number, boolean>>({});

  const handleSelectAnswer = (qId: number, optIdx: number) => {
    if (isAnswerSubmitted[qId]) return;
    setSelectedAnswers((prev) => ({ ...prev, [qId]: optIdx }));
  };

  const handleCheckAnswer = (qId: number) => {
    setIsAnswerSubmitted((prev) => ({ ...prev, [qId]: true }));
  };

  // -------------------------------------------------------------------------
  // AI TUTOR DRAWER STATE
  // -------------------------------------------------------------------------
  const [isAiDrawerOpen, setIsAiDrawerOpen] = useState<boolean>(false);
  const [aiChatMessages, setAiChatMessages] = useState<
    Array<{ sender: 'user' | 'sheru'; text: string; math?: string }>
  >([
    {
      sender: 'sheru',
      text: 'হ্যালো! আমি শেরু — তোমার গণিত পার্সোনাল টিউটর। বীজগাণিতিক রাশির জ্যামিতিক টাইলস, x ± 1/x এর পাওয়ার সিঁড়ি, মিডল-টার্ম বা ভাগশেষ উপপাদ্য নিয়ে কোনো প্রশ্ন থাকলে আমাকে নির্দ্বিধায় বলো!',
    },
  ]);
  const [aiInputText, setAiInputText] = useState<string>('');

  const AI_PROMPT_CHIPS = [
    'x + 1/x থেকে x⁵ + 1/x⁵ কীভাবে বের করে?',
    '(a + b)² এর জ্যামিতিক টাইলস কীভাবে কাজ করে?',
    'ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথডের কৌশল কী?',
    'মিডল-টার্মে চিহ্নের ভুল কীভাবে এড়াব?',
  ];

  const handleSendAiMessage = (queryText: string) => {
    const q = queryText.trim();
    if (!q) return;

    const userMsg = { sender: 'user' as const, text: q };
    let reply = '';
    let mathStr: string | undefined = undefined;

    if (q.includes('x⁵') || q.includes('পাওয়ার') || q.includes('সিঁড়ি')) {
      reply =
        'দারুণ প্রশ্ন! x⁵ + 1/x⁵ বের করতে দুটি স্তম্ভ প্রয়োজন:\n১. x² + 1/x²\n২. x³ + 1/x³\nদুটো গুণ করলে পাই:\n(x² + 1/x²)(x³ + 1/x³) = x⁵ + 1/x⁵ + (x + 1/x)\nঅতএব, x⁵ + 1/x⁵ = (x² + 1/x²)(x³ + 1/x³) - (x + 1/x)। সবসময় শেষের (x + 1/x) বিয়োগ করতে ভুলবে না!';
      mathStr = '$x^5 + \\frac{1}{x^5} = \\left(x^2 + \\frac{1}{x^2}\\right)\\left(x^3 + \\frac{1}{x^3}\\right) - \\left(x + \\frac{1}{x}\\right)$';
    } else if (q.includes('টাইলস') || q.includes('জ্যামিতিক')) {
      reply =
        '(a + b)² হলো একটি বড় বর্গক্ষেত্র যার এক বাহু (a + b)। একে চারটি অংশে ভাগ করলে পাওয়া যায়:\n• ১টি a² ক্ষেত্রফলের বর্গ\n• ২টি ab ক্ষেত্রফলের আয়তক্ষেত্র\n• ১টি b² ক্ষেত্রফলের বর্গ\nএদের যোগফল = a² + 2ab + b²!';
      mathStr = '$(a+b)^2 = a^2 + 2ab + b^2$';
    } else if (q.includes('ভাগশেষ') || q.includes('ভ্যানিশিং')) {
      reply =
        'ভ্যানিশিং মেথডের মূল চাবিকাঠি হলো ধ্রুবপদের গুণনীয়কগুলো (±১, ±২, ±৩...) x এর জায়গায় বসিয়ে দেখা কখন বহুপদীর মান ০ হয়। যদি f(a) = 0 হয়, তবে (x - a) অবশ্যই একটি উৎপাদক। এরপর ২য় লাইন ফাঁকা রেখে ৩য় লাইনে উৎপাদকটি লিখে হিসাব মেলানোই হলো আসল কৌশল!';
      mathStr = '$f(a) = 0 \\implies (x - a) \\text{ একটি উৎপাদক}$';
    } else {
      reply =
        'বীজগাণিতিক রাশিতে ভালো করার প্রধান ট্রিক হলো চিহ্নের সতর্কতা। বিশেষ করে (a - b)² এবং a² - b² এর পার্থক্য বোঝা এবং x - 1/x দেওয়া থাকলে (x - 1/x)² + 2 সূত্রে +2 ব্যবহার করা!';
      mathStr = '$x^2 + \\frac{1}{x^2} = \\left(x - \\frac{1}{x}\\right)^2 + 2$';
    }

    setAiChatMessages((prev) => [
      ...prev,
      userMsg,
      { sender: 'sheru', text: reply, math: mathStr },
    ]);
    setAiInputText('');
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col selection:bg-[#FF6B57]/30 selection:text-white">
      {/* --------------------------------------------------------------------- */}
      {/* HEADER BAR */}
      {/* --------------------------------------------------------------------- */}
      <header className="border-b border-slate-800 bg-slate-900/60 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link
              href="/dashboard/playground/v2?subject=math"
              className="p-2 rounded-xl bg-slate-800/80 hover:bg-slate-700/80 text-slate-300 hover:text-white transition-colors border border-slate-700/50"
            >
              <RotateCcw className="w-4 h-4" />
            </Link>
            <div>
              <div className="flex items-center space-x-2 text-[11px] font-mono text-[#FF6B57]">
                <span>সাধারণ গণিত</span>
                <ChevronRight className="w-3 h-3 text-slate-500" />
                <span>অধ্যায় ০৩</span>
              </div>
              <h1 className="text-sm sm:text-base font-bold text-slate-100 flex items-center gap-2">
                <span>বীজগাণিতিক রাশি</span>
                <span className="text-[10px] font-normal px-2 py-0.5 rounded-full bg-[#FF6B57]/10 text-[#FF6B57] border border-[#FF6B57]/20">
                  NCTB ৯ম-১০ম
                </span>
              </h1>
            </div>
          </div>

          {/* Action buttons */}
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setIsAiDrawerOpen(true)}
              className="flex items-center space-x-2 px-3 py-1.5 rounded-xl bg-[#FF6B57]/10 hover:bg-[#FF6B57]/20 border border-[#FF6B57]/30 text-[#FF6B57] text-xs font-medium transition-all shadow-sm"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">শেরু এআই টিউটর</span>
            </button>
          </div>
        </div>
      </header>

      {/* --------------------------------------------------------------------- */}
      {/* 5-STEP NAVIGATION BAR */}
      {/* --------------------------------------------------------------------- */}
      <nav className="border-b border-slate-800/80 bg-slate-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center space-x-1 sm:space-x-2 py-2 overflow-x-auto no-scrollbar text-xs">
            {[
              { id: 'learn', no: '১', label: 'ধারণা শিখুন', icon: BookOpen },
              { id: 'example', no: '২', label: 'উদাহরণ দেখুন (CQ)', icon: Award },
              { id: 'try', no: '৩', label: 'নিজে চেষ্টা করুন', icon: Sliders },
              { id: 'quiz', no: '৪', label: 'জ্ঞান যাচাই (MCQ)', icon: HelpCircle },
              { id: 'summary', no: '৫', label: 'সারাংশ ও সূত্র', icon: CheckSquare },
            ].map((step) => {
              const Icon = step.icon;
              const isActive = activeTab === step.id;
              return (
                <button
                  key={step.id}
                  onClick={() => setActiveTab(step.id as any)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl font-medium whitespace-nowrap transition-all ${
                    isActive
                      ? 'bg-[#FF6B57] text-white shadow-lg shadow-[#FF6B57]/20'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                  }`}
                >
                  <span
                    className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] font-bold ${
                      isActive ? 'bg-white/20 text-white' : 'bg-slate-800 text-slate-400'
                    }`}
                  >
                    {step.no}
                  </span>
                  <Icon className="w-3.5 h-3.5" />
                  <span>{step.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* --------------------------------------------------------------------- */}
      {/* MAIN BODY AREA */}
      {/* --------------------------------------------------------------------- */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* =================================================================== */}
        {/* TAB 1: LEARN CONCEPT (5 INTERACTIVE SUB-LABS)                       */}
        {/* =================================================================== */}
        {activeTab === 'learn' && (
          <div className="space-y-6">
            {/* Sub-lab selector strip */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-2">
              {LAB_LESSONS.map((lesson) => (
                <button
                  key={lesson.id}
                  onClick={() => setActiveLessonId(lesson.id)}
                  className={`flex items-center space-x-2 px-3.5 py-2 rounded-xl text-xs font-medium whitespace-nowrap border transition-all ${
                    activeLessonId === lesson.id
                      ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57]'
                      : 'bg-slate-900/40 border-slate-800/80 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-mono text-[10px] opacity-75">{lesson.badge}</span>
                  <span>{lesson.title}</span>
                </button>
              ))}
            </div>

            {/* Lesson Intro Card */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800/80 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center space-x-2">
                  <span className="px-2 py-0.5 rounded bg-[#FF6B57]/10 text-[#FF6B57] font-mono text-[10px]">
                    {LAB_LESSONS[activeLessonId - 1].badge}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    এনসিটিবি {LAB_LESSONS[activeLessonId - 1].nctbPage}
                  </span>
                </div>
                <h2 className="text-lg font-bold text-slate-100">{LAB_LESSONS[activeLessonId - 1].title}</h2>
                <p className="text-xs text-slate-300 max-w-3xl leading-relaxed">
                  {LAB_LESSONS[activeLessonId - 1].intro}
                </p>
              </div>
            </div>

            {/* --------------------------------------------------------------- */}
            {/* LAB 1: GEOMETRIC TILES & IDENTITIES                             */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 1 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Square className="w-4 h-4 text-[#FF6B57]" />
                      <span>বীজগাণিতিক সূত্র নির্বাচন</span>
                    </h3>

                    {/* Formula selector */}
                    <div className="grid grid-cols-1 gap-2 text-xs">
                      {[
                        { id: 'sumSquare', label: '(a + b)² = a² + 2ab + b²', nameBn: 'বর্গের যোগফল সূত্র' },
                        { id: 'diffSquare', label: '(a - b)² = a² - 2ab + b²', nameBn: 'বর্গের বিয়োগফল সূত্র' },
                        { id: 'diffOfSquares', label: '(a + b)(a - b) = a² - b²', nameBn: 'বর্গান্তর সূত্র' },
                        { id: 'trinomialSquare', label: '(a + b + c)² = a² + b² + c² + 2(ab + bc + ca)', nameBn: 'ত্রিপদী বর্গ সূত্র' },
                        { id: 'sumCube', label: '(a + b)³ = a³ + 3a²b + 3ab² + b³', nameBn: 'ঘনের যোগফল সূত্র' },
                      ].map((f) => (
                        <button
                          key={f.id}
                          onClick={() => setTileFormula(f.id as any)}
                          className={`p-2.5 rounded-xl border text-left transition-all ${
                            tileFormula === f.id
                              ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57] font-medium'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-mono text-xs">{f.label}</div>
                          <div className="text-[11px] text-slate-400">{f.nameBn}</div>
                        </button>
                      ))}
                    </div>

                    {/* Sliders for a and b */}
                    <div className="space-y-4 pt-2 border-t border-slate-800">
                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>প্রথম বাহু (a):</span>
                          <span className="font-mono text-[#FF6B57] font-bold">{tileA} একক</span>
                        </div>
                        <input
                          type="range"
                          min="2"
                          max="8"
                          value={tileA}
                          onChange={(e) => setTileA(Number(e.target.value))}
                          className="w-full accent-[#FF6B57] bg-slate-800 h-2 rounded-lg cursor-pointer"
                        />
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-300">
                          <span>দ্বিতীয় বাহু (b):</span>
                          <span className="font-mono text-sky-400 font-bold">{tileB} একক</span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="5"
                          value={tileB}
                          onChange={(e) => setTileB(Number(e.target.value))}
                          className="w-full accent-sky-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                        />
                      </div>

                      {tileFormula === 'trinomialSquare' && (
                        <div className="space-y-1">
                          <div className="flex justify-between text-xs text-slate-300">
                            <span>তৃতীয় বাহু (c):</span>
                            <span className="font-mono text-emerald-400 font-bold">{tileC} একক</span>
                          </div>
                          <input
                            type="range"
                            min="1"
                            max="4"
                            value={tileC}
                            onChange={(e) => setTileC(Number(e.target.value))}
                            className="w-full accent-emerald-400 bg-slate-800 h-2 rounded-lg cursor-pointer"
                          />
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Mathematical Computation Card */}
                  <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2">
                    <span className="text-[10px] uppercase font-mono text-slate-400 block">
                      লাইভ গাণিতিক ক্ষেত্রফল গণনা:
                    </span>
                    <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs space-y-1 text-slate-200 border border-slate-800/80">
                      {tileFormula === 'sumSquare' && (
                        <>
                          <div className="text-[#FF6B57] font-bold">
                            (a + b)² = ({tileA} + {tileB})² = {(tileA + tileB) ** 2} বর্গ একক
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            = a² + 2ab + b² = {tileA ** 2} + 2({tileA} × {tileB}) + {tileB ** 2}
                          </div>
                          <div className="text-emerald-400 text-[11px]">
                            = {tileA ** 2} + {2 * tileA * tileB} + {tileB ** 2} = {(tileA + tileB) ** 2}
                          </div>
                        </>
                      )}
                      {tileFormula === 'diffSquare' && (
                        <>
                          <div className="text-[#FF6B57] font-bold">
                            (a - b)² = ({tileA} - {tileB})² = {(tileA - tileB) ** 2} বর্গ একক
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            = a² - 2ab + b² = {tileA ** 2} - 2({tileA} × {tileB}) + {tileB ** 2}
                          </div>
                          <div className="text-emerald-400 text-[11px]">
                            = {tileA ** 2} - {2 * tileA * tileB} + {tileB ** 2} = {(tileA - tileB) ** 2}
                          </div>
                        </>
                      )}
                      {tileFormula === 'diffOfSquares' && (
                        <>
                          <div className="text-[#FF6B57] font-bold">
                            (a + b)(a - b) = ({tileA} + {tileB})({tileA} - {tileB}) = {(tileA + tileB) * (tileA - tileB)}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            = a² - b² = {tileA ** 2} - {tileB ** 2}
                          </div>
                          <div className="text-emerald-400 text-[11px]">
                            = {tileA ** 2 - tileB ** 2} বর্গ একক
                          </div>
                        </>
                      )}
                      {tileFormula === 'trinomialSquare' && (
                        <>
                          <div className="text-[#FF6B57] font-bold">
                            (a + b + c)² = ({tileA} + {tileB} + {tileC})² = {(tileA + tileB + tileC) ** 2}
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            = a² + b² + c² + 2(ab + bc + ca)
                          </div>
                          <div className="text-emerald-400 text-[11px]">
                            = {tileA ** 2 + tileB ** 2 + tileC ** 2} + 2({tileA * tileB + tileB * tileC + tileC * tileA}) = {(tileA + tileB + tileC) ** 2}
                          </div>
                        </>
                      )}
                      {tileFormula === 'sumCube' && (
                        <>
                          <div className="text-[#FF6B57] font-bold">
                            (a + b)³ = ({tileA} + {tileB})³ = {(tileA + tileB) ** 3} ঘন একক
                          </div>
                          <div className="text-slate-400 text-[11px]">
                            = a³ + 3a²b + 3ab² + b³
                          </div>
                          <div className="text-emerald-400 text-[11px]">
                            = {tileA ** 3} + {3 * tileA * tileA * tileB} + {3 * tileA * tileB * tileB} + {tileB ** 3} = {(tileA + tileB) ** 3}
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Right Interactive Visual Area */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">জ্যামিতিক টাইলস ভিজ্যুয়ালাইজার</h3>
                      <span className="text-xs font-mono text-[#FF6B57] bg-[#FF6B57]/10 px-2.5 py-1 rounded-full border border-[#FF6B57]/20">
                        {tileFormula === 'sumSquare' ? '৪টি টাইলস বিভাজন' : 'পার্টিশন গ্রিড'}
                      </span>
                    </div>

                    {/* SVG Graphic Display */}
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-center min-h-[300px]">
                      {tileFormula === 'sumSquare' && (
                        <div className="flex flex-col items-center">
                          <svg viewBox="0 0 320 320" className="w-72 h-72 select-none font-mono">
                            {/* Proportional sizing: total size 260px */}
                            {/* Width A proportion: (a / (a+b)) * 260 */}
                            {(() => {
                              const total = tileA + tileB;
                              const scale = 250 / total;
                              const wA = tileA * scale;
                              const wB = tileB * scale;
                              const offX = 35;
                              const offY = 35;

                              return (
                                <>
                                  {/* Top a and b dimension labels */}
                                  <text x={offX + wA / 2} y={offY - 10} className="fill-[#FF6B57] text-xs font-bold text-anchor-middle text-center" textAnchor="middle">
                                    a = {tileA}
                                  </text>
                                  <text x={offX + wA + wB / 2} y={offY - 10} className="fill-sky-400 text-xs font-bold" textAnchor="middle">
                                    b = {tileB}
                                  </text>

                                  {/* Left side dimension labels */}
                                  <text x={offX - 12} y={offY + wA / 2} className="fill-[#FF6B57] text-xs font-bold" textAnchor="middle">
                                    a
                                  </text>
                                  <text x={offX - 12} y={offY + wA + wB / 2} className="fill-sky-400 text-xs font-bold" textAnchor="middle">
                                    b
                                  </text>

                                  {/* Tile 1: Top-Left a^2 square */}
                                  <rect
                                    x={offX}
                                    y={offY}
                                    width={wA}
                                    height={wA}
                                    className="fill-[#FF6B57]/30 stroke-2 stroke-[#FF6B57] transition-all"
                                  />
                                  <text x={offX + wA / 2} y={offY + wA / 2} className="fill-white font-bold text-xs" textAnchor="middle">
                                    a² ({tileA ** 2})
                                  </text>

                                  {/* Tile 2: Top-Right a * b rectangle */}
                                  <rect
                                    x={offX + wA}
                                    y={offY}
                                    width={wB}
                                    height={wA}
                                    className="fill-amber-500/30 stroke-2 stroke-amber-400 transition-all"
                                  />
                                  <text x={offX + wA + wB / 2} y={offY + wA / 2} className="fill-amber-200 font-bold text-xs" textAnchor="middle">
                                    ab ({tileA * tileB})
                                  </text>

                                  {/* Tile 3: Bottom-Left b * a rectangle */}
                                  <rect
                                    x={offX}
                                    y={offY + wA}
                                    width={wA}
                                    height={wB}
                                    className="fill-amber-500/30 stroke-2 stroke-amber-400 transition-all"
                                  />
                                  <text x={offX + wA / 2} y={offY + wA + wB / 2} className="fill-amber-200 font-bold text-xs" textAnchor="middle">
                                    ab ({tileA * tileB})
                                  </text>

                                  {/* Tile 4: Bottom-Right b^2 square */}
                                  <rect
                                    x={offX + wA}
                                    y={offY + wA}
                                    width={wB}
                                    height={wB}
                                    className="fill-sky-500/30 stroke-2 stroke-sky-400 transition-all"
                                  />
                                  <text x={offX + wA + wB / 2} y={offY + wA + wB / 2} className="fill-sky-200 font-bold text-xs" textAnchor="middle">
                                    b² ({tileB ** 2})
                                  </text>
                                </>
                              );
                            })()}
                          </svg>
                        </div>
                      )}

                      {tileFormula !== 'sumSquare' && (
                        <div className="w-full max-w-md p-6 rounded-xl bg-slate-900 border border-slate-800 space-y-4 text-center">
                          <div className="w-12 h-12 rounded-2xl bg-[#FF6B57]/10 border border-[#FF6B57]/20 flex items-center justify-center mx-auto text-[#FF6B57]">
                            <Square className="w-6 h-6" />
                          </div>
                          <div className="space-y-1">
                            <h4 className="text-base font-bold text-slate-100">
                              {tileFormula === 'diffSquare' && 'বর্গের বিয়োগফল পার্টিশন মোড'}
                              {tileFormula === 'diffOfSquares' && 'বর্গান্তর (a² - b²) মোড'}
                              {tileFormula === 'trinomialSquare' && 'ত্রিপদী (a + b + c)² ৯টি টাইলস বিভাজন'}
                              {tileFormula === 'sumCube' && 'ত্রিমাত্রিক ঘনের ৮টি ব্লক বিভাজন'}
                            </h4>
                            <p className="text-xs text-slate-400 leading-relaxed">
                              {tileFormula === 'diffSquare' &&
                                'পুরো a² ক্ষেত্রফল থেকে দুটি ab আয়তক্ষেত্র বাদ দিলে অতিরিক্ত b² ক্ষেত্রফল একবার বেশি বাদ চলে যায়, তাই পুনরায় +b² যোগ করতে হয়: a² - 2ab + b²।'}
                              {tileFormula === 'diffOfSquares' &&
                                'একটি a² বর্গ থেকে b² ক্ষেত্রফলের বর্গ কেটে সরিয়ে নিলে বাকি টুকরোকে সাজিয়ে গঠিত হয় (a + b) দৈর্ঘ্য এবং (a - b) প্রস্থের একক আয়তক্ষেত্র!'}
                              {tileFormula === 'trinomialSquare' &&
                                '৩টি চলকের ক্ষেত্রে বর্গটি ৯টি অংশে বিভক্ত হয়: ৩টি প্রধান বর্গ (a², b², c²) এবং ৬টি আয়তক্ষেত্র জোড়া ২(ab + bc + ca)।'}
                              {tileFormula === 'sumCube' &&
                                '(a + b) বাহুবিশিষ্ট ঘনক মোট ৮টি ব্লকে বিভক্ত: ১টি a³ কিউব, ৩টি a²b স্ল্যাব, ৩টি ab² রড এবং ১টি b³ কিউবলেট!'}
                            </p>
                          </div>
                          <div className="p-3 rounded-lg bg-slate-950 font-mono text-xs text-emerald-400 border border-slate-800">
                            মোট সম্মিলিত আয়তন / ক্ষেত্রফল ={' '}
                            {tileFormula === 'diffSquare' && `${(tileA - tileB) ** 2} বর্গ একক`}
                            {tileFormula === 'diffOfSquares' && `${tileA ** 2 - tileB ** 2} বর্গ একক`}
                            {tileFormula === 'trinomialSquare' && `${(tileA + tileB + tileC) ** 2} বর্গ একক`}
                            {tileFormula === 'sumCube' && `${(tileA + tileB) ** 3} ঘন একক`}
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Color Legend */}
                    <div className="grid grid-cols-3 gap-2 text-xs pt-1">
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="w-3 h-3 rounded bg-[#FF6B57]" />
                        <span className="text-slate-300">a² বর্গ টাইল</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="w-3 h-3 rounded bg-amber-400" />
                        <span className="text-slate-300">ab আয়ত টাইল</span>
                      </div>
                      <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-950 border border-slate-800">
                        <span className="w-3 h-3 rounded bg-sky-400" />
                        <span className="text-slate-300">b² বর্গ টাইল</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 2: SYMMETRICAL RECIPROCAL POWER LADDER                      */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 2 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <TrendingUp className="w-4 h-4 text-[#FF6B57]" />
                      <span>সিঁড়ির প্রাথমিক ভিত্তি শর্ত নির্বাচন</span>
                    </h3>

                    {/* Preset Buttons */}
                    <div className="grid grid-cols-2 gap-2 text-xs">
                      {[
                        { id: 'sqrt5', label: 'x + 1/x = √5', sub: 'ঢাকা বোর্ড স্পেশাল' },
                        { id: 'p3', label: 'x + 1/x = 3', sub: 'এনসিটিবি আদর্শ উদাহরণ' },
                        { id: 'm4', label: 'x - 1/x = 4', sub: 'বিয়োগ চিহ্ন ট্র্যাপ' },
                        { id: 'sqrt3', label: 'x + 1/x = √3', sub: 'শূন্য ঘনক বোর্ড ফেভারিট' },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setLadderPreset(item.id as any)}
                          className={`p-3 rounded-xl border text-left transition-all ${
                            ladderPreset === item.id
                              ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57] font-medium'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-mono font-bold text-xs">{item.label}</div>
                          <div className="text-[10px] text-slate-400 mt-0.5">{item.sub}</div>
                        </button>
                      ))}
                    </div>

                    {/* Current Base Badge */}
                    <div className="p-3.5 rounded-xl bg-slate-950 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs text-slate-400">নির্বাচিত ভিত্তি সমীকরণ:</span>
                      <span className="font-mono text-sm text-[#FF6B57] font-bold">
                        <RenderMathText text={ladderDetails.baseTex} />
                      </span>
                    </div>

                    {/* Ladder Rung Quick Jump */}
                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <label className="text-xs text-slate-400 block">সিঁড়ির ধাপে জাম্প করুন:</label>
                      <div className="grid grid-cols-6 gap-1.5 text-xs font-mono">
                        {[1, 2, 3, 4, 5, 6].map((rung) => (
                          <button
                            key={rung}
                            onClick={() => setActiveLadderRung(rung)}
                            className={`py-2 rounded-lg border text-center transition-all ${
                              activeLadderRung === rung
                                ? 'bg-[#FF6B57] text-white font-bold border-[#FF6B57]'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            ধাপ {rung}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Examiner Secret Tip Card */}
                  <div className="p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
                      <AlertTriangle className="w-4 h-4 shrink-0" />
                      <span>পরীক্ষকের গোল্ডেন রুল (x⁵ এর হিসাব):</span>
                    </div>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      x⁵ ± 1/x⁵ সরাসরি বের করার কোনো সূত্র নেই। সর্বদা (x² + 1/x²) এবং (x³ ± 1/x³) গুণ করতে হবে এবং শেষে অতিরিক্ত (x ± 1/x) বিয়োগ/যোগ করতে হবে!
                    </p>
                  </div>
                </div>

                {/* Right Interactive Ladder Display */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">সিমেট্রিক্যাল পাওয়ার সিঁড়ি (Power Ladder)</h3>
                      <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-full border border-emerald-800/40">
                        বর্তমান আরোহণ: ধাপ {activeLadderRung}
                      </span>
                    </div>

                    {/* Vertical Interactive Ladder Steps */}
                    <div className="space-y-2.5">
                      {[
                        { rung: 6, title: 'ধাপ ৬: x⁶ + 1/x⁶ এর মান', data: ladderDetails.r6, badge: 'ঘাত ৬' },
                        { rung: 5, title: 'ধাপ ৫: x⁵ ± 1/x⁵ এর মান (বোর্ড প্রশ্ন গ)', data: ladderDetails.r5, badge: 'ঘাত ৫ (শীর্ষ প্রিয়)' },
                        { rung: 4, title: 'ধাপ ৪: x⁴ + 1/x⁴ এর মান', data: ladderDetails.r4, badge: 'ঘাত ৪' },
                        { rung: 3, title: 'ধাপ ৩: x³ ± 1/x³ এর মান (বোর্ড প্রশ্ন খ)', data: ladderDetails.r3, badge: 'ঘাত ৩' },
                        { rung: 2, title: 'ধাপ ২: x² + 1/x² এর মান', data: ladderDetails.r2, badge: 'ঘাত ২' },
                        { rung: 1, title: 'ধাপ ১: x ± 1/x (ভিত্তি ধাপ)', data: ladderDetails.r1, badge: 'ঘাত ১ (জ্ঞানমূলক)' },
                      ].map((step) => {
                        const isCurrent = activeLadderRung === step.rung;
                        const isPassed = activeLadderRung >= step.rung;

                        return (
                          <div
                            key={step.rung}
                            onClick={() => setActiveLadderRung(step.rung)}
                            className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                              isCurrent
                                ? 'bg-[#FF6B57]/15 border-[#FF6B57] ring-1 ring-[#FF6B57]'
                                : isPassed
                                ? 'bg-slate-900/80 border-slate-700/60 hover:border-slate-600'
                                : 'bg-slate-950/50 border-slate-800/60 opacity-60 hover:opacity-80'
                            }`}
                          >
                            <div className="flex items-center justify-between mb-1">
                              <div className="flex items-center gap-2">
                                <span
                                  className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                                    isCurrent
                                      ? 'bg-[#FF6B57] text-white'
                                      : isPassed
                                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                                      : 'bg-slate-800 text-slate-500'
                                  }`}
                                >
                                  {step.rung}
                                </span>
                                <span className={`text-xs font-bold ${isCurrent ? 'text-white' : 'text-slate-300'}`}>
                                  {step.title}
                                </span>
                              </div>
                              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-slate-800 text-slate-400">
                                {step.badge}
                              </span>
                            </div>

                            <div className="flex items-center justify-between pt-1">
                              <div className="text-xs font-mono text-emerald-400 font-bold">
                                <RenderMathText text={step.data.tex} />
                              </div>
                              <div className="text-[11px] font-mono text-slate-400">
                                <RenderMathText text={step.data.formula} />
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 3: MIDDLE-TERM FACTOR SPLITTER                              */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 3 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Split className="w-4 h-4 text-[#FF6B57]" />
                      <span>দ্বিঘাত রাশি নির্বাচন</span>
                    </h3>

                    {/* Quadratic Problems */}
                    <div className="space-y-2">
                      {QUAD_DATA.map((q) => (
                        <button
                          key={q.id}
                          onClick={() => setActiveQuadId(q.id)}
                          className={`w-full p-2.5 rounded-xl border text-left flex items-center justify-between transition-all ${
                            activeQuadId === q.id
                              ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57] font-medium'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <span className="font-mono text-xs">{q.expr}</span>
                          <span className="text-[11px] text-slate-500 font-mono">
                            b = {q.b}, ac = {q.a * q.c}
                          </span>
                        </button>
                      ))}
                    </div>

                    {/* Interactive p and q sliders / adjusters */}
                    <div className="pt-2 border-t border-slate-800 space-y-3">
                      <label className="text-xs text-slate-300 font-medium block">
                        দুটি সংখ্যা p ও q নির্বাচন করুন:
                      </label>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>প্রথম সংখ্যা (p):</span>
                          <span className="font-mono text-emerald-400 font-bold">{userP}</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((num) => (
                            <button
                              key={num}
                              onClick={() => setUserP(num)}
                              className={`w-8 h-8 rounded-lg text-xs font-mono border transition-all ${
                                userP === num
                                  ? 'bg-emerald-500 text-slate-950 font-bold border-emerald-400'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="space-y-1">
                        <div className="flex justify-between text-xs text-slate-400">
                          <span>দ্বিতীয় সংখ্যা (q):</span>
                          <span className="font-mono text-sky-400 font-bold">{userQ}</span>
                        </div>
                        <div className="flex gap-1.5 flex-wrap">
                          {[-5, -4, -3, -2, -1, 1, 2, 3, 4, 5, 6].map((num) => (
                            <button
                              key={num}
                              onClick={() => setUserQ(num)}
                              className={`w-8 h-8 rounded-lg text-xs font-mono border transition-all ${
                                userQ === num
                                  ? 'bg-sky-400 text-slate-950 font-bold border-sky-300'
                                  : 'bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700'
                              }`}
                            >
                              {num}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Verification Area */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">মিডল-টার্ম স্প্লিট যাচাইকরণ ও ধাপে ধাপে কমন</h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-mono font-bold ${
                          isQuadSolved
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-400 border-amber-500/30'
                        }`}
                      >
                        {isQuadSolved ? 'নিখুঁত উৎপাদক বিশ্লেষণ!' : 'শর্ত অপূর্ণ'}
                      </span>
                    </div>

                    {/* Verification Badges */}
                    <div className="grid grid-cols-2 gap-3">
                      <div
                        className={`p-3.5 rounded-xl border space-y-1 ${
                          isSumMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        <div className="text-[11px] font-bold">১. যোগফল পরীক্ষা (p + q = b):</div>
                        <div className="font-mono text-xs">
                          {userP} + ({userQ}) = {pSumQ}{' '}
                          {isSumMatched ? `✓ (b = ${selectedQuad.b})` : `✗ (প্রয়োজন ${selectedQuad.b})`}
                        </div>
                      </div>

                      <div
                        className={`p-3.5 rounded-xl border space-y-1 ${
                          isProdMatched
                            ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                            : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                        }`}
                      >
                        <div className="text-[11px] font-bold">২. গুণফল পরীক্ষা (p × q = a × c):</div>
                        <div className="font-mono text-xs">
                          {userP} × ({userQ}) = {pProdQ}{' '}
                          {isProdMatched ? `✓ (ac = ${targetProd})` : `✗ (প্রয়োজন ${targetProd})`}
                        </div>
                      </div>
                    </div>

                    {/* Step-by-Step Factoring Lines */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                      <span className="text-[10px] uppercase text-slate-400 block font-sans">
                        ধাপে ধাপে উৎপাদক রূপান্তর:
                      </span>
                      <div className="text-slate-300">
                        প্রদত্ত রাশি = <RenderMathText text={selectedQuad.texExpr} />
                      </div>
                      <div className="text-amber-300">
                        = {selectedQuad.a === 1 ? 'x²' : `${selectedQuad.a}x²`} + ({userP}x) + ({userQ}x) + ({selectedQuad.c})
                      </div>
                      {isQuadSolved && (
                        <>
                          <div className="text-sky-300">
                            {selectedQuad.a === 1 ? (
                              `= x(x + ${userP}) + ${userQ}(x + ${userP})`
                            ) : (
                              `= 2x(x + 2) + 5(x + 2)`
                            )}
                          </div>
                          <div className="text-emerald-400 font-bold text-sm pt-1">
                            = <RenderMathText text={selectedQuad.factoredTex} />
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 4: REMAINDER THEOREM & VANISHING METHOD                      */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 4 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <Binary className="w-4 h-4 text-[#FF6B57]" />
                      <span>বহুপদী রাশি ও উৎপাদক নির্বাচন</span>
                    </h3>

                    {/* Polynomial presets */}
                    <div className="space-y-2">
                      {CUBIC_POLYS.map((poly) => (
                        <button
                          key={poly.id}
                          onClick={() => {
                            setActivePolyId(poly.id);
                            setTestAVal(poly.roots[0]);
                          }}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                            activePolyId === poly.id
                              ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57] font-medium'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-mono text-xs">
                            <RenderMathText text={poly.exprTex} />
                          </div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{poly.desc}</div>
                        </button>
                      ))}
                    </div>

                    {/* Interactive root test selector */}
                    <div className="pt-2 border-t border-slate-800 space-y-2">
                      <label className="text-xs text-slate-300 font-medium block">
                        সম্ভাব্য মান x = a পরীক্ষা করুন:
                      </label>
                      <div className="grid grid-cols-7 gap-1.5 font-mono text-xs">
                        {[-3, -2, -1, 0, 1, 2, 3].map((val) => (
                          <button
                            key={val}
                            onClick={() => setTestAVal(val)}
                            className={`py-2 rounded-lg border text-center transition-all ${
                              testAVal === val
                                ? 'bg-[#FF6B57] text-white font-bold border-[#FF6B57]'
                                : 'bg-slate-950 border-slate-800 text-slate-400 hover:text-white'
                            }`}
                          >
                            {val}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Vanishing Machine Area */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">ভ্যানিশিং মেথড লাইভ ক্যালকুলেটর</h3>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full border font-mono font-bold ${
                          isVanished
                            ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30 animate-pulse'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {isVanished ? 'f(a) = ০ — ভ্যানিশ হয়েছে!' : `ভাগশেষ R = ${evalResult}`}
                      </span>
                    </div>

                    {/* Calculation Display */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-3 font-mono text-xs">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-2">
                        <span className="text-slate-400">পরীক্ষাধীন মান:</span>
                        <span className="text-[#FF6B57] font-bold">x = {testAVal}</span>
                      </div>

                      <div className="space-y-1 text-slate-300 leading-relaxed">
                        <div>
                          f({testAVal}) = ({testAVal})³ ... ={' '}
                          <span className={`font-bold ${isVanished ? 'text-emerald-400 text-sm' : 'text-amber-400'}`}>
                            {evalResult}
                          </span>
                        </div>
                        {isVanished ? (
                          <div className="text-emerald-400 font-sans text-xs pt-1">
                            ✓ যেহেতু f({testAVal}) = 0, সুতরাং ভাগশেষ উপপাদ্য অনুযায়ী{' '}
                            <span className="font-mono font-bold">
                              (x - ({testAVal})) = (x {testAVal < 0 ? `+ ${Math.abs(testAVal)}` : `- ${testAVal}`})
                            </span>{' '}
                            রাশিটি f(x) এর একটি সাধারণ উৎপাদক!
                          </div>
                        ) : (
                          <div className="text-slate-400 font-sans text-xs pt-1">
                            ভাগশেষ ০ হয়নি, তাই (x - ({testAVal})) কোনো উৎপাদক নয়। অন্য মান চেষ্টা করুন।
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Step-by-Step 3-line Vanishing Expansion */}
                    {isVanished && (
                      <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 space-y-2">
                        <span className="text-xs font-bold text-emerald-400 block font-sans">
                          এনসিটিবি ভ্যানিশিং মেথডের ৩-লাইন কৌশল:
                        </span>
                        <div className="font-mono text-xs text-slate-200 space-y-1">
                          <div>
                            লাইন ১: <RenderMathText text={selectedPoly.breakdownLines.line1} />
                          </div>
                          <div className="text-sky-300">
                            লাইন ২: <RenderMathText text={selectedPoly.breakdownLines.line2} />
                          </div>
                          <div className="text-emerald-400 font-bold">
                            লাইন ৩: <RenderMathText text={selectedPoly.breakdownLines.line3} />
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* --------------------------------------------------------------- */}
            {/* LAB 5: CYCLIC & SYMMETRIC POLYNOMIAL LAB                        */}
            {/* --------------------------------------------------------------- */}
            {activeLessonId === 5 && (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                {/* Left Controls */}
                <div className="lg:col-span-5 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <h3 className="text-sm font-bold text-slate-200 flex items-center gap-2">
                      <RefreshCw className="w-4 h-4 text-[#FF6B57]" />
                      <span>চক্র-ক্রমিক পরিচয় ও শর্ত নির্বাচন</span>
                    </h3>

                    {/* Expr selector */}
                    <div className="space-y-2">
                      {[
                        {
                          id: 'cubeSumCondition',
                          label: 'a + b + c = 0 হলে a³ + b³ + c³ = 3abc',
                          sub: 'বোর্ড CQ শীর্ষ প্রশ্ন',
                        },
                        {
                          id: 'cyclic1',
                          label: 'a(b² - c²) + b(c² - a²) + c(a² - b²)',
                          sub: '= -(a - b)(b - c)(c - a)',
                        },
                        {
                          id: 'heronFormula',
                          label: 'a³ + b³ + c³ - 3abc বিস্তার',
                          sub: '= 1/2(a+b+c)[(a-b)²+(b-c)²+(c-a)²]',
                        },
                      ].map((item) => (
                        <button
                          key={item.id}
                          onClick={() => setActiveCyclicKey(item.id as any)}
                          className={`w-full p-2.5 rounded-xl border text-left transition-all ${
                            activeCyclicKey === item.id
                              ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57] font-medium'
                              : 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700'
                          }`}
                        >
                          <div className="font-mono text-xs">{item.label}</div>
                          <div className="text-[11px] text-slate-400 mt-0.5">{item.sub}</div>
                        </button>
                      ))}
                    </div>

                    {/* Variables a, b, c adjusters */}
                    <div className="pt-2 border-t border-slate-800 space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-slate-300 font-medium">চলক মান নির্বাচন:</span>
                        <span className="text-[11px] font-mono text-emerald-400">
                          a + b + c = {varA + varB + varC}
                        </span>
                      </div>

                      <div className="grid grid-cols-3 gap-2 text-xs font-mono">
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">a:</label>
                          <input
                            type="number"
                            value={varA}
                            onChange={(e) => setVarA(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">b:</label>
                          <input
                            type="number"
                            value={varB}
                            onChange={(e) => setVarB(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-slate-200"
                          />
                        </div>
                        <div>
                          <label className="text-[10px] text-slate-400 block mb-1">c:</label>
                          <input
                            type="number"
                            value={varC}
                            onChange={(e) => setVarC(Number(e.target.value))}
                            className="w-full bg-slate-950 border border-slate-800 rounded-lg p-2 text-center text-slate-200"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right Interactive Verification Area */}
                <div className="lg:col-span-7 space-y-4">
                  <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-center justify-between">
                      <h3 className="text-sm font-bold text-slate-200">চক্রাকার আবর্তন (a → b → c → a) পরীক্ষা</h3>
                      <span className="text-xs font-mono text-indigo-400 bg-indigo-950/60 px-2.5 py-1 rounded-full border border-indigo-800/40">
                        চক্র-ক্রমিক রাশি
                      </span>
                    </div>

                    {/* Cyclic Wheel SVG */}
                    <div className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-4 flex items-center justify-center">
                      <svg viewBox="0 0 240 240" className="w-56 h-56 select-none font-mono">
                        <circle cx="120" cy="120" r="70" className="stroke-2 stroke-dashed stroke-slate-700 fill-none" />
                        
                        {/* Node A */}
                        <circle cx="120" cy="50" r="22" className="fill-[#FF6B57]/20 stroke-2 stroke-[#FF6B57]" />
                        <text x="120" y="55" className="fill-white font-bold text-xs" textAnchor="middle">
                          a ({varA})
                        </text>

                        {/* Node B */}
                        <circle cx="180" cy="155" r="22" className="fill-sky-500/20 stroke-2 stroke-sky-400" />
                        <text x="180" y="160" className="fill-white font-bold text-xs" textAnchor="middle">
                          b ({varB})
                        </text>

                        {/* Node C */}
                        <circle cx="60" cy="155" r="22" className="fill-emerald-500/20 stroke-2 stroke-emerald-400" />
                        <text x="60" y="160" className="fill-white font-bold text-xs" textAnchor="middle">
                          c ({varC})
                        </text>

                        {/* Arrows */}
                        <path d="M 140 60 Q 185 85 180 125" className="stroke-[#FF6B57] fill-none stroke-2" markerEnd="url(#arrow)" />
                        <path d="M 160 175 Q 120 200 80 175" className="stroke-sky-400 fill-none stroke-2" />
                        <path d="M 55 125 Q 55 85 100 60" className="stroke-emerald-400 fill-none stroke-2" />
                      </svg>
                    </div>

                    {/* Calculation Result */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-2 font-mono text-xs">
                      {activeCyclicKey === 'cubeSumCondition' && (
                        <>
                          <div className="flex justify-between text-slate-300">
                            <span>a³ + b³ + c³:</span>
                            <span className="text-[#FF6B57] font-bold">
                              {varA ** 3 + varB ** 3 + varC ** 3}
                            </span>
                          </div>
                          <div className="flex justify-between text-slate-300">
                            <span>3abc:</span>
                            <span className="text-emerald-400 font-bold">{3 * varA * varB * varC}</span>
                          </div>
                          <div className="pt-1 text-[11px] text-slate-400 border-t border-slate-800">
                            {varA + varB + varC === 0 ? (
                              <span className="text-emerald-400">
                                ✓ যেহেতু a + b + c = 0, তাই a³ + b³ + c³ = 3abc প্রমাণিত!
                              </span>
                            ) : (
                              <span className="text-amber-400">
                                ⚠ a + b + c এর মান ০ হলে দুটি মান হুবহু সমান হবে।
                              </span>
                            )}
                          </div>
                        </>
                      )}

                      {activeCyclicKey !== 'cubeSumCondition' && (
                        <div className="text-slate-300 leading-relaxed">
                          চক্র-ক্রমিক রাশিতে a, b, c চলক তিনটি বৃত্তাকারে ঘড়ির কাঁটার দিকে ঘুরালে মূল রাশির মান সর্বদা অপরিবর্তিত থাকে।
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 2: SEE EXAMPLE (WORKED BOARD CQS WITH RUBRICS)                  */}
        {/* =================================================================== */}
        {activeTab === 'example' && (
          <div className="space-y-6">
            {/* Sub-Tabs for 3 CQ Types */}
            <div className="flex items-center space-x-2 overflow-x-auto no-scrollbar pb-1">
              {[
                { id: 1, title: 'টাইপ ১: x⁵ ± 1/x⁵ এর মান নির্ণয়', board: 'ঢাকা ও রাজশাহী বোর্ড' },
                { id: 2, title: 'টাইপ ২: m³ + 2p³ = 3mn ও চক্রীয় সমীকরণ', board: 'কুমিল্লা ও চট্টগ্রাম বোর্ড' },
                { id: 3, title: 'টাইপ ৩: ভাগশেষ উপপাদ্য ও ভ্যানিশিং উৎপাদক', board: 'যশোর ও দিনাজপুর বোর্ড' },
              ].map((cq) => (
                <button
                  key={cq.id}
                  onClick={() => setActiveCqType(cq.id as any)}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-medium whitespace-nowrap transition-all ${
                    activeCqType === cq.id
                      ? 'bg-[#FF6B57]/15 border-[#FF6B57] text-[#FF6B57]'
                      : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                  }`}
                >
                  <span className="font-bold block">{cq.title}</span>
                  <span className="text-[10px] text-slate-500 font-normal">{cq.board}</span>
                </button>
              ))}
            </div>

            {/* CQ 1 Content */}
            {activeCqType === 1 && (
              <div className="space-y-4">
                <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                  <div className="flex items-start justify-between gap-4">
                    <div className="space-y-1">
                      <span className="px-2.5 py-0.5 rounded-full bg-[#FF6B57]/10 text-[#FF6B57] font-mono text-[10px] border border-[#FF6B57]/20 uppercase">
                        বোর্ড সৃজনশীল প্রশ্ন (১০ নম্বর)
                      </span>
                      <h3 className="text-base font-bold text-slate-100">
                        উদ্দীপক: <RenderMathText text="$x^2 - \\sqrt{5}x + 1 = 0$ ($x > 0$)" />
                      </h3>
                    </div>
                    <button
                      onClick={() =>
                        handleCopyText(
                          `ক. দেওয়া আছে, x² - √5x + 1 = 0 => x² + 1 = √5x => x + 1/x = √5\nখ. x - 1/x = √((x + 1/x)² - 4) = √(5 - 4) = 1\nx³ - 1/x³ = (x - 1/x)³ + 3(x - 1/x) = 1³ + 3(1) = 4\nগ. x² + 1/x² = (√5)² - 2 = 3\nx³ + 1/x³ = (√5)³ - 3√5 = 2√5\n(x² + 1/x²)(x³ + 1/x³) = x⁵ + 1/x⁵ + (x + 1/x)\n3 * 2√5 = x⁵ + 1/x⁵ + √5\n6√5 - √5 = x⁵ + 1/x⁵ => x⁵ + 1/x⁵ = 5√5 (প্রমাণিত)`,
                          1
                        )
                      }
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-700 bg-slate-800 text-xs font-medium text-slate-200 hover:bg-slate-700 shrink-0"
                    >
                      {copiedCq === 1 ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{copiedCq === 1 ? 'কপি হয়েছে' : 'উত্তর কপি করুন'}</span>
                    </button>
                  </div>

                  {/* 3 Steps: Ka, Kha, Ga */}
                  <div className="space-y-3 pt-2">
                    {/* Part Ka */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-sky-400">
                          ক. দেখাও যে, <RenderMathText text="$x + \\frac{1}{x} = \\sqrt{5}$" />
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-300 border border-sky-800/40">
                          ২ নম্বর
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-300 space-y-1">
                        <div>দেওয়া আছে, <RenderMathText text="$x^2 - \\sqrt{5}x + 1 = 0$" /></div>
                        <div>বা, <RenderMathText text="$x^2 + 1 = \\sqrt{5}x$" /></div>
                        <div>উভয়পক্ষকে <RenderMathText text="$x$" /> দ্বারা ভাগ করে পাই,</div>
                        <div className="text-emerald-400 font-bold">
                          <RenderMathText text="$\\frac{x^2 + 1}{x} = \\sqrt{5} \\implies x + \\frac{1}{x} = \\sqrt{5}$" /> (দেখানো হলো)
                        </div>
                      </div>
                    </div>

                    {/* Part Kha */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-amber-400">
                          খ. <RenderMathText text="$x^3 - \\frac{1}{x^3}$" /> এর মান নির্ণয় করো।
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/40">
                          ৪ নম্বর
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-300 space-y-1">
                        <div>আমরা জানি, <RenderMathText text="$(x - \\frac{1}{x})^2 = (x + \\frac{1}{x})^2 - 4 = (\\sqrt{5})^2 - 4 = 5 - 4 = 1$" /></div>
                        <div><RenderMathText text="যেহেতু $x > 0$, সুতরাং $x - \\frac{1}{x} = 1$" /></div>
                        <div>প্রদত্ত রাশি = <RenderMathText text="$x^3 - \\frac{1}{x^3} = (x - \\frac{1}{x})^3 + 3 \\cdot x \\cdot \\frac{1}{x}(x - \\frac{1}{x})$" /></div>
                        <div className="text-emerald-400 font-bold">
                          <RenderMathText text="$= 1^3 + 3(1) = 1 + 3 = 4$" /> (Ans)
                        </div>
                      </div>
                    </div>

                    {/* Part Ga */}
                    <div className="p-4 rounded-xl bg-slate-950 border border-slate-800/80 space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-bold text-emerald-400">
                          গ. প্রমাণ করো যে, <RenderMathText text="$x^5 + \\frac{1}{x^5} = 5\\sqrt{5}$" />
                        </span>
                        <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-950 text-emerald-300 border border-emerald-800/40">
                          ৪ নম্বর
                        </span>
                      </div>
                      <div className="font-mono text-xs text-slate-300 space-y-1">
                        <div>ধাপ ১: <RenderMathText text="$x^2 + \\frac{1}{x^2} = (x + \\frac{1}{x})^2 - 2 = (\\sqrt{5})^2 - 2 = 5 - 2 = 3$" /></div>
                        <div>ধাপ ২: <RenderMathText text="$x^3 + \\frac{1}{x^3} = (x + \\frac{1}{x})^3 - 3(x + \\frac{1}{x}) = (\\sqrt{5})^3 - 3\\sqrt{5} = 5\\sqrt{5} - 3\\sqrt{5} = 2\\sqrt{5}$" /></div>
                        <div>ধাপ ৩: <RenderMathText text="$(x^2 + \\frac{1}{x^2})(x^3 + \\frac{1}{x^3}) = x^5 + \\frac{1}{x^5} + (x + \\frac{1}{x})$" /></div>
                        <div>বা, <RenderMathText text="$3 \\times 2\\sqrt{5} = x^5 + \\frac{1}{x^5} + \\sqrt{5}$" /></div>
                        <div className="text-emerald-400 font-bold">
                          বা, <RenderMathText text="$x^5 + \\frac{1}{x^5} = 6\\sqrt{5} - \\sqrt{5} = 5\\sqrt{5}$" /> (প্রমাণিত)
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Examiner Secret Rubric Card */}
                  <div className="p-4 rounded-xl bg-purple-500/10 border border-purple-500/30 space-y-2">
                    <div className="flex items-center gap-2 text-xs font-bold text-purple-300">
                      <ShieldCheck className="w-4 h-4" />
                      <span>পরীক্ষকের নম্বর বণ্টন রুব্রিক (Examiner Rubrics):</span>
                    </div>
                    <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside">
                      <li>ক অংশে $x$ দিয়ে ভাগ করে $x + 1/x = \sqrt{5}$ আনলে পূর্ণ ২ নম্বর।</li>
                      <li>খ অংশে $(x - 1/x)$ এর মান ১ বের করতে ভুল করলে পরবর্তী অংশে শূন্য।</li>
                      <li>গ অংশে গুণন প্রক্রিয়ায় $(x + 1/x)$ বিয়োগ না লিখে সরাসরি মান লিখলে ১ নম্বর কাটা যাবে।</li>
                    </ul>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 2 Content */}
            {activeCqType === 2 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="px-2.5 py-0.5 rounded-full bg-sky-500/10 text-sky-400 font-mono text-[10px] border border-sky-500/20 uppercase">
                      বোর্ড সৃজনশীল প্রশ্ন (১০ নম্বর)
                    </span>
                    <h3 className="text-base font-bold text-slate-100">
                      উদ্দীপক: <RenderMathText text="$a + b + c = m, \\quad a^2 + b^2 + c^2 = n, \\quad a^3 + b^3 = p^3$" />
                    </h3>
                  </div>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-sky-400 font-bold font-sans block mb-1">ক. যদি m = 0 হয়, তবে দেখাও যে a³ + b³ + c³ = 3abc (২ নম্বর)</span>
                    <div><RenderMathText text="দেওয়া আছে, $a + b + c = 0 \\implies a + b = -c$" /></div>
                    <div><RenderMathText text="উভয়পক্ষকে ঘন করে, $(a + b)^3 = (-c)^3 \\implies a^3 + b^3 + 3ab(a + b) = -c^3$" /></div>
                    <div className="text-emerald-400 font-bold"><RenderMathText text="বা, $a^3 + b^3 + 3ab(-c) = -c^3 \\implies a^3 + b^3 + c^3 = 3abc$ (দেখানো হলো)" /></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-amber-400 font-bold font-sans block mb-1">খ. যদি c = 0 হয়, তবে দেখাও যে m³ + 2p³ = 3mn (৪ নম্বর)</span>
                    <div><RenderMathText text="বামপক্ষ $= m^3 + 2p^3 = (a + b)^3 + 2(a^3 + b^3)$" /></div>
                    <div><RenderMathText text="$= a^3 + 3a^2b + 3ab^2 + b^3 + 2a^3 + 2b^3 = 3a^3 + 3a^2b + 3ab^2 + 3b^3$" /></div>
                    <div className="text-emerald-400 font-bold"><RenderMathText text="$= 3(a + b)(a^2 + b^2) = 3mn = \\text{ডানপক্ষ}$ (প্রমাণিত)" /></div>
                  </div>
                </div>
              </div>
            )}

            {/* CQ 3 Content */}
            {activeCqType === 3 && (
              <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                <div className="space-y-1">
                  <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 font-mono text-[10px] border border-emerald-500/20 uppercase">
                    বোর্ড সৃজনশীল প্রশ্ন (১০ নম্বর)
                  </span>
                  <h3 className="text-base font-bold text-slate-100">
                    উদ্দীপক: <RenderMathText text="$f(x) = x^3 - 7x - 6$" /> এবং <RenderMathText text="$g(y) = y^4 + y^2 + 1$" />
                  </h3>
                </div>

                <div className="space-y-3 font-mono text-xs">
                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-sky-400 font-bold font-sans block mb-1">ক. g(y) কে উৎপাদকে বিশ্লেষণ করো (২ নম্বর)</span>
                    <div><RenderMathText text="$g(y) = y^4 + y^2 + 1 = (y^2 + 1)^2 - y^2 = (y^2 + y + 1)(y^2 - y + 1)$ (Ans)" /></div>
                  </div>

                  <div className="p-4 rounded-xl bg-slate-950 border border-slate-800 space-y-1">
                    <span className="text-emerald-400 font-bold font-sans block mb-1">খ ও গ. ভাগশেষ উপপাদ্যের সাহায্যে f(x) কে উৎপাদকে বিশ্লেষণ করো (৪ + ৪ নম্বর)</span>
                    <div><RenderMathText text="$f(-1) = (-1)^3 - 7(-1) - 6 = -1 + 7 - 6 = 0$" /></div>
                    <div><RenderMathText text="সুতরাং $(x + 1)$ রাশিটি $f(x)$ এর একটি সাধারণ উৎপাদক।" /></div>
                    <div className="text-emerald-400 font-bold">
                      <RenderMathText text="$x^3 - 7x - 6 = x^2(x+1) - x(x+1) - 6(x+1) = (x+1)(x-3)(x+2)$ (Ans)" />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 3: TRY YOURSELF (3 CHALLENGES)                                  */}
        {/* =================================================================== */}
        {activeTab === 'try' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100">ইন্টারেক্টিভ বীজগণিত চ্যালেঞ্জ</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  খাতায় হিসাব করে সঠিক সাংখ্যিক উত্তর বসাও এবং সাথে সাথে যাচাই করো।
                </p>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FF6B57]/10 text-[#FF6B57] text-xs font-mono font-bold border border-[#FF6B57]/20">
                <TrophyIcon className="w-3.5 h-3.5" />
                <span>৩টি চ্যালেঞ্জ</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {CHALLENGES.map((ch) => {
                const userVal = challengeInputs[ch.id] || '';
                const isChecked = challengeChecked[ch.id];
                const isCorrect = userVal.trim() === ch.correctAnswer;

                return (
                  <div
                    key={ch.id}
                    className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4"
                  >
                    <div className="space-y-3">
                      <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {ch.title}
                      </span>
                      <h3 className="text-sm font-bold text-slate-200">{ch.questionBn}</h3>

                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800/80 font-mono text-xs space-y-1">
                        <div className="text-slate-400">শর্ত: <RenderMathText text={ch.givenTex} /></div>
                        <div className="text-[#FF6B57] font-bold">লক্ষ্য: <RenderMathText text={ch.targetTex} /></div>
                      </div>

                      <div className="text-[11px] text-slate-400 italic">
                        ইঙ্গিত: {ch.hintBn}
                      </div>
                    </div>

                    <div className="space-y-2 pt-2 border-t border-slate-800">
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="উত্তর লিখো (যেমন: 9)"
                          value={userVal}
                          onChange={(e) => {
                            setChallengeInputs((prev) => ({ ...prev, [ch.id]: e.target.value }));
                            setChallengeChecked((prev) => ({ ...prev, [ch.id]: false }));
                          }}
                          className="flex-1 bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs font-mono text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-[#FF6B57]"
                        />
                        <button
                          onClick={() => handleChallengeSubmit(ch.id)}
                          className="px-4 py-2 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white text-xs font-bold transition-all"
                        >
                          যাচাই
                        </button>
                      </div>

                      {isChecked && (
                        <div
                          className={`p-2.5 rounded-xl border text-xs font-mono ${
                            isCorrect
                              ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                              : 'bg-rose-500/10 border-rose-500/30 text-rose-400'
                          }`}
                        >
                          {isCorrect ? (
                            <div className="flex items-center gap-1.5">
                              <CheckCircle2 className="w-4 h-4 shrink-0" />
                              <span>অসাধারণ! সঠিক উত্তর: {ch.correctAnswer}</span>
                            </div>
                          ) : (
                            <div className="flex items-center gap-1.5">
                              <XCircle className="w-4 h-4 shrink-0" />
                              <span>ভুল হয়েছে। সঠিক উত্তর: {ch.correctAnswer}</span>
                            </div>
                          )}
                          <div className="text-[11px] text-slate-300 mt-1 font-sans">
                            ব্যাখ্যা: <RenderMathText text={ch.explanationTex} />
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 4: CHECK UNDERSTANDING (5 MCQS)                                 */}
        {/* =================================================================== */}
        {activeTab === 'quiz' && (
          <div className="space-y-6">
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex items-center justify-between">
              <div>
                <h2 className="text-base font-bold text-slate-100">বোর্ড মানসম্পন্ন বহুনির্বাচনি কুইজ (MCQ)</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  এসএসসি পরীক্ষায় ঘন ঘন আসা ৫টি গুরুত্বপূর্ণ প্রশ্নের সঠিক উত্তর যাচাই করো।
                </p>
              </div>
              <span className="text-xs font-mono px-3 py-1 rounded-full bg-[#FF6B57]/10 text-[#FF6B57] border border-[#FF6B57]/20">
                ৫টি প্রশ্ন
              </span>
            </div>

            <div className="space-y-4">
              {MCQS.map((mcq, idx) => {
                const selectedOpt = selectedAnswers[mcq.id];
                const isSubmitted = isAnswerSubmitted[mcq.id];
                const isCorrect = selectedOpt === mcq.correctIndex;

                return (
                  <div key={mcq.id} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="text-sm font-bold text-slate-200">
                        {idx + 1}. {mcq.questionBn}
                      </h3>
                      {isSubmitted && (
                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isCorrect ? 'bg-emerald-500/20 text-emerald-400' : 'bg-rose-500/20 text-rose-400'
                          }`}
                        >
                          {isCorrect ? 'সঠিক' : 'ভুল'}
                        </span>
                      )}
                    </div>

                    {/* Options Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {mcq.options.map((opt, oIdx) => {
                        const isChosen = selectedOpt === oIdx;
                        let btnStyle = 'bg-slate-950 border-slate-800 text-slate-300 hover:border-slate-700';

                        if (isSubmitted) {
                          if (oIdx === mcq.correctIndex) {
                            btnStyle = 'bg-emerald-500/20 border-emerald-500 text-emerald-300 font-bold';
                          } else if (isChosen) {
                            btnStyle = 'bg-rose-500/20 border-rose-500 text-rose-300 font-bold';
                          }
                        } else if (isChosen) {
                          btnStyle = 'bg-[#FF6B57]/20 border-[#FF6B57] text-[#FF6B57] font-bold';
                        }

                        return (
                          <button
                            key={oIdx}
                            onClick={() => handleSelectAnswer(mcq.id, oIdx)}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              <RenderMathText text={opt} />
                            </span>
                            <span className="w-5 h-5 rounded-full border border-current/30 flex items-center justify-center text-[10px]">
                              {['ক', 'খ', 'গ', 'ঘ'][oIdx]}
                            </span>
                          </button>
                        );
                      })}
                    </div>

                    {/* Submit Check Button */}
                    {!isSubmitted && (
                      <div className="flex justify-end pt-1">
                        <button
                          disabled={selectedOpt === undefined}
                          onClick={() => handleCheckAnswer(mcq.id)}
                          className="px-4 py-2 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] disabled:opacity-40 disabled:hover:bg-[#FF6B57] text-white text-xs font-bold transition-all"
                        >
                          উত্তর যাচাই করুন
                        </button>
                      </div>
                    )}

                    {/* Explanation */}
                    {isSubmitted && (
                      <div className="p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-slate-300 space-y-1">
                        <div className="text-[#FF6B57] font-bold">ব্যাখ্যা:</div>
                        <div className="font-mono">
                          <RenderMathText text={mcq.explanationTex} />
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {/* =================================================================== */}
        {/* TAB 5: SUMMARY & FORMULA VAULT                                      */}
        {/* =================================================================== */}
        {activeTab === 'summary' && (
          <div className="space-y-6">
            {/* Header with 1-Click Copy */}
            <div className="p-4 rounded-2xl bg-slate-900/50 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-base font-bold text-slate-100">অধ্যায় ৩: সম্পূর্ণ সূত্রকোষ ও পরীক্ষকের ট্র্যাপ</h2>
                <p className="text-xs text-slate-400 mt-0.5">
                  এসএসসি পরীক্ষার পূর্বে রিভিশনের জন্য সকল মৌলিক সূত্র ও ৪টি মারাত্মক সতর্কবার্তা।
                </p>
              </div>
              <button
                onClick={() =>
                  handleCopyText(
                    `--- অধ্যায় ৩: বীজগাণিতিক রাশি সূত্রকোষ ---\n১. (a + b)² = a² + 2ab + b²\n২. (a - b)² = a² - 2ab + b²\n৩. a² - b² = (a + b)(a - b)\n৪. a² + b² = (a + b)² - 2ab = (a - b)² + 2ab\n৫. (a + b)² = (a - b)² + 4ab\n৬. 4ab = (a + b)² - (a - b)²\n৭. 2(a² + b²) = (a + b)² + (a - b)²\n৮. (a + b + c)² = a² + b² + c² + 2(ab + bc + ca)\n৯. (a + b)³ = a³ + 3a²b + 3ab² + b³\n১০. (a - b)³ = a³ - 3a²b + 3ab² - b³\n১১. a³ + b³ = (a + b)(a² - ab + b²) = (a + b)³ - 3ab(a + b)\n১২. a³ - b³ = (a - b)(a² + ab + b²) = (a - b)³ + 3ab(a - b)\n১৩. a + b + c = 0 => a³ + b³ + c³ = 3abc\n১৪. x⁵ + 1/x⁵ = (x² + 1/x²)(x³ + 1/x³) - (x + 1/x)`,
                    99
                  )
                }
                className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#FF6B57] text-white text-xs font-bold shadow-md hover:bg-[#e05340] transition-all shrink-0"
              >
                {copiedCq === 99 ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copiedCq === 99 ? 'নোট কপি হয়েছে' : 'এক-ক্লিকে রিভিশন নোট কপি'}</span>
              </button>
            </div>

            {/* 6 Core Formula Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Card 1: Square Identities */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-[#FF6B57] flex items-center gap-1.5">
                  <Square className="w-4 h-4" />
                  <span>১. বর্গের মৌলিক সূত্রাবলি</span>
                </span>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800/80">
                  <div>• <RenderMathText text="$(a + b)^2 = a^2 + 2ab + b^2$" /></div>
                  <div>• <RenderMathText text="$(a - b)^2 = a^2 - 2ab + b^2$" /></div>
                  <div>• <RenderMathText text="$a^2 - b^2 = (a + b)(a - b)$" /></div>
                  <div>• <RenderMathText text="$(a + b + c)^2 = a^2 + b^2 + c^2 + 2(ab + bc + ca)$" /></div>
                </div>
              </div>

              {/* Card 2: Square Corollaries */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-sky-400 flex items-center gap-1.5">
                  <Activity className="w-4 h-4" />
                  <span>২. বর্গের মান নির্ণয়ের অনুসিদ্ধান্ত</span>
                </span>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800/80">
                  <div>• <RenderMathText text="$a^2 + b^2 = (a + b)^2 - 2ab$" /></div>
                  <div>• <RenderMathText text="$a^2 + b^2 = (a - b)^2 + 2ab$" /></div>
                  <div>• <RenderMathText text="$(a + b)^2 = (a - b)^2 + 4ab$" /></div>
                  <div>• <RenderMathText text="$4ab = (a + b)^2 - (a - b)^2$" /></div>
                  <div>• <RenderMathText text="$2(a^2 + b^2) = (a + b)^2 + (a - b)^2$" /></div>
                </div>
              </div>

              {/* Card 3: Cube Identities */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-indigo-400 flex items-center gap-1.5">
                  <Layers className="w-4 h-4" />
                  <span>৩. ঘনের সূত্রাবলি ও উৎপাদক রূপ</span>
                </span>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800/80">
                  <div>• <RenderMathText text="$(a + b)^3 = a^3 + 3a^2b + 3ab^2 + b^3$" /></div>
                  <div>• <RenderMathText text="$(a - b)^3 = a^3 - 3a^2b + 3ab^2 - b^3$" /></div>
                  <div>• <RenderMathText text="$a^3 + b^3 = (a + b)(a^2 - ab + b^2)$" /></div>
                  <div>• <RenderMathText text="$a^3 - b^3 = (a - b)(a^2 + ab + b^2)$" /></div>
                </div>
              </div>

              {/* Card 4: Cube Corollaries */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
                  <TrendingUp className="w-4 h-4" />
                  <span>৪. ঘনের মান নির্ণয়ের অনুসিদ্ধান্ত</span>
                </span>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800/80">
                  <div>• <RenderMathText text="$a^3 + b^3 = (a + b)^3 - 3ab(a + b)$" /></div>
                  <div>• <RenderMathText text="$a^3 - b^3 = (a - b)^3 + 3ab(a - b)$" /></div>
                  <div>• <RenderMathText text="যদি $a + b + c = 0$ হয়, $a^3 + b^3 + c^3 = 3abc$" /></div>
                </div>
              </div>

              {/* Card 5: Power Ladder */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1.5">
                  <Zap className="w-4 h-4" />
                  <span>৫. x ± 1/x সিঁড়ি সূত্রাবলি</span>
                </span>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800/80">
                  <div>• <RenderMathText text="$x^2 + \\frac{1}{x^2} = (x + \\frac{1}{x})^2 - 2$" /></div>
                  <div>• <RenderMathText text="$x^3 + \\frac{1}{x^3} = (x + \\frac{1}{x})^3 - 3(x + \\frac{1}{x})$" /></div>
                  <div>• <RenderMathText text="$x^5 + \\frac{1}{x^5} = (x^2 + \\frac{1}{x^2})(x^3 + \\frac{1}{x^3}) - (x + \\frac{1}{x})$" /></div>
                </div>
              </div>

              {/* Card 6: Remainder & Cyclic */}
              <div className="p-4 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-2.5">
                <span className="text-xs font-bold text-rose-400 flex items-center gap-1.5">
                  <Binary className="w-4 h-4" />
                  <span>৬. ভাগশেষ উপপাদ্য ও চক্র-ক্রমিক</span>
                </span>
                <div className="p-3 rounded-xl bg-slate-950 font-mono text-xs text-slate-200 space-y-1.5 border border-slate-800/80">
                  <div>• <RenderMathText text="$f(a) = 0 \\implies (x - a)$" /> একটি সাধারণ উৎপাদক</div>
                  <div>• <RenderMathText text="$x^4 + x^2 + 1 = (x^2 + x + 1)(x^2 - x + 1)$" /></div>
                  <div>• <RenderMathText text="$a(b^2-c^2) + b(c^2-a^2) + c(a^2-b^2) = -(a-b)(b-c)(c-a)$" /></div>
                </div>
              </div>
            </div>

            {/* 4 Examiner Traps with Red Badges */}
            <div className="p-5 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-4">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-sm">
                <ShieldAlert className="w-5 h-5" />
                <span>পরীক্ষকের ৪টি মারাত্মক নম্বর কাটার ফাঁদ (Examiner Traps)</span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-1">
                  <div className="font-bold text-rose-300">ট্র্যাপ ০১: ±২ বনাম ±৪ চিহ্নের বিভ্রাট</div>
                  <p className="text-slate-300 leading-relaxed">
                    (x + 1/x)² = (x - 1/x)² + 4ab সূত্রে চার (৪), কিন্তু x² + 1/x² = (x - 1/x)² + 2 সূত্রে দুই (২)। বহু ছাত্রছাত্রী তাড়াহুড়ায় ৪ এর স্থলে ২ লিখে নম্বর হারায়।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-1">
                  <div className="font-bold text-rose-300">ট্র্যাপ ০২: x⁵ - 1/x⁵ এর গুণনীয়ক নির্বাচন</div>
                  <p className="text-slate-300 leading-relaxed">
                    x⁵ - 1/x⁵ এর জন্য সর্বদা (x² + 1/x²) এবং (x³ - 1/x³) গুণ করতে হবে। এদের গুণফলে মাঝখানে অতিরিক্ত +(x - 1/x) আসে, যা বামপাশে বিয়োগ করতে হয়।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-1">
                  <div className="font-bold text-rose-300">ট্র্যাপ ০৩: উৎপাদক বনাম মান নির্ণয় সূত্র</div>
                  <p className="text-slate-300 leading-relaxed">
                    a³ - b³ এর উৎপাদক সূত্র (a - b)(a² + ab + b²) যেখানে মাঝের পদে কোনো ৩ নেই! কিন্তু মান নির্ণয় সূত্র (a - b)³ + 3ab(a - b) তে ৩ আছে।
                  </p>
                </div>

                <div className="p-3 rounded-xl bg-slate-950/80 border border-rose-500/20 space-y-1">
                  <div className="font-bold text-rose-300">ট্র্যাপ ০৪: ভ্যানিশিং মেথডের সমতা ফাঁদ</div>
                  <p className="text-slate-300 leading-relaxed">
                    ভ্যানিশিং পদ্ধতিতে ২য় লাইনের পদগুলো সাজানোর সময় মূল বহুপদীর সহগগুলোর সাথে বীজগণিতীয় যোগফল হুবহু মিলতে হবে।
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      {/* --------------------------------------------------------------------- */}
      {/* SHERU SOCRATIC AI TUTOR DRAWER                                        */}
      {/* --------------------------------------------------------------------- */}
      {isAiDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/60 backdrop-blur-sm animate-in fade-in">
          <div className="w-full max-w-md bg-slate-900 border-l border-slate-800 h-full flex flex-col shadow-2xl">
            {/* Drawer Header */}
            <div className="p-4 border-b border-slate-800 flex items-center justify-between bg-slate-950/50">
              <div className="flex items-center space-x-2.5">
                <div className="w-8 h-8 rounded-xl bg-[#FF6B57]/20 border border-[#FF6B57]/30 flex items-center justify-center text-[#FF6B57]">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-slate-100">শেরু এআই গণিত টিউটর</h3>
                  <p className="text-[10px] text-slate-400">বীজগাণিতিক রাশি সহায়ক</p>
                </div>
              </div>
              <button
                onClick={() => setIsAiDrawerOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Prompt Chips */}
            <div className="p-3 border-b border-slate-800/80 bg-slate-950/30 flex gap-1.5 overflow-x-auto no-scrollbar">
              {AI_PROMPT_CHIPS.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSendAiMessage(chip)}
                  className="px-2.5 py-1 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 text-[11px] whitespace-nowrap transition-colors border border-slate-700/50"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Chat Messages */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
              {aiChatMessages.map((msg, idx) => (
                <div
                  key={idx}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[85%] p-3 rounded-2xl leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-[#FF6B57] text-white rounded-br-none'
                        : 'bg-slate-800 text-slate-200 border border-slate-700/70 rounded-bl-none'
                    }`}
                  >
                    <div className="whitespace-pre-line">{msg.text}</div>
                    {msg.math && (
                      <div className="mt-2 pt-2 border-t border-slate-700/60 font-mono text-[11px] text-emerald-400">
                        <RenderMathText text={msg.math} />
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Input Box */}
            <div className="p-3 border-t border-slate-800 bg-slate-950/50">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="শেরুকে কোনো সূত্রের প্রশ্ন করো..."
                  value={aiInputText}
                  onChange={(e) => setAiInputText(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage(aiInputText)}
                  className="flex-1 bg-slate-900 border border-slate-800 rounded-xl px-3.5 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:border-[#FF6B57]"
                />
                <button
                  onClick={() => handleSendAiMessage(aiInputText)}
                  className="p-2 rounded-xl bg-[#FF6B57] hover:bg-[#e05340] text-white transition-colors"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function TrophyIcon({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
    >
      <path d="M6 9H4.5a2.5 2.5 0 0 1 0-5H6" />
      <path d="M18 9h1.5a2.5 2.5 0 0 0 0-5H18" />
      <path d="M4 22h16" />
      <path d="M10 14.66V17c0 .55-.47.98-.97 1.21C7.85 18.75 7 20.24 7 22" />
      <path d="M14 14.66V17c0 .55.47.98.97 1.21C16.15 18.75 17 20.24 17 22" />
      <path d="M18 2H6v7a6 6 0 0 0 12 0V2Z" />
    </svg>
  );
}
