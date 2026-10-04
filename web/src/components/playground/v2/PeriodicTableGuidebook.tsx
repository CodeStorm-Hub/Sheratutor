'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import {
  FlaskConical,
  PanelLeftClose,
  PanelLeftOpen,
  Atom,
  Zap,
  Layers,
  Sparkles,
  ShieldCheck,
  BookOpen,
  CheckCircle2,
  Circle,
  Play,
  RotateCcw,
  Award,
  AlertCircle,
  Copy,
  Send,
  Sliders,
  ChevronDown,
  ChevronRight,
  Eye,
  Info,
  HelpCircle,
  Trophy,
  Bookmark,
  Lightbulb,
  Check,
  X,
  Scale,
  RefreshCw,
  Table,
  Compass,
  ArrowRight,
  Flame,
  Droplets,
  Search,
} from 'lucide-react';
import { useLanguage } from '@/context/LanguageContext';
import { RenderMathText } from '@/components/render-math-text';
import { GuidebookHeaderNav } from './GuidebookHeaderNav';
import { StepNavigationFooter, StepKey } from './StepNavigationFooter';

export type LearningStep = 'concept' | 'example' | 'try' | 'check' | 'summary';

// Element category colors & labels
export type ElementCategory =
  | 'alkali'
  | 'alkaline-earth'
  | 'transition'
  | 'post-transition'
  | 'metalloid'
  | 'nonmetal'
  | 'halogen'
  | 'noble'
  | 'lanthanide'
  | 'actinide';

interface ElementData {
  z: number;
  symbol: string;
  nameBn: string;
  nameEn: string;
  latinName?: string;
  period: number;
  group: number;
  block: 's' | 'p' | 'd' | 'f';
  category: ElementCategory;
  mass: number;
  config: string;
  radiusPm: number; // Picometers
  ieKj: number; // Ionization energy in kJ/mol
  enPauling: number; // Electronegativity (Pauling scale)
  eaKj: number; // Electron affinity in kJ/mol
  funFactBn: string;
  funFactEn: string;
  stateRoomTemp: 'solid' | 'liquid' | 'gas';
}

export const PERIODIC_ELEMENTS: ElementData[] = [
  // Period 1
  {
    z: 1,
    symbol: 'H',
    nameBn: 'হাইড্রোজেন',
    nameEn: 'Hydrogen',
    latinName: 'Hydrogenium',
    period: 1,
    group: 1,
    block: 's',
    category: 'nonmetal',
    mass: 1.008,
    config: '1s¹',
    radiusPm: 53,
    ieKj: 1312,
    enPauling: 2.2,
    eaKj: 73,
    funFactBn: 'মহাবিশ্বের ৭৫% পরমাণুই হাইড্রোজেন! ক্ষার ধাতুর মতো +১ এবং হ্যালোজেনের মতো -১ আধান গঠন করতে পারে।',
    funFactEn: 'Accounts for 75% of universal mass. Can form +1 cation like alkali metals and -1 hydride like halogens.',
    stateRoomTemp: 'gas',
  },
  {
    z: 2,
    symbol: 'He',
    nameBn: 'হিলিয়াম',
    nameEn: 'Helium',
    latinName: 'Helium',
    period: 1,
    group: 18,
    block: 's',
    category: 'noble',
    mass: 4.003,
    config: '1s²',
    radiusPm: 31,
    ieKj: 2372,
    enPauling: 0,
    eaKj: 0,
    funFactBn: 'সূর্যের পৃষ্ঠে প্রথম আবিষ্কৃত হয়। দ্বিত্ব (Duplet) পূর্ণ হওয়ায় এটি তীব্র নিষ্ক্রিয় এবং উড়োজাহাজের টায়ারে ব্যবহৃত হয়।',
    funFactEn: 'First discovered in the Sun’s corona. With a full duplet shell, it is totally unreactive and non-flammable.',
    stateRoomTemp: 'gas',
  },

  // Period 2
  {
    z: 3,
    symbol: 'Li',
    nameBn: 'লিথিয়াম',
    nameEn: 'Lithium',
    latinName: 'Lithium',
    period: 2,
    group: 1,
    block: 's',
    category: 'alkali',
    mass: 6.94,
    config: '1s² 2s¹',
    radiusPm: 152,
    ieKj: 520,
    enPauling: 0.98,
    eaKj: 60,
    funFactBn: 'সবচেয়ে হালকা কঠিন ধাতু। পানির ওপর ভাসে এবং আধুনিক স্মার্টফোনের ব্যাটারির প্রাণশক্তি!',
    funFactEn: 'The lightest metal known. Floats on water and powers modern smartphone lithium-ion batteries.',
    stateRoomTemp: 'solid',
  },
  {
    z: 4,
    symbol: 'Be',
    nameBn: 'বেরিলিয়াম',
    nameEn: 'Beryllium',
    latinName: 'Beryllium',
    period: 2,
    group: 2,
    block: 's',
    category: 'alkaline-earth',
    mass: 9.012,
    config: '1s² 2s²',
    radiusPm: 112,
    ieKj: 899,
    enPauling: 1.57,
    eaKj: 0,
    funFactBn: 'পান্না (Emerald) রত্নপাথরে বেরিলিয়াম থাকে। এর পূর্ণ ২s অরবিটালের কারণে বোরনের চেয়ে আয়নীকরণ শক্তি বেশি!',
    funFactEn: 'Gives emeralds their color. Full 2s² orbital gives it higher ionization energy than Boron.',
    stateRoomTemp: 'solid',
  },
  {
    z: 5,
    symbol: 'B',
    nameBn: 'বোরন',
    nameEn: 'Boron',
    latinName: 'Borium',
    period: 2,
    group: 13,
    block: 'p',
    category: 'metalloid',
    mass: 10.81,
    config: '1s² 2s² 2p¹',
    radiusPm: 85,
    ieKj: 801,
    enPauling: 2.04,
    eaKj: 27,
    funFactBn: 'একটি অপধাতু (উপধাতু)। তাপীয় গ্লাস যেমন বোরোসিলিকেট পাইরেক্স কাচ তৈরিতে ব্যবহৃত হয়।',
    funFactEn: 'A metalloid used to manufacture heat-resistant Pyrex borosilicate glassware.',
    stateRoomTemp: 'solid',
  },
  {
    z: 6,
    symbol: 'C',
    nameBn: 'কার্বন',
    nameEn: 'Carbon',
    latinName: 'Carboneum',
    period: 2,
    group: 14,
    block: 'p',
    category: 'nonmetal',
    mass: 12.011,
    config: '1s² 2s² 2p²',
    radiusPm: 77,
    ieKj: 1086,
    enPauling: 2.55,
    eaKj: 122,
    funFactBn: 'জীবজগতের মেরুদণ্ড! হীরা হলো কঠিনতম প্রাকৃতিক রূপভেদ, আর গ্রাফাইট বিদ্যুৎ সুপরিবাহী।',
    funFactEn: 'Backbone of all organic life. Diamond is the hardest mineral, while graphite conducts electricity.',
    stateRoomTemp: 'solid',
  },
  {
    z: 7,
    symbol: 'N',
    nameBn: 'নাইট্রোজেন',
    nameEn: 'Nitrogen',
    latinName: 'Nitrogenium',
    period: 2,
    group: 15,
    block: 'p',
    category: 'nonmetal',
    mass: 14.007,
    config: '1s² 2s² 2p³',
    radiusPm: 70,
    ieKj: 1402,
    enPauling: 3.04,
    eaKj: 7,
    funFactBn: 'বায়ুমণ্ডলের ৭৮% নাইট্রোজেন। ২p³ অর্ধপূর্ণ উপস্তর অত্যন্ত স্থিতিশীল হওয়ায় এর আয়নীকরণ শক্তি অক্সিজেনের চেয়েও বেশি!',
    funFactEn: 'Makes up 78% of air. Half-filled 2p³ subshell makes its 1st ionization energy higher than Oxygen.',
    stateRoomTemp: 'gas',
  },
  {
    z: 8,
    symbol: 'O',
    nameBn: 'অক্সিজেন',
    nameEn: 'Oxygen',
    latinName: 'Oxygenium',
    period: 2,
    group: 16,
    block: 'p',
    category: 'nonmetal',
    mass: 15.999,
    config: '1s² 2s² 2p⁴',
    radiusPm: 66,
    ieKj: 1314,
    enPauling: 3.44,
    eaKj: 141,
    funFactBn: 'শ্বসন ও দহনের অপরিহার্য গ্যাস। পর্যায় সারণির দ্বিতীয় সর্বাধিক তড়িৎ ঋণাত্মক মৌল (৩.৪৪)।',
    funFactEn: 'Essential for respiration and combustion. Second most electronegative element in the table.',
    stateRoomTemp: 'gas',
  },
  {
    z: 9,
    symbol: 'F',
    nameBn: 'ফ্লোরিন',
    nameEn: 'Fluorine',
    latinName: 'Fluorum',
    period: 2,
    group: 17,
    block: 'p',
    category: 'halogen',
    mass: 18.998,
    config: '1s² 2s² 2p⁵',
    radiusPm: 64,
    ieKj: 1681,
    enPauling: 4.0,
    eaKj: 328,
    funFactBn: 'পর্যায় সারণির সবচেয়ে তীব্র তড়িৎ ঋণাত্মক ও সক্রিয় অধাতু! কাচকেও গলিয়ে দিতে পারে।',
    funFactEn: 'The most electronegative element (4.0). Extremely reactive halogen capable of etching glass.',
    stateRoomTemp: 'gas',
  },
  {
    z: 10,
    symbol: 'Ne',
    nameBn: 'নিয়ন',
    nameEn: 'Neon',
    latinName: 'Neon',
    period: 2,
    group: 18,
    block: 'p',
    category: 'noble',
    mass: 20.18,
    config: '1s² 2s² 2p⁶',
    radiusPm: 58,
    ieKj: 2080,
    enPauling: 0,
    eaKj: 0,
    funFactBn: 'উচ্চ ভোল্টেজে লালচে-কমলা আলো ছড়ায়। আধুনিক বিজ্ঞাপনী নিয়ন সাইনবোর্ডে ব্যবহৃত হয়।',
    funFactEn: 'Glows reddish-orange in high-voltage discharge tubes. Widely used in advertising signboards.',
    stateRoomTemp: 'gas',
  },

  // Period 3
  {
    z: 11,
    symbol: 'Na',
    nameBn: 'সোডিয়াম',
    nameEn: 'Sodium',
    latinName: 'Natrium',
    period: 3,
    group: 1,
    block: 's',
    category: 'alkali',
    mass: 22.99,
    config: '[Ne] 3s¹',
    radiusPm: 186,
    ieKj: 496,
    enPauling: 0.93,
    eaKj: 53,
    funFactBn: 'ল্যাটিন নাম Natrium। নরম ছুরি দিয়ে কাটা যায়; পানিতে ফেললে তীব্র ক্ষার NaOH ও H₂ উৎপন্ন করে বিস্ফোরণ ঘটায়!',
    funFactEn: 'Soft enough to cut with a butter knife. Reacts violently with water releasing flammable H₂.',
    stateRoomTemp: 'solid',
  },
  {
    z: 12,
    symbol: 'Mg',
    nameBn: 'ম্যাগনেসিয়াম',
    nameEn: 'Magnesium',
    latinName: 'Magnesium',
    period: 3,
    group: 2,
    block: 's',
    category: 'alkaline-earth',
    mass: 24.305,
    config: '[Ne] 3s²',
    radiusPm: 160,
    ieKj: 738,
    enPauling: 1.31,
    eaKj: 0,
    funFactBn: 'উদ্ভিদের ক্লোরোফিলের কেন্দ্রে থাকে। পোড়ালে উজ্জ্বল সাদা আলো উৎপন্ন করে (আতশবাজি ও ফ্ল্যাশলাইট)।',
    funFactEn: 'Central metallic atom in plant chlorophyll. Burns with a dazzling white flame in fireworks.',
    stateRoomTemp: 'solid',
  },
  {
    z: 13,
    symbol: 'Al',
    nameBn: 'অ্যালুমিনিয়াম',
    nameEn: 'Aluminium',
    latinName: 'Aluminium',
    period: 3,
    group: 13,
    block: 'p',
    category: 'post-transition',
    mass: 26.982,
    config: '[Ne] 3s² 3p¹',
    radiusPm: 143,
    ieKj: 578,
    enPauling: 1.61,
    eaKj: 42,
    funFactBn: 'ভূত্বকের সবচেয়ে বেশি থাকা ধাতু। হালকা ও টেকসই হওয়ায় উড়োজাহাজের বডি এবং জানালার থাই অ্যালুমিনিয়ামে ব্যবহৃত হয়।',
    funFactEn: 'Most abundant metal in Earth’s crust. Lightweight alloy used in aircraft bodies and foil.',
    stateRoomTemp: 'solid',
  },
  {
    z: 14,
    symbol: 'Si',
    nameBn: 'সিলিকন',
    nameEn: 'Silicon',
    latinName: 'Silicium',
    period: 3,
    group: 14,
    block: 'p',
    category: 'metalloid',
    mass: 28.085,
    config: '[Ne] 3s² 3p²',
    radiusPm: 118,
    ieKj: 786,
    enPauling: 1.9,
    eaKj: 134,
    funFactBn: 'আধুনিক কম্পিউটার ও চিপ বিপ্লবের ভিত্তি (সিলিকন ভ্যালি)। বালুকা কণার মূল উপাদান SiO₂।',
    funFactEn: 'The heartbeat of semiconductor microchips and Silicon Valley. Primary component of quartz sand.',
    stateRoomTemp: 'solid',
  },
  {
    z: 15,
    symbol: 'P',
    nameBn: 'ফসফরাস',
    nameEn: 'Phosphorus',
    latinName: 'Phosphorus',
    period: 3,
    group: 15,
    block: 'p',
    category: 'nonmetal',
    mass: 30.974,
    config: '[Ne] 3s² 3p³',
    radiusPm: 110,
    ieKj: 1012,
    enPauling: 2.19,
    eaKj: 72,
    funFactBn: 'দিয়াশলাইয়ের বারুদে লাল ফসফরাস থাকে। DNA অণুর ফসফেট ব্যাকবোন এবং আমাদের হাড় গঠনে অত্যাবশ্যক।',
    funFactEn: 'Red phosphorus coats matchboxes. Vital for DNA backbone and bone phosphate mineral.',
    stateRoomTemp: 'solid',
  },
  {
    z: 16,
    symbol: 'S',
    nameBn: 'সালফার (গন্ধক)',
    nameEn: 'Sulfur',
    latinName: 'Sulfur',
    period: 3,
    group: 16,
    block: 'p',
    category: 'nonmetal',
    mass: 32.06,
    config: '[Ne] 3s² 3p⁴',
    radiusPm: 103,
    ieKj: 1000,
    enPauling: 2.58,
    eaKj: 200,
    funFactBn: 'হলুদ রঙের কঠিন অধাতু। শিল্পায়নের মানদণ্ড সালফিউরিক এসিড (H₂SO₄) এবং গানপাউডারে ব্যবহৃত হয়।',
    funFactEn: 'Yellow solid used to synthesize sulfuric acid, the king of industrial chemicals.',
    stateRoomTemp: 'solid',
  },
  {
    z: 17,
    symbol: 'Cl',
    nameBn: 'ক্লোরিন',
    nameEn: 'Chlorine',
    latinName: 'Chlorum',
    period: 3,
    group: 17,
    block: 'p',
    category: 'halogen',
    mass: 35.45,
    config: '[Ne] 3s² 3p⁵',
    radiusPm: 100,
    ieKj: 1251,
    enPauling: 3.16,
    eaKj: 349,
    funFactBn: 'পর্যায় সারণির সর্বোচ্চ ইলেকট্রন আসক্তির মৌল (৩৪৯ kJ/mol)! খাবার লবণ (NaCl) ও ব্লিচিং পাউডারের প্রধান উপাদান।',
    funFactEn: 'Holds the highest electron affinity in the periodic table (349 kJ/mol). Forms table salt NaCl.',
    stateRoomTemp: 'gas',
  },
  {
    z: 18,
    symbol: 'Ar',
    nameBn: 'আর্গন',
    nameEn: 'Argon',
    latinName: 'Argon',
    period: 3,
    group: 18,
    block: 'p',
    category: 'noble',
    mass: 39.948,
    config: '[Ne] 3s² 3p⁶',
    radiusPm: 98,
    ieKj: 1520,
    enPauling: 0,
    eaKj: 0,
    funFactBn: 'গ্রিক শব্দ Argon মানে "অলস"। সাধারণ বৈদ্যুতিক বাল্বের ফিলামেন্ট সুরক্ষায় নিষ্ক্রিয় গ্যাস হিসেবে ব্যবহৃত হয়।',
    funFactEn: 'Greek for "lazy / inactive". Fills incandescent light bulbs to protect hot tungsten filaments.',
    stateRoomTemp: 'gas',
  },

  // Period 4 Key Elements
  {
    z: 19,
    symbol: 'K',
    nameBn: 'পটাশিয়াম',
    nameEn: 'Potassium',
    latinName: 'Kalium',
    period: 4,
    group: 1,
    block: 's',
    category: 'alkali',
    mass: 39.098,
    config: '[Ar] 4s¹',
    radiusPm: 227,
    ieKj: 419,
    enPauling: 0.82,
    eaKj: 48,
    funFactBn: 'ল্যাটিন নাম Kalium। ১৯তম ইলেকট্রন ৩d তে না গিয়ে ৪s এ প্রবেশ করে কারণ ৪s এর (n+l) শক্তি কম!',
    funFactEn: 'Latin Kalium. 19th electron fills 4s rather than 3d due to lower Aufbau (n+l) energy.',
    stateRoomTemp: 'solid',
  },
  {
    z: 20,
    symbol: 'Ca',
    nameBn: 'ক্যালসিয়াম',
    nameEn: 'Calcium',
    latinName: 'Calcium',
    period: 4,
    group: 2,
    block: 's',
    category: 'alkaline-earth',
    mass: 40.078,
    config: '[Ar] 4s²',
    radiusPm: 197,
    ieKj: 590,
    enPauling: 1.0,
    eaKj: 2,
    funFactBn: 'মৃৎক্ষার ধাতু; মাটিতে এর যৌগ CaCO₃ পাওয়া যায়। আমাদের হাড় ও দাঁত মজবুত রাখতে অপরিহার্য।',
    funFactEn: 'Alkaline earth metal abundant in soil limestone CaCO₃. Essential for bones and teeth.',
    stateRoomTemp: 'solid',
  },
  {
    z: 21,
    symbol: 'Sc',
    nameBn: 'স্ক্যান্ডিয়াম',
    nameEn: 'Scandium',
    latinName: 'Scandium',
    period: 4,
    group: 3,
    block: 'd',
    category: 'transition',
    mass: 44.956,
    config: '[Ar] 3d¹ 4s²',
    radiusPm: 162,
    ieKj: 633,
    enPauling: 1.36,
    eaKj: 18,
    funFactBn: 'মেন্ডেলিফ যার ভবিষ্যদ্বাণী করেছিলেন "একা-বোরন" হিসেবে! প্রথম d-ব্লক মৌল।',
    funFactEn: 'Predicted by Mendeleev as "Eka-Boron". The very first d-block element in period 4.',
    stateRoomTemp: 'solid',
  },
  {
    z: 24,
    symbol: 'Cr',
    nameBn: 'ক্রোমিয়াম',
    nameEn: 'Chromium',
    latinName: 'Chromium',
    period: 4,
    group: 6,
    block: 'd',
    category: 'transition',
    mass: 51.996,
    config: '[Ar] 3d⁵ 4s¹',
    radiusPm: 128,
    ieKj: 653,
    enPauling: 1.66,
    eaKj: 64,
    funFactBn: 'ব্যতিক্রমী ইলেকট্রন বিন্যাস [Ar] 3d⁵ 4s¹। অর্ধপূর্ণ d⁵ অধিক স্থিতিশীলতার জন্য ৪s থেকে ইলেকট্রন নেয়। গ্রুপ ৬।',
    funFactEn: 'Exception [Ar] 3d⁵ 4s¹ for half-filled d-orbital stability. Belongs to Group 6 (5+1).',
    stateRoomTemp: 'solid',
  },
  {
    z: 26,
    symbol: 'Fe',
    nameBn: 'লোহা (আয়রন)',
    nameEn: 'Iron',
    latinName: 'Ferrum',
    period: 4,
    group: 8,
    block: 'd',
    category: 'transition',
    mass: 55.845,
    config: '[Ar] 3d⁶ 4s²',
    radiusPm: 126,
    ieKj: 762,
    enPauling: 1.83,
    eaKj: 15,
    funFactBn: 'রক্তের হিমোগ্লোবিনে Fe²⁺ হিসেবে অক্সিজেন পরিবহন করে। গ্রুপ ৮ (৬+২) অবস্থান্তর ধাতু।',
    funFactEn: 'Binds O₂ in blood hemoglobin. Group 8 transition metal forming magnetic compounds.',
    stateRoomTemp: 'solid',
  },
  {
    z: 29,
    symbol: 'Cu',
    nameBn: 'তামা (কপার)',
    nameEn: 'Copper',
    latinName: 'Cuprum',
    period: 4,
    group: 11,
    block: 'd',
    category: 'transition',
    mass: 63.546,
    config: '[Ar] 3d¹⁰ 4s¹',
    radiusPm: 128,
    ieKj: 745,
    enPauling: 1.9,
    eaKj: 118,
    funFactBn: 'মুদ্রা ধাতু (Coinage Metal)। সম্পূর্ণ পূর্ণ d¹⁰ কাঠামোর জন্য ব্যতিক্রমী [Ar] 3d¹⁰ 4s¹। চমৎকার বিদ্যুৎ সুপরিবাহী।',
    funFactEn: 'Ancient coinage metal. Exception [Ar] 3d¹⁰ 4s¹ for filled d¹⁰ stability. Superior conductor.',
    stateRoomTemp: 'solid',
  },
  {
    z: 30,
    symbol: 'Zn',
    nameBn: 'দস্তা (জিঙ্ক)',
    nameEn: 'Zinc',
    latinName: 'Zincum',
    period: 4,
    group: 12,
    block: 'd',
    category: 'transition',
    mass: 65.38,
    config: '[Ar] 3d¹⁰ 4s²',
    radiusPm: 134,
    ieKj: 906,
    enPauling: 1.65,
    eaKj: 0,
    funFactBn: 'লোহায় মরিচা প্রতিরোধে গ্যালভানাইজিং প্রলেপ হিসেবে ব্যবহৃত হয়। উদ্ভিদের উৎসেচকের জন্য দরকারি।',
    funFactEn: 'Coats steel in galvanization to prevent rust. Critical enzyme activator in living cells.',
    stateRoomTemp: 'solid',
  },
  {
    z: 35,
    symbol: 'Br',
    nameBn: 'ব্রোমিন',
    nameEn: 'Bromine',
    latinName: 'Bromum',
    period: 4,
    group: 17,
    block: 'p',
    category: 'halogen',
    mass: 79.904,
    config: '[Ar] 3d¹⁰ 4s² 4p⁵',
    radiusPm: 114,
    ieKj: 1140,
    enPauling: 2.96,
    eaKj: 325,
    funFactBn: 'কক্ষ তাপমাত্রায় তরল একমাত্র অধাতু! তীব্র লালচে-বাদামি রঙের উদ্বায়ী তরল।',
    funFactEn: 'The only nonmetal liquid at room temperature! Volatile reddish-brown halogen.',
    stateRoomTemp: 'liquid',
  },
  {
    z: 36,
    symbol: 'Kr',
    nameBn: 'ক্রিপ্টন',
    nameEn: 'Krypton',
    latinName: 'Krypton',
    period: 4,
    group: 18,
    block: 'p',
    category: 'noble',
    mass: 83.798,
    config: '[Ar] 3d¹⁰ 4s² 4p⁶',
    radiusPm: 112,
    ieKj: 1351,
    enPauling: 3.0,
    eaKj: 0,
    funFactBn: 'গ্রিক "kryptos" মানে লুকানো। এয়ারপোর্টের রানওয়ের উচ্চগতির ফ্ল্যাশ লাইটে ব্যবহৃত হয়।',
    funFactEn: 'Greek for "hidden". Used in high-speed photography flashes and airport runways.',
    stateRoomTemp: 'gas',
  },

  // Famous Heavy Elements for board questions
  {
    z: 47,
    symbol: 'Ag',
    nameBn: 'রূপা (সিলভার)',
    nameEn: 'Silver',
    latinName: 'Argentum',
    period: 5,
    group: 11,
    block: 'd',
    category: 'transition',
    mass: 107.87,
    config: '[Kr] 4d¹⁰ 5s¹',
    radiusPm: 144,
    ieKj: 731,
    enPauling: 1.93,
    eaKj: 126,
    funFactBn: 'ল্যাটিন Argentum। মুদ্রা ধাতু এবং পৃথিবীর সমস্ত ধাতুর মধ্যে সর্বোচ্চ বিদ্যুৎ ও তাপ পরিবাহী!',
    funFactEn: 'Latin Argentum. The single best electrical and thermal conductor of all elements.',
    stateRoomTemp: 'solid',
  },
  {
    z: 53,
    symbol: 'I',
    nameBn: 'আয়োডিন',
    nameEn: 'Iodine',
    latinName: 'Iodum',
    period: 5,
    group: 17,
    block: 'p',
    category: 'halogen',
    mass: 126.9,
    config: '[Kr] 4d¹⁰ 5s² 5p⁵',
    radiusPm: 133,
    ieKj: 1008,
    enPauling: 2.66,
    eaKj: 295,
    funFactBn: 'বেগুনি বাষ্পে রূপান্তরযোগ্য ঊর্ধ্বপাতিত কঠিন হ্যালোজেন। থাইরয়েড গ্রন্থি ও গলগণ্ড রোগ প্রতিরোধে দরকার।',
    funFactEn: 'Sublimates directly into purple vapor. Essential nutrient to prevent thyroid goiter.',
    stateRoomTemp: 'solid',
  },
  {
    z: 79,
    symbol: 'Au',
    nameBn: 'স্বর্ণ (গোল্ড)',
    nameEn: 'Gold',
    latinName: 'Aurum',
    period: 6,
    group: 11,
    block: 'd',
    category: 'transition',
    mass: 196.97,
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s¹',
    radiusPm: 144,
    ieKj: 890,
    enPauling: 2.54,
    eaKj: 223,
    funFactBn: 'ল্যাটিন Aurum মানে "দীপ্তিময় প্রভাত"। ক্ষয়রোধী অভিজাত মুদ্রা ধাতু; বাতাসে কখনোই মরিচা ধরে না!',
    funFactEn: 'Latin Aurum. Noble coinage metal that does not oxidize or tarnish in air over millenia.',
    stateRoomTemp: 'solid',
  },
  {
    z: 80,
    symbol: 'Hg',
    nameBn: 'পারদ (মার্কারি)',
    nameEn: 'Mercury',
    latinName: 'Hydrargyrum',
    period: 6,
    group: 12,
    block: 'd',
    category: 'transition',
    mass: 200.59,
    config: '[Xe] 4f¹⁴ 5d¹⁰ 6s²',
    radiusPm: 151,
    ieKj: 1007,
    enPauling: 2.0,
    eaKj: 0,
    funFactBn: 'ল্যাটিন Hydrargyrum মানে "তরল রূপা"। কক্ষ তাপমাত্রায় তরল একমাত্র ধাতু! থার্মোমিটারে ব্যবহৃত হয়।',
    funFactEn: 'Latin Hydrargyrum (liquid silver). Only metal liquid at room temperature.',
    stateRoomTemp: 'liquid',
  },
];

