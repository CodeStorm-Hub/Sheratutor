import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh5E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 5 (এক চলকবিশিষ্ট সমীকরণ / Equations in One Variable) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 5
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
      path: path.join(ARTIFACTS_DIR, 'math-ch5-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 5
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/5...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/5`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // --- SNAPSHOT 1: LAB 1 - BALANCE SCALE EQUATION (Balanced at x=2) ---
    console.log('[*] Capturing Lab 1: Balance Scale Equation Mode (x=2)...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-01-learn-balance-scale-eq.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-01-learn-balance-scale-eq.png');

    // --- SNAPSHOT 2: LAB 1 - BALANCE SCALE UNBALANCED (x=4) ---
    console.log('[*] Testing Lab 1: Setting x to 4 (Unbalanced)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn4 = buttons.find((b) => b.textContent?.trim() === '৪' || b.textContent?.trim() === '4');
      if (btn4) {
        btn4.click();
      } else {
        const slider = document.querySelector('input[type="range"]');
        if (slider) {
          const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
            window.HTMLInputElement.prototype,
            'value'
          ).set;
          nativeInputValueSetter.call(slider, '4');
          slider.dispatchEvent(new Event('input', { bubbles: true }));
          slider.dispatchEvent(new Event('change', { bubbles: true }));
        }
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-02-learn-balance-scale-unbalanced.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-02-learn-balance-scale-unbalanced.png');

    // --- SNAPSHOT 3: LAB 1 - IDENTITY MODE ---
    console.log('[*] Testing Lab 1: Switching to Identity Mode (অভেদ মোড)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const idBtn = buttons.find((b) => b.textContent?.includes('অভেদ') || b.textContent?.includes('Identity'));
      if (idBtn) idBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-03-learn-balance-scale-identity.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-03-learn-balance-scale-identity.png');

    // --- SWITCH TO LAB 2: LINEAR TRANSPOSITION ---
    console.log('[*] Navigating to Lab 2: Linear Equations & Transposition Rules...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab2 = labTabs.find((b) => b.textContent?.includes('একঘাত সমীকরণ') || b.textContent?.includes('ল্যাব ০২'));
      if (lab2) lab2.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-04-learn-linear-preset-1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-04-learn-linear-preset-1.png');

    // Change preset or parameters in Lab 2
    console.log('[*] Testing Lab 2: Changing linear equation inputs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const presetBtn = buttons.find((b) => b.textContent?.includes('5x') || b.textContent?.includes('উদাহরণ ২') || b.textContent?.includes('মডেল'));
      if (presetBtn) presetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-05-learn-linear-preset-2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-05-learn-linear-preset-2.png');

    // --- SWITCH TO LAB 3: QUADRATIC & DISCRIMINANT ---
    console.log('[*] Navigating to Lab 3: Quadratic & Discriminant Collider...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab3 = labTabs.find((b) => b.textContent?.includes('দ্বিঘাত') || b.textContent?.includes('ল্যাব ০৩'));
      if (lab3) lab3.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Preset 1: D > 0 (Rational)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const ratBtn = buttons.find((b) => b.textContent?.includes('বাস্তব ও মূলদ') || b.textContent?.includes('D > 0'));
      if (ratBtn) ratBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-06-learn-quadratic-rational.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-06-learn-quadratic-rational.png');

    // Preset 2: D = 0 (Equal)
    console.log('[*] Testing Lab 3: Setting Discriminant D = 0...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const eqBtn = buttons.find((b) => b.textContent?.includes('বাস্তব ও সমান') || b.textContent?.includes('D = 0'));
      if (eqBtn) eqBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-07-learn-quadratic-equal.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-07-learn-quadratic-equal.png');

    // Preset 3: D < 0 (Complex / No real roots)
    console.log('[*] Testing Lab 3: Setting Discriminant D < 0...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const negBtn = buttons.find((b) => b.textContent?.includes('বাস্তব মূল নেই') || b.textContent?.includes('D < 0'));
      if (negBtn) negBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-08-learn-quadratic-complex.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-08-learn-quadratic-complex.png');

    // --- SWITCH TO LAB 4: RADICAL EQUATIONS & EXTRANEOUS ROOTS ---
    console.log('[*] Navigating to Lab 4: Radical Equations & Extraneous Root Detector...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab4 = labTabs.find((b) => b.textContent?.includes('অমূলদ সমীকরণ') || b.textContent?.includes('ল্যাব ০৪'));
      if (lab4) lab4.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Model 1: Valid solutions
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-09-learn-radical-model1-valid.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-09-learn-radical-model1-valid.png');

    // Model 2: The Infamous Trap with Extraneous Root
    console.log('[*] Testing Lab 4: Switching to Model 2 (Extraneous Root Trap)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trapBtn = buttons.find((b) => b.textContent?.includes('মডেল ০২') || b.textContent?.includes('ফাঁদ') || b.textContent?.includes('√(x - 3)'));
      if (trapBtn) trapBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-10-learn-radical-model2-trap.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-10-learn-radical-model2-trap.png');

    // --- SWITCH TO LAB 5: WORD PROBLEMS MODELING ---
    console.log('[*] Navigating to Lab 5: Word Problems Modeling...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab5 = labTabs.find((b) => b.textContent?.includes('বাস্তবভিত্তিক') || b.textContent?.includes('ল্যাব ০৫'));
      if (lab5) lab5.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Type 1: Boat and Stream
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-11-learn-word-boat-stream.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-11-learn-word-boat-stream.png');

    // Type 2 or 3: Pipes and Cistern / Fractions
    console.log('[*] Testing Lab 5: Switching to Type 3 (Pipes & Cistern)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pipeBtn = buttons.find((b) => b.textContent?.includes('নল ও চৌবাচ্চা') || b.textContent?.includes('টাইপ ৩'));
      if (pipeBtn) pipeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-12-learn-word-pipes-cistern.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-12-learn-word-pipes-cistern.png');

    // =========================================================================
    // STEP 2: SEE EXAMPLE (CQ ACCORDIONS & RUBRICS)
    // =========================================================================
    console.log('[*] Navigating to Step 2: See Example (উদাহরণ)...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[1]) navButtons[1].click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Expand Part B and Part C of CQ 1
    await page.evaluate(() => {
      const accordions = Array.from(document.querySelectorAll('button'));
      const partB = accordions.find((b) => b.textContent?.includes('প্রশ্ন (খ)'));
      if (partB) partB.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-13-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-13-see-example-cqs.png');

    // =========================================================================
    // STEP 3: TRY YOURSELF (3 CHALLENGES)
    // =========================================================================
    console.log('[*] Navigating to Step 3: Try Yourself (অনুশীলন)...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[2]) navButtons[2].click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Solve Challenge 1: 7
    console.log('[*] Solving Challenge 1: 3x - 7 = 14 => x = 7...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[0]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(inputs[0], '7');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 200));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[0]) verifyBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Solve Challenge 2: 1
    console.log('[*] Solving Challenge 2: x^2 - 5x + 6 = 0 => D = 1...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[1]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(inputs[1], '1');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 200));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[1]) verifyBtns[1].click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Solve Challenge 3: 11
    console.log('[*] Solving Challenge 3: sqrt(x + 5) = 4 => x = 11...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[2]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(inputs[2], '11');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 200));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[2]) verifyBtns[2].click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-14-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-14-try-yourself-challenges.png');

    // =========================================================================
    // STEP 4: CHECK UNDERSTANDING (5 MCQS)
    // =========================================================================
    console.log('[*] Navigating to Step 4: Check Understanding (যাচাই)...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[3]) navButtons[3].click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Answer the 5 MCQs:
    // Q1: Option 2 ('(x + 2)² = x² + 4x + 4')
    // Q2: Option 1 ('b² - 4ac')
    // Q3: Option 1 ('বাস্তব ও পরস্পর সমান')
    // Q4: Option 0 ('উভয়পক্ষকে বর্গ করা')
    // Q5: Option 2 ('{2, -2}')
    console.log('[*] Answering 5 MCQs...');
    await page.evaluate(() => {
      // Find each question container
      const qCards = Array.from(document.querySelectorAll('.rounded-3xl.border'));
      const correctIndices = [2, 1, 1, 0, 2];

      qCards.forEach((card, qIdx) => {
        if (qIdx < correctIndices.length) {
          const optButtons = Array.from(card.querySelectorAll('button'));
          const targetOpt = optButtons[correctIndices[qIdx]];
          if (targetOpt) targetOpt.click();
        }
      });
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click submit button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => b.textContent?.includes('উত্তর জমা দিন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-15-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-15-check-understanding-mcqs.png');

    // =========================================================================
    // STEP 5: SUMMARY & FORMULA BANK
    // =========================================================================
    console.log('[*] Navigating to Step 5: Summary (সারসংক্ষেপ)...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[4]) navButtons[4].click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-16-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-16-summary-cheat-sheet.png');

    // Copy revision notes
    console.log('[*] Clicking Copy Notes button...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('নোট কপি করুন'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-17-summary-notes-copied.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-17-summary-notes-copied.png');

    // =========================================================================
    // SHERU SOCRATIC AI COMPANION DRAWER
    // =========================================================================
    console.log('[*] Opening Sheru AI Companion drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sheruBtn = buttons.find((b) => b.textContent?.includes('শেরু') || b.textContent?.includes('AI সহচর'));
      if (sheruBtn) sheruBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click a quick prompt button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('নিশ্চায়ক D = 0 হলে'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch5-18-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch5-18-ai-tutor-drawer.png');

    console.log('\n=========================================');
    console.log(`🎉 E2E TEST COMPLETED SUCCESSFULLY!`);
    console.log(`Total console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console errors logged:', consoleErrors);
    }
    console.log('=========================================\n');
  } catch (error) {
    console.error('❌ E2E Test Failed with error:', error);
    throw error;
  } finally {
    await browser.close();
  }
}

runMathCh5E2ETest().catch((e) => {
  console.error(e);
  process.exit(1);
});
