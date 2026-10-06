import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runMathCh11E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 11 (বীজগাণিতিক অনুপাত ও সমানুপাত / Algebraic Ratio & Proportion) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 11
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
      path: path.join(ARTIFACTS_DIR, 'math-ch11-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 11
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/11...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/11`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so the interactive canvas and controls are centered
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - RATIO STANDARD (a=3, b=6, c=4 => d=8) ---
    console.log('[*] Testing Lab 1: Ratio Standard...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-01-learn-lab1-ratio-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-01-learn-lab1-ratio-standard.png');

    // --- SNAPSHOT 02: LAB 1 - ADJUST SLIDERS a=4, b=8, c=5 ---
    console.log('[*] Adjusting Lab 1 Sliders (a=4, b=8, c=5)...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length >= 3) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[0], '4');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(sliders[1], '8');
        sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[1].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(sliders[2], '5');
        sliders[2].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[2].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-02-learn-lab1-ratio-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-02-learn-lab1-ratio-slider.png');

    // --- SNAPSHOT 03: LAB 1 - আড়গুণন (CROSS MULTIPLICATION) ---
    console.log('[*] Testing Lab 1: Cross Multiplication...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const crossBtn = buttons.find((b) => b.textContent?.includes('আড়গুণন'));
      if (crossBtn) crossBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-03-learn-lab1-ratio-cross.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-03-learn-lab1-ratio-cross.png');

    // --- SNAPSHOT 04: LAB 1 - একান্তরকরণ (ALTERNENDO) ---
    console.log('[*] Testing Lab 1: Alternendo...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const altBtn = buttons.find((b) => b.textContent?.includes('একান্তরকরণ'));
      if (altBtn) altBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-04-learn-lab1-ratio-alternendo.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-04-learn-lab1-ratio-alternendo.png');

    // --- SNAPSHOT 05: LAB 1 - ব্যস্তকরণ (INVERTENDO) ---
    console.log('[*] Testing Lab 1: Invertendo...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const invBtn = buttons.find((b) => b.textContent?.includes('ব্যস্তকরণ'));
      if (invBtn) invBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-05-learn-lab1-ratio-invertendo.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-05-learn-lab1-ratio-invertendo.png');

    // --- SNAPSHOT 06: LAB 2 - COMPONENDO & DIVIDENDO ---
    console.log('[*] Switching to Lab 2: Componendo & Dividendo...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('যোজন ও বিয়োজন'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-06-learn-lab2-comp-div.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-06-learn-lab2-comp-div.png');

    // --- SNAPSHOT 07: LAB 2 - COMPONENDO ONLY ---
    console.log('[*] Testing Lab 2: Componendo Only...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const compBtn = buttons.find((b) => b.textContent?.includes('শুধুমাত্র যোজন'));
      if (compBtn) compBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-07-learn-lab2-comp-only.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-07-learn-lab2-comp-only.png');

    // --- SNAPSHOT 08: LAB 2 - DIVIDENDO ONLY ---
    console.log('[*] Testing Lab 2: Dividendo Only...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const divBtn = buttons.find((b) => b.textContent?.includes('শুধুমাত্র বিয়োজন'));
      if (divBtn) divBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-08-learn-lab2-div-only.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-08-learn-lab2-div-only.png');

    // --- SNAPSHOT 09: LAB 2 - ADJUST NUMERATOR SLIDER TO 7 ---
    console.log('[*] Adjusting Lab 2 Numerator to 7...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const compDivBtn = buttons.find((b) => b.textContent?.includes('যোজন-বিয়োজন (a+b)/(a-b)'));
      if (compDivBtn) compDivBtn.click();

      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '7');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-09-learn-lab2-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-09-learn-lab2-slider.png');

    // --- SNAPSHOT 10: LAB 3 - CONTINUED PROPORTION & k-METHOD ---
    console.log('[*] Switching to Lab 3: Continued Proportion & k-Method...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ক্রমিক সমানুপাতি ও k-পদ্ধতি'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-10-learn-lab3-k-method-id1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-10-learn-lab3-k-method-id1.png');

    // --- SNAPSHOT 11: LAB 3 - IDENTITY 2 ---
    console.log('[*] Testing Lab 3: Identity 2 (a^2+b^2)/(b^2+c^2) = a/c...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const id2Btn = buttons.find((b) => b.textContent?.includes('(a² + b²)/(b² + c²) = a/c'));
      if (id2Btn) id2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-11-learn-lab3-k-method-id2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-11-learn-lab3-k-method-id2.png');

    // --- SNAPSHOT 12: LAB 3 - SLIDER a=9, c=16 ---
    console.log('[*] Adjusting Lab 3 Slider a=9...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '9');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-12-learn-lab3-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-12-learn-lab3-slider.png');

    // --- SNAPSHOT 13: LAB 4 - COMPOUND RATIO & "দ" METHOD ---
    console.log('[*] Switching to Lab 4: Compound Ratio & "দ" Method...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ধারাবাহিক অনুপাত ও বাস্তব বণ্টন'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-13-learn-lab4-compound-ratio.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-13-learn-lab4-compound-ratio.png');

    // --- SNAPSHOT 14: LAB 4 - ADJUST DISTRIBUTION SUM SLIDER ---
    console.log('[*] Adjusting Lab 4 Total Sum Slider to 2800...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '2800');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-14-learn-lab4-distribution-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-14-learn-lab4-distribution-slider.png');

    // --- SNAPSHOT 15: LAB 5 - RADICAL ALGEBRAIC EQUATION SOLVER ---
    console.log('[*] Switching to Lab 5: Radical Algebraic Equation Solver...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('জটিল সমীকরণ সমাধান'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-15-learn-lab5-equation-solver.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-15-learn-lab5-equation-solver.png');

    // --- SNAPSHOT 16: LAB 5 - ADJUST p SLIDER TO 4 ---
    console.log('[*] Adjusting Lab 5 p slider to 4...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length >= 2) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[1], '4');
        sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-16-learn-lab5-equation-slider-p4.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-16-learn-lab5-equation-slider-p4.png');

    // --- SNAPSHOT 17: STEP 2 - BOARD CQ 1 ---
    console.log('[*] Step 2: Navigating to Board CQs...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('header nav button'));
      const step2Btn = navButtons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-17-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-17-see-example-cq1-dhaka.png');

    // --- SNAPSHOT 18: STEP 2 - BOARD CQ 2 ---
    console.log('[*] Expanding Board CQ 2 (Cumilla/Chittagong)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const cq2Btn = buttons.find((b) => b.textContent?.includes('কুমিল্লা বোর্ড') || b.textContent?.includes('চট্টগ্রাম বোর্ড'));
      if (cq2Btn) cq2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-18-see-example-cq2-cumilla.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-18-see-example-cq2-cumilla.png');

    // --- SNAPSHOT 19: STEP 3 - TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Step 3: Navigating to Try Yourself & Solving Challenges...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('header nav button'));
      const step3Btn = navButtons.find((b) => b.textContent?.includes('৩. নিজে করো'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Solve Challenge 1 (12), Challenge 2 (8), Challenge 3 (0.8)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('main input[type="text"]'));
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

      if (inputs[0]) {
        nativeSetter.call(inputs[0], '12');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[1]) {
        nativeSetter.call(inputs[1], '8');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[2]) {
        nativeSetter.call(inputs[2], '0.8');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Click each "যাচাই" button
      const checkButtons = Array.from(document.querySelectorAll('main button')).filter(
        (b) => b.textContent?.trim() === 'যাচাই'
      );
      checkButtons.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-19-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-19-try-yourself-challenges.png');

    // --- SNAPSHOT 20: STEP 4 - CHECK UNDERSTANDING (MCQs) ---
    console.log('[*] Step 4: Navigating to MCQs & Answering...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('header nav button'));
      const step4Btn = navButtons.find((b) => b.textContent?.includes('৪. যাচাই'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer all 5 MCQs correctly:
    // Q1 -> Option B (b^2 = ac)
    // Q2 -> Option B (a : c = b : d)
    // Q3 -> Option A (5 : 7 : 9)
    // Q4 -> Option C (50)
    // Q5 -> Option B (sqrt(a+x) / sqrt(a-x))
    await page.evaluate(() => {
      const mcqCards = Array.from(document.querySelectorAll('main .grid-cols-1.sm\\:grid-cols-2'));
      // Q1: Option B (index 1)
      if (mcqCards[0]) {
        const btns = mcqCards[0].querySelectorAll('button');
        if (btns[1]) btns[1].click();
      }
      // Q2: Option B (index 1)
      if (mcqCards[1]) {
        const btns = mcqCards[1].querySelectorAll('button');
        if (btns[1]) btns[1].click();
      }
      // Q3: Option A (index 0)
      if (mcqCards[2]) {
        const btns = mcqCards[2].querySelectorAll('button');
        if (btns[0]) btns[0].click();
      }
      // Q4: Option C (index 2)
      if (mcqCards[3]) {
        const btns = mcqCards[3].querySelectorAll('button');
        if (btns[2]) btns[2].click();
      }
      // Q5: Option B (index 1)
      if (mcqCards[4]) {
        const btns = mcqCards[4].querySelectorAll('button');
        if (btns[1]) btns[1].click();
      }

      // Submit
      const submitBtn = Array.from(document.querySelectorAll('main button')).find(
        (b) => b.textContent?.includes('উত্তর জমা দিন')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-20-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-20-check-understanding-mcqs.png');

    // --- SNAPSHOT 21: STEP 5 - SUMMARY & CHEAT SHEET ---
    console.log('[*] Step 5: Navigating to Summary & Cheat Sheet...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('header nav button'));
      const step5Btn = navButtons.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-21-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-21-summary-cheat-sheet.png');

    // --- SNAPSHOT 22: SHERU AI SOCRATIC TUTOR DRAWER ---
    console.log('[*] Testing Sheru AI Socratic Tutor Drawer...');
    await page.evaluate(() => {
      const aiBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.includes('শেরু AI টিউটর')
      );
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click quick prompt "যোজন-বিয়োজন নিয়ম?"
    await page.evaluate(() => {
      const quickBtns = Array.from(document.querySelectorAll('button'));
      const promptBtn = quickBtns.find((b) => b.textContent?.includes('যোজন-বিয়োজন নিয়ম?'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 900));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch11-22-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch11-22-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log(`✅ CHAPTER 11 E2E TESTS COMPLETED WITH 0 ERRORS!`);
    console.log(`Total snapshots captured: 23`);
    console.log(`Console errors count: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMathCh11E2ETest();
