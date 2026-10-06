import { PhysicsChapterFullData } from '../types';

export const CH14_BIOMEDICAL_DATA: PhysicsChapterFullData = {
  id: 'ssc-phy-ch14',
  chapterNo: 14,
  subjectCode: 'SSC-PHY',
  titleEn: 'Physics to Save Life',
  titleBn: 'জীবন বাঁচাতে পদার্থবিজ্ঞান',
  division: 'modern_biomedical',
  divisionTitleEn: 'Modern Physics & Electronics',
  divisionTitleBn: 'আধুনিক পদার্থবিজ্ঞান ও ইলেকট্রনিক্স',
  iconName: 'HeartPulse',
  estimatedMinutes: 40,
  boardMarksAllocation: 'CQ ১০ নম্বর (ক: ১, খ: ২, গ: ৩, ঘ: ৪) + MCQ ৩ নম্বর',
  overviewBn:
    'চিকিৎসাবিজ্ঞানের প্রায় প্রতিটি আধুনিক ডায়াগনস্টিক যন্ত্রই পদার্থবিজ্ঞানের মৌলিক সূত্র ও তরঙ্গের আচরণের উপর প্রতিষ্ঠিত। এই অধ্যায়ে এক্স-রে, আল্ট্রাসনোগ্রাফি, সিটি স্ক্যান, এমআরআই, ইসিজি, এন্ডোস্কোপি এবং রেডিওথেরাপির বৈজ্ঞানিক মূলনীতি, বিকিরণ ঝুঁকি এবং তুলনামূলক নিরাপত্তা বোর্ড পরীক্ষার মানদণ্ডে বিশদভাবে তুলে ধরা হয়েছে।',
  overviewEn:
    'Modern medical diagnostics heavily rely on fundamental physics principles of electromagnetic radiation, acoustics, and bio-potentials. This chapter explores the operational mechanics and safety profiles of X-Ray, Ultrasonography, CT Scans, MRI, ECG, Endoscopy, and Radiotherapy for SSC exams.',
  keyTopicsBn: [
    'এক্স-রে উৎপাদন ও রেডিওগ্রাফির মূলনীতি',
    'আল্ট্রাসনোগ্রাফি ও পিজোইলেকট্রিক প্রতিধ্বনি',
    'সিটি স্ক্যান (CT Scan) বনাম এমআরআই (MRI)',
    'ইসিজি (ECG) ও হৃদযন্ত্রের জৈব-বৈদ্যুতিক সংকেত',
    'এন্ডোস্কোপি ও অপটিক্যাল ফাইবারের প্রতিফলন',
    'রেডিওথেরাপি, আইসোটোপ ও বিকিরণ সতর্কতা',
  ],
  keyTopicsEn: [
    'X-Ray Production & Radiographic Attenuation',
    'Ultrasonography & Piezoelectric Acoustic Echoes',
    'Computed Tomography (CT) vs MRI Mechanisms',
    'Electrocardiogram (ECG) & Cardiac Bio-potentials',
    'Endoscopy & Total Internal Reflection Probes',
    'Radiotherapy, Radioisotopes & Radiation Safety',
  ],
  status: 'available',

  // ----------------------------------------------------
  // STEP 1: Concept Tree
  // ----------------------------------------------------
  step1: {
    summaryBn:
      'চিকিৎসায় ব্যবহৃত প্রযুক্তিগুলোকে বিকিরণের প্রকৃতির ওপর ভিত্তি করে দুটি ভাগে ভাগ করা যায়: (১) আয়নাইজিং বিকিরণ (এক্স-রে, সিটি স্ক্যান, রেডিওথেরাপি— যা সতর্কতার সাথে ব্যবহার্য) এবং (২) নন-আয়নাইজিং প্রযুক্তি (আল্ট্রাসনোগ্রাফি, এমআরআই, ইসিজি— যা সম্পূর্ণ নিরাপদ)।',
    summaryEn:
      'Medical modalities divide into ionizing radiation technologies (X-Ray, CT, Radiotherapy requiring caution) and non-ionizing safe acoustic or magnetic modalities (Ultrasound, MRI, ECG).',
    nodes: [
      {
        id: 'node-xray-principles',
        titleBn: 'এক্স-রে ও রেডিওগ্রাফি',
        titleEn: 'X-Ray & Radiography',
        descriptionBn:
          '১৮৯৫ সালে উইলহেম রন্টজেন এক্স-রে আবিষ্কার করেন। দ্রুতগামী ইলেকট্রন ভারী ধাতব লক্ষ্যবস্তুতে (টাংস্টেন) আঘাত করলে উচ্চ শক্তির তড়িৎচৌম্বকীয় বিকিরণ উৎপন্ন হয়। হাড়ের ঘন ক্যালসিয়াম এক্স-রে শোষণ করে ফলে ফটোগ্রাফিক ফিল্মে সাদা ছায়া পড়ে, কিন্তু মাংসপেশি ভেদ করে যাওয়ায় তা কালো দেখায়।',
        descriptionEn:
          'High-speed electrons colliding with dense tungsten targets emit bremsstrahlung and characteristic X-rays. Calcium-dense bones attenuate radiation heavily, projecting clear white radiopaque shadows.',
        iconName: 'Scan',
        realWorldExampleBn:
          'দুর্ঘটনায় হাত বা পায়ের হাড় ভেঙে গেলে ঠিক কোথায় ফ্র্যাকচার হয়েছে তা নিখুঁতভাবে দেখতে এক্স-রে করা হয়।',
        realWorldExampleEn:
          'Trauma radiography immediately reveals skeletal hairline cracks and joint dislocations.',
        formulaLatex: '\\lambda_{\\min} = \\frac{hc}{eV} \\quad [E_{\\max} = eV]',
      },
      {
        id: 'node-ultrasonography-echo',
        titleBn: 'আল্ট্রাসনোগ্রাফি ও শব্দ প্রতিধ্বনি',
        titleEn: 'Ultrasonography & Acoustic Echoes',
        descriptionBn:
          'শ্রাব্যতার সীমার বাইরের অতিউচ্চ কম্পাঙ্কের শব্দতরঙ্গ (১ থেকে ১০ মেগাহার্টজ) ব্যবহার করে দেহের অভ্যন্তরীণ অঙ্গের ছবি তোলার পদ্ধতিকে আল্ট্রাসনোগ্রাফি বলে। পিজোইলেকট্রিক স্ফটিকের মাধ্যমে শব্দ সৃষ্টি ও প্রতিফলিত প্রতিধ্বনি (Echo) গ্রহণ করা হয়। এটি অহিংস এবং কোনো ক্ষতিকর তেজস্ক্রিয়তা নেই।',
        descriptionEn:
          'Employs 1-10 MHz acoustic pulses produced by piezoelectric transducers. Echoes reflecting from tissue boundaries are mapped into real-time cross-sectional images with zero radiation hazard.',
        iconName: 'Activity',
        realWorldExampleBn:
          'গর্ভবতী মায়ের পেটের শিশুর বৃদ্ধি, নাড়াচাড়া ও অঙ্গপ্রত্যঙ্গের সুস্থতা পরীক্ষা করতে নিয়মিত আল্ট্রাসনোগ্রাফি করা হয়।',
        realWorldExampleEn:
          'Routine obstetric ultrasound tracks fetal development and placental health safely throughout pregnancy.',
        formulaLatex: 'd = \\frac{v \\times t}{2} \\quad [v \\approx 1540\\text{ m/s মানবদেহে}]',
      },
      {
        id: 'node-ct-vs-mri',
        titleBn: 'সিটি স্ক্যান বনাম এমআরআই',
        titleEn: 'CT Scan vs MRI',
        descriptionBn:
          'সিটি স্ক্যানে এক্স-রে টিউব শরীরের চারপাশে ঘুরে শত শত দ্বিমাত্রিক এক্স-রে স্লাইস নেয় যা কম্পিউটার ত্রিমাত্রিক (3D) চিত্রে রূপান্তর করে (আয়নাইজিং)। অন্যদিকে এমআরআই-তে কোনো এক্স-রে নেই; শক্তিশালী চৌম্বক ক্ষেত্রে (১.৫-৩.০ টেসলা) রেডিও তরঙ্গের প্রভাবে মানবদেহের পানির হাইড্রোজেন প্রোটন স্পিন অনুরণনে সাড়া দেয় (নন-আয়নাইজিং ও নরম টিস্যুর জন্য সেরা)।',
        descriptionEn:
          'CT utilizes rotating X-ray beams for 3D cross-sectional tomography. MRI uses magnetic field proton resonance without ionizing radiation, delivering superior soft tissue contrast.',
        iconName: 'Eye',
        realWorldExampleBn:
          'মস্তিষ্কে সূক্ষ্ম স্ট্রোক বা লিগামেন্ট ছিঁড়ে গেলে এমআরআই করা হয়, আর মাথায় তাৎক্ষণিক রক্তক্ষরণ শনাক্তে দ্রুত সিটি স্ক্যান করা হয়।',
        realWorldExampleEn:
          'Emergency brain hemorrhages prioritize rapid CT scans; complex brain tumors and knee ligament tears require MRI.',
        formulaLatex: '\\text{CT: Rotating X-Ray (Ionizing)}, \\quad \\text{MRI: } ^1\\text{H Proton Resonance (Non-ionizing)}',
      },
      {
        id: 'node-ecg-heart',
        titleBn: 'ইসিজি ও কার্ডিয়াক সংকেত',
        titleEn: 'ECG & Cardiac Bio-potentials',
        descriptionBn:
          'হৃদপিণ্ডের অলিন্দ ও নিলয়ের সংকোচন ও প্রসারণের সময় পেশি কোষে অতি সূক্ষ্ম মিলিভোল্ট মাত্রার তড়িৎ বিভব পার্থক্য সৃষ্টি হয়। ত্বকের সাথে ইলেক্ট্রোড লাগিয়ে এই তড়িৎ সংকেত গ্রাফ পেপারে লিপিবদ্ধ করাকে ইসিজি (Electrocardiogram) বলে। P-তরঙ্গ অলিন্দের সংকোচন, QRS-কমপ্লেক্স নিলয়ের সংকোচন এবং T-তরঙ্গ নিলয়ের শিথিল অবস্থা নির্দেশ করে।',
        descriptionEn:
          'ECG records microvolt cardiac dipole potentials via skin electrodes. P-wave indicates atrial depolarization, QRS denotes ventricular depolarization, and T-wave marks ventricular repolarization.',
        iconName: 'HeartPulse',
        realWorldExampleBn:
          'বুকে তীব্র ব্যথা হলে হার্ট অ্যাটাক হয়েছে কি না তা তাৎক্ষণিকভাবে নিশ্চিত হতে জরুরি বিভাগে প্রথম পরীক্ষাটিই হলো ইসিজি।',
        realWorldExampleEn:
          'Emergency room diagnosis of myocardial infarction relies on immediate ST-segment elevation on a 12-lead ECG.',
        formulaLatex: '\\text{ECG Cycle: P-wave } \\to \\text{ QRS complex } \\to \\text{ T-wave}',
      },
      {
        id: 'node-endoscopy-fiber',
        titleBn: 'এন্ডোস্কোপি ও অভ্যন্তরীণ পরীক্ষা',
        titleEn: 'Endoscopy & Optical Probes',
        descriptionBn:
          'শরীরে কোনো অস্ত্রোপচার ছাড়া নমনীয় অপটিক্যাল ফাইবার টিউব মুখ বা অন্য কোনো প্রাকৃতিক পথ দিয়ে প্রবেশ করিয়ে শরীরের ভেতরের ফাঁপা অঙ্গের (পাকস্থলী, খাদ্যনালী, ফুসফুস) সরাসরি ভিডিও চিত্র পর্যবেক্ষণ ও বায়োপসি করার পদ্ধতিকে এন্ডোস্কোপি বলে। এটি আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন মূলনীতিতে কাজ করে।',
        descriptionEn:
          'Endoscopy routes flexible optical fiber bundles through natural orifices to visually inspect internal mucosal linings and perform minimally invasive biopsies via total internal reflection.',
        iconName: 'Zap',
        realWorldExampleBn:
          'পাকস্থলীর আলসার বা গ্যাস্ট্রিক ক্যান্সারের সন্দেহ হলে গ্যাস্ট্রোস্কোপি বা এন্ডোস্কোপি করে ভেতর থেকে ক্যামেরা দিয়ে দেখা হয়।',
        realWorldExampleEn:
          'Upper endoscopy directly visualizes peptic ulcers and captures tissue biopsies for histopathology.',
        formulaLatex: '\\text{Principle: Total Internal Reflection (পূর্ণ অভ্যন্তরীণ প্রতিফলন)}',
      },
      {
        id: 'node-radiotherapy-safety',
        titleBn: 'রেডিওথেরাপি ও বিকিরণ সতর্কতা',
        titleEn: 'Radiotherapy & Radiation Protection',
        descriptionBn:
          'উচ্চ শক্তিসম্পন্ন আয়নায়নকারী বিকিরণ (যেমন কোবাল্ট-৬০ থেকে নির্গত গামা রশ্মি বা লিনিয়ার এক্সিলারেটরের উচ্চ শক্তির এক্স-রে) লক্ষ্য করে ক্যান্সার আক্রান্ত ক্ষতিকর টিউমার কোষের ডিএনএ ধ্বংস করার পদ্ধতিকে রেডিওথেরাপি বলে। সুস্থ কোষ বাঁচাতে নির্দিষ্ট কোণ থেকে কেন্দ্রীভূত রশ্মি ফেলা হয় এবং সুরক্ষায় ভারী সীসার অ্যাপ্রন পরা হয়।',
        descriptionEn:
          'Targeted high-dose ionizing radiation (Cobalt-60 gamma rays or linear accelerators) destroys malignant cancer DNA while sparing healthy surrounding tissues using collimated beam geometry.',
        iconName: 'Shield',
        realWorldExampleBn:
          'ক্যান্সারের টিউমার অপারেশন করার পর অবশিষ্টাংশ ধ্বংস করতে কিংবা টিউমার ছোট করতে রোগীর শরীরে রেডিওথেরাপি দেওয়া হয়।',
        realWorldExampleEn:
          'Oncologists administer conformal beam radiotherapy to shrink tumors prior to surgical resection.',
        formulaLatex: '{^{60}_{27}\\text{Co}} \\to {^{60}_{28}\\text{Ni}} + e^- + 2\\gamma \\quad [\\text{Gamma Ray Therapy}]',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 2: Interactive Sandbox Configuration
  // ----------------------------------------------------
  step2: {
    simulatorType: 'biomedical',
    instructionsBn:
      'চিকিৎসা ডায়াগনস্টিক প্রযুক্তি নির্বাচন করো (ইসিজি, এক্স-রে, আল্ট্রাসাউন্ড, এমআরআই, সিটি স্ক্যান) এবং প্যারামিটার পরিবর্তন করে এর কর্মপদ্ধতি, শারীরিক সংকেত ও বিকিরণ নিরাপত্তা প্রোফাইল পর্যবেক্ষণ করো।',
    instructionsEn:
      'Select diagnostic modalities (ECG, X-Ray, USG, MRI, CT) and adjust technical parameters to examine physical mechanisms, bio-signals, and radiation safety.',
    controls: [
      {
        key: 'heartRateBpm',
        labelBn: 'হৃদস্পন্দনের হার (Heart Rate)',
        labelEn: 'Heart Rate (BPM)',
        defaultValue: 75,
        min: 50,
        max: 140,
        step: 5,
        unit: 'BPM',
        descriptionBn: 'প্রতি মিনিটে হৃদস্পন্দনের সংখ্যা',
      },
      {
        key: 'xrayKv',
        labelBn: 'এক্স-রে টিউব ভোল্টেজ',
        labelEn: 'X-Ray Tube Voltage',
        defaultValue: 70,
        min: 40,
        max: 120,
        step: 5,
        unit: 'kV',
        descriptionBn: 'ইলেকট্রনের গতিশক্তি ও ভেদন ক্ষমতা নির্ধারক',
      },
      {
        key: 'ultrasoundFreqMhz',
        labelBn: 'আল্ট্রাসাউন্ড কম্পাঙ্ক',
        labelEn: 'Ultrasound Frequency',
        defaultValue: 3.5,
        min: 1.0,
        max: 10.0,
        step: 0.5,
        unit: 'MHz',
        descriptionBn: 'ট্রান্সডিউসারের নির্গত শব্দতরঙ্গের কম্পাঙ্ক',
      },
    ],
    keyObservationTipBn:
      'বোর্ড পরীক্ষায় প্রায়ই জানতে চায়: "গর্ভবতী নারীর ক্ষেত্রে এক্স-রে না করে আল্ট্রাসনোগ্রাফি করা উচিত কেন?" উত্তর: এক্স-রে হলো আয়নাইজিং ক্ষতিকর রশ্মি যা ভ্রূণের কোষের জিনগত ক্ষতি করতে পারে। অন্যদিকে আল্ট্রাসনোগ্রাফি হলো অহিংস শব্দতরঙ্গ (Non-ionizing), যার কোনো ক্ষতিকর বিকিরণ নেই।',
    keyObservationTipEn:
      'Essential Board CQ comparison: Ultrasonography uses harmless mechanical sound waves with zero ionization risk, whereas X-rays carry ionizing mutagenic hazards to developing fetal cells.',
  },

  // ----------------------------------------------------
  // STEP 3: Pattern & Formula Decoder
  // ----------------------------------------------------
  step3: {
    coreFormulaLatex:
      '\\lambda_{\\min} = \\frac{hc}{eV} \\quad \\Longleftrightarrow \\quad d = \\frac{v \\times t}{2} \\quad \\Longleftrightarrow \\quad E_{\\text{photon}} = h\\nu',
    variableDefinitions: [
      {
        symbol: '\\lambda_{\\min}',
        nameBn: 'এক্স-রে নলের ন্যূনতম তরঙ্গদৈর্ঘ্য (Cut-off Wavelength)',
        nameEn: 'Minimum X-ray Wavelength',
        siUnit: 'মিটার (m) বা অ্যাংস্ট্রম (Å)',
      },
      {
        symbol: 'V',
        nameBn: 'এক্স-রে নলের বিভব পার্থক্য (Tube Potential)',
        nameEn: 'X-Ray Tube Voltage',
        siUnit: 'ভোল্ট (V)',
      },
      {
        symbol: 'h',
        nameBn: 'প্ল্যাঙ্কের ধ্রুবক ($6.626 \\times 10^{-34}\\text{ J}\\cdot\\text{s}$)',
        nameEn: 'Planck’s Constant',
        siUnit: '$\\text{J}\\cdot\\text{s}$',
      },
      {
        symbol: 'e',
        nameBn: 'ইলেকট্রনের আধান ($1.6 \\times 10^{-19}\\text{ C}$)',
        nameEn: 'Elementary Charge',
        siUnit: 'কুলম্ব (C)',
      },
      {
        symbol: 'v',
        nameBn: 'মানবদেহে শব্দের বেগ (প্রায় $1540\\text{ m/s}$)',
        nameEn: 'Speed of Sound in Soft Tissue',
        siUnit: 'মিটার/সেকেন্ড (m/s)',
      },
      {
        symbol: 't',
        nameBn: 'শব্দ প্রতিধ্বনি ফিরে আসার মোট সময়',
        nameEn: 'Echo Return Time',
        siUnit: 'সেকেন্ড (s)',
      },
      {
        symbol: 'd',
        nameBn: 'অঙ্গের গভীরতা বা বিভেদতলের দূরত্ব',
        nameEn: 'Tissue Interface Depth',
        siUnit: 'মিটার (m)',
      },
    ],
    derivationSteps: [
      {
        stepNumber: 1,
        labelBn: 'এক্স-রে টিউবের ইলেকট্রন শক্তি ও ফোটনের রূপান্তর',
        labelEn: 'X-Ray Kinetic to Photon Energy Conversion',
        latexExpression:
          'E_k = eV = h\\nu_{\\max} = \\frac{hc}{\\lambda_{\\min}} \\implies \\lambda_{\\min} = \\frac{hc}{eV}',
        explanationBn:
          'টিউব বিভব $V$ যত বেশি হবে, উৎপন্ন এক্স-রে তরঙ্গদৈর্ঘ্য তত ক্ষুদ্র হবে এবং ভেদন ক্ষমতা (Hard X-ray) তত বৃদ্ধি পাবে।',
        explanationEn:
          'Higher accelerating tube voltages generate shorter cutoff wavelengths with deeper tissue penetration.',
      },
      {
        stepNumber: 2,
        labelBn: 'আল্ট্রাসাউন্ড প্রতিধ্বনি থেকে অঙ্গের গভীরতা নির্ণয়',
        labelEn: 'Ultrasound Pulse-Echo Depth Equation',
        latexExpression:
          '2d = v \\times t \\implies d = \\frac{v \\times t}{2} \\quad [v_{\\text{body}} \\approx 1540\\text{ m/s}]',
        explanationBn:
          'শব্দ সংকেত ট্রান্সডিউসার থেকে গিয়ে অঙ্গে বাধা পেয়ে আবার ফিরে আসে, তাই মোট পথ $2d$। গভীরতা বের করতে সর্বদা ২ দিয়ে ভাগ করতে হয়।',
        explanationEn:
          'The round-trip travel time $t$ covers twice the organ depth ($2d$). Dividing by 2 yields distance.',
      },
      {
        stepNumber: 3,
        labelBn: 'বিকিরণ শোষণ ও অপবর্তন বৈসাদৃশ্য',
        labelEn: 'Radiographic Density and Attenuation Attainment',
        latexExpression:
          'I = I_0 e^{-\\mu x} \\quad [\\mu_{\\text{হাড়}} \\gg \\mu_{\\text{টিস্যু}}]',
        explanationBn:
          'ক্যালসিয়ামযুক্ত হাড়ের রৈখিক শোষণ গুণাঙ্ক ($\mu$) অত্যন্ত বেশি হওয়ায় এক্স-রে সহজে ভেদ করতে পারে না এবং ফিল্মে স্পষ্ট সাদা কাঠামো ফুটিয়ে তোলে।',
        explanationEn:
          'Bone calcium has high attenuation coefficient $\\mu$, absorbing incident photons to project high-contrast silhouettes.',
      },
    ],
    practicalCalculationExample: {
      problemBn:
        'একটি আল্ট্রাসনোগ্রাফি যন্ত্র থেকে রোগীর লিভারে প্রেরিত অতিস্বনক শব্দতরঙ্গ মানবদেহে $1540\\text{ m/s}$ বেগে গমন করে কোনো টিউমারের বিভেদতলে বাধা পেয়ে $0.04\\text{ ms}$ (মিলি-সেকেন্ড) পর প্রতিধ্বনি হিসেবে ফিরে এলো। (ক) রোগীর ত্বক থেকে টিউমারটির গভীরতা কত? (খ) একটি এক্স-রে মেশিনে ৫০ কিলোভোল্ট ($50\\text{ kV}$) বিভব পার্থক্য প্রয়োগ করা হলে উৎপন্ন এক্স-রের ন্যূনতম তরঙ্গদৈর্ঘ্য ($\\lambda_{\\min}$) কত হবে?',
      problemEn:
        'An ultrasound pulse traveling at $1540\\text{ m/s}$ in tissue reflects off a liver lesion and returns after $0.04\\text{ ms}$. (a) Calculate the depth of the lesion. (b) Find the cutoff wavelength ($\\lambda_{\\min}$) of an X-ray tube operated at $50\\text{ kV}$.',
      solutionStepsBn: [
        '১. আল্ট্রাসাউন্ড গভীরতা: $v = 1540\\text{ m/s}$, সময় $t = 0.04\\text{ ms} = 0.04 \\times 10^{-3}\\text{ s} = 4 \\times 10^{-5}\\text{ s}$।',
        '২. গভীরতার সূত্র: $d = \\frac{v \\times t}{2} = \\frac{1540 \\times (4 \\times 10^{-5})}{2} = \\frac{0.0616}{2} = 0.0308\\text{ m} = 3.08\\text{ cm}$।',
        '৩. এক্স-রে টিউব বিভব: $V = 50\\text{ kV} = 50,000\\text{ V}$।',
        '৪. ন্যূনতম তরঙ্গদৈর্ঘ্য: $\\lambda_{\\min} = \\frac{hc}{eV} = \\frac{(6.626 \\times 10^{-34}) \\times (3 \\times 10^8)}{(1.6 \\times 10^{-19}) \\times 50,000} = \\frac{1.9878 \\times 10^{-25}}{8 \\times 10^{-15}} \\approx 2.485 \\times 10^{-11}\\text{ m} = 0.2485\\text{ Å}$।',
      ],
      solutionStepsEn: [
        '1. Ultrasound parameters: $v = 1540\\text{ m/s}, t = 4 \\times 10^{-5}\\text{ s}$.',
        '2. Depth: $d = (v \\times t) / 2 = (1540 \\times 4 \\times 10^{-5}) / 2 = 0.0308\\text{ m} = 3.08\\text{ cm}$.',
        '3. X-ray potential: $V = 50,000\\text{ V}$.',
        '4. Cutoff wavelength: $\\lambda_{\\min} = hc / eV = \\frac{(6.626 \\times 10^{-34})(3 \\times 10^8)}{(1.6 \\times 10^{-19})(50000)} = 2.485 \\times 10^{-11}\\text{ m} = 0.2485\\text{ Å}$.',
      ],
      finalAnswerWithUnit: 'd = 3.08\\text{ cm}, \\quad \\lambda_{\\min} = 2.485 \\times 10^{-11}\\text{ m}',
    },
  },

  // ----------------------------------------------------
  // STEP 4: Board Traps (Examiner Mark Deductions)
  // ----------------------------------------------------
  step4: {
    traps: [
      {
        id: 'trap-1-ultrasound-echo-halving-omission',
        titleBn: 'আল্ট্রাসাউন্ড প্রতিধ্বনি হিসেবে গভীরতা বের করার সময় ২ দিয়ে ভাগ না করা',
        titleEn: 'Omitting Factor of 2 in Ultrasound Echo Depth Calculations',
        lostMarks: 1,
        frequentlyTestedIn: 'গ-অংশ (প্রয়োগমূলক)',
        commonMistakeBn:
          'ছাত্রছাত্রীরা সরাসরি $d = v \\times t$ গুণ করে দ্বিগুণ গভীরতা বের করে ফেলে!',
        commonMistakeEn:
          'Directly multiplying $d = vt$ without halving for the reflected return path.',
        correctApproachBn:
          'শব্দ সংকেত গিয়ে পুনরায় ফিরে এসেছে। তাই অতিক্রান্ত মোট দূরত্ব $2d = vt \\implies d = \\frac{vt}{2}$।',
        correctApproachEn:
          'Echo pulses traverse the distance twice ($2d$). Depth is strictly $d = vt/2$.',
        examinerSecretTipBn:
          'বোর্ডের গ-অংশে প্রতিধ্বনি অংকে ২ দিয়ে ভাগ না করলে ১ নম্বর কেটে নেওয়া হয়।',
        examinerSecretTipEn:
          'Forgetting to divide round-trip distance by 2 incurs an automatic 1-mark rubric penalty.',
      },
      {
        id: 'trap-2-mri-radiation-misconception',
        titleBn: 'এমআরআই-কে ক্ষতিকর এক্স-রে বা তেজস্ক্রিয় বিকিরণ ভাবা',
        titleEn: 'Falsely Classifying MRI as Ionizing Radioactive Radiation',
        lostMarks: 1,
        frequentlyTestedIn: 'খ ও ঘ-অংশ',
        commonMistakeBn:
          'ছাত্রছাত্রীরা মনে করে এমআরআই-তে উচ্চ ক্ষমতার তেজস্ক্রিয় রশ্মি ব্যবহার করা হয় এবং এটি ক্ষতিকর!',
        commonMistakeEn:
          'Assuming MRI emits radioactive ionizing photons like CT or Radiotherapy.',
        correctApproachBn:
          'এমআরআই-তে কোনো এক্স-রে বা তেজস্ক্রিয়তা নেই। এতে কেবল শক্তিশালী চৌম্বক ক্ষেত্র ও নিরাপদ রেডিও তরঙ্গ ব্যবহার করা হয় (নন-আয়নাইজিং)। তবে রোগীর দেহে ধাতব পেসমেকার থাকলে তীব্র চৌম্বক ক্ষেত্রে তা বিপজ্জনক হতে পারে।',
        correctApproachEn:
          'MRI uses zero ionizing radiation. It relies strictly on static magnetic fields and harmless radiofrequency pulses.',
        examinerSecretTipBn:
          'এমআরআই এর পূর্ণরূপ (Magnetic Resonance Imaging) ও নীতিতে কোনো তেজস্ক্রিয় শব্দ উল্লেখ করলে পরীক্ষক নম্বর কেটে দেবেন।',
        examinerSecretTipEn:
          'Never confuse MRI with ionizing radiation. Mention hydrogen proton spin resonance.',
      },
      {
        id: 'trap-3-endoscopy-optical-principle',
        titleBn: 'এন্ডোস্কোপির আলোর নীতিতে প্রতিসরণ বা প্রতিফলন গুলিয়ে ফেলা',
        titleEn: 'Misidentifying Optical Principle in Endoscopy',
        lostMarks: 1,
        frequentlyTestedIn: 'ক ও খ-অংশ',
        commonMistakeBn:
          'এন্ডোস্কোপিতে শুধু "প্রতিফলন" বা "প্রতিসরণ" লিখে বসা।',
        commonMistakeEn:
          'Writing generic "reflection" or "refraction" instead of Total Internal Reflection.',
        correctApproachBn:
          'উত্তরে স্পষ্ট করে লিখতে হবে: "আলোর পূর্ণ অভ্যন্তরীণ প্রতিফলন (Total Internal Reflection)"। অপটিক্যাল ফাইবারের কোরের মধ্য দিয়ে সংকেত পূর্ণ অভ্যন্তরীণ প্রতিফলিত হয়ে বের হয়।',
        correctApproachEn:
          'Examiners require the precise term "Total Internal Reflection (TIR)" for optical fibers.',
        examinerSecretTipBn:
          'জ্ঞানমূলক ও অনুধাবনে কেবল "পূর্ণ অভ্যন্তরীণ প্রতিফলন" শব্দবন্ধটির জন্যই ১ নম্বর বরাদ্দ থাকে।',
        examinerSecretTipEn:
          'Marking schemes award credit exclusively for the specific phrase "Total Internal Reflection".',
      },
    ],
  },

  // ----------------------------------------------------
  // STEP 5: Rapid Board Quiz
  // ----------------------------------------------------
  step5: {
    quizzes: [
      {
        id: 'q1-ultrasonography-safety-pregnancy',
        questionBn:
          'গর্ভবতী মায়ের গর্ভস্থ ভ্রূণের অবস্থান ও সুস্থতা পর্যবেক্ষণে এক্স-রের পরিবর্তে আল্ট্রাসনোগ্রাফি ব্যবহারের প্রধান বৈজ্ঞানিক কারণ কী?',
        questionEn:
          'What is the primary scientific reason for using Ultrasonography instead of X-Ray for fetal monitoring during pregnancy?',
        questionType: 'MCQ',
        optionsBn: [
          'আল্ট্রাসনোগ্রাফি অহিংস শব্দতরঙ্গ যা সম্পূর্ণ নন-আয়নাইজিং ও ক্ষতিকর বিকিরণমুক্ত',
          'আল্ট্রাসনোগ্রাফি এক্স-রে চেয়ে দ্রুত কাজ করে',
          'আল্ট্রাসনোগ্রাফিতে হাড় স্পষ্ট দেখা যায়',
          'আল্ট্রাসনোগ্রাফিতে বিদ্যুৎ খরচ অনেক কম',
        ],
        optionsEn: [
          'Ultrasound relies on non-ionizing acoustic waves with zero radiation hazard',
          'Ultrasound works faster than X-ray machines',
          'Ultrasound visualizes dense bones better than X-ray',
          'Ultrasound consumes less electrical energy',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'এক্স-রে হলো উচ্চ শক্তির আয়নাইজিং রশ্মি যা ভ্রূণের কোষের জিনগত ক্ষতি ও অঙ্গহানি ঘটাতে পারে। অন্যদিকে আল্ট্রাসনোগ্রাফি হলো সাধারণ অতিউচ্চ কম্পাঙ্কের শব্দতরঙ্গ (নন-আয়নাইজিং), যার কোনো তেজস্ক্রিয় ঝুঁকি নেই। সঠিক উত্তর ক।',
        explanationEn:
          'X-rays are mutagenic ionizing radiation. Ultrasound uses non-ionizing mechanical sound echoes carrying zero radiation hazard. Option A is correct.',
        boardSource: 'ঢাকা বোর্ড ২০২৪ / রাজশাহী বোর্ড ২০২৩',
      },
      {
        id: 'q2-mri-working-element',
        questionBn: 'এমআরআই (MRI) প্রযুক্তিতে মানবদেহের কোন মৌলের পরমাণুর নিউক্লিয়াসের স্পিন অনুরণনকে কাজে লাগানো হয়?',
        questionEn: 'Which atomic nucleus spin resonance in the human body is tracked in Magnetic Resonance Imaging (MRI)?',
        questionType: 'MCQ',
        optionsBn: [
          'হাইড্রোজেন প্রোটন (Hydrogen ¹H)',
          'ক্যালসিয়াম পরমাণু (Calcium ⁴⁰Ca)',
          'লোহার পরমাণু (Iron ⁵⁶Fe)',
          'কার্বন পরমাণু (Carbon ¹²C)',
        ],
        optionsEn: [
          'Hydrogen Proton (¹H)',
          'Calcium (⁴⁰Ca)',
          'Iron (⁵⁶Fe)',
          'Carbon (¹²C)',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'মানবদেহের প্রায় ৭০% পানি ($H_2O$)। পানির হাইড্রোজেন নিউক্লিয়াস (একক প্রোটন) শক্তিশালী চৌম্বক ক্ষেত্রে স্পিন প্রান্তিকীকরণ এবং রেডিও তরঙ্গের অনুরণনে সর্বোচ্চ সংবেদনশীল সংকেত দেয়। সঠিক উত্তর ক।',
        explanationEn:
          'Abundant water ($H_2O$) provides ubiquitous single-proton hydrogen (¹H) nuclei whose magnetic moments align and resonate cleanly. Option A is correct.',
        boardSource: 'দিনাজপুর বোর্ড ২০২৪',
      },
      {
        id: 'q3-ecg-qrs-complex',
        questionBn: 'ইসিজি (ECG) ট্রেসে QRS-কমপ্লেক্স হৃদপিণ্ডের কোন শারীরবৃত্তীয় ঘটনাটি নির্দেশ করে?',
        questionEn: 'In an ECG trace, what cardiac physiological event is represented by the QRS complex?',
        questionType: 'MCQ',
        optionsBn: [
          'নিলয়ের সংকোচন বা ডিপোলারাইজেশন (Ventricular Depolarization)',
          'অলিন্দের সংকোচন বা ডিপোলারাইজেশন (Atrial Depolarization)',
          'নিলয়ের শিথিলকরণ বা রিপোলারাইজেশন (Ventricular Repolarization)',
          'হৃদপিণ্ডের সম্পূর্ণ বিশ্রাম অবস্থা',
        ],
        optionsEn: [
          'Ventricular Depolarization (Contraction)',
          'Atrial Depolarization (Contraction)',
          'Ventricular Repolarization (Relaxation)',
          'Cardiac Complete Rest',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'ইসিজিতে P-তরঙ্গ অলিন্দের সংকোচন, QRS-কমপ্লেক্স শক্তিশালী নিলয়ের সংকোচন (ডিপোলারাইজেশন), এবং T-তরঙ্গ নিলয়ের শিথিলকরণ নির্দেশ করে। সঠিক উত্তর ক।',
        explanationEn:
          'QRS represents ventricular contraction (depolarization), pumping blood out to the lungs and body. Option A is correct.',
        boardSource: 'চট্টগ্রাম বোর্ড ২০২৪',
      },
      {
        id: 'q4-endoscopy-optical-fiber',
        questionBn: 'এন্ডোস্কোপি যন্ত্রে আলোক সংকেত সঞ্চালনের ক্ষেত্রে আলোর কোন ধর্মটি কার্যকর ভূমিকা পালন করে?',
        questionEn: 'Which optical phenomenon enables light propagation through endoscopic fiber bundles?',
        questionType: 'MCQ',
        optionsBn: [
          'পূর্ণ অভ্যন্তরীণ প্রতিফলন (Total Internal Reflection)',
          'আলোর অপবর্তন (Diffraction)',
          'আলোর ব্যতিচার (Interference)',
          'আলোর বিচ্ছুরণ (Dispersion)',
        ],
        optionsEn: [
          'Total Internal Reflection (TIR)',
          'Diffraction of Light',
          'Interference of Light',
          'Dispersion of Light',
        ],
        correctOptionIndex: 0,
        explanationBn:
          'এন্ডোস্কোপির অপটিক্যাল ফাইবার নমনীয় কাঁচতন্তু দিয়ে তৈরি, যার ভেতরের কোরে আলো সংকট কোণের চেয়ে বেশি কোণে আপতিত হয়ে বারবার পূর্ণ অভ্যন্তরীণ প্রতিফলিত হয়ে পথ অতিক্রম করে। সঠিক উত্তর ক।',
        explanationEn:
          'Optical fibers in endoscopes transmit illuminating and imaging beams lossless via continuous total internal reflection. Option A is correct.',
        boardSource: 'বরিশাল বোর্ড ২০২৪ / সিলেট বোর্ড ২০২৩',
      },
    ],
  },
};
