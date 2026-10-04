import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh12E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 12 (দুই চলকবিশিষ্ট সরল সহসমীকরণ / Simultaneous Linear Equations) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 12
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
      path: path.join(ARTIFACTS_DIR, 'math-ch12-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 12
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/12...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/12`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so interactive canvas and controls are centered
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - CONDITIONS UNIQUE SOLUTION ---
    console.log('[*] Testing Lab 1: Unique Solution Condition...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-01-learn-lab1-conditions-unique.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-01-learn-lab1-conditions-unique.png');

    // --- SNAPSHOT 02: LAB 1 - INFINITE SOLUTIONS PRESET ---
    console.log('[*] Clicking Infinite Solutions Preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.trim() === 'অসংখ্য সমাধান');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-02-learn-lab1-conditions-infinite.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-02-learn-lab1-conditions-infinite.png');

    // --- SNAPSHOT 03: LAB 1 - NO SOLUTION PRESET ---
    console.log('[*] Clicking Inconsistent / No Solution Preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.trim() === 'সমাধান নেই');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-03-learn-lab1-conditions-none.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-03-learn-lab1-conditions-none.png');

    // --- SNAPSHOT 04: LAB 2 - SUBSTITUTION METHOD ---
    console.log('[*] Switching to Lab 2: Substitution vs Elimination...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('প্রতিস্থাপন ও অপনয়ন'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-04-learn-lab2-substitution.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-04-learn-lab2-substitution.png');

    // --- SNAPSHOT 05: LAB 2 - ELIMINATION METHOD ---
    console.log('[*] Switching to Elimination Method in Lab 2...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const elimBtn = buttons.find((b) => b.textContent?.includes('অপনয়ন পদ্ধতি') || b.textContent?.includes('অপনয়ন'));
      if (elimBtn) elimBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-05-learn-lab2-elimination.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-05-learn-lab2-elimination.png');

    // --- SNAPSHOT 06: LAB 2 - ADJUST COEFFICIENTS ---
    console.log('[*] Adjusting coefficients in Lab 2...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length > 0) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[0], '3');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-06-learn-lab2-stepper.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-06-learn-lab2-stepper.png');

    // --- SNAPSHOT 07: LAB 3 - CROSS MULTIPLICATION MATRIX ---
    console.log('[*] Switching to Lab 3: Cross-Multiplication Method...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('আড়গুণন বা বজ্রগুণন'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-07-learn-lab3-cross-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-07-learn-lab3-cross-standard.png');

    // --- SNAPSHOT 08: LAB 3 - ADJUST SLIDERS ---
    console.log('[*] Adjusting Lab 3 Sliders...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length >= 2) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[0], '3');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-08-learn-lab3-cross-adjusted.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-08-learn-lab3-cross-adjusted.png');

    // --- SNAPSHOT 09: LAB 4 - COORDINATE GRAPH & INTERSECTION ---
    console.log('[*] Switching to Lab 4: Graphical Method & Intersection...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('লেখচিত্র ও ছেদবিন্দু'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-09-learn-lab4-graph-canvas.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-09-learn-lab4-graph-canvas.png');

    // --- SNAPSHOT 10: LAB 4 - ADJUST SLIDER / COORDINATES ---
    console.log('[*] Adjusting Lab 4 test point slider...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length > 0) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[0], '3');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-10-learn-lab4-graph-table.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-10-learn-lab4-graph-table.png');

    // --- SNAPSHOT 11: LAB 5 - BOAT & STREAM PROBLEM ---
    console.log('[*] Switching to Lab 5: Real-Life Boat & Stream...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('নৌকা ও স্রোতের বেগ'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-11-learn-lab5-boat-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-11-learn-lab5-boat-standard.png');

    // --- SNAPSHOT 12: LAB 5 - ADJUST BOAT & STREAM VELOCITY ---
    console.log('[*] Adjusting Boat and Stream sliders...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length >= 2) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[0], '12');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(sliders[1], '3');
        sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-12-learn-lab5-boat-sliders.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-12-learn-lab5-boat-sliders.png');

    // --- SNAPSHOT 13: STEP 2 - SEE EXAMPLE CQ1 ---
    console.log('[*] Switching to Step 2: Board CQ Examples...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-13-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-13-see-example-cq1-dhaka.png');

    // --- SNAPSHOT 14: STEP 2 - CQ2 CHITTAGONG BOARD ---
    console.log('[*] Selecting CQ 2 in Step 2...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq2Btn = buttons.find((b) => b.textContent?.includes('CQ ০২') || b.textContent?.includes('চট্টগ্রাম'));
      if (cq2Btn) cq2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-14-see-example-cq2-chittagong.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-14-see-example-cq2-chittagong.png');

    // --- SNAPSHOT 15: STEP 2 - CQ3 DINAJPUR BOARD ---
    console.log('[*] Selecting CQ 3 in Step 2...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq3Btn = buttons.find((b) => b.textContent?.includes('CQ ০৩') || b.textContent?.includes('দিনাজপুর'));
      if (cq3Btn) cq3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-15-see-example-cq3-dinajpur.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-15-see-example-cq3-dinajpur.png');

    // --- SNAPSHOT 16: STEP 3 - TRY YOURSELF CHALLENGES ---
    console.log('[*] Switching to Step 3: Try Yourself...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. নিজে করো'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Fill challenge answers: 7, 2, 36
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      const buttons = Array.from(document.querySelectorAll('button'));
      const checkBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');

      if (inputs.length >= 3 && checkBtns.length >= 3) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

        // Challenge 1 -> 7
        nativeSetter.call(inputs[0], '7');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        checkBtns[0].click();

        // Challenge 2 -> 2
        nativeSetter.call(inputs[1], '2');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        checkBtns[1].click();

        // Challenge 3 -> 36
        nativeSetter.call(inputs[2], '36');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        checkBtns[2].click();
      }
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-16-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-16-try-yourself-challenges.png');

    // --- SNAPSHOT 17: STEP 4 - CHECK UNDERSTANDING (MCQs) ---
    console.log('[*] Switching to Step 4: MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. যাচাই'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Select answers: Q1->0, Q2->2, Q3->1, Q4->1, Q5->2
    await page.evaluate(() => {
      // Find all MCQ cards
      const mcqCards = Array.from(document.querySelectorAll('.p-5.rounded-2xl'));
      const correctIndices = [0, 2, 1, 1, 2];

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
      path: path.join(ARTIFACTS_DIR, 'math-ch12-17-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-17-check-understanding-mcqs.png');

    // --- SNAPSHOT 18: STEP 5 - SUMMARY CHEAT SHEET ---
    console.log('[*] Switching to Step 5: Summary...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ') || b.textContent?.includes('সারসংক্ষেপ'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Copy notes button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('কপি করুন'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-18-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-18-summary-cheat-sheet.png');

    // --- SNAPSHOT 19: SHERU AI TUTOR DRAWER ---
    console.log('[*] Opening Sheru AI Socratic Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('শেরু AI') || b.textContent?.includes('AI টিউটর'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch12-19-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch12-19-ai-tutor-drawer.png');

    console.log('\n========================================');
    console.log('✅ All 20 Chapter 12 Snapshots captured successfully!');
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

runMathCh12E2ETest();
