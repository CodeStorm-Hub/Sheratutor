import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh4E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 4 (সূচক ও লগারিদম / Exponents & Logarithms) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 4
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
      path: path.join(ARTIFACTS_DIR, 'math-ch4-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 4
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/4...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/4`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // --- SNAPSHOT 1: LAB 1 - INDICES LADDER CUBE (2^3 = 8) ---
    console.log('[*] Capturing Lab 1: Indices & Power Scale (2^3 = 8)...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-01-learn-indices-ladder-cube.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-01-learn-indices-ladder-cube.png');

    // --- SNAPSHOT 2: LAB 1 - ZERO EXPONENT LADDER (2^0 = 1) ---
    console.log('[*] Testing Lab 1: Setting exponent to 0...');
    await page.evaluate(() => {
      const ladderRows = Array.from(document.querySelectorAll('.cursor-pointer'));
      const zeroRow = ladderRows.find((r) => r.textContent?.includes('2^0') || r.textContent?.includes('নিরপেক্ষ'));
      if (zeroRow) zeroRow.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-02-learn-indices-ladder-zero.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-02-learn-indices-ladder-zero.png');

    // --- SNAPSHOT 3: LAB 1 - NEGATIVE EXPONENT LADDER (2^-2 = 1/4) ---
    console.log('[*] Testing Lab 1: Setting exponent to -2...');
    await page.evaluate(() => {
      const ladderRows = Array.from(document.querySelectorAll('.cursor-pointer'));
      const negRow = ladderRows.find((r) => r.textContent?.includes('-2'));
      if (negRow) negRow.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-03-learn-indices-ladder-neg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-03-learn-indices-ladder-neg.png');

    // --- SNAPSHOT 4: LAB 1 - BASE 10 SELECTION ---
    console.log('[*] Testing Lab 1: Selecting Base a = 10...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const base10Btn = buttons.find((b) => b.textContent?.trim() === 'a = 10');
      if (base10Btn) base10Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-04-learn-indices-base10.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-04-learn-indices-base10.png');

    // --- SNAPSHOT 5: LAB 2 - LOGARITHM BALANCE NORMAL ---
    console.log('[*] Navigating to Lab 2: Logarithm Definition & Balance Machine...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-05-learn-log-balance-normal.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-05-learn-log-balance-normal.png');

    // --- SNAPSHOT 6: LAB 2 - BASE 1 TRAP ACTIVATED ---
    console.log('[*] Testing Lab 2: Triggering Base a = 1 trap...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trap1Btn = buttons.find((b) => b.textContent?.includes('ভিত্তি a = 1'));
      if (trap1Btn) trap1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-06-learn-log-balance-trap-base1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-06-learn-log-balance-trap-base1.png');

    // --- SNAPSHOT 7: LAB 2 - NEGATIVE N TRAP ACTIVATED ---
    console.log('[*] Testing Lab 2: Triggering N <= 0 trap...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trap2Btn = buttons.find((b) => b.textContent?.includes('N ≤ 0'));
      if (trap2Btn) trap2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-07-learn-log-balance-trap-neg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-07-learn-log-balance-trap-neg.png');

    // --- SNAPSHOT 8: LAB 3 - LAWS OF LOGS (PRODUCT & QUOTIENT) ---
    console.log('[*] Navigating to Lab 3: Laws of Logarithms & Change of Base...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-08-learn-laws-product-quotient.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-08-learn-laws-product-quotient.png');

    // --- SNAPSHOT 9: LAB 3 - FATAL TRAP CONTRAST WARNING ---
    console.log('[*] Testing Lab 3: Opening trap contrast simulator...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trapBtn = buttons.find((b) => b.textContent?.includes('বিখ্যাত বোর্ড ফাঁদ পরীক্ষা'));
      if (trapBtn) trapBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-09-learn-laws-trap-warning.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-09-learn-laws-trap-warning.png');

    // --- SNAPSHOT 10: LAB 4 - EXPONENTIAL EQUATIONS MODEL 1 ---
    console.log('[*] Navigating to Lab 4: Exponential Equations Solver...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-10-learn-eq-model1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-10-learn-eq-model1.png');

    // --- SNAPSHOT 11: LAB 4 - EXPONENTIAL EQUATIONS MODEL 3 (RADICALS) ---
    console.log('[*] Testing Lab 4: Selecting Model 3 (Radicals)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const model3Btn = buttons.find((b) => b.textContent?.includes('মডেল ৩'));
      if (model3Btn) model3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-11-learn-eq-model3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-11-learn-eq-model3.png');

    // --- SNAPSHOT 12: LAB 5 - SCIENTIFIC NOTATION (4356) ---
    console.log('[*] Navigating to Lab 5: Scientific Notation & Characteristic...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const num4356Btn = buttons.find((b) => b.textContent?.includes('৪৩৫৬'));
      if (num4356Btn) num4356Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-12-learn-sci-characteristic-pos.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-12-learn-sci-characteristic-pos.png');

    // --- SNAPSHOT 13: LAB 5 - SCIENTIFIC NOTATION WITH BAR NOTATION (0.00345) ---
    console.log('[*] Testing Lab 5: Selecting 0.00345 with bar notation...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const num00345Btn = buttons.find((b) => b.textContent?.includes('০.০০৩৪৫'));
      if (num00345Btn) num00345Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-13-learn-sci-characteristic-bar.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-13-learn-sci-characteristic-bar.png');

    // --- SNAPSHOT 14: STEP 2 - WORKED BOARD CQS ---
    console.log('[*] Navigating to Step 2: See Example (Board CQs)...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[1]) navButtons[1].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Expand Part B and Part C of active CQ
    await page.evaluate(() => {
      const partButtons = Array.from(document.querySelectorAll('button'));
      const partBBtn = partButtons.find((b) => b.textContent?.includes('খ (৪ নম্বর)'));
      if (partBBtn) partBBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-14-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-14-see-example-cqs.png');

    // --- SNAPSHOT 15: STEP 3 - TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Navigating to Step 3: Try Yourself...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[2]) navButtons[2].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Fill answers using nativeInputValueSetter for React controlled inputs
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      const setVal = (el, val) => {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeInputValueSetter.call(el, val);
        el.dispatchEvent(new Event('input', { bubbles: true }));
      };
      if (inputs[0]) setVal(inputs[0], '1');
      if (inputs[1]) setVal(inputs[1], '0.5');
      if (inputs[2]) setVal(inputs[2], '1.2');
    });
    await new Promise((r) => setTimeout(r, 300));

    await page.evaluate(() => {
      const verifyBtns = Array.from(document.querySelectorAll('button')).filter(
        (b) => b.textContent?.trim() === 'যাচাই'
      );
      verifyBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-15-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-15-try-yourself-challenges.png');

    // --- SNAPSHOT 16: STEP 4 - CHECK UNDERSTANDING (MCQS) ---
    console.log('[*] Navigating to Step 4: Check Understanding (MCQs)...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[3]) navButtons[3].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer the 5 MCQs
    // Q1: B (a ≠ 0), Q2: B (log M + log N), Q3: C (-3 বা 3̄), Q4: B (4), Q5: B (2)
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.rounded-3xl.border.bg-card'));
      const mcqCards = cards.filter((c) => c.querySelector('h3')?.textContent?.match(/^\d+\./));

      // Correct options: [1, 1, 2, 1, 1]
      const answers = [1, 1, 2, 1, 1];
      mcqCards.forEach((card, qIdx) => {
        const optionBtns = Array.from(card.querySelectorAll('button'));
        const targetOpt = optionBtns[answers[qIdx]];
        if (targetOpt) targetOpt.click();
      });
    });
    await new Promise((r) => setTimeout(r, 400));

    // Submit Quiz
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.includes('উত্তর জমা দিন')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-16-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-16-check-understanding-mcqs.png');

    // --- SNAPSHOT 17: STEP 5 - SUMMARY CHEAT SHEET ---
    console.log('[*] Navigating to Step 5: Summary & Cheat Sheet...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[4]) navButtons[4].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click copy notes button
    await page.evaluate(() => {
      const copyBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.includes('রিভিশন নোট কপি')
      );
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-17-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-17-summary-cheat-sheet.png');

    // --- SNAPSHOT 18: SHERU SOCRATIC AI COMPANION DRAWER ---
    console.log('[*] Testing Sheru Socratic AI Companion Drawer...');
    await page.evaluate(() => {
      const sheruBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.includes('শেরু এআই সহকারী') || b.textContent?.includes('শেরু সহকারী')
      );
      if (sheruBtn) sheruBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click a prompt in Sheru drawer
    await page.evaluate(() => {
      const quickBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.textContent?.includes('চাঁদে')
      );
      if (quickBtns[0]) quickBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch4-18-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch4-18-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log('✅ Math Chapter 4 E2E Test Passed with 19 Snapshots!');
    console.log(`❌ Total Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors Detected:', consoleErrors);
    }
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ E2E Test execution failed:', error);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runMathCh4E2ETest();
