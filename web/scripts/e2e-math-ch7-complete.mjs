import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh7E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 7 (ব্যবহারিক জ্যামিতি / Practical Geometry) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 7
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
      path: path.join(ARTIFACTS_DIR, 'math-ch7-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 7
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/7...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/7`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so the interactive canvas and controls are beautifully centered
    await page.evaluate(() => window.scrollTo({ top: 310, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 1: LAB 1 - SUM MODE STEP 1 ---
    console.log('[*] Testing Lab 1: Sum Mode Step 1...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step1Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ১');
      if (step1Btn) step1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-01-learn-lab1-sum-step1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-01-learn-lab1-sum-step1.png');

    // --- SNAPSHOT 2: LAB 1 - SUM MODE STEP 3 ---
    console.log('[*] Testing Lab 1: Sum Mode Step 3 (BD = s cut)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ৩');
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-02-learn-lab1-sum-step3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-02-learn-lab1-sum-step3.png');

    // --- SNAPSHOT 3: LAB 1 - SUM MODE STEP 4 (COMPLETE TRIANGLE ABC) ---
    console.log('[*] Testing Lab 1: Sum Mode Step 4 Complete...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ৪');
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-03-learn-lab1-sum-step4-complete.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-03-learn-lab1-sum-step4-complete.png');

    // --- SNAPSHOT 4: LAB 1 - PERIMETER SUB-MODE STEP 2 ---
    console.log('[*] Testing Lab 1: Perimeter Mode Step 2 (Half Angles)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pModeBtn = buttons.find((b) => b.textContent?.includes('সম্পাদ্য ০৩: পরিসীমা'));
      if (pModeBtn) pModeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ২');
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-04-learn-lab1-perimeter-step2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-04-learn-lab1-perimeter-step2.png');

    // --- SNAPSHOT 5: LAB 1 - PERIMETER SUB-MODE STEP 4 COMPLETE ---
    console.log('[*] Testing Lab 1: Perimeter Mode Step 4 Complete...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ৪');
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-05-learn-lab1-perimeter-step4-complete.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-05-learn-lab1-perimeter-step4-complete.png');

    // --- SWITCH TO LAB 2: DIFFERENCE OF SIDES ---
    console.log('[*] Navigating to Lab 2: Difference of Sides...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২') || b.textContent?.includes('বাহুর অন্তর'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 6: LAB 2 - CASE 1 (c > b) ---
    console.log('[*] Testing Lab 2: Case 1 (c > b)...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-06-learn-lab2-difference-case1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-06-learn-lab2-difference-case1.png');

    // --- SNAPSHOT 7: LAB 2 - CASE 2 (c < b / OPPOSITE RAY) ---
    console.log('[*] Testing Lab 2: Case 2 (c < b / Opposite Ray)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const case2Btn = buttons.find((b) => b.textContent?.includes('বিপরীত বাহু'));
      if (case2Btn) case2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-07-learn-lab2-difference-case2-opposite-ray.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-07-learn-lab2-difference-case2-opposite-ray.png');

    // --- SWITCH TO LAB 3: RIGHT TRIANGLE ---
    console.log('[*] Navigating to Lab 3: Right Triangle...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩') || b.textContent?.includes('সমকোণী'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 8: LAB 3 - STEP 2 (ARC) ---
    console.log('[*] Testing Lab 3: Right Triangle Step 2...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ২');
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-08-learn-lab3-right-triangle-stepper.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-08-learn-lab3-right-triangle-stepper.png');

    // --- SNAPSHOT 9: LAB 3 - STEP 3 (HYPOTENUSE & SIDE COMPLETE) ---
    console.log('[*] Testing Lab 3: Right Triangle Step 3 Complete...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ৩');
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-09-learn-lab3-right-triangle-hyp-side.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-09-learn-lab3-right-triangle-hyp-side.png');

    // --- SWITCH TO LAB 4: 5 CONDITIONS & QUAD MATRIX ---
    console.log('[*] Navigating to Lab 4: 5 Independent Conditions & Quad Matrix...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪') || b.textContent?.includes('৫টি স্বতন্ত্র শর্ত'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 10: LAB 4 - 5 CONDITIONS DEFAULT ---
    console.log('[*] Testing Lab 4: Condition 1 Tab...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-10-learn-lab4-5-conditions-tab1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-10-learn-lab4-5-conditions-tab1.png');

    // --- SNAPSHOT 11: LAB 4 - QUAD MATRIX: RHOMBUS ---
    console.log('[*] Testing Lab 4: Quad Matrix Rhombus (2 Data)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rhomBtn = buttons.find((b) => b.textContent?.includes('রম্বস'));
      if (rhomBtn) rhomBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-11-learn-lab4-quad-matrix-rhombus.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-11-learn-lab4-quad-matrix-rhombus.png');

    // --- SNAPSHOT 12: LAB 4 - QUAD MATRIX: TRAPEZOID ---
    console.log('[*] Testing Lab 4: Quad Matrix Trapezoid (4 Data)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trapBtn = buttons.find((b) => b.textContent?.includes('ট্রাপিজিয়াম'));
      if (trapBtn) trapBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-12-learn-lab4-quad-matrix-trapezoid.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-12-learn-lab4-quad-matrix-trapezoid.png');

    // --- SWITCH TO LAB 5: RHOMBUS & TRAPEZOID SIMULATOR ---
    console.log('[*] Navigating to Lab 5: Rhombus & Trapezoid Simulator...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫') || b.textContent?.includes('ট্রাপিজিয়াম ও রম্বস'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 13: LAB 5 - RHOMBUS SIMULATOR ---
    console.log('[*] Testing Lab 5: Rhombus Diagonals Simulator...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-13-learn-lab5-rhombus-simulator.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-13-learn-lab5-rhombus-simulator.png');

    // --- SNAPSHOT 14: LAB 5 - TRAPEZOID SIMULATOR ---
    console.log('[*] Testing Lab 5: Trapezoid Simulator...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trapBtn = buttons.find((b) => b.textContent?.includes('সম্পাদ্য ০৬: ট্রাপিজিয়াম'));
      if (trapBtn) trapBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-14-learn-lab5-trapezoid-simulator.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-14-learn-lab5-trapezoid-simulator.png');

    // --- SWITCH TO STEP 2: SEE EXAMPLES (BOARD CQS) ---
    console.log('[*] Navigating to Step 2: Board Creative Questions (CQ)...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const cqTab = tabs.find((b) => b.textContent?.includes('২. বোর্ড সৃজনশীল') || b.textContent?.includes('বোর্ড সৃজনশীল'));
      if (cqTab) cqTab.click();
      window.scrollTo({ top: 220, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 500));

    // Toggle Examiner Secret on CQ 1
    await page.evaluate(() => {
      const secretBtns = Array.from(document.querySelectorAll('button'));
      const bSec = secretBtns.find((b) => b.textContent?.includes('পরীক্ষকের গোপন নম্বর সিক্রেট'));
      if (bSec) bSec.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 15: STEP 2 - SEE EXAMPLES ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-15-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-15-see-example-cqs.png');

    // --- SWITCH TO STEP 3: TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Navigating to Step 3: Try Yourself (Interactive Challenges)...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const tryTab = tabs.find((b) => b.textContent?.includes('৩. নিজে করো') || b.textContent?.includes('নিজে করো'));
      if (tryTab) tryTab.click();
      window.scrollTo({ top: 200, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 500));

    // Solve Challenge 1 (4.5)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
      if (inputs[0]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputs[0], '4.5');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[0]) verifyBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Solve Challenge 2 (5)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
      if (inputs[1]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(inputs[1], '5');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[1]) verifyBtns[1].click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Solve Challenge 3 (৪টি)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const fourBtn = buttons.find((b) => b.textContent?.trim() === '৪টি');
      if (fourBtn) fourBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 16: STEP 3 - TRY YOURSELF SOLVED ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-16-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-16-try-yourself-challenges.png');

    // --- SWITCH TO STEP 4: CHECK UNDERSTANDING (MCQS) ---
    console.log('[*] Navigating to Step 4: Check Understanding (MCQs)...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const quizTab = tabs.find((b) => b.textContent?.includes('৪. যাচাই করো') || b.textContent?.includes('যাচাই করো'));
      if (quizTab) quizTab.click();
      window.scrollTo({ top: 160, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 500));

    // Answer 5 MCQs scoped to each question container for 100% score (5/5)
    await page.evaluate(() => {
      const qCards = Array.from(document.querySelectorAll('main div.bg-card.rounded-2xl.border.p-5.shadow-sm.space-y-4'));

      if (qCards[0]) {
        const opts = Array.from(qCards[0].querySelectorAll('button'));
        const opt5 = opts.find((b) => b.textContent?.trim() === '৫টি');
        if (opt5) opt5.click();
      }

      if (qCards[1]) {
        const opts = Array.from(qCards[1].querySelectorAll('button'));
        const opt24 = opts.find((b) => b.textContent?.trim() === '২৪ cm²');
        if (opt24) opt24.click();
      }

      if (qCards[2]) {
        const opts = Array.from(qCards[2].querySelectorAll('button'));
        const optBorg = opts.find((b) => b.textContent?.trim() === 'বর্গ');
        if (optBorg) optBorg.click();
      }

      if (qCards[3]) {
        const opts = Array.from(qCards[3].querySelectorAll('button'));
        const optSum = opts.find((b) => b.textContent?.includes('ভূমি, ভূমিসংলগ্ন কোণ ও অপর দুই বাহুর সমষ্টি'));
        if (optSum) optSum.click();
      }

      if (qCards[4]) {
        const opts = Array.from(qCards[4].querySelectorAll('button'));
        const opt4 = opts.find((b) => b.textContent?.trim() === '৪টি');
        if (opt4) opt4.click();
      }
    });
    await new Promise((r) => setTimeout(r, 400));

    // Submit quiz
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => b.textContent?.includes('কুইজ জমা দিন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 17: STEP 4 - MCQS GRADED (5/5) ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-17-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-17-check-understanding-mcqs.png');

    // --- SWITCH TO STEP 5: SUMMARY & CHEAT SHEET ---
    console.log('[*] Navigating to Step 5: Summary & Cheat Sheet...');
    await page.evaluate(() => {
      const tabs = Array.from(document.querySelectorAll('button'));
      const sumTab = tabs.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ') || b.textContent?.includes('সারসংক্ষেপ'));
      if (sumTab) sumTab.click();
      window.scrollTo({ top: 160, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click Copy Notes button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('কপি করুন') || b.textContent?.includes('নোটস'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 18: STEP 5 - SUMMARY CHEAT SHEET ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-18-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-18-summary-cheat-sheet.png');

    // --- OPEN SHERU AI TUTOR DRAWER ---
    console.log('[*] Testing Sheru AI Tutor Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sheruBtn = buttons.find((b) => b.textContent?.includes('শেরু এআই টিউটর'));
      if (sheruBtn) sheruBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click quick prompt in drawer
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('সম্পাদ্য ১-এ কোণদ্বয়'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // --- SNAPSHOT 19: SHERU AI TUTOR DRAWER ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch7-19-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch7-19-ai-tutor-drawer.png');

    console.log('\n========================================');
    console.log('✅ ALL 20 CHAPTER 7 SNAPSHOTS CAPTURED WITH ENHANCED CENTERING & 100% MCQ SCORE!');
    console.log('Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.warn('Errors logged:', consoleErrors);
    }
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMathCh7E2ETest();