// Helper to determine Category styles
export const CATEGORY_CONFIG: Record<
  ElementCategory,
  {
    nameBn: string;
    nameEn: string;
    bgClass: string;
    badgeClass: string;
    borderClass: string;
    dotClass: string;
  }
> = {
  alkali: {
    nameBn: 'ক্ষার ধাতু (Group 1)',
    nameEn: 'Alkali Metals (Group 1)',
    bgClass: 'bg-rose-500/10 hover:bg-rose-500/20 text-rose-700 dark:text-rose-300 border-rose-500/30',
    badgeClass: 'bg-rose-500/15 text-rose-700 dark:text-rose-400 border-rose-500/30',
    borderClass: 'border-rose-500',
    dotClass: 'bg-rose-500',
  },
  'alkaline-earth': {
    nameBn: 'মৃৎক্ষার ধাতু (Group 2)',
    nameEn: 'Alkaline Earth (Group 2)',
    bgClass: 'bg-amber-500/10 hover:bg-amber-500/20 text-amber-700 dark:text-amber-300 border-amber-500/30',
    badgeClass: 'bg-amber-500/15 text-amber-700 dark:text-amber-400 border-amber-500/30',
    borderClass: 'border-amber-500',
    dotClass: 'bg-amber-500',
  },
  transition: {
    nameBn: 'অবস্থান্তর মৌল (Groups 3-12)',
    nameEn: 'Transition Metals (Groups 3-12)',
    bgClass: 'bg-blue-500/10 hover:bg-blue-500/20 text-blue-700 dark:text-blue-300 border-blue-500/30',
    badgeClass: 'bg-blue-500/15 text-blue-700 dark:text-blue-400 border-blue-500/30',
    borderClass: 'border-blue-500',
    dotClass: 'bg-blue-500',
  },
  'post-transition': {
    nameBn: 'পরবর্তী ধাতু',
    nameEn: 'Post-Transition Metals',
    bgClass: 'bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-700 dark:text-cyan-300 border-cyan-500/30',
    badgeClass: 'bg-cyan-500/15 text-cyan-700 dark:text-cyan-400 border-cyan-500/30',
    borderClass: 'border-cyan-500',
    dotClass: 'bg-cyan-500',
  },
  metalloid: {
    nameBn: 'অপধাতু / উপধাতু',
    nameEn: 'Metalloids / Semimetals',
    bgClass: 'bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-700 dark:text-emerald-300 border-emerald-500/30',
    badgeClass: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-400 border-emerald-500/30',
    borderClass: 'border-emerald-500',
    dotClass: 'bg-emerald-500',
  },
  nonmetal: {
    nameBn: 'সক্রিয় অধাতু',
    nameEn: 'Reactive Nonmetals',
    bgClass: 'bg-teal-500/10 hover:bg-teal-500/20 text-teal-700 dark:text-teal-300 border-teal-500/30',
    badgeClass: 'bg-teal-500/15 text-teal-700 dark:text-teal-400 border-teal-500/30',
    borderClass: 'border-teal-500',
    dotClass: 'bg-teal-500',
  },
  halogen: {
    nameBn: 'হ্যালোজেন (Group 17)',
    nameEn: 'Halogens (Group 17)',
    bgClass: 'bg-indigo-500/10 hover:bg-indigo-500/20 text-indigo-700 dark:text-indigo-300 border-indigo-500/30',
    badgeClass: 'bg-indigo-500/15 text-indigo-700 dark:text-indigo-400 border-indigo-500/30',
    borderClass: 'border-indigo-500',
    dotClass: 'bg-indigo-500',
  },
  noble: {
    nameBn: 'নিষ্ক্রিয় গ্যাস (Group 18)',
    nameEn: 'Noble Gases (Group 18)',
    bgClass: 'bg-purple-500/10 hover:bg-purple-500/20 text-purple-700 dark:text-purple-300 border-purple-500/30',
    badgeClass: 'bg-purple-500/15 text-purple-700 dark:text-purple-400 border-purple-500/30',
    borderClass: 'border-purple-500',
    dotClass: 'bg-purple-500',
  },
  lanthanide: {
    nameBn: 'ল্যান্থানাইড সারি',
    nameEn: 'Lanthanides',
    bgClass: 'bg-amber-600/10 hover:bg-amber-600/20 text-amber-800 dark:text-amber-200 border-amber-600/30',
    badgeClass: 'bg-amber-600/15 text-amber-800 dark:text-amber-300 border-amber-600/30',
    borderClass: 'border-amber-600',
    dotClass: 'bg-amber-600',
  },
  actinide: {
    nameBn: 'অ্যাকটিনাইড সারি',
    nameEn: 'Actinides',
    bgClass: 'bg-red-600/10 hover:bg-red-600/20 text-red-800 dark:text-red-200 border-red-600/30',
    badgeClass: 'bg-red-600/15 text-red-800 dark:text-red-300 border-red-600/30',
    borderClass: 'border-red-600',
    dotClass: 'bg-red-600',
  },
};

// 5 Board MCQs
interface BoardMCQ {
  id: number;
  questionBn: string;
  questionEn: string;
  boardInfoBn: string;
  boardInfoEn: string;
  options: {
    key: string;
    textBn: string;
    textEn: string;
  }[];
  correctKey: string;
  explanationBn: string;
  explanationEn: string;
}

