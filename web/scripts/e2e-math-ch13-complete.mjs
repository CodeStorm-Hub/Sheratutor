import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runMathCh13E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 13 (সসীম ধারা / Finite Series) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 13
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
      path: path.join(ARTIFACTS_DIR, 'math-ch13-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 13
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/13...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/13`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so controls are nicely in view
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - AP STANDARD ---
    console.log('[*] Testing Lab 1: AP Standard...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-01-learn-lab1-ap-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-01-learn-lab1-ap-standard.png');

    // --- SNAPSHOT 02: LAB 1 - DECREASING PRESET (d=-4) ---
    console.log('[*] Lab 1: Clicking decreasing series preset (d=-4)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('হ্রাসমান'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-02-learn-lab1-ap-decreasing.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-02-learn-lab1-ap-decreasing.png');

    // --- SNAPSHOT 03: LAB 1 - EVEN NUMBERS PRESET ---
    console.log('[*] Lab 1: Clicking even numbers preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('জোড় সংখ্যা'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-03-learn-lab1-ap-even.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-03-learn-lab1-ap-even.png');

    // --- SNAPSHOT 04: LAB 2 - AP SUM & GAUSS PAIRING ---
    console.log('[*] Switching to Lab 2: AP Sum & Gauss Pairing...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('গাউস পেয়ারিং'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-04-learn-lab2-gauss-pairing.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-04-learn-lab2-gauss-pairing.png');

    // --- SNAPSHOT 05: LAB 2 - ADJUST SLIDER n ---
    console.log('[*] Lab 2: Adjusting slider n for 8 terms...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length >= 3) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[2], '8');
        sliders[2].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[2].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-05-learn-lab2-gauss-8terms.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-05-learn-lab2-gauss-8terms.png');

    // --- SNAPSHOT 06: LAB 3 - SPECIAL SERIES 1: SUM N ---
    console.log('[*] Switching to Lab 3: Special Series...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('বিশেষ ৩টি স্বাভাবিক ধারা'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-06-learn-lab3-sum-linear.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-06-learn-lab3-sum-linear.png');

    // --- SNAPSHOT 07: LAB 3 - SPECIAL SERIES 2: SUM N^2 ---
    console.log('[*] Lab 3: Switching to Sum of Squares (∑n²)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sqBtn = buttons.find((b) => b.textContent?.includes('বর্গের সমষ্টি'));
      if (sqBtn) sqBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-07-learn-lab3-sum-square.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-07-learn-lab3-sum-square.png');

    // --- SNAPSHOT 08: LAB 3 - SPECIAL SERIES 3: SUM N^3 (GOLDEN IDENTITY) ---
    console.log('[*] Lab 3: Switching to Sum of Cubes (∑n³)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cubeBtn = buttons.find((b) => b.textContent?.includes('ঘনের সমষ্টি'));
      if (cubeBtn) cubeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-08-learn-lab3-sum-cube-identity.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-08-learn-lab3-sum-cube-identity.png');

    // --- SNAPSHOT 09: LAB 4 - GP STANDARD ---
    console.log('[*] Switching to Lab 4: Geometric Progression (GP)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('গুণোত্তর ধারা ও সাধারণ অনুপাত'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-09-learn-lab4-gp-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-09-learn-lab4-gp-standard.png');

    // --- SNAPSHOT 10: LAB 4 - GP ALTERNATING SIGN (r=-2) ---
    console.log('[*] Lab 4: Clicking alternating sign preset (r=-2)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('চিহ্ন বদল'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-10-learn-lab4-gp-alternating.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-10-learn-lab4-gp-alternating.png');

    // --- SNAPSHOT 11: LAB 4 - GP FRACTIONAL HALVING (r=0.5) ---
    console.log('[*] Lab 4: Clicking halving preset (r=0.5)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('অর্ধেক'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-11-learn-lab4-gp-fractional.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-11-learn-lab4-gp-fractional.png');

    // --- SNAPSHOT 12: LAB 5 - GP SUMMATION ---
    console.log('[*] Switching to Lab 5: GP Sum & Logarithmic Series...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('গুণোত্তর ধারার সমষ্টি ও লগারিদমিক'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-12-learn-lab5-gp-sum.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-12-learn-lab5-gp-sum.png');

    // --- SNAPSHOT 13: LAB 5 - LOGARITHMIC SERIES ---
    console.log('[*] Lab 5: Switching to Logarithmic Series Converter...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const logBtn = buttons.find((b) => b.textContent?.includes('লগারিদমিক ধারা'));
      if (logBtn) logBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-13-learn-lab5-log-series.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-13-learn-lab5-log-series.png');

    // --- SNAPSHOT 14: STEP 2 - SEE EXAMPLE CQ1 ---
    console.log('[*] Switching to Step 2: Board CQ Examples...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-14-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-14-see-example-cq1-dhaka.png');

    // --- SNAPSHOT 15: STEP 2 - CQ2 CHITTAGONG BOARD ---
    console.log('[*] Selecting CQ 2 in Step 2...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq2Btn = buttons.find((b) => b.textContent?.includes('CQ ০২') || b.textContent?.includes('চট্টগ্রাম'));
      if (cq2Btn) cq2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-15-see-example-cq2-chittagong.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-15-see-example-cq2-chittagong.png');

    // --- SNAPSHOT 16: STEP 2 - CQ3 CUMILLA BOARD ---
    console.log('[*] Selecting CQ 3 in Step 2...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq3Btn = buttons.find((b) => b.textContent?.includes('CQ ০৩') || b.textContent?.includes('কুমিল্লা'));
      if (cq3Btn) cq3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-16-see-example-cq3-cumilla.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-16-see-example-cq3-cumilla.png');

    // --- SNAPSHOT 17: STEP 3 - TRY YOURSELF CHALLENGES ---
    console.log('[*] Switching to Step 3: Try Yourself...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. নিজে করো'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Fill challenge answers: 38, 126, 55
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      const buttons = Array.from(document.querySelectorAll('button'));
      const checkBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');

      if (inputs.length >= 3 && checkBtns.length >= 3) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

        // Challenge 1 -> 38
        nativeSetter.call(inputs[0], '38');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        checkBtns[0].click();

        // Challenge 2 -> 126
        nativeSetter.call(inputs[1], '126');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        checkBtns[1].click();

        // Challenge 3 -> 55
        nativeSetter.call(inputs[2], '55');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        checkBtns[2].click();
      }
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-17-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-17-try-yourself-challenges.png');

    // --- SNAPSHOT 18: STEP 4 - CHECK UNDERSTANDING (MCQs) ---
    console.log('[*] Switching to Step 4: MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. যাচাই'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Select answers: Q1->0, Q2->1, Q3->2, Q4->0, Q5->1
    await page.evaluate(() => {
      const mcqCards = Array.from(document.querySelectorAll('.p-5.rounded-2xl'));
      const correctIndices = [0, 1, 2, 0, 1];

      mcqCards.forEach((card, qIdx) => {
        const optButtons = Array.from(card.querySelectorAll('button'));
        const targetIdx = correctIndices[qIdx];
        if (optButtons[targetIdx]) {
          optButtons[targetIdx].click();
        }
      });

      // Click evaluate button
      const allButtons = Array.from(document.querySelectorAll('button'));
      const evalBtn = allButtons.find((b) => b.textContent?.includes('উত্তর যাচাই করুন'));
      if (evalBtn) evalBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-18-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-18-check-understanding-mcqs.png');

    // --- SNAPSHOT 19: STEP 5 - SUMMARY CHEAT SHEET ---
    console.log('[*] Switching to Step 5: Summary...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click Copy notes button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('কপি করুন'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-19-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-19-summary-cheat-sheet.png');

    // --- SNAPSHOT 20: SHERU AI TUTOR DRAWER ---
    console.log('[*] Opening Sheru AI Socratic Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('শেরু AI') || b.textContent?.includes('ধারা টিউটর'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch13-20-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch13-20-ai-tutor-drawer.png');

    console.log('\n========================================');
    console.log('✅ All 21 Chapter 13 Snapshots captured successfully!');
    console.log(`Console Errors (${consoleErrors.length}):`, consoleErrors);
    console.log('========================================\n');

    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
    }
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMathCh13E2ETest();
