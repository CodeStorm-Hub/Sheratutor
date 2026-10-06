import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runMathCh9E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 9 (ত্রিকোণমিতিক অনুপাত / Trigonometric Ratios) Playground V2...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1500,950'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 950 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. LOGIN
    console.log('[*] Step 1: Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully.');

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 9
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2 Library View...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Select Math tab in library
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mathBtn = buttons.find((b) => b.textContent?.includes('Mathematics') || b.textContent?.includes('সাধারণ গণিত'));
      if (mathBtn) mathBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 9
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/9...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/9`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so the interactive canvas and controls are centered
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - TRIANGLE RATIOS STANDARD (36.87 deg) ---
    console.log('[*] Testing Lab 1: Right Triangle Ratios Standard...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-01-learn-lab1-tri-ratios-std.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-01-learn-lab1-tri-ratios-std.png');

    // --- SNAPSHOT 02: LAB 1 - ANGLE SLIDER TO 50 DEG ---
    console.log('[*] Adjusting Lab 1 Angle Slider to 50 deg...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '50');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-02-learn-lab1-tri-ratios-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-02-learn-lab1-tri-ratios-slider.png');

    // --- LAB 2: 3 FUNDAMENTAL IDENTITIES ---
    console.log('[*] Switching to Lab 2: 3 Fundamental Identities...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২') || b.textContent?.includes('অভেদাবলি'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 03: LAB 2 - IDENTITY 1 (sin² + cos² = 1) ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-03-learn-lab2-identity1-sin-cos.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-03-learn-lab2-identity1-sin-cos.png');

    // --- SNAPSHOT 04: LAB 2 - IDENTITY 2 (sec² - tan² = 1) ---
    console.log('[*] Selecting Identity 2 (sec² - tan² = 1)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const id2Btn = buttons.find((b) => b.textContent?.includes('sec² - tan²'));
      if (id2Btn) id2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-04-learn-lab2-identity2-sec-tan.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-04-learn-lab2-identity2-sec-tan.png');

    // --- SNAPSHOT 05: LAB 2 - IDENTITY 3 (csc² - cot² = 1) ---
    console.log('[*] Selecting Identity 3 (csc² - cot² = 1)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const id3Btn = buttons.find((b) => b.textContent?.includes('csc² - cot²'));
      if (id3Btn) id3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-05-learn-lab2-identity3-csc-cot.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-05-learn-lab2-identity3-csc-cot.png');

    // --- LAB 3: STANDARD TRIG VALUES & HAND TRICK ---
    console.log('[*] Switching to Lab 3: Standard Trig Values & Hand Trick...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩') || b.textContent?.includes('মান ছক'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 06: LAB 3 - 30 DEG ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-06-learn-lab3-values-30deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-06-learn-lab3-values-30deg.png');

    // --- SNAPSHOT 07: LAB 3 - 45 DEG ---
    console.log('[*] Selecting 45 deg...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const deg45Btn = buttons.find((b) => b.textContent?.trim() === '45°');
      if (deg45Btn) deg45Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-07-learn-lab3-values-45deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-07-learn-lab3-values-45deg.png');

    // --- SNAPSHOT 08: LAB 3 - 60 DEG ---
    console.log('[*] Selecting 60 deg...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const deg60Btn = buttons.find((b) => b.textContent?.trim() === '60°');
      if (deg60Btn) deg60Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-08-learn-lab3-values-60deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-08-learn-lab3-values-60deg.png');

    // --- SNAPSHOT 09: LAB 3 - 90 DEG UNDEFINED DETECTOR ---
    console.log('[*] Selecting 90 deg (Undefined tan detector)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const deg90Btn = buttons.find((b) => b.textContent?.trim() === '90°');
      if (deg90Btn) deg90Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-09-learn-lab3-values-90deg-undefined.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-09-learn-lab3-values-90deg-undefined.png');

    // --- LAB 4: TRIG EQUATIONS & CONSTRAINTS ---
    console.log('[*] Switching to Lab 4: Trig Equations & Constraints...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪') || b.textContent?.includes('সমীকরণ সমাধান'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 10: LAB 4 - ACUTE CONSTRAINT ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-10-learn-lab4-equation-acute.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-10-learn-lab4-equation-acute.png');

    // --- SNAPSHOT 11: LAB 4 - NON-NEGATIVE CONSTRAINT ---
    console.log('[*] Switching to Non-Negative Constraint (0 <= theta <= 90)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const nonNegBtn = buttons.find((b) => b.textContent?.includes('০° ≤ θ ≤ ৯০°'));
      if (nonNegBtn) nonNegBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-11-learn-lab4-equation-non-negative.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-11-learn-lab4-equation-non-negative.png');

    // --- LAB 5: COMPLEMENTARY ANGLES ---
    console.log('[*] Switching to Lab 5: Complementary Angles...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫') || b.textContent?.includes('পরিপূরক কোণ'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 12: LAB 5 - COMP ANGLES 35 DEG ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-12-learn-lab5-comp-angles-35deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-12-learn-lab5-comp-angles-35deg.png');

    // --- SNAPSHOT 13: LAB 5 - COMP ANGLES 60 DEG SLIDER ---
    console.log('[*] Adjusting Lab 5 Angle A Slider to 60 deg...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '60');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-13-learn-lab5-comp-angles-60deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-13-learn-lab5-comp-angles-60deg.png');

    // --- STEP 2: SEE EXAMPLE (WORKED BOARD CQS) ---
    console.log('[*] Step 4: Navigating to Step 2: See Example CQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // --- SNAPSHOT 14: STEP 2 - CQ 1 (DHAKA BOARD) EXPANDED ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-14-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-14-see-example-cq1-dhaka.png');

    // --- SNAPSHOT 15: STEP 2 - CQ 2 (RAJSHAHI BOARD) EXPANDED ---
    console.log('[*] Expanding CQ 2 (Rajshahi Board)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const cqButtons = buttons.filter((b) => b.querySelector('span') && b.textContent?.includes('বোর্ড'));
      if (cqButtons[1]) cqButtons[1].click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-15-see-example-cq2-rajshahi.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-15-see-example-cq2-rajshahi.png');

    // --- STEP 3: TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Step 5: Navigating to Step 3: Try Yourself Challenges...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. নিজে করো'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Solve Challenge 1: tan = 3/4 => sin = 0.6
    console.log('[*] Solving Challenge 1: sin theta = 0.6...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('main input[type="text"]');
      if (inputs[0]) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[0], '0.6');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const checkBtn = buttons.find((b) => b.textContent?.trim() === 'যাচাই');
      if (checkBtn) checkBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Solve Challenge 2: sin² 30° + cos² 30° = 1
    console.log('[*] Solving Challenge 2: identity value = 1...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('main input[type="text"]');
      if (inputs[1]) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[1], '1');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[1]) verifyBtns[1].click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Solve Challenge 3: (1 - tan² 45°) / (1 + tan² 45°) = 0
    console.log('[*] Solving Challenge 3: value = 0...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('main input[type="text"]');
      if (inputs[2]) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[2], '0');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[2]) verifyBtns[2].click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 16: STEP 3 - ALL CHALLENGES SOLVED ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-16-try-yourself-solved.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-16-try-yourself-solved.png');

    // --- STEP 4: CHECK UNDERSTANDING (MCQS) ---
    console.log('[*] Step 6: Navigating to Step 4: Check Understanding MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. যাচাই'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer all 5 MCQs correctly:
    // Q1: tan theta = 4/3 => cot theta = 3/4 (Option B / index 1)
    // Q2: sec² - tan² = 1 (Option B / index 1)
    // Q3: sin 60° and cos 30° => √3/2, √3/2 (Option B / index 1)
    // Q4: Undefined value => tan 90° (Option C / index 2)
    // Q5: 2 sin θ cos θ = sin θ => θ = 60° (Option C / index 2)
    console.log('[*] Selecting correct options for all 5 MCQs...');
    await page.evaluate(() => {
      const correctIndices = [1, 1, 1, 2, 2];
      const qCards = document.querySelectorAll('[data-quiz-question]');
      qCards.forEach((card, idx) => {
        const btns = card.querySelectorAll('button');
        const targetBtn = btns[correctIndices[idx]];
        if (targetBtn) targetBtn.click();
      });
    });
    await new Promise((r) => setTimeout(r, 400));

    // Click submit
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('main button')).find(
        (b) => b.textContent?.includes('কুইজ সাবমিট করুন')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 17: STEP 4 - MCQS 100% SCORE (5/5) ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-17-check-understanding-100pct.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-17-check-understanding-100pct.png');

    // --- STEP 5: SUMMARY & REVISION CHEAT SHEET ---
    console.log('[*] Step 7: Navigating to Step 5: Summary & Revision Cheat Sheet...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // --- SNAPSHOT 18: STEP 5 - SUMMARY CHEAT SHEET ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-18-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-18-summary-cheat-sheet.png');

    // --- SHERU AI SOCRATIC TUTOR DRAWER ---
    console.log('[*] Step 8: Testing Sheru AI Tutor Drawer...');
    await page.evaluate(() => {
      const tutorBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('শেরু AI টিউটর')
      );
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click quick preset question: 'sin²+cos² প্রমাণ?'
    await page.evaluate(() => {
      const chip = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('sin²+cos²')
      );
      if (chip) chip.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Send question
    await page.evaluate(() => {
      const sendBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.querySelector('svg.lucide-send') || b.querySelector('svg')
      );
      // Click the send button next to input
      const drawerInput = document.querySelector('input[placeholder*="ত্রিকোণমিতি সম্পর্কিত"]');
      if (drawerInput && drawerInput.nextElementSibling) {
        drawerInput.nextElementSibling.click();
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    // --- SNAPSHOT 19: AI TUTOR DRAWER CONVERSATION ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch9-19-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch9-19-ai-tutor-drawer.png');

    // Verify console errors
    console.log('\n--- Console Error Audit ---');
    if (consoleErrors.length === 0) {
      console.log('✅ 0 Console Errors encountered during entire test run!');
    } else {
      console.warn(`⚠️ Encountered ${consoleErrors.length} console errors:`, consoleErrors);
    }

    console.log('\n🎉 Chapter 9 E2E Test Completed Successfully with all 20 snapshots captured!\n');
  } catch (err) {
    console.error('❌ E2E Test Failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runMathCh9E2ETest();