const BOARD_MCQS: BoardMCQ[] = [
  {
    id: 1,
    questionBn: 'আধুনিক পর্যায় সারণির মূল ভিত্তি কী?',
    questionEn: 'What is the fundamental basis of the Modern Periodic Table?',
    boardInfoBn: 'ঢাকা বোর্ড ২০১৯, কুমিল্লা বোর্ড ২০২৩',
    boardInfoEn: 'Dhaka Board 2019, Cumilla Board 2023',
    options: [
      { key: 'A', textBn: 'পারমাণবিক ভর (Atomic Mass)', textEn: 'Atomic Mass' },
      { key: 'B', textBn: 'পারমাণবিক সংখ্যা (ইলেকট্রন বিন্যাস)', textEn: 'Atomic Number (Electron Configuration)' },
      { key: 'C', textBn: 'আইসোটোপ প্রাচুর্য', textEn: 'Isotopic Abundance' },
      { key: 'D', textBn: 'যোজ্যতা ইলেকট্রন সংখ্যা', textEn: 'Valence Electron Number' },
    ],
    correctKey: 'B',
    explanationBn:
      'বিজ্ঞানী মোসলে (১৯১৩) পারমাণবিক সংখ্যা ভিত্তিক আধুনিক পর্যায় সূত্র দেন। পারমাণবিক সংখ্যার পরিবর্তনের সাথে সাথে ইলেকট্রন বিন্যাস পরিবর্তিত হয়, যা মৌলিক ধর্মের নিয়ন্ত্রক।',
    explanationEn:
      'Henry Moseley (1913) formulated the modern periodic law based on atomic number. Electronic configuration dictates chemical characteristics.',
  },
  {
    id: 2,
    questionBn: 'নিচের কোন মৌলটির পারমাণবিক আকার সবচেয়ে ছোট?',
    questionEn: 'Which of the following elements has the smallest atomic size?',
    boardInfoBn: 'রাজশাহী বোর্ড ২০২২, যশোর বোর্ড ২০২০',
    boardInfoEn: 'Rajshahi Board 2022, Jashore Board 2020',
    options: [
      { key: 'A', textBn: '১১Na (সোডিয়াম)', textEn: '11Na (Sodium)' },
      { key: 'B', textBn: '১২Mg (ম্যাগনেসিয়াম)', textEn: '12Mg (Magnesium)' },
      { key: 'C', textBn: '১৩Al (অ্যালুমিনিয়াম)', textEn: '13Al (Aluminium)' },
      { key: 'D', textBn: '১৪Si (সিলিকন)', textEn: '14Si (Silicon)' },
    ],
    correctKey: 'D',
    explanationBn:
      'মৌলগুলো সবাই ৩য় পর্যায়ের। একই পর্যায়ে বাম থেকে ডানে গেলে নতুন স্তর যুক্ত না হয়ে প্রোটন সংখ্যা বাড়ে, ফলে নিউক্লিয়াসের আকর্ষণ বৃদ্ধির কারণে পরমাণুর আকার হ্রাস পায়। সুতরাং Na > Mg > Al > Si।',
    explanationEn:
      'All are in Period 3. From left to right, effective nuclear charge increases without adding shells, pulling electrons tighter. Hence Si is the smallest.',
  },
  {
    id: 3,
    questionBn: 'নাইট্রোজেন (N, Z=7) ও অক্সিজেন (O, Z=8) এর মধ্যে কার ১ম আয়নীকরণ শক্তি বেশি এবং কেন?',
    questionEn: 'Between Nitrogen (Z=7) and Oxygen (Z=8), which has higher 1st ionization energy and why?',
    boardInfoBn: 'দিনাজপুর বোর্ড ২০২৩, চট্টগ্রাম বোর্ড ২০২১',
    boardInfoEn: 'Dinajpur Board 2023, Chattogram Board 2021',
    options: [
      { key: 'A', textBn: 'অক্সিজেন, কারণ এর পারমাণবিক ভর বেশি', textEn: 'Oxygen, because atomic mass is higher' },
      { key: 'B', textBn: 'নাইট্রোজেন, কারণ এর 2p³ উপস্তর অর্ধপূর্ণ ও সুস্থিত', textEn: 'Nitrogen, because half-filled 2p³ is highly stable' },
      { key: 'C', textBn: 'অক্সিজেন, কারণ এটি ডানে অবস্থিত', textEn: 'Oxygen, because it is located to the right' },
      { key: 'D', textBn: 'উভয়ের সমান', textEn: 'Both are equal' },
    ],
    correctKey: 'B',
    explanationBn:
      'নাইট্রোজেনের ইলেকট্রন বিন্যাস 1s² 2s² 2p³। হুন্ডের নিয়ম অনুসারে অর্ধপূর্ণ (Half-filled) উপস্তর অধিক সুস্থিত হওয়ায় ইলেকট্রন অপসারণ করতে অক্সিজেনের (2p⁴) চেয়ে বেশি শক্তির প্রয়োজন হয়।',
    explanationEn:
      'Nitrogen has half-filled 2p³ configuration, giving it extra quantum mechanical exchange stability compared to Oxygen (2p⁴).',
  },
  {
    id: 4,
    questionBn: 'হ্যালোজেন গ্রুপের মৌলসমূহের মধ্যে কোনটির ইলেকট্রন আসক্তি (Electron Affinity) সর্বাধিক?',
    questionEn: 'Which halogen element has the highest electron affinity?',
    boardInfoBn: 'বরিশাল বোর্ড ২০২২, সিলেট বোর্ড ২০১৯',
    boardInfoEn: 'Barishal Board 2022, Sylhet Board 2019',
    options: [
      { key: 'A', textBn: 'ফ্লোরিন (F)', textEn: 'Fluorine (F)' },
      { key: 'B', textBn: 'ক্লোরিন (Cl)', textEn: 'Chlorine (Cl)' },
      { key: 'C', textBn: 'ব্রোমিন (Br)', textEn: 'Bromine (Br)' },
      { key: 'D', textBn: 'আয়োডিন (I)', textEn: 'Iodine (I)' },
    ],
    correctKey: 'B',
    explanationBn:
      'সাধারণ নিয়মে ফ্লোরিনের বেশি হওয়ার কথা থাকলেও, ফ্লোরিনের ২য় শক্তিস্তরের ক্ষুদ্র আকারের জন্য ইলেকট্রন মেঘের ঘনত্ব খুব বেশি হয় এবং আগত ইলেকট্রন বিকর্ষণের মুখোমুখি হয়। ক্লোরিনের ৩য় স্তর প্রশস্ত হওয়ায় বিকর্ষণ কম এবং এর ইলেকট্রন আসক্তি সর্বোচ্চ (৩৪৯ kJ/mol)।',
    explanationEn:
      'Fluorine’s tiny 2nd shell causes high inter-electronic repulsion. Chlorine’s roomier 3rd shell accommodates the added electron with less repulsion, yielding highest EA (349 kJ/mol).',
  },
  {
    id: 5,
    questionBn: 'লোহা (Fe, পারমাণবিক সংখ্যা ২৬) পর্যায় সারণির কোন গ্রুপে অবস্থিত?',
    questionEn: 'In which group is Iron (Fe, atomic number 26) located?',
    boardInfoBn: 'ময়মনসিংহ বোর্ড ২০২০, ঢাকা বোর্ড ২০২১',
    boardInfoEn: 'Mymensingh Board 2020, Dhaka Board 2021',
    options: [
      { key: 'A', textBn: 'গ্রুপ ২', textEn: 'Group 2' },
      { key: 'B', textBn: 'গ্রুপ ৬', textEn: 'Group 6' },
      { key: 'C', textBn: 'গ্রুপ ৮', textEn: 'Group 8' },
      { key: 'D', textBn: 'গ্রুপ ১০', textEn: 'Group 10' },
    ],
    correctKey: 'C',
    explanationBn:
      'Fe (26) এর ইলেকট্রন বিন্যাস: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁶ 4s²। d-ব্লক মৌলের গ্রুপ নির্ণয়ের নিয়ম ৩ অনুযায়ী: বহিঃস্থ 4s এর ২টি + আগের 3d এর ৬টি = ৬ + ২ = গ্রুপ ৮।',
    explanationEn:
      'Fe (26) configuration: [Ar] 3d⁶ 4s². Rule 3 for d-block: valence 4s² + penultimate 3d⁶ electrons = 6 + 2 = Group 8.',
  },
];


export interface LessonMeta {
  no: string;
  titleBn: string;
  titleEn: string;
  overviewBn: string;
  overviewEn: string;
  studyTipBn: string;
  studyTipEn: string;
  badgeText: string;
}

export const CHAPTER_4_LESSONS: Record<number, LessonMeta> = {
  1: {
    no: '০১',
    titleBn: 'পর্যায় সারণির পটভূমি ও ত্রয়ী/অষ্টক সূত্র',
    titleEn: 'Historical Evolution & Triads/Octaves',
    overviewBn:
      'ল্যাভয়সিয়ের শ্রেণিবিভাগ, ডোবেরাইনারের ত্রয়ী সূত্র, নিউল্যান্ডসের অষ্টক সূত্র ও মেন্ডেলিফের ঐতিহাসিক পর্যায় সারণি।',
    overviewEn:
      'Lavoisier classification, Dobereiner’s triads, Newlands’ octaves, and Mendeleev’s milestone periodic system.',
    studyTipBn: 'ডোবেরাইনারের ত্রয়ী সূত্রে Na এর পারমাণবিক ভর (২৩) হলো Li (৭) ও K (৩৯) এর গড়ের সমান!',
    studyTipEn: 'In Dobereiner’s triad, Sodium’s mass (23) is the exact arithmetic mean of Lithium (7) and Potassium (39)!',
    badgeText: 'পটভূমি ও মেন্ডেলিফ',
  },
  2: {
    no: '০২',
    titleBn: 'আধুনিক পর্যায় সারণির গঠন ও বৈশিষ্ট্য',
    titleEn: 'Structure of the Modern Periodic Table',
    overviewBn:
      '৭টি পর্যায় ও ১৮টি গ্রুপ, ল্যান্থানাইড ও অ্যাক্টিনাইড সারি এবং ১১৮টি মৌলিক পদার্থের নিখুঁত অবস্থান।',
    overviewEn:
      '7 periods and 18 groups, Lanthanide and Actinide series, and systematic classification of 118 elements.',
    studyTipBn: 'পর্যায় ৪ ও ৫ এ ১৮টি করে মৌল থাকে; পর্যায় ৬ ও ৭ এ ল্যান্থানাইড ও অ্যাক্টিনাইডসহ ৩২টি করে মৌল থাকে!',
    studyTipEn: 'Periods 4 & 5 accommodate 18 elements each; Periods 6 & 7 contain 32 elements including rare earths!',
    badgeText: '৭ পর্যায় ও ১৮ গ্রুপ',
  },
  3: {
    no: '০৩',
    titleBn: 'ইলেকট্রন বিন্যাস থেকে গ্রুপ ও পর্যায় নির্ণয়',
    titleEn: 'Determining Period & Group via Configurations',
    overviewBn:
      's-ব্লক, p-ব্লক (+১০ নিয়ম) এবং d-ব্লক (বহিঃস্থ s + পূর্ববর্তী d) এর ৩টি মাস্টার নিয়ম দিয়ে অবস্থান নির্ণয়।',
    overviewEn:
      'Mastering the 3 golden rules for s-block, p-block (+10 rule), and d-block transition element group prediction.',
    studyTipBn: 'p-ব্লক মৌলের গ্রুপ নির্ণয়ে বহিঃস্থ স্তরের ইলেকট্রন সংখ্যার সাথে সর্বদা ১০ যোগ করতে হয়!',
    studyTipEn: 'Always add 10 to valence electrons when predicting group numbers for p-block elements!',
    badgeText: 'অবস্থান নির্ণয়ের ৩ নিয়ম',
  },
  4: {
    no: '০৪',
    titleBn: 'পর্যায়বৃত্ত ধর্ম ও ব্যতিক্রমী ব্যাসার্ধ ল্যাব',
    titleEn: 'Periodic Trends & Exception Lab',
    overviewBn:
      'পারমাণবিক আকার, আয়নীকরণ শক্তি, ইলেকট্রন আসক্তি ও তড়িৎ ঋণাত্মকতা এবং N > O ও Be > B এর ব্যতিক্রমী কারণ।',
    overviewEn:
      'Trends in atomic radius, ionization energy, electron affinity, electronegativity and stability exceptions.',
    studyTipBn: 'অর্ধপূর্ণ উপস্তর (2p³) অধিক স্থিতিশীল হওয়ায় নাইট্রোজেনের প্রথম আয়নীকরণ শক্তি অক্সিজেনের চেয়ে বেশি!',
    studyTipEn: 'Half-filled 2p³ orbital stability causes Nitrogen’s first ionization energy to exceed Oxygen’s!',
    badgeText: 'আকার ও আয়নীকরণ শক্তি',
  },
  5: {
    no: '০৫',
    titleBn: 'বিশেষ মৌল শ্রেণি ও ক্ষার ধাতুর সক্রিয়তা',
    titleEn: 'Special Element Groups & Alkali Reactivity',
    overviewBn:
      'গ্রুপ ১ ক্ষার ধাতু, গ্রুপ ২ মৃৎক্ষার, গ্রুপ ১৭ হ্যালোজেন, গ্রুপ ১৮ নিষ্ক্রিয় গ্যাস ও পরীক্ষাগারে ক্ষার ধাতুর বিক্রিয়া।',
    overviewEn:
      'Alkali metals, alkaline earth metals, halogens, noble gases, and live alkali reaction chamber with water.',
    studyTipBn: 'ক্ষার ধাতু পানির সাথে তীব্র বিক্রিয়া করে তীব্র ক্ষার ও H₂ গ্যাস তৈরি করে, ফেনলফথ্যালিনে দ্রবণ গোলাপি হয়!',
    studyTipEn: 'Alkali metals react violently with water forming caustic hydroxide and H₂ gas, turning phenolphthalein pink!',
    badgeText: 'ক্ষার ধাতু ও হ্যালোজেন',
  },
};

export function PeriodicTableGuidebook() {
  const { language } = useLanguage();
  const isBn = language === 'bn';

  // Navigation State
  const [activeLesson, setActiveLesson] = useState<number>(1);
  const [activeStep, setActiveStep] = useState<LearningStep>('concept');
  const [completedLessons, setCompletedLessons] = useState<number[]>([1]);
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState<boolean>(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState<boolean>(false);

  // Alias for backward compatibility with existing step tabs
  const currentStep = activeStep;
  const setCurrentStep = setActiveStep;

  // AI Chat Drawer State
  const [chatMessages, setChatMessages] = useState<Array<{ role: 'user' | 'ai'; text: string }>>([
    {
      role: 'ai',
      text: isBn
        ? 'স্বাগতম পর্যায় সারণি ল্যাবে! আমি তোমার AI শিক্ষক। মেন্ডেলিফের পর্যায় সূত্র, ইলেকট্রন বিন্যাস থেকে গ্রুপ-পর্যায় নির্ণয়, পারমাণবিক আকার, আয়নীকরণ শক্তি কিংবা ক্ষার ধাতু নিয়ে যেকোনো প্রশ্ন করতে পারো!'
        : 'Welcome to the Periodic Table Lab! I am your AI Chemistry Tutor. Ask me anything about Mendeleev’s table, predicting group/period from electron configuration, atomic radii, ionization energy, or alkali reactions!',
    },
  ]);
  const [chatInput, setChatInput] = useState('');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [copyToast, setCopyToast] = useState(false);

  const currentLessonMeta = CHAPTER_4_LESSONS[activeLesson] || CHAPTER_4_LESSONS[1];
  const progressPercent = Math.min(100, Math.round((completedLessons.length / 5) * 100));

  const handleSendAiMessage = async () => {
    if (!chatInput.trim() || isAiLoading) return;
    const userQuery = chatInput.trim();
    setChatMessages((prev) => [...prev, { role: 'user', text: userQuery }]);
    setChatInput('');
    setIsAiLoading(true);

    try {
      const res = await fetch('/api/tutor/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: userQuery,
          subject: 'chemistry',
          chapter: '4 - পর্যায় সারণি (Periodic Table)',
          context: `বর্তমান পাঠ: ${activeLesson}, ধাপ: ${activeStep}, নির্বাচিত মৌল: ${selectedElement.nameBn} (${selectedElement.symbol}, Z=${selectedElement.z})`,
        }),
      });

      if (res.ok) {
        const data = await res.json();
        setChatMessages((prev) => [
          ...prev,
          {
            role: 'ai',
            text: data.response || data.message || (isBn ? 'উত্তর প্রস্তুত করা হয়েছে!' : 'Answer ready!'),
          },
        ]);
      } else {
        throw new Error('API request failed');
      }
    } catch {
      setTimeout(() => {
        let fallback = isBn
          ? 'পর্যায় সারণি হলো রসায়নের সবচেয়ে সুশৃঙ্খল ভিত্তিপ্রস্তর। মৌলসমূহকে তাদের পারমাণবিক সংখ্যার ক্রমানুসারে সাজানো হলে তাদের ভৌত ও রাসায়নিক ধর্ম পর্যায়ক্রমে আবর্তিত হয়।'
          : 'The periodic table arranges elements by atomic number, causing physical and chemical properties to recur periodically.';

        if (userQuery.toLowerCase().includes('গ্রুপ') || userQuery.toLowerCase().includes('group') || userQuery.toLowerCase().includes('নির্ণয়')) {
          fallback = isBn
            ? 'গ্রুপ নির্ণয়ের ৩টি নিয়ম: ১. বহিঃস্থ s হলে s এর ইলেকট্রনই গ্রুপ; ২. বহিঃস্থ s ও p হলে (s+p)+১০; ৩. বহিঃস্থ s ও পূর্ববর্তী d হলে (d+s) সংখ্যাই গ্রুপ।'
            : '3 rules to determine group: 1. Outer s = valence electrons; 2. Outer s & p = (s+p)+10; 3. Outer s & penultimate d = (d+s) electrons.';
        } else if (userQuery.toLowerCase().includes('আয়নীকরণ') || userQuery.toLowerCase().includes('ionization') || userQuery.toLowerCase().includes('ব্যতিক্রম')) {
          fallback = isBn
            ? 'নাইট্রোজেনের (N, ৭) প্রথম আয়নীকরণ শক্তি অক্সিজেনের (O, ৮) চেয়ে বেশি, কারণ নাইট্রোজেনের 2p উপস্তর সুষমভাবে অর্ধপূর্ণ (2p³), যা অধিকতর স্থিতিশীল।'
            : 'Nitrogen’s 1st ionization energy exceeds Oxygen’s because Nitrogen possesses a half-filled 2p³ configuration giving extra quantum stability.';
        } else if (userQuery.toLowerCase().includes('হিলিয়াম') || userQuery.toLowerCase().includes('helium')) {
          fallback = isBn
            ? 'হিলিয়ামের বিন্যাস 1s² হলেও এটি নিষ্ক্রিয় গ্যাস এবং দ্বিত্ব নিয়মে সম্পূর্ণ সুস্থিত। গ্রুপ ২ এর ধাতু নয় বলে ধর্মের মিলের কারণে একে গ্রুপ ১৮ তে রাখা হয়েছে।'
            : 'Helium is 1s² with full duplet valence shell. Because it is chemically inert matching noble gases, it is classified under Group 18 rather than Group 2.';
        }

        setChatMessages((prev) => [...prev, { role: 'ai', text: fallback }]);
      }, 700);
    } finally {
      setIsAiLoading(false);
    }
  };

  const handleCopySummary = () => {
    const notes = isBn
      ? `SSC রসায়ন অধ্যায় ৪: পর্যায় সারণি (রিভিশন হ্যান্ডনোট)
--------------------------------------------------
১. ঐতিহাসিক পটভূমি:
   - ল্যাভয়সিয়ে (১৭৮৯): ধাতু ও অধাতু শ্রেণিবিভাগ।
   - ডোবেরাইনার (১৮২৯): ত্রয়ী সূত্র (Li, Na, K)।
   - নিউল্যান্ডস (১৮৬৪): অষ্টক সূত্র।
   - মেন্ডেলিফ (১৮৬৯): পর্যায় সূত্র (পারমাণবিক ভর ভিত্তিক, ৬৩টি মৌল)।
   - মোসলে (১৯১৩): আধুনিক পর্যায় সূত্র (পারমাণবিক সংখ্যা ভিত্তিক)।

২. পর্যায় সারণির বৈশিষ্ট্য:
   - ৭টি পর্যায় ও ১৮টি গ্রুপ।
   - ১ম পর্যায়: ২টি মৌল (অতি সংক্ষিপ্ত)।
   - ২য় ও ৩য় পর্যায়: ৮টি করে মৌল (সংক্ষিপ্ত)।
   - ৪র্থ ও ৫ম পর্যায়: ১৮টি করে মৌল (দীর্ঘ)।
   - ৬ষ্ঠ ও ৭ম পর্যায়: ৩২টি করে মৌল (অতি দীর্ঘ, নিচে ল্যান্থানাইড ও অ্যাক্টিনাইড সারি)।

৩. পর্যায় ও গ্রুপ নির্ণয়ের ৩ নিয়ম:
   - নিয়ম ১ (s-ব্লক): বহিঃস্থ s ইলেকট্রন সংখ্যা = গ্রুপ নম্বর।
   - নিয়ম ২ (p-ব্লক): বহিঃস্থ (s + p) + ১০ = গ্রুপ নম্বর।
   - নিয়ম ৩ (d-ব্লক): বহিঃস্থ s + আগের স্তরের d = গ্রুপ নম্বর।

৪. পর্যায়বৃত্ত ধর্ম:
   - পারমাণবিক ব্যাসার্ধ: পর্যায়ে বাম থেকে ডানে হ্রাস পায়, গ্রুপে উপর থেকে নিচে বৃদ্ধি পায়।
   - আয়নীকরণ শক্তি, ইলেকট্রন আসক্তি, তড়িৎ ঋণাত্মকতা: বাম থেকে ডানে বৃদ্ধি পায়, উপর থেকে নিচে হ্রাস পায়।
   - ব্যতিক্রম: Be > B (2s² পূর্ণ) এবং N > O (2p³ অর্ধপূর্ণ); ইলেকট্রন আসক্তিতে Cl > F।
--------------------------------------------------
শেরাটুটোর ভার্চুয়াল গাইডবুক (SheraTutor.com)`
      : `SSC Chemistry Chapter 4: Periodic Table (Revision Notes)
--------------------------------------------------
1. History: Lavoisier, Dobereiner Triads, Newlands Octaves, Mendeleev (mass) to Moseley (atomic number).
2. Modern Table: 7 Periods, 18 Groups, 118 Elements, Lanthanides & Actinides.
3. Group Prediction Rules: s-block (valence e-), p-block (valence e- + 10), d-block (valence s + d).
4. Trends: Radius decreases across period & increases down group. IE, EA, EN increase across period. Exceptions: N > O, Be > B, Cl > F.
--------------------------------------------------
SheraTutor Virtual Guidebook (SheraTutor.com)`;

    navigator.clipboard.writeText(notes);
    setCopyToast(true);
    setTimeout(() => setCopyToast(false), 2500);
  };

  // Simulator 1 State: Element Explorer
  const [selectedElementZ, setSelectedElementZ] = useState<number>(11); // Default Na
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Simulator 2 State: Periodic Trends Comparator
  const [trendType, setTrendType] = useState<'radius' | 'ie' | 'en' | 'ea'>('radius');
  const [trendScope, setTrendScope] = useState<'p2' | 'p3' | 'g1' | 'g17'>('p2');

  // Simulator 3 State: Position Predictor
  const [predictZ, setPredictZ] = useState<number>(26); // Default Fe

  // Simulator 4 State: Alkali Reaction Chamber
  const [alkaliMetal, setAlkaliMetal] = useState<'Li' | 'Na' | 'K'>('Na');
  const [isReacting, setIsReacting] = useState<boolean>(false);
  const [reactionStep, setReactionStep] = useState<number>(0);

  // Quiz State
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, string>>({});
  const [showResults, setShowResults] = useState<boolean>(false);

  // Step 5 CQ Rubric state
  const [openRubric, setOpenRubric] = useState<string | null>('d');

  // Selected element for detailed card
  const selectedElement =
    PERIODIC_ELEMENTS.find((el) => el.z === selectedElementZ) || PERIODIC_ELEMENTS[0];

  // Predictor Calculation helper
  const getPositionPrediction = (z: number) => {
    const el = PERIODIC_ELEMENTS.find((e) => e.z === z);
    if (!el) {
      return {
        symbol: 'X',
        nameBn: 'মৌল',
        nameEn: 'Element',
        period: 0,
        group: 0,
        ruleTextBn: '',
        ruleTextEn: '',
        config: '',
      };
    }

    let ruleBn = '';
    let ruleEn = '';

    if (el.group <= 2) {
      ruleBn = `নিয়ম ১ (s-ব্লক): সর্ববহিঃস্থ স্তরে শুধু s অরবিটালে ইলেকট্রন আছে। s এর ইলেকট্রন সংখ্যাই (${el.group}) এর গ্রুপ নম্বর।`;
      ruleEn = `Rule 1 (s-block): Only s orbital has valence electrons. Valence electron count (${el.group}) equals Group number.`;
    } else if (el.group >= 13 && el.group <= 18) {
      const pCount = el.group - 12;
      ruleBn = `নিয়ম ২ (p-ব্লক): সর্ববহিঃস্থ স্তরে s ও p অরবিটাল আছে। বহিঃস্থ স্তরের ইলেকট্রন সংখ্যার সাথে ১০ যোগ করে গ্রুপ নির্ণয়: (২ + ${pCount} + ১০ = ${el.group})।`;
      ruleEn = `Rule 2 (p-block): Has valence s and p orbitals. Group = valence electrons + 10 = 2 + ${pCount} + 10 = ${el.group}.`;
    } else {
      ruleBn = `নিয়ম ৩ (d-ব্লক): সর্ববহিঃস্থ s অরবিটালের ইলেকট্রন সংখ্যার সাথে পূর্ববর্তী স্তরের d অরবিটালের ইলেকট্রন সংখ্যা যোগ করে গ্রুপ নির্ণয়: (${el.group} নং গ্রুপ)।`;
      ruleEn = `Rule 3 (d-block): Group equals outer s electrons plus penultimate d electrons = Group ${el.group}.`;
    }

    return {
      symbol: el.symbol,
      nameBn: el.nameBn,
      nameEn: el.nameEn,
      period: el.period,
      group: el.group,
      ruleTextBn: ruleBn,
      ruleTextEn: ruleEn,
      config: el.config,
    };
  };

  const predicted = getPositionPrediction(predictZ);

  // Filter elements for Simulator 1
  const filteredElements = PERIODIC_ELEMENTS.filter((el) => {
    if (categoryFilter !== 'all' && el.category !== categoryFilter) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        el.symbol.toLowerCase().includes(q) ||
        el.nameBn.toLowerCase().includes(q) ||
        el.nameEn.toLowerCase().includes(q) ||
        String(el.z) === q
      );
    }
    return true;
  });

  // Trend Scope Elements for Simulator 2
  const getTrendElements = () => {
    switch (trendScope) {
      case 'p2':
        return PERIODIC_ELEMENTS.filter((el) => el.period === 2 && el.z <= 10).sort(
          (a, b) => a.z - b.z
        );
      case 'p3':
        return PERIODIC_ELEMENTS.filter((el) => el.period === 3 && el.z <= 18).sort(
          (a, b) => a.z - b.z
        );
      case 'g1':
        return PERIODIC_ELEMENTS.filter((el) => el.group === 1 && el.z !== 1).sort(
          (a, b) => a.z - b.z
        );
      case 'g17':
        return PERIODIC_ELEMENTS.filter((el) => el.group === 17).sort((a, b) => a.z - b.z);
      default:
        return [];
    }
  };

  const trendElements = getTrendElements();

  const getTrendValue = (el: ElementData) => {
    switch (trendType) {
      case 'radius':
        return { val: el.radiusPm, unit: 'pm', labelBn: 'ব্যাসার্ধ', labelEn: 'Radius' };
      case 'ie':
        return { val: el.ieKj, unit: 'kJ/mol', labelBn: 'আয়নীকরণ শক্তি', labelEn: 'IE' };
      case 'en':
        return { val: el.enPauling, unit: '', labelBn: 'তড়িৎ ঋণাত্মকতা', labelEn: 'EN' };
      case 'ea':
        return { val: el.eaKj, unit: 'kJ/mol', labelBn: 'ইলেকট্রন আসক্তি', labelEn: 'EA' };
    }
  };

  // Alkali reaction trigger
  const triggerAlkaliReaction = () => {
    setIsReacting(true);
    setReactionStep(1);
    setTimeout(() => setReactionStep(2), 1200);
    setTimeout(() => setReactionStep(3), 2600);
    setTimeout(() => {
      setIsReacting(false);
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0B0D13] text-foreground flex flex-col transition-colors selection:bg-cyan-500/20">
      {/* 1. Header Navigation */}
      <GuidebookHeaderNav
        subjectKey="chemistry"
        subjectNameBn="রসায়ন"
        subjectNameEn="Chemistry"
        chapterNum={4}
        chapterTitleBn="পর্যায় সারণি (Periodic Table)"
        chapterTitleEn="Periodic Table & Periodic Properties"
        activeLesson={activeLesson}
        activeLessonTitle={isBn ? currentLessonMeta.titleBn : currentLessonMeta.titleEn}
        isSidebarOpen={isLeftSidebarOpen}
        onToggleSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onOpenAi={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
      />

      {/* Main 3-Column Workspace */}
      <div className="flex-1 flex w-full max-w-[1720px] mx-auto p-3 sm:p-4 lg:p-6 gap-5 items-start">
        {/* ========================================================= */}
        {/* COLUMN 1: LEFT SIDEBAR (Hideable Chapter Rail & Syllabus) */}
        {/* ========================================================= */}
        {isLeftSidebarOpen && (
          <aside className="w-64 sm:w-72 shrink-0 space-y-4 animate-in fade-in duration-200">
            {/* Subject Selector Pill Card */}
            <div className="rounded-2xl border border-border/80 bg-card p-4 shadow-xs space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-muted-foreground">
                  {isBn ? 'শ্রেণি ও বিষয়' : 'Grade & Subject'}
                </span>
                <span className="h-2 w-2 rounded-full bg-cyan-500 animate-pulse" />
              </div>
              <div className="flex items-center gap-2.5 p-2 rounded-xl bg-muted/40 border border-border/50 text-xs font-bold">
                <FlaskConical className="h-4 w-4 text-cyan-600 dark:text-cyan-400" />
                <div>
                  <div className="text-foreground">Class 9–10 (SSC)</div>
                  <div className="text-[10px] text-muted-foreground font-normal">
                    {isBn ? 'রসায়ন (Chemistry) • কোড ১৩৭' : 'Chemistry • Code 137'}
                  </div>
                </div>
              </div>
            </div>

            {/* Chapter Progress & Lessons Card */}
            <div className="rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4">
              <div className="space-y-1">
                <div className="flex items-center justify-between text-xs font-black">
                  <span className="text-cyan-600 dark:text-cyan-400 uppercase tracking-wide">CHAPTER 04</span>
                  <span className="text-muted-foreground font-mono">{progressPercent}%</span>
                </div>
                <h2 className="text-sm font-extrabold text-foreground leading-snug">
                  {isBn ? 'পর্যায় সারণি' : 'Periodic Table'}
                </h2>
                <div className="w-full bg-muted/60 rounded-full h-1.5 overflow-hidden mt-1.5">
                  <div
                    className="bg-cyan-500 h-1.5 rounded-full transition-all duration-500"
                    style={{ width: `${progressPercent}%` }}
                  />
                </div>
              </div>

              {/* 5 Lessons Navigation List */}
              <div className="space-y-1.5 pt-1">
                {[1, 2, 3, 4, 5].map((lNum) => {
                  const meta = CHAPTER_4_LESSONS[lNum];
                  const isCurrent = activeLesson === lNum;
                  const isDone = completedLessons.includes(lNum);

                  return (
                    <button
                      key={lNum}
                      onClick={() => {
                        setActiveLesson(lNum);
                        setActiveStep('concept');
                      }}
                      className={`w-full text-left p-3 rounded-2xl text-xs font-semibold transition-all flex items-start gap-2.5 ${
                        isCurrent
                          ? 'bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 border border-cyan-500/30 shadow-xs'
                          : 'hover:bg-muted/60 text-muted-foreground hover:text-foreground border border-transparent'
                      }`}
                    >
                      <div className="mt-0.5 shrink-0">
                        {isDone ? (
                          <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                        ) : (
                          <div
                            className={`h-4 w-4 rounded-full border flex items-center justify-center text-[9px] font-mono ${
                              isCurrent
                                ? 'border-cyan-500 text-cyan-600 dark:text-cyan-400'
                                : 'border-muted-foreground/40 text-muted-foreground'
                            }`}
                          >
                            {lNum}
                          </div>
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between gap-1">
                          <span className="text-[10px] font-mono text-muted-foreground">
                            {isBn ? `পাঠ ${meta.no}` : `Lesson ${lNum}`}
                          </span>
                          {isCurrent && (
                            <span className="text-[9px] font-bold px-1.5 py-0.2 rounded-full bg-cyan-500/20 text-cyan-700 dark:text-cyan-300">
                              {isBn ? 'সক্রিয়' : 'Active'}
                            </span>
                          )}
                        </div>
                        <div className="font-bold text-xs truncate mt-0.5 text-foreground">
                          {isBn ? meta.titleBn : meta.titleEn}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* NCTB Authenticity Badge */}
            <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/5 p-4 text-xs space-y-2">
              <div className="flex items-center gap-1.5 text-cyan-600 dark:text-cyan-400 font-bold">
                <ShieldCheck className="h-4 w-4" />
                <span>{isBn ? 'এনসিটিবি পাঠ্যক্রম অনুমোদিত' : 'NCTB Curriculum Aligned'}</span>
              </div>
              <p className="text-[11px] text-muted-foreground leading-relaxed">
                {isBn
                  ? 'এনসিটিবি রসায়ন অধ্যায় ৪ (পৃষ্ঠা ৫৯-৮০) এর পটভূমি, গ্রুপ নির্ণয়ের ৩টি নিয়ম, পর্যায়বৃত্ত ধর্ম এবং ক্ষার ধাতু বিক্রিয়ার প্রমাণ।'
                  : 'Derived strictly from Class 9–10 Chemistry Chapter 4 (Printed pp. 59–80) with 3 group rules and periodic trends.'}
              </p>
            </div>
          </aside>
        )}

        {/* ========================================================= */}
        {/* COLUMN 2: CENTER WORKSPACE (5-Step Pedagogical Engine)   */}
        {/* ========================================================= */}
        <main className="flex-1 min-w-0 space-y-6">
          {/* Lesson Header Banner */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs relative overflow-hidden">
            <div className="absolute -right-8 -top-8 w-44 h-44 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1.5">
                <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-700 dark:text-cyan-300 text-[11px] font-bold border border-cyan-500/20">
                  <Table className="h-3.5 w-3.5" />
                  <span>
                    {isBn ? `অধ্যায় ০৪ • পাঠ ${currentLessonMeta.no}` : `Chapter 04 • Lesson ${activeLesson}`}
                  </span>
                  <span>•</span>
                  <span>{currentLessonMeta.badgeText}</span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-foreground tracking-tight">
                  {isBn ? currentLessonMeta.titleBn : currentLessonMeta.titleEn}
                </h1>
                <p className="text-xs sm:text-sm text-muted-foreground max-w-2xl">
                  {isBn ? currentLessonMeta.overviewBn : currentLessonMeta.overviewEn}
                </p>
              </div>

              {/* Study Tip Pill */}
              <div className="shrink-0 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/25 max-w-xs text-xs space-y-1">
                <div className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-bold text-[11px]">
                  <Lightbulb className="h-3.5 w-3.5" />
                  <span>{isBn ? 'বোর্ড পরীক্ষার টিপ' : 'Exam Study Tip'}</span>
                </div>
                <p className="text-[11px] text-muted-foreground leading-snug">
                  {isBn ? currentLessonMeta.studyTipBn : currentLessonMeta.studyTipEn}
                </p>
              </div>
            </div>

            {/* 5-Step Horizontal Tab Navigation */}
            <div className="mt-6 pt-4 border-t border-border/70 flex flex-wrap items-center gap-1.5 sm:gap-2">
              {[
                { key: 'concept', labelBn: '১. কনসেপ্ট ল্যাব', labelEn: '1. Concept Lab', icon: BookOpen },
                { key: 'example', labelBn: '২. বোর্ড উদাহরণ (CQ)', labelEn: '2. Board CQ', icon: Award },
                { key: 'try', labelBn: '৩. নিজে চেষ্টা করুন', labelEn: '3. Try Yourself', icon: Sliders },
                { key: 'check', labelBn: '৪. অনুধাবন যাচাই (MCQ)', labelEn: '4. Check MCQ', icon: HelpCircle },
                { key: 'summary', labelBn: '৫. সারসংক্ষেপ ও সূত্র', labelEn: '5. Summary Vault', icon: CheckCircle2 },
              ].map((step) => {
                const isStepActive = activeStep === step.key;
                const Icon = step.icon;
                return (
                  <button
                    key={step.key}
                    onClick={() => setActiveStep(step.key as LearningStep)}
                    className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all ${
                      isStepActive
                        ? 'bg-cyan-600 text-white shadow-sm shadow-cyan-600/30'
                        : 'bg-muted/50 hover:bg-muted text-muted-foreground hover:text-foreground'
                    }`}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    <span>{isBn ? step.labelBn : step.labelEn}</span>
                  </button>
                );
              })}
            </div>
          </div>

      {/* ========================================================= */}
      {/* STEP 1: মূল ধারণা (CONCEPT) */}
      {/* ========================================================= */}
      {currentStep === 'concept' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 4.1: Historical Evolution */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <BookOpen className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৪.১ পর্যায় সারণির পটভূমি ও ক্রমবিকাশ'
                    : '4.1 Background & Evolution of the Periodic Table'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'ল্যাভয়সিয়ে থেকে মোসলে: মানব ইতিহাসের সবচেয়ে যুগান্তকারী বৈজ্ঞানিক শ্রেণিবিন্যাস'
                    : 'From Lavoisier to Moseley: The greatest systematic classification in science'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              {/* Lavoisier */}
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-600">১৭৮৯ খ্রি.</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600">
                    {isBn ? 'ধাতু ও অধাতু' : 'Metals & Nonmetals'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">ল্যাভয়সিয়ে (Lavoisier)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isBn
                    ? '৩৩টি মৌলকে তাদের ভৌত ধর্মের ভিত্তিতে ধাতু ও অধাতু এই দুটি ভাগে বিভক্ত করেন। এটিই আধুনিক মৌল বিন্যাসের প্রথম বীজ।'
                    : 'Grouped 33 known elements into metals and nonmetals based on physical properties.'}
                </p>
              </div>

              {/* Dobereiner */}
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-600">১৮২৯ খ্রি.</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600">
                    {isBn ? 'ত্রয়ী সূত্র (Triads)' : 'Law of Triads'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">ডোবেরাইনার (Döbereiner)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isBn
                    ? 'তিনটি করে মৌল নিয়ে ত্রয়ী গঠন করেন, যেখানে ১ম ও ৩য় মৌলের ভরের গড় ২য় মৌলের ভরের সমান (যেমন: Li 7 ও K 39 এর গড় = Na 23; Cl 35.5 ও I 127 এর গড় ≈ Br 80)।'
                    : 'Observed triads where the average mass of 1st and 3rd equals the 2nd (e.g. Li 7 + K 39 / 2 = Na 23).'}
                </p>
              </div>

              {/* Newlands */}
              <div className="rounded-2xl border border-border/70 bg-muted/20 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-600">১৮৬৪ খ্রি.</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600">
                    {isBn ? 'অষ্টক সূত্র (Octaves)' : 'Law of Octaves'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">নিউল্যান্ডস (Newlands)</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isBn
                    ? 'মৌলগুলোকে পারমাণবিক ভর অনুসারে সাজালে প্রতি ৮ম মৌলে প্রথম মৌলের ধর্মের পুনরাবৃত্তি ঘটে (সঙ্গীতের সা-রে-গা-মা-পা-ধা-নি-সা এর মতো)।'
                    : 'Every 8th element repeats the properties of the 1st, reminiscent of musical octaves.'}
                </p>
              </div>

              {/* Mendeleev & Moseley */}
              <div className="rounded-2xl border border-cyan-500/30 bg-cyan-500/5 p-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-cyan-600">১৮৬৯ ও ১৯১৩</span>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-600">
                    {isBn ? 'আধুনিক পর্যায় সূত্র' : 'Modern Periodic Law'}
                  </span>
                </div>
                <h3 className="text-base font-bold text-foreground">মেন্ডেলিফ ও মোসলে</h3>
                <p className="text-xs text-muted-foreground leading-relaxed">
                  {isBn
                    ? 'মেন্ডেলিফ ৬৩টি মৌল নিয়ে ভরের ভিত্তিতে পর্যায় সারণি আবিষ্কার করেন এবং ফাঁকা স্থানে নতুন মৌলের ভবিষ্যৎবাণী করেন। ১৯১৩ সালে মোসলে পারমাণবিক সংখ্যাকে ভিত্তি করে আধুনিক পর্যায় সারণি প্রতিষ্ঠা করেন।'
                    : 'Mendeleev predicted missing elements using atomic weights. Moseley reorganized the table by atomic number (Z).'}
                </p>
              </div>
            </div>
          </div>

          {/* Section 4.2: Anatomy of the Periodic Table */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Table className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৪.২ পর্যায় সারণির সার্বিক বৈশিষ্ট্য ও গঠন'
                    : '4.2 Structure & Features of the Periodic Table'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'এনসিটিবি পাঠ্যবই পৃষ্ঠা ৬২-৬৩: ৭টি আনুভূমিক পর্যায় ও ১৮টি খাড়া গ্রুপ'
                    : 'NCTB pp. 62-63: 7 horizontal periods and 18 vertical groups'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Periods */}
              <div className="space-y-4 rounded-2xl border border-border/70 p-5 bg-card">
                <h3 className="text-sm font-black text-cyan-600 flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-cyan-500 text-cyan-500" />
                  {isBn ? 'পর্যায় (Periods - মোট ৭টি)' : 'Periods (Total 7)'}
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2.5">
                  <li className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="font-semibold text-foreground">পর্যায় ১:</span>
                    <span>২টি মৌল (H, He - অতিক্ষুদ্র)</span>
                  </li>
                  <li className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="font-semibold text-foreground">পর্যায় ২ ও ৩:</span>
                    <span>৮টি করে মৌল (হ্রস্ব পর্যায়)</span>
                  </li>
                  <li className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="font-semibold text-foreground">পর্যায় ৪ ও ৫:</span>
                    <span>১৮টি করে মৌল (দীর্ঘ পর্যায়)</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span className="font-semibold text-foreground">পর্যায় ৬ ও ৭:</span>
                    <span>৩২টি করে মৌল (অতিদীর্ঘ পর্যায়)</span>
                  </li>
                </ul>
              </div>

              {/* Groups */}
              <div className="space-y-4 rounded-2xl border border-border/70 p-5 bg-card">
                <h3 className="text-sm font-black text-cyan-600 flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-cyan-500 text-cyan-500" />
                  {isBn ? 'গ্রুপসমূহ (Groups - মোট ১৮টি)' : 'Groups (Total 18)'}
                </h3>
                <ul className="text-xs text-muted-foreground space-y-2.5">
                  <li className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="font-semibold text-foreground">গ্রুপ ১:</span>
                    <span>৭টি মৌল (ক্ষার ধাতু + H)</span>
                  </li>
                  <li className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="font-semibold text-foreground">গ্রুপ ২:</span>
                    <span>৬টি মৌল (মৃৎক্ষার ধাতু)</span>
                  </li>
                  <li className="flex justify-between border-b border-border/40 pb-1.5">
                    <span className="font-semibold text-foreground">গ্রুপ ৩:</span>
                    <span>৩২টি মৌল (ল্যান্থানাইড ও অ্যাকটিনাইডসহ)</span>
                  </li>
                  <li className="flex justify-between pb-1">
                    <span className="font-semibold text-foreground">গ্রুপ ১৩-১৮:</span>
                    <span>প্রতিটিতে ৬টি করে মৌল (গ্রুপ ১৮ তে ৭টি)</span>
                  </li>
                </ul>
              </div>

              {/* Bottom Rows */}
              <div className="space-y-4 rounded-2xl border border-border/70 p-5 bg-card">
                <h3 className="text-sm font-black text-cyan-600 flex items-center gap-2">
                  <Circle className="h-2 w-2 fill-cyan-500 text-cyan-500" />
                  {isBn ? 'নিচের দুটি বিশেষ সারি' : 'Bottom Special Series'}
                </h3>
                <div className="space-y-3 text-xs text-muted-foreground">
                  <p>
                    <strong className="text-foreground">ল্যান্থানাইড সারি:</strong> ৬ষ্ঠ পর্যায় ও ৩ নং গ্রুপে ৫৭ (La) থেকে ৭১ (Lu) পর্যন্ত ১৫টি মৌল।
                  </p>
                  <p>
                    <strong className="text-foreground">অ্যাকটিনাইড সারি:</strong> ৭ম পর্যায় ও ৩ নং গ্রুপে ৮৯ (Ac) থেকে ১০৩ (Lr) পর্যন্ত ১৫টি মৌল।
                  </p>
                  <p className="text-[11px] bg-muted/40 p-2 rounded-lg border border-border/60">
                    💡 <em>এদেরকে সারণির মূল কাঠামোর নিচে রাখা হয়েছে পর্যায় সারণির সৌন্দর্য ও সামঞ্জস্য রক্ষার জন্য।</em>
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4.3: Determining Position from Electron Configuration */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Compass className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৪.৩ ইলেকট্রন বিন্যাস থেকে পর্যায় ও গ্রুপ নির্ণয়ের ৩টি মাস্টার নিয়ম'
                    : '4.3 3 Master Rules: Determining Period & Group from Configuration'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'এসএসসি পরীক্ষায় ৩ নম্বরের প্রয়োগমূলক প্রশ্নের জন্য ১০০% বাধ্যতামূলক সূত্র'
                    : 'Essential formula for 3-mark Board application questions'}
                </p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-800 dark:text-cyan-300">
                <strong>পর্যায় নির্ণয় সূত্র:</strong> যেকোনো মৌলের ইলেকট্রন বিন্যাসের সবচেয়ে বাইরের প্রধান শক্তিস্তরের নম্বরই (সর্বোচ্চ <RenderMathText text="n" /> এর মান) হলো তার <strong>পর্যায় নম্বর</strong>। যেমন: <RenderMathText text="\text{Na}(11): 1s^2 2s^2 2p^6 3s^1 \rightarrow" /> পর্যায় = ৩।
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Rule 1 */}
                <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                  <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-rose-500/15 text-rose-600">
                    নিয়ম ০১: s-ব্লক
                  </div>
                  <h3 className="text-sm font-bold text-foreground">শুধু s অরবিটাল থাকলে</h3>
                  <p className="text-xs text-muted-foreground">
                    সর্ববহিঃস্থ স্তরে যদি কেবল <RenderMathText text="s" /> অরবিটাল থাকে, তবে সেই <RenderMathText text="s" /> অরবিটালের মোট ইলেকট্রন সংখ্যাই হলো ঐ মৌলের <strong>গ্রুপ নম্বর</strong>।
                  </p>
                  <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono">
                    <p className="text-foreground">Na (11): [Ne] 3s¹ → গ্রুপ ১</p>
                    <p className="text-foreground">Ca (20): [Ar] 4s² → গ্রুপ ২</p>
                  </div>
                </div>

                {/* Rule 2 */}
                <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                  <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-indigo-500/15 text-indigo-600">
                    নিয়ম ০২: p-ব্লক
                  </div>
                  <h3 className="text-sm font-bold text-foreground">s ও p অরবিটাল থাকলে</h3>
                  <p className="text-xs text-muted-foreground">
                    সর্ববহিঃস্থ প্রধান শক্তিস্তরে যদি <RenderMathText text="s" /> এবং <RenderMathText text="p" /> উভয় অরবিটাল থাকে, তবে মোট ইলেকট্রন সংখ্যার সাথে <strong>১০ যোগ</strong> করলে গ্রুপ পাওয়া যায়।
                  </p>
                  <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono">
                    <p className="text-foreground">Al (13): 3s² 3p¹ → 2 + 1 + 10 = ১৩</p>
                    <p className="text-foreground">Cl (17): 3s² 3p⁵ → 2 + 5 + 10 = ১৭</p>
                  </div>
                </div>

                {/* Rule 3 */}
                <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
                  <div className="inline-flex px-2 py-0.5 rounded text-[10px] font-bold bg-blue-500/15 text-blue-600">
                    নিয়ম ০৩: d-ব্লক
                  </div>
                  <h3 className="text-sm font-bold text-foreground">বহিঃস্থ s ও আগের d থাকলে</h3>
                  <p className="text-xs text-muted-foreground">
                    সর্ববহিঃস্থ <RenderMathText text="s" /> অরবিটালের ইলেকট্রন সংখ্যার সাথে ঠিক আগের শক্তিস্তরের <RenderMathText text="d" /> অরবিটালের মোট ইলেকট্রন যোগ করলে <strong>গ্রুপ নম্বর</strong> পাওয়া যায়।
                  </p>
                  <div className="bg-muted/40 p-2.5 rounded-xl text-xs font-mono">
                    <p className="text-foreground">Fe (26): 3d⁶ 4s² → 6 + 2 = গ্রুপ ৮</p>
                    <p className="text-foreground">Cr (24): 3d⁵ 4s¹ → 5 + 1 = গ্রুপ ৬</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section 4.4: Periodic Trends (পর্যায়বৃত্ত ধর্ম) */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Zap className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? '৪.৪ মৌলের পর্যায়বৃত্ত ধর্ম (Periodic Trends)'
                    : '4.4 Periodic Trends in Element Properties'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'পর্যায় ও গ্রুপ পরিবর্তনের সাথে সাথে পরমাণুর অভ্যন্তরীণ ধর্মের নিয়মিত আবর্তন'
                    : 'Systematic variation in atomic structure across periods and down groups'}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Trend 1: Atomic Radius */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">১. পারমাণবিক ব্যাসার্ধ (আকার)</h3>
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
                    Atomic Radius
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    • <strong>একই পর্যায়ে বাম থেকে ডানে:</strong> পরমাণুর আকার <strong>হ্রাস পায়</strong> (নতুন শক্তিস্তর যুক্ত হয় না, কিন্তু প্রোটন ও ইলেকট্রন সংখ্যা বাড়ে বলে আকর্ষণ বৃদ্ধি পায়)।
                  </p>
                  <p>
                    • <strong>একই গ্রুপে উপর থেকে নিচে:</strong> পরমাণুর আকার <strong>বৃদ্ধি পায়</strong> (প্রতি ধাপে ১টি করে নতুন প্রধান শক্তিস্তর যুক্ত হয়, ফলে দূরত্ব বাড়ে)।
                  </p>
                  <div className="p-2.5 rounded-lg bg-muted/40 font-mono text-foreground text-[11px]">
                    Period 2 আকার ক্রম: Li &gt; Be &gt; B &gt; C &gt; N &gt; O &gt; F
                  </div>
                </div>
              </div>

              {/* Trend 2: Ionization Energy */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">২. আয়নীকরণ শক্তি (IE)</h3>
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
                    Ionization Energy
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    • গ্যাসীয় অবস্থায় ১ মোল পরমাণু থেকে ১টি করে ইলেকট্রন অপসারণ করে ১ মোল ধনাত্মক আয়নে রূপান্তর করতে প্রয়োজনীয় শক্তি।
                  </p>
                  <p>
                    • পরমাণুর আকার যত ছোট, নিউক্লিয়াসের আকর্ষণ তত তীব্র, তাই <strong>বাম থেকে ডানে বৃদ্ধি পায়</strong> এবং <strong>উপর থেকে নিচে হ্রাস পায়</strong>।
                  </p>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-[11px]">
                    ⚠️ <strong>ব্যতিক্রম:</strong> Be (2s² পূর্ণ) এর IE &gt; B; আবার N (2p³ অর্ধপূর্ণ) এর IE &gt; O!
                  </div>
                </div>
              </div>

              {/* Trend 3: Electron Affinity */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">৩. ইলেকট্রন আসক্তি (EA)</h3>
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
                    Electron Affinity
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    • গ্যাসীয় পরমাণুতে ১টি ইলেকট্রন যুক্ত করে ১ মোল একক ঋণাত্মক আয়নে পরিণত করতে নির্গত শক্তি।
                  </p>
                  <p>
                    • আকার ছোট হলে ইলেকট্রন গ্রহণের আকর্ষণ বাড়ে। তাই <strong>বাম থেকে ডানে বাড়ে</strong> এবং <strong>উপর থেকে নিচে কমে</strong>।
                  </p>
                  <div className="p-2.5 rounded-lg bg-amber-500/10 text-amber-800 dark:text-amber-300 border border-amber-500/20 text-[11px]">
                    ⚠️ <strong>ব্যতিক্রম:</strong> হ্যালোজেন গ্রুপে Cl এর ইলেকট্রন আসক্তি &gt; F! কারণ ফ্লোরিনের ২য় স্তর খুব ক্ষুদ্র হওয়ায় ইলেকট্রন বিকর্ষণ তীব্র হয়।
                  </div>
                </div>
              </div>

              {/* Trend 4: Electronegativity */}
              <div className="p-5 rounded-2xl border border-border/70 bg-card space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-base font-bold text-foreground">৪. তড়িৎ ঋণাত্মকতা (EN)</h3>
                  <span className="text-xs font-bold text-cyan-600 bg-cyan-500/10 px-2.5 py-0.5 rounded-full">
                    Electronegativity
                  </span>
                </div>
                <div className="text-xs text-muted-foreground space-y-2">
                  <p>
                    • সমযোজী বন্ধনে শেয়ারকৃত ইলেকট্রন যুগলকে কোনো পরমাণু নিজের দিকে আকর্ষণ করার আপেক্ষিক ক্ষমতা।
                  </p>
                  <p>
                    • পাউলিং স্কেলে <strong>ফ্লোরিন (F = ৪.০)</strong> হলো পর্যায় সারণির সর্বাধিক তড়িৎ ঋণাত্মক মৌল!
                  </p>
                  <div className="p-2.5 rounded-lg bg-muted/40 font-mono text-foreground text-[11px]">
                    তড়িৎ ঋণাত্মকতার সাধারণ ক্রম: F &gt; O &gt; N ≈ Cl &gt; Br &gt; I &gt; S &gt; C &gt; H
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 2: উদাহরণ ও সমস্যা সমাধান (WORKED EXAMPLES) */}
      {/* ========================================================= */}
      {currentStep === 'example' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Award className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? 'বোর্ড প্র্যাকটিস: ধাপে ধাপে সমস্যা সমাধান'
                    : 'Board Practice: Step-by-Step Worked Problems'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'এনসিটিবি পাঠ্যবইয়ের একক কাজ ও বিগত এসএসসি বোর্ড পরীক্ষার গাণিতিক ব্যাখ্যা'
                    : 'Official textbook individual work and past SSC board solved problems'}
                </p>
              </div>
            </div>

            {/* Problem 1 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-600">সমস্যা ০১ (বোর্ড প্রয়োগমূলক প্রশ্ন)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600">
                  ৩ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                ক্রোমিয়াম (Cr, পারমাণবিক সংখ্যা ২৪) এবং ক্লোরিন (Cl, পারমাণবিক সংখ্যা ১৭) মৌল দুটির পর্যায় সারণিতে পর্যায় ও গ্রুপ নির্ণয় করো।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <div className="bg-muted/40 p-3 rounded-xl space-y-2 font-mono">
                  <p className="text-foreground">
                    ১. Cl (17) এর ইলেকট্রন বিন্যাস: 1s² 2s² 2p⁶ 3s² 3p⁵
                  </p>
                  <p className="text-cyan-700 dark:text-cyan-300">
                    • সবচেয়ে বাইরের প্রধান স্তর n = 3, সুতরাং পর্যায় = ৩।
                    <br />
                    • সর্ববহিঃস্থ স্তরে s এ ২টি ও p এ ৫টি ইলেকট্রন আছে। নিয়ম ২ অনুযায়ী: গ্রুপ = ২ + ৫ + ১০ = গ্রুপ ১৭।
                  </p>
                  <div className="border-t border-border/60 my-1.5" />
                  <p className="text-foreground">
                    ২. Cr (24) এর ইলেকট্রন বিন্যাস: 1s² 2s² 2p⁶ 3s² 3p⁶ 3d⁵ 4s¹ (ব্যতিক্রমী)
                  </p>
                  <p className="text-cyan-700 dark:text-cyan-300">
                    • সবচেয়ে বাইরের প্রধান স্তর n = 4, সুতরাং পর্যায় = ৪।
                    <br />
                    • নিয়ম ৩ অনুযায়ী: বহিঃস্থ 4s এর ১টি + আগের স্তরের 3d এর ৫টি = ১ + ৫ = গ্রুপ ৬।
                  </p>
                </div>
              </div>
            </div>

            {/* Problem 2 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-600">সমস্যা ০২ (ব্যতিক্রমী উচ্চতর দক্ষতা)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600">
                  ৪ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                নাইট্রোজেন (N, ৭) এর প্রথম আয়নীকরণ শক্তি অক্সিজেন (O, ৮) অপেক্ষা বেশি কেন? ইলেকট্রন বিন্যাসের আলোকে ব্যাখ্যা করো।
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <p>
                  আমরা জানি, একই পর্যায়ে বাম থেকে ডানে গেলে পরমাণুর আকার হ্রাস পায়, ফলে নিউক্লিয়াসের আকর্ষণ বৃদ্ধির কারণে আয়নীকরণ শক্তি বৃদ্ধি পাওয়ার কথা। সে হিসেবে অক্সিজেনের আয়নীকরণ শক্তি নাইট্রোজেনের চেয়ে বেশি হওয়ার কথা ছিল।
                </p>
                <div className="bg-muted/40 p-3 rounded-xl font-mono text-foreground space-y-1">
                  <p>N (7): 1s² 2s² 2p³ (2px¹ 2py¹ 2pz¹)</p>
                  <p>O (8): 1s² 2s² 2p⁴ (2px² 2py¹ 2pz¹)</p>
                </div>
                <p>
                  <strong>বৈজ্ঞানিক যুক্তি:</strong> হুন্ডের নীতি অনুসারে কোনো উপস্তর ইলেকট্রন দ্বারা অর্ধপূর্ণ (যেমন <RenderMathText text="p^3, d^5" />) বা সম্পূর্ণরূপে পূর্ণ (যেমন <RenderMathText text="p^6, d^{10}" />) থাকলে তা অধিকতর স্থিতিশীল (Stable) হয়। নাইট্রোজেনের <RenderMathText text="2p" /> উপস্তরটি সুষমভাবে অর্ধপূর্ণ (<RenderMathText text="2p^3" />), যা ভাঙতে প্রচুর শক্তি লাগে। অন্যদিকে অক্সিজেনের <RenderMathText text="2p^4" /> থেকে একটি ইলেকট্রন সহজেই বেরিয়ে গিয়ে সুস্থিত <RenderMathText text="2p^3" /> হতে চায়। এজন্য নাইট্রোজেনের ১ম আয়নীকরণ শক্তি (১৪০২ kJ/mol) অক্সিজেনের (১৩১৪ kJ/mol) চেয়ে বেশি।
                </p>
              </div>
            </div>

            {/* Problem 3 */}
            <div className="rounded-2xl border border-border/70 p-5 bg-card space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-cyan-600">সমস্যা ০৩ (অনুধাবনমূলক প্রশ্ন)</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-600">
                  ২ নম্বর
                </span>
              </div>
              <h3 className="text-sm font-bold text-foreground">
                হিলিয়াম (He)-কে গ্রুপ ২ এ না রেখে গ্রুপ ১৮ তে রাখা হয়েছে কেন?
              </h3>
              <div className="space-y-2 text-xs text-muted-foreground pt-1">
                <p>
                  হিলিয়ামের ইলেকট্রন বিন্যাস <RenderMathText text="1s^2" />। নিয়ম ১ অনুযায়ী সর্ববহিঃস্থ স্তরে ২টি <RenderMathText text="s" /> ইলেকট্রন থাকায় এটিকে ২ নং গ্রুপে (মৃৎক্ষার ধাতু Be, Mg, Ca এর সাথে) রাখার কথা ছিল।
                </p>
                <p>
                  কিন্তু হিলিয়াম কোনো ধাতু নয়, এটি একটি <strong>নিষ্ক্রিয় গ্যাস</strong>। এর প্রথম ও একমাত্র শক্তিস্তরটি সর্বোচ্চ ২টি ইলেকট্রন দ্বারাই সম্পূর্ণ পূর্ণ (দ্বিত্ব নিয়ম / Duplet Rule)। এর রাসায়নিক সক্রিয়তা শূন্য এবং এর সমস্ত ধর্ম গ্রুপ ১৮ এর অন্যান্য নিষ্ক্রিয় গ্যাস (Ne, Ar, Kr)-এর সাথে মিলে যায়। তাই পর্যায় সারণির মূল নীতি (একই ধর্মে একই গ্রুপ) বজায় রাখতে একে ১৮ নং গ্রুপে স্থান দেওয়া হয়েছে।
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 3: ইন্টারেক্টিভ সিমুলেটর ও ল্যাব (TRY IT YOURSELF) */}
      {/* ========================================================= */}
      {currentStep === 'try' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* SIMULATOR 1: Interactive Element Explorer Grid */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Table className="h-5 w-5 text-cyan-500" />
                  {isBn
                    ? '১. আধুনিক পর্যায় সারণি গ্রিড ও মৌল এক্সপ্লোরার'
                    : '1. Interactive Periodic Table & Element Explorer'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'যেকোনো মৌলে ক্লিক করো এবং তার ল্যাটিন নাম, গ্রুপ-পর্যায়, ইলেকট্রন বিন্যাস ও বাস্তব জীবনের ম্যাজিক দেখো!'
                    : 'Click any element to reveal Latin origins, configuration, and real-life chemistry trivia.'}
                </p>
              </div>

              {/* Filter pills */}
              <div className="flex flex-wrap gap-1.5">
                {[
                  { id: 'all', labelBn: 'সকল' },
                  { id: 'alkali', labelBn: 'ক্ষার ধাতু' },
                  { id: 'alkaline-earth', labelBn: 'মৃৎক্ষার' },
                  { id: 'transition', labelBn: 'অবস্থান্তর' },
                  { id: 'halogen', labelBn: 'হ্যালোজেন' },
                  { id: 'noble', labelBn: 'নিষ্ক্রিয়' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => setCategoryFilter(f.id)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-semibold transition-all ${
                      categoryFilter === f.id
                        ? 'bg-cyan-600 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {f.labelBn}
                  </button>
                ))}
              </div>
            </div>

            {/* Elements Grid */}
            <div className="grid grid-cols-3 sm:grid-cols-6 lg:grid-cols-9 gap-2.5">
              {filteredElements.map((el) => {
                const catCfg = CATEGORY_CONFIG[el.category];
                const isSelected = el.z === selectedElementZ;

                return (
                  <button
                    key={el.z}
                    onClick={() => setSelectedElementZ(el.z)}
                    className={`group relative p-2.5 rounded-xl border text-left transition-all flex flex-col justify-between h-20 ${
                      isSelected
                        ? 'ring-2 ring-cyan-500 border-cyan-500 bg-cyan-500/10 shadow-sm'
                        : `${catCfg.bgClass} border-border/70 hover:scale-[1.03]`
                    }`}
                  >
                    <div className="flex items-center justify-between w-full">
                      <span className="text-[10px] font-mono font-bold text-muted-foreground">
                        {el.z}
                      </span>
                      <span className="text-[9px] font-mono opacity-80">{el.mass.toFixed(1)}</span>
                    </div>

                    <div className="text-center my-0.5">
                      <div className="text-lg font-black tracking-tight text-foreground group-hover:text-cyan-600 transition-colors">
                        {el.symbol}
                      </div>
                      <div className="text-[9px] truncate text-muted-foreground font-medium">
                        {isBn ? el.nameBn : el.nameEn}
                      </div>
                    </div>

                    <div className="flex justify-between items-center text-[8px] text-muted-foreground">
                      <span>P{el.period}</span>
                      <span>G{el.group}</span>
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Selected Element Detailed Spec Card */}
            {selectedElement && (
              <div className="rounded-2xl border border-cyan-500/30 bg-gradient-to-br from-cyan-500/5 via-card to-card p-5 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 pb-3">
                  <div className="flex items-center gap-3">
                    <div className="h-14 w-14 rounded-2xl bg-cyan-600 text-white flex flex-col items-center justify-center shadow-md">
                      <span className="text-xs font-mono font-bold leading-none">{selectedElement.z}</span>
                      <span className="text-2xl font-black leading-none mt-0.5">{selectedElement.symbol}</span>
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="text-lg font-black text-foreground">
                          {isBn ? selectedElement.nameBn : selectedElement.nameEn}
                        </h4>
                        <span className="text-xs font-mono text-muted-foreground">
                          ({selectedElement.latinName || selectedElement.nameEn})
                        </span>
                      </div>
                      <div className="flex items-center gap-2 mt-0.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${CATEGORY_CONFIG[selectedElement.category].badgeClass}`}>
                          {isBn
                            ? CATEGORY_CONFIG[selectedElement.category].nameBn
                            : CATEGORY_CONFIG[selectedElement.category].nameEn}
                        </span>
                        <span className="text-xs text-muted-foreground">
                          {selectedElement.stateRoomTemp === 'solid'
                            ? 'কঠিন (Solid)'
                            : selectedElement.stateRoomTemp === 'liquid'
                            ? 'তরল (Liquid)'
                            : 'গ্যাসীয় (Gas)'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 text-xs font-mono bg-background/80 p-2.5 rounded-xl border border-border/70">
                    <div>
                      <span className="text-muted-foreground block text-[10px]">পর্যায়</span>
                      <strong className="text-cyan-600 text-sm">{selectedElement.period}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">গ্রুপ</span>
                      <strong className="text-cyan-600 text-sm">{selectedElement.group}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">ব্লক</span>
                      <strong className="text-cyan-600 text-sm uppercase">{selectedElement.block}</strong>
                    </div>
                    <div>
                      <span className="text-muted-foreground block text-[10px]">পারমাণবিক ভর</span>
                      <strong className="text-foreground text-sm">{selectedElement.mass}</strong>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">ইলেকট্রন বিন্যাস</span>
                    <span className="font-mono font-bold text-foreground">{selectedElement.config}</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">পারমাণবিক ব্যাসার্ধ</span>
                    <span className="font-mono font-bold text-foreground">{selectedElement.radiusPm} pm</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">১ম আয়নীকরণ শক্তি</span>
                    <span className="font-mono font-bold text-foreground">{selectedElement.ieKj} kJ/mol</span>
                  </div>
                  <div className="p-3 rounded-xl bg-muted/30 border border-border/60">
                    <span className="text-muted-foreground block text-[10px]">তড়িৎ ঋণাত্মকতা (Pauling)</span>
                    <span className="font-mono font-bold text-foreground">
                      {selectedElement.enPauling > 0 ? selectedElement.enPauling : '০ (নিষ্ক্রিয়)'}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-foreground flex items-start gap-2.5">
                  <Lightbulb className="h-4 w-4 text-cyan-600 dark:text-cyan-400 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-cyan-700 dark:text-cyan-300">প্রাত্যহিক রসায়ন ফ্যাক্ট: </strong>
                    <span>{isBn ? selectedElement.funFactBn : selectedElement.funFactEn}</span>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* SIMULATOR 2: Periodic Trends Visualizer */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Zap className="h-5 w-5 text-cyan-500" />
                  {isBn
                    ? '২. পর্যায়বৃত্ত ধর্ম তুলনামূলক অ্যানিমেটর'
                    : '2. Periodic Trends Animated Comparator'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'পর্যায় বা গ্রুপ পরিবর্তন করে আকার, আয়নীকরণ শক্তি ও তড়িৎ ঋণাত্মকতার লাইভ গ্রাফ দেখো।'
                    : 'Observe how radius, ionization energy, and electronegativity fluctuate along periods and groups.'}
                </p>
              </div>

              {/* Scope Selector */}
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground font-semibold">তুলনা করো:</span>
                <select
                  value={trendScope}
                  onChange={(e) => setTrendScope(e.target.value as any)}
                  className="rounded-xl border border-border bg-background px-3 py-1.5 text-xs font-bold text-foreground focus:outline-hidden focus:ring-2 focus:ring-cyan-500"
                >
                  <option value="p2">পর্যায় ২ (Li থেকে Ne)</option>
                  <option value="p3">পর্যায় ৩ (Na থেকে Ar)</option>
                  <option value="g1">গ্রুপ ১ (Li থেকে K - ক্ষার ধাতু)</option>
                  <option value="g17">গ্রুপ ১৭ (F থেকে I - হ্যালোজেন)</option>
                </select>
              </div>
            </div>

            {/* Trend Type Tabs */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {[
                { id: 'radius', labelBn: 'পারমাণবিক ব্যাসার্ধ', labelEn: 'Atomic Radius' },
                { id: 'ie', labelBn: 'আয়নীকরণ শক্তি (IE)', labelEn: 'Ionization Energy' },
                { id: 'en', labelBn: 'তড়িৎ ঋণাত্মকতা (EN)', labelEn: 'Electronegativity' },
                { id: 'ea', labelBn: 'ইলেকট্রন আসক্তি (EA)', labelEn: 'Electron Affinity' },
              ].map((t) => (
                <button
                  key={t.id}
                  onClick={() => setTrendType(t.id as any)}
                  className={`p-3 rounded-2xl border text-center transition-all ${
                    trendType === t.id
                      ? 'border-cyan-500 bg-cyan-500/10 text-cyan-600 font-bold shadow-xs'
                      : 'border-border/70 bg-card hover:bg-muted/40 text-muted-foreground'
                  }`}
                >
                  <div className="text-xs font-bold">{isBn ? t.labelBn : t.labelEn}</div>
                </button>
              ))}
            </div>

            {/* Visual Dynamic Bars */}
            <div className="p-6 rounded-2xl border border-border/80 bg-muted/15 space-y-4">
              <div className="text-xs text-muted-foreground flex justify-between items-center">
                <span>
                  {trendScope.startsWith('p') ? 'বাম থেকে ডানে সাজানো (পর্যায়বৃত্ত)' : 'উপর থেকে নিচে সাজানো (গ্রুপবৃত্ত)'}
                </span>
                <span className="font-bold text-cyan-600">
                  {trendType === 'radius' && (trendScope.startsWith('p') ? 'আকার হ্রাস পায় ↘' : 'আকার বৃদ্ধি পায় ↗')}
                  {trendType === 'ie' && (trendScope.startsWith('p') ? 'শক্তি বৃদ্ধি পায় ↗' : 'শক্তি হ্রাস পায় ↘')}
                  {trendType === 'en' && (trendScope.startsWith('p') ? 'তড়িৎ ঋণাত্মকতা বাড়ে ↗' : 'কমে ↘')}
                </span>
              </div>

              <div className="flex items-end justify-between gap-2 h-48 pt-6 px-2">
                {trendElements.map((el) => {
                  const data = getTrendValue(el);
                  // Calculate height percentage based on max
                  let maxVal = 250;
                  if (trendType === 'ie') maxVal = 2400;
                  if (trendType === 'en') maxVal = 4.0;
                  if (trendType === 'ea') maxVal = 360;

                  const heightPct = Math.max(12, Math.min(100, (data.val / maxVal) * 100));

                  return (
                    <div key={el.z} className="flex-1 flex flex-col items-center gap-2 h-full justify-end group">
                      <span className="text-[10px] font-mono font-bold text-foreground opacity-90 group-hover:scale-110 transition-transform">
                        {data.val}
                      </span>
                      <div
                        style={{ height: `${heightPct}%` }}
                        className="w-full rounded-t-xl bg-gradient-to-t from-cyan-600 to-cyan-400 group-hover:from-cyan-500 group-hover:to-cyan-300 transition-all shadow-xs relative"
                      >
                        {trendType === 'radius' && (
                          <div
                            style={{
                              width: `${Math.max(12, el.radiusPm / 7)}px`,
                              height: `${Math.max(12, el.radiusPm / 7)}px`,
                            }}
                            className="rounded-full bg-white/80 absolute top-1 left-1/2 -translate-x-1/2 shadow-xs hidden sm:block"
                          />
                        )}
                      </div>
                      <div className="text-center">
                        <span className="text-xs font-black text-foreground block">{el.symbol}</span>
                        <span className="text-[9px] text-muted-foreground block">{el.z}</span>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* SIMULATOR 3: Position Predictor Simulator (গ্রুপ ও পর্যায় নির্ণায়ক) */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div>
              <h3 className="text-base font-black text-foreground flex items-center gap-2">
                <Compass className="h-5 w-5 text-cyan-500" />
                {isBn
                  ? '৩. পর্যায় ও গ্রুপ নির্ণয়ক ক্যালকুলেটর'
                  : '3. Period & Group Position Predictor Calculator'}
              </h3>
              <p className="text-xs text-muted-foreground">
                {isBn
                  ? 'যেকোনো পারমাণবিক সংখ্যা সিলেক্ট করো; সিস্টেম স্বয়ংক্রিয়ভাবে ইলেকট্রন বিন্যাস বিশ্লেষণ করে সঠিক নিয়ম প্রয়োগ করবে।'
                  : 'Select any atomic number (1–36) to compute Period and Group with exact NCTB rules.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Controls */}
              <div className="space-y-4">
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="font-bold text-foreground">পারমাণবিক সংখ্যা (Z):</span>
                    <span className="font-mono font-black text-cyan-600 text-sm">{predictZ}</span>
                  </div>
                  <input
                    type="range"
                    min={1}
                    max={36}
                    value={predictZ}
                    onChange={(e) => setPredictZ(Number(e.target.value))}
                    className="w-full accent-cyan-600 cursor-pointer"
                  />
                </div>

                <div className="flex flex-wrap gap-2">
                  <span className="text-xs text-muted-foreground font-semibold self-center">
                    দ্রুত উদাহরণ:
                  </span>
                  {[
                    { z: 11, label: 'Na (11)' },
                    { z: 13, label: 'Al (13)' },
                    { z: 17, label: 'Cl (17)' },
                    { z: 20, label: 'Ca (20)' },
                    { z: 24, label: 'Cr (24)' },
                    { z: 26, label: 'Fe (26)' },
                    { z: 29, label: 'Cu (29)' },
                  ].map((btn) => (
                    <button
                      key={btn.z}
                      onClick={() => setPredictZ(btn.z)}
                      className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                        predictZ === btn.z
                          ? 'bg-cyan-600 text-white shadow-xs'
                          : 'bg-muted text-muted-foreground hover:bg-muted/80'
                      }`}
                    >
                      {btn.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Result Preview Box */}
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-black text-cyan-600">{predicted.symbol}</span>
                    <span className="text-sm font-bold text-foreground">
                      {isBn ? predicted.nameBn : predicted.nameEn} (Z = {predictZ})
                    </span>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold text-xs">
                      পর্যায় {predicted.period}
                    </span>
                    <span className="px-2.5 py-1 rounded-lg bg-cyan-600 text-white font-bold text-xs">
                      গ্রুপ {predicted.group}
                    </span>
                  </div>
                </div>

                <div className="p-3 rounded-xl bg-background/80 border border-border/60 text-xs font-mono">
                  <span className="text-muted-foreground block text-[10px]">ইলেকট্রন বিন্যাস:</span>
                  <span className="font-bold text-foreground text-sm">{predicted.config}</span>
                </div>

                <div className="p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/20 text-xs text-cyan-900 dark:text-cyan-200">
                  <span className="font-bold block mb-1">প্রযুক্ত এনসিটিবি নিয়ম:</span>
                  <span>{isBn ? predicted.ruleTextBn : predicted.ruleTextEn}</span>
                </div>
              </div>
            </div>
          </div>

          {/* SIMULATOR 4: Alkali Metal Water Reaction Lab (ক্ষার ধাতু ও পানির বিক্রিয়া) */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 shadow-xs space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div>
                <h3 className="text-base font-black text-foreground flex items-center gap-2">
                  <Flame className="h-5 w-5 text-rose-500" />
                  {isBn
                    ? '৪. ক্ষার ধাতু ও পানির বিক্রিয়া ভার্চুয়াল ল্যাব'
                    : '4. Alkali Metals & Water Reaction Chamber'}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? 'এনসিটিবি পৃষ্ঠা ৭৪: গ্রুপ ১ এর ক্ষার ধাতু পানিতে ফেললে কীভাবে তীব্র ক্ষার ও হাইড্রোজেন গ্যাস উৎপন্ন করে তা প্রত্যক্ষ করো।'
                    : 'NCTB p. 74: Watch alkali metals react vigorously with water yielding alkali and H₂ gas.'}
                </p>
              </div>

              {/* Select Alkali Metal */}
              <div className="flex items-center gap-2">
                {(['Li', 'Na', 'K'] as const).map((m) => (
                  <button
                    key={m}
                    onClick={() => {
                      if (!isReacting) setAlkaliMetal(m);
                    }}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                      alkaliMetal === m
                        ? 'bg-rose-500 text-white shadow-xs'
                        : 'bg-muted text-muted-foreground hover:bg-muted/80'
                    }`}
                  >
                    {m === 'Li' ? 'লিথিয়াম (Li)' : m === 'Na' ? 'সোডিয়াম (Na)' : 'পটাশিয়াম (K)'}
                  </button>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              {/* Reaction Animation Chamber */}
              <div className="relative h-64 rounded-2xl border border-border/80 bg-slate-900 overflow-hidden flex flex-col items-center justify-end p-6">
                {/* Water layer */}
                <div
                  className={`w-full transition-colors duration-1000 rounded-b-xl flex items-center justify-center relative ${
                    reactionStep >= 2
                      ? 'bg-pink-500/40 border-t-2 border-pink-400' // Phenolphthalein turns pink in base!
                      : 'bg-cyan-500/20 border-t-2 border-cyan-400'
                  }`}
                  style={{ height: '55%' }}
                >
                  <span className="text-[11px] font-mono text-cyan-200">
                    {reactionStep >= 2
                      ? `ক্ষারীয় দ্রবণ (${alkaliMetal}OH) • ফেনলফথ্যালিন গোলাপি!`
                      : 'বিশুদ্ধ পানি (H₂O) + ফেনলফথ্যালিন নির্দেশক'}
                  </span>

                  {/* Bubbles of H2 */}
                  {isReacting && (
                    <div className="absolute inset-0 flex justify-around items-end overflow-hidden pointer-events-none">
                      <div className="h-3 w-3 rounded-full bg-white/70 animate-bounce delay-100 mb-8" />
                      <div className="h-4 w-4 rounded-full bg-white/70 animate-bounce delay-200 mb-12" />
                      <div className="h-2 w-2 rounded-full bg-white/70 animate-bounce delay-300 mb-4" />
                      <div className="h-3 w-3 rounded-full bg-white/70 animate-bounce delay-75 mb-14" />
                    </div>
                  )}
                </div>

                {/* Metal Chunk */}
                <div
                  className={`absolute transition-all duration-700 ${
                    reactionStep === 0
                      ? 'top-6'
                      : reactionStep === 1
                      ? 'top-28'
                      : 'top-32 animate-pulse'
                  }`}
                >
                  <div
                    className={`h-8 w-8 rounded-lg flex items-center justify-center text-xs font-bold text-white shadow-lg ${
                      isReacting ? 'bg-amber-400 animate-spin shadow-amber-500/50' : 'bg-slate-400'
                    }`}
                  >
                    {alkaliMetal}
                  </div>
                </div>

                {/* Fire / Smoke Sparks */}
                {isReacting && (
                  <div className="absolute top-20 text-center animate-ping">
                    <span className="text-xl">🔥 💥</span>
                  </div>
                )}
              </div>

              {/* Lab Controls & Chemical Equation */}
              <div className="space-y-4">
                <div className="p-4 rounded-2xl bg-muted/30 border border-border/70 space-y-2">
                  <span className="text-xs font-bold text-muted-foreground block">
                    রাসায়নিক বিক্রিয়ার সমীকরণ:
                  </span>
                  <div className="p-2.5 rounded-xl bg-background border border-border/60 text-xs font-mono text-cyan-600 dark:text-cyan-400 font-bold">
                    <RenderMathText
                      text={`2\\text{${alkaliMetal}} + 2\\text{H}_2\\text{O} \\rightarrow 2\\text{${alkaliMetal}OH} + \\text{H}_2\\uparrow`}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {alkaliMetal === 'Li' &&
                      'লিথিয়াম ধীরে বিক্রিয়া করে মৃদু বুদবুদ ছড়ায়।'}
                    {alkaliMetal === 'Na' &&
                      'সোডিয়াম দ্রুত গলে চকচকে গোলকের মতো পানির ওপর ঘুরে বেড়ায় এবং তীব্র হিসহিস শব্দে আগুন জ্বলে ওঠে!'}
                    {alkaliMetal === 'K' &&
                      'পটাশিয়াম পানির সংস্পর্শে আসার সাথে সাথে বেগুনি শিখা সহকারে বিস্ফোরিত হয়!'}
                  </p>
                </div>

                <button
                  onClick={triggerAlkaliReaction}
                  disabled={isReacting}
                  className="w-full py-3 rounded-2xl bg-rose-500 hover:bg-rose-600 text-white font-bold text-xs transition-all shadow-md flex items-center justify-center gap-2 disabled:opacity-50"
                >
                  <Play className="h-4 w-4" />
                  <span>
                    {isReacting ? 'বিক্রিয়া চলছে...' : `পানিতে ${alkaliMetal} ফেলুন (Drop ${alkaliMetal} in Water)`}
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 4: কুইজ ও আত্মযাচাই (CHECK UNDERSTANDING) */}
      {/* ========================================================= */}
      {currentStep === 'check' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border/60 pb-4">
              <div className="flex items-center gap-3">
                <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                  <HelpCircle className="h-5 w-5" />
                </div>
                <div>
                  <h2 className="text-lg sm:text-xl font-black text-foreground">
                    {isBn
                      ? 'এসএসসি বোর্ড মানসম্মত ৫টি বহুনির্বাচনি প্রশ্ন (MCQ)'
                      : '5 Authentic SSC Board Standard MCQs'}
                  </h2>
                  <p className="text-xs text-muted-foreground">
                    {isBn
                      ? 'বিগত বোর্ড পরীক্ষার গুরুত্বপূর্ণ প্রশ্ন ও তাত্ক্ষণিক ব্যাখ্যা'
                      : 'Past board questions with immediate automated rubric evaluation'}
                  </p>
                </div>
              </div>

              {showResults && (
                <button
                  onClick={() => {
                    setSelectedAnswers({});
                    setShowResults(false);
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-border text-xs font-bold hover:bg-muted transition-colors"
                >
                  <RotateCcw className="h-3.5 w-3.5" />
                  <span>{isBn ? 'পুনরায় পরীক্ষা দিন' : 'Retake Quiz'}</span>
                </button>
              )}
            </div>

            {/* MCQ List */}
            <div className="space-y-6">
              {BOARD_MCQS.map((q, idx) => {
                const selected = selectedAnswers[q.id];
                const isCorrect = selected === q.correctKey;

                return (
                  <div
                    key={q.id}
                    className="p-5 rounded-2xl border border-border/70 bg-card space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-mono font-bold text-cyan-600">
                        প্রশ্ন ০{idx + 1}
                      </span>
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-cyan-500/10 text-cyan-600">
                        {isBn ? q.boardInfoBn : q.boardInfoEn}
                      </span>
                    </div>

                    <h3 className="text-sm font-bold text-foreground">
                      {isBn ? q.questionBn : q.questionEn}
                    </h3>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                      {q.options.map((opt) => {
                        const isThisSelected = selected === opt.key;
                        let btnStyle = 'border-border/70 bg-muted/20 hover:bg-muted/40 text-foreground';

                        if (showResults) {
                          if (opt.key === q.correctKey) {
                            btnStyle = 'border-emerald-500 bg-emerald-500/15 text-emerald-800 dark:text-emerald-300 font-bold';
                          } else if (isThisSelected) {
                            btnStyle = 'border-rose-500 bg-rose-500/15 text-rose-800 dark:text-rose-300 font-bold';
                          }
                        } else if (isThisSelected) {
                          btnStyle = 'border-cyan-500 bg-cyan-500/15 text-cyan-800 dark:text-cyan-200 font-bold';
                        }

                        return (
                          <button
                            key={opt.key}
                            onClick={() => {
                              if (!showResults) {
                                setSelectedAnswers({
                                  ...selectedAnswers,
                                  [q.id]: opt.key,
                                });
                              }
                            }}
                            className={`p-3 rounded-xl border text-left text-xs transition-all flex items-center justify-between ${btnStyle}`}
                          >
                            <span>
                              <strong className="mr-2">{opt.key}.</strong>
                              {isBn ? opt.textBn : opt.textEn}
                            </span>
                            {showResults && opt.key === q.correctKey && (
                              <CheckCircle2 className="h-4 w-4 text-emerald-600 shrink-0" />
                            )}
                            {showResults && isThisSelected && opt.key !== q.correctKey && (
                              <X className="h-4 w-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {showResults && (
                      <div className="p-3 rounded-xl bg-muted/40 border border-border/60 text-xs text-muted-foreground mt-2">
                        <strong className="text-foreground">সঠিক উত্তরের ব্যাখ্যা: </strong>
                        <span>{isBn ? q.explanationBn : q.explanationEn}</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {!showResults && (
              <button
                onClick={() => setShowResults(true)}
                disabled={Object.keys(selectedAnswers).length === 0}
                className="w-full py-3.5 rounded-2xl bg-cyan-600 hover:bg-cyan-700 text-white font-bold text-xs transition-all shadow-md disabled:opacity-50"
              >
                {isBn ? 'উত্তর যাচাই করুন (Submit & Check Answers)' : 'Submit & Check Answers'}
              </button>
            )}

            {showResults && (
              <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/10 flex items-center justify-between">
                <div>
                  <h4 className="text-base font-black text-foreground">
                    আপনার মোট স্কোর:{' '}
                    {
                      BOARD_MCQS.filter((q) => selectedAnswers[q.id] === q.correctKey).length
                    }{' '}
                    / {BOARD_MCQS.length}
                  </h4>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {BOARD_MCQS.filter((q) => selectedAnswers[q.id] === q.correctKey).length === 5
                      ? 'চমৎকার! পর্যায় সারণির সমস্ত মূল কনসেপ্ট তোমার আয়ত্তে।'
                      : 'ব্যাখ্যাগুলো মনোযোগ দিয়ে পড়ে ভুলগুলো সংশোধন করে নাও।'}
                  </p>
                </div>
                <Trophy className="h-8 w-8 text-cyan-600 dark:text-cyan-400" />
              </div>
            )}
          </div>
        </div>
      )}

      {/* ========================================================= */}
      {/* STEP 5: সারসংক্ষেপ ও বোর্ড সৃজনশীল (SUMMARY & CQ RUBRIC) */}
      {/* ========================================================= */}
      {currentStep === 'summary' && (
        <div className="space-y-8 animate-in fade-in duration-300">
          {/* Section 1: 10-Mark Board Creative Question */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-6 shadow-xs">
            <div className="flex items-center gap-3 border-b border-border/60 pb-4">
              <div className="h-10 w-10 rounded-xl bg-cyan-500/10 text-cyan-600 dark:text-cyan-400 flex items-center justify-center">
                <Bookmark className="h-5 w-5" />
              </div>
              <div>
                <h2 className="text-lg sm:text-xl font-black text-foreground">
                  {isBn
                    ? 'এসএসসি বোর্ড সৃজনশীল প্রশ্ন ও পূর্ণাঙ্গ মডেল উত্তর'
                    : 'SSC Board Creative Question (CQ) with Model Answers'}
                </h2>
                <p className="text-xs text-muted-foreground">
                  {isBn
                    ? '১+২+৩+৪ = মোট ১০ নম্বরের আদর্শ বোর্ড প্রশ্নের বিশ্লেষণ ও মূল্যায়নের নির্দেশিকা'
                    : 'Standard 10-mark board question rubric with step-by-step model breakdown'}
                </p>
              </div>
            </div>

            {/* Stimulus */}
            <div className="p-5 rounded-2xl border border-cyan-500/30 bg-cyan-500/5 space-y-2">
              <span className="text-xs font-bold text-cyan-600 block">উদ্দীপকটি লক্ষ্য করো:</span>
              <p className="text-xs sm:text-sm text-foreground leading-relaxed">
                পর্যায় সারণির ২য় ও ৩য় পর্যায়ের চারটি পরিচিত মৌল যথাক্রমে{' '}
                <strong>
                  <RenderMathText text="X(Z=7)" />
                </strong>
                ,{' '}
                <strong>
                  <RenderMathText text="Y(Z=8)" />
                </strong>
                ,{' '}
                <strong>
                  <RenderMathText text="Z(Z=11)" />
                </strong>
                , এবং{' '}
                <strong>
                  <RenderMathText text="M(Z=17)" />
                </strong>
                ।
              </p>
            </div>

            {/* 4 CQ Questions & Accordion Rubric */}
            <div className="space-y-3">
              {/* Question Ka */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'a' ? null : 'a')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600">
                      (ক) জ্ঞানমূলক [১]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">ডোবেরাইনারের ত্রয়ী সূত্রটি লেখো।</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'a' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'a' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> পর্যায় সারণিতে দুটি মৌলের পারমাণবিক ভরের গড় যদি অন্য একটি মৌলের পারমাণবিক ভরের প্রায় সমান হয় এবং মৌল তিনটির ধর্ম একই রকম হয়, তবে তাকে ডোবেরাইনারের ত্রয়ী সূত্র বলে। যেমন: Li (৭) ও K (৩৯) এর ভরের গড় = Na (২৩)।
                    </p>
                  </div>
                )}
              </div>

              {/* Question Kha */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'b' ? null : 'b')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600">
                      (খ) অনুধাবনমূলক [২]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">হিলিয়ামকে ২ নং গ্রুপে না রেখে ১৮ নং গ্রুপে রাখা হয়েছে কেন?</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'b' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'b' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-1.5">
                    <p>
                      <strong>আদর্শ উত্তর:</strong> হিলিয়ামের ইলেকট্রন বিন্যাস <RenderMathText text="1s^2" />। নিয়ম ১ অনুযায়ী বহিঃস্থ স্তরে ২টি <RenderMathText text="s" /> ইলেকট্রন থাকায় একে ২ নং গ্রুপে মৃৎক্ষার ধাতুগুলোর সাথে রাখার কথা ছিল।
                    </p>
                    <p>
                      কিন্তু হিলিয়াম একটি নিষ্ক্রিয় গ্যাস। এর প্রথম ও একমাত্র প্রধান শক্তিস্তরটি সর্বোচ্চ ২টি ইলেকট্রন দ্বারাই সম্পূর্ণ পূর্ণ (দ্বিত্ব নিয়ম)। এটি কোনো রাসায়নিক বিক্রিয়ায় অংশ নেয় না এবং এর সমস্ত ধর্ম ১৮ নং গ্রুপের নিষ্ক্রিয় গ্যাসগুলোর সাথে অবিকল মিলে যায়। তাই ধর্মের সাদৃশ্য বজায় রাখতে একে ১৮ নং গ্রুপে স্থান দেওয়া হয়েছে।
                    </p>
                  </div>
                )}
              </div>

              {/* Question Ga */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'c' ? null : 'c')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600">
                      (গ) প্রয়োগমূলক [৩]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">উদ্দীপকের Z ও M মৌল দুটির পর্যায় সারণিতে পর্যায় ও গ্রুপ নির্ণয় করো।</h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'c' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'c' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-2">
                    <p>
                      <strong>মডেল উত্তর ও নম্বর বিভাজন:</strong>
                    </p>
                    <div className="bg-muted/40 p-3 rounded-xl font-mono space-y-2 text-foreground">
                      <p>
                        ১. Z মৌলটি হলো সোডিয়াম (Na, পারমাণবিক সংখ্যা ১১):
                        <br />
                        ইলেকট্রন বিন্যাস: <RenderMathText text="1s^2 2s^2 2p^6 3s^1" />
                        <br />
                        • সর্বোচ্চ প্রধান শক্তিস্তর n = 3, সুতরাং <strong>পর্যায় = ৩</strong>। [১ নম্বর]
                        <br />
                        • নিয়ম ১ অনুযায়ী সর্ববহিঃস্থ s অরবিটালে ১টি ইলেকট্রন আছে, সুতরাং <strong>গ্রুপ = ১</strong>।
                      </p>
                      <div className="border-t border-border/60 my-1" />
                      <p>
                        ২. M মৌলটি হলো ক্লোরিন (Cl, পারমাণবিক সংখ্যা ১৭):
                        <br />
                        ইলেকট্রন বিন্যাস: <RenderMathText text="1s^2 2s^2 2p^6 3s^2 3p^5" />
                        <br />
                        • সর্বোচ্চ প্রধান শক্তিস্তর n = 3, সুতরাং <strong>পর্যায় = ৩</strong>। [১ নম্বর]
                        <br />
                        • নিয়ম ২ অনুযায়ী বহিঃস্থ স্তরে s ও p অরবিটালের ইলেকট্রন সংখ্যার সাথে ১০ যোগ: ২ + ৫ + ১০ = <strong>গ্রুপ ১৭</strong>। [১ নম্বর]
                      </p>
                    </div>
                  </div>
                )}
              </div>

              {/* Question Gha */}
              <div className="rounded-2xl border border-border/70 p-4 bg-card space-y-2">
                <div
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => setOpenRubric(openRubric === 'd' ? null : 'd')}
                >
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-bold px-2 py-0.5 rounded bg-cyan-500/15 text-cyan-600">
                      (ঘ) উচ্চতর দক্ষতা [৪]
                    </span>
                    <h4 className="text-sm font-bold text-foreground">
                      উদ্দীপকের X ও Y মৌল দুটির মধ্যে কোনটির ১ম আয়নীকরণ শক্তি বেশি? ইলেকট্রন বিন্যাসের আলোকে বিশ্লেষণ করো।
                    </h4>
                  </div>
                  <ChevronDown className={`h-4 w-4 transition-transform ${openRubric === 'd' ? 'rotate-180' : ''}`} />
                </div>

                {openRubric === 'd' && (
                  <div className="text-xs text-muted-foreground pt-2 border-t border-border/60 space-y-2">
                    <p>
                      <strong>৪ নম্বরের পূর্ণাঙ্গ বোর্ড উত্তর:</strong>
                    </p>
                    <p>
                      উদ্দীপকের X (Z=7) হলো নাইট্রোজেন (N) এবং Y (Z=8) হলো অক্সিজেন (O)। উভয় মৌলই পর্যায় সারণির দ্বিতীয় পর্যায়ের অন্তর্ভুক্ত।
                    </p>
                    <div className="bg-muted/40 p-3 rounded-xl font-mono text-foreground space-y-1">
                      <p>N (7): 1s² 2s² 2p³ (2px¹ 2py¹ 2pz¹)</p>
                      <p>O (8): 1s² 2s² 2p⁴ (2px² 2py¹ 2pz¹)</p>
                    </div>
                    <p>
                      সাধারণ নিয়ম অনুযায়ী একই পর্যায়ে বাম থেকে ডানে গেলে পরমাণুর আকার হ্রাস পায় এবং আয়নীকরণ শক্তি বৃদ্ধি পায়। সে হিসেবে নাইট্রোজেনের ডানে অবস্থিত অক্সিজেনের আয়নীকরণ শক্তি বেশি হওয়ার কথা।
                    </p>
                    <p>
                      <strong>ব্যতিক্রমের কারণ:</strong> কোনো পরমাণুর সর্ববহিঃস্থ উপস্তর ইলেকট্রন দ্বারা অর্ধপূর্ণ বা সম্পূর্ণ পূর্ণ থাকলে তা অত্যন্ত সুস্থিত (Stable) হয়। নাইট্রোজেনের ক্ষেত্রে ২p উপস্তরটি সুষমভাবে অর্ধপূর্ণ (<RenderMathText text="2p^3" />), যা অধিক স্থিতিশীল। ফলে এর থেকে একটি ইলেকট্রন অপসারণ করতে অতিরিক্ত শক্তির প্রয়োজন হয়।
                    </p>
                    <p>
                      অন্যদিকে, অক্সিজেনের ২p উপস্তরে ৪টি ইলেকট্রন রয়েছে (<RenderMathText text="2p^4" />)। এটি থেকে ১টি ইলেকট্রন অপসারণ করলে তা সহজে অধিক স্থিতিশীল <RenderMathText text="2p^3" /> কাঠামো লাভ করে।
                    </p>
                    <p className="font-bold text-cyan-700 dark:text-cyan-300">
                      অতএব, আকারের সাধারণ নিয়মের ব্যতিক্রম ঘটিয়ে নাইট্রোজেনের (X) প্রথম আয়নীকরণ শক্তি অক্সিজেনের (Y) চেয়ে বেশি।
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Quick Revision Checklist */}
          <div className="rounded-3xl border border-border/80 bg-card p-6 sm:p-8 space-y-4 shadow-xs">
            <h3 className="text-base font-black text-foreground flex items-center gap-2">
              <CheckCircle2 className="h-5 w-5 text-emerald-500" />
              {isBn ? 'অধ্যায় ০৪ রিভিশন চেকলিস্ট' : 'Chapter 04 Revision Checklist'}
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              {[
                { labelBn: 'মেন্ডেলিফ বনাম মোসলের পর্যায় সূত্র পার্থক্য', ok: true },
                { labelBn: '৭টি পর্যায় ও ১৮টি গ্রুপের মৌল সংখ্যা বিন্যাস', ok: true },
                { labelBn: 'গ্রুপ নির্ণয়ের ৩টি মাস্টার নিয়ম (s, p, d-ব্লক)', ok: true },
                { labelBn: 'Cr (24) ও Cu (29) এর গ্রুপ ও পর্যায় নির্ণয়', ok: true },
                { labelBn: 'পর্যায় ও গ্রুপে পারমাণবিক ব্যাসার্ধের পরিবর্তন যুক্তি', ok: true },
                { labelBn: 'আয়নীকরণ শক্তিতে Be > B এবং N > O ব্যতিক্রম', ok: true },
                { labelBn: 'ইলেকট্রন আসক্তিতে Cl > F ব্যতিক্রমী কারণ', ok: true },
                { labelBn: 'ক্ষার ধাতু ও পানির বিক্রিয়ার সমীকরণ ও ফেনলফথ্যালিন পরীক্ষা', ok: true },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 p-2.5 rounded-xl bg-muted/20 border border-border/60 text-foreground"
                >
                  <Check className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{item.labelBn}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 3. Footer Step Navigation */}
      <StepNavigationFooter
        currentStep={activeStep as StepKey}
        onStepChange={(step) => setActiveStep(step as LearningStep)}
        chapterNumberBn="অধ্যায় ০৪"
        chapterNumberEn="Chapter 04"
        chapterTitleBn="পর্যায় সারণি"
        chapterTitleEn="Periodic Table"
        subjectHref="/dashboard/playground/v2?subject=chemistry"
      />
    </main>

    {/* ========================================================= */}
    {/* COLUMN 3: RIGHT SIDEBAR (AI Chemistry Tutor Drawer)       */}
    {/* ========================================================= */}
    {isRightSidebarOpen && (
      <aside className="w-80 shrink-0 rounded-3xl border border-border/80 bg-card p-5 shadow-xs space-y-4 animate-in slide-in-from-right duration-200 sticky top-20 flex flex-col h-[calc(100vh-6rem)]">
        <div className="flex items-center justify-between border-b border-border/70 pb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <h3 className="text-xs font-bold text-foreground">
                {isBn ? 'AI রসায়ন শিক্ষক' : 'AI Chemistry Tutor'}
              </h3>
              <span className="text-[10px] text-muted-foreground">
                {isBn ? 'অধ্যায় ৪ বিশেষজ্ঞ' : 'Chapter 4 Specialist'}
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsRightSidebarOpen(false)}
            className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Chat Transcript Container */}
        <div className="flex-1 overflow-y-auto space-y-3 pr-1 text-xs">
          {chatMessages.map((msg, i) => (
            <div
              key={i}
              className={`p-3 rounded-2xl ${
                msg.role === 'user'
                  ? 'bg-cyan-600 text-white ml-6 rounded-tr-xs'
                  : 'bg-muted/50 text-foreground mr-6 rounded-tl-xs border border-border/60'
              }`}
            >
              <p className="leading-relaxed">{msg.text}</p>
            </div>
          ))}
          {isAiLoading && (
            <div className="p-3 rounded-2xl bg-muted/40 text-muted-foreground text-xs animate-pulse">
              {isBn ? 'উত্তরের বিশ্লেষণ তৈরি হচ্ছে...' : 'Formulating response...'}
            </div>
          )}
        </div>

        {/* Chat Input */}
        <div className="pt-2 border-t border-border/70 space-y-2">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={chatInput}
              onChange={(e) => setChatInput(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendAiMessage()}
              placeholder={isBn ? 'পর্যায় সারণি নিয়ে প্রশ্ন করো...' : 'Ask about periodic table...'}
              className="flex-1 rounded-xl bg-muted/50 border border-border/80 px-3 py-2 text-xs text-foreground placeholder:text-muted-foreground focus:outline-hidden focus:ring-1 focus:ring-cyan-500"
            />
            <button
              onClick={handleSendAiMessage}
              disabled={isAiLoading || !chatInput.trim()}
              className="p-2 rounded-xl bg-cyan-600 hover:bg-cyan-700 text-white transition-all disabled:opacity-50 shrink-0"
            >
              <Send className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      </aside>
    )}
  </div>
</div>
  );
}
