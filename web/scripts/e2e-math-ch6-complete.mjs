import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runMathCh6E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 6 (রেখা, কোণ ও ত্রিভুজ / Lines, Angles & Triangles) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 6
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
      path: path.join(ARTIFACTS_DIR, 'math-ch6-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 6
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/6...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/6`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // --- SNAPSHOT 1: LAB 1 - LINEAR PAIR DEFAULT (65°) ---
    console.log('[*] Capturing Lab 1: Linear Pair Default (65° + 115° = 180°)...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-01-learn-linear-pair-default.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-01-learn-linear-pair-default.png');

    // --- SNAPSHOT 2: LAB 1 - PERPENDICULAR (90°) ---
    console.log('[*] Testing Lab 1: Setting angle to 90° (Perpendicular)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn90 = buttons.find((b) => b.textContent?.trim() === '৯০°');
      if (btn90) btn90.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-02-learn-linear-pair-perpendicular.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-02-learn-linear-pair-perpendicular.png');

    // --- SNAPSHOT 3: LAB 1 - OBTUSE ANGLE (120°) ---
    console.log('[*] Testing Lab 1: Setting angle to 120°...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn120 = buttons.find((b) => b.textContent?.trim() === '১২০°');
      if (btn120) btn120.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-03-learn-linear-pair-obtuse.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-03-learn-linear-pair-obtuse.png');

    // --- SWITCH TO LAB 2: PARALLEL LINES & TRANSVERSAL ---
    console.log('[*] Navigating to Lab 2: Parallel Lines & Transversal Angles...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab2 = labTabs.find((b) => b.textContent?.includes('সমান্তরাল রেখা') || b.textContent?.includes('ল্যাব ০২'));
      if (lab2) lab2.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Alternate angles (Z shape)
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-04-learn-parallel-alternate.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-04-learn-parallel-alternate.png');

    // Corresponding angles (F shape)
    console.log('[*] Testing Lab 2: Switching to Corresponding Angles (অনুরূপ কোণ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const corrBtn = buttons.find((b) => b.textContent?.includes('অনুরূপ কোণ'));
      if (corrBtn) corrBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-05-learn-parallel-corresponding.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-05-learn-parallel-corresponding.png');

    // Consecutive interior angles (C shape)
    console.log('[*] Testing Lab 2: Switching to Consecutive Interior Angles (অন্তঃস্থ কোণ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const intBtn = buttons.find((b) => b.textContent?.includes('অন্তঃস্থ কোণ'));
      if (intBtn) intBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-06-learn-parallel-interior.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-06-learn-parallel-interior.png');

    // --- SWITCH TO LAB 3: TRIANGLE ANGLE SUM & EXTERIOR ANGLE ---
    console.log('[*] Navigating to Lab 3: Triangle Angle Sum & Exterior Angle Theorem...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab3 = labTabs.find((b) => b.textContent?.includes('কোণ সমষ্টি ১৮০°') || b.textContent?.includes('ল্যাব ০৩'));
      if (lab3) lab3.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-07-learn-triangle-sum-default.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-07-learn-triangle-sum-default.png');

    // Exterior angle demonstration
    console.log('[*] Testing Lab 3: Adjusting angles to demonstrate exterior angle...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders[0]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(sliders[0], '80');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-08-learn-triangle-exterior-angle.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-08-learn-triangle-exterior-angle.png');

    // --- SWITCH TO LAB 4: TRIANGLE CONGRUENCE CRITERIA ---
    console.log('[*] Navigating to Lab 4: Triangle Congruence Criteria...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab4 = labTabs.find((b) => b.textContent?.includes('সর্বসমতার ৪টি শর্ত') || b.textContent?.includes('ল্যাব ০৪'));
      if (lab4) lab4.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Criteria 1: SAS
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-09-learn-congruence-sas.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-09-learn-congruence-sas.png');

    // Criteria 2: SSS
    console.log('[*] Testing Lab 4: Switching to SSS Criteria (বাহু-বাহু-বাহু)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sssBtn = buttons.find((b) => b.textContent?.includes('বাহু-বাহু-বাহু') || b.textContent?.includes('SSS'));
      if (sssBtn) sssBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-10-learn-congruence-sss.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-10-learn-congruence-sss.png');

    // Criteria 4: RHS
    console.log('[*] Testing Lab 4: Switching to RHS Criteria (অতিভুজ-বাহু)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rhsBtn = buttons.find((b) => b.textContent?.includes('অতিভুজ-বাহু') || b.textContent?.includes('RHS'));
      if (rhsBtn) rhsBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-11-learn-congruence-rhs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-11-learn-congruence-rhs.png');

    // --- SWITCH TO LAB 5: PYTHAGORAS & TRIANGLE INEQUALITY ---
    console.log('[*] Navigating to Lab 5: Pythagoras & Triangle Inequality Collider...');
    await page.evaluate(() => {
      const labTabs = Array.from(document.querySelectorAll('button'));
      const lab5 = labTabs.find((b) => b.textContent?.includes('পিথাগোরাস') || b.textContent?.includes('ল্যাব ০৫'));
      if (lab5) lab5.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Default: 3, 4, 5
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-12-learn-pythagoras-right.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-12-learn-pythagoras-right.png');

    // Preset: 5, 12, 13
    console.log('[*] Testing Lab 5: Selecting 5, 12, 13 Pythagorean Triple...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tripleBtn = buttons.find((b) => b.textContent?.includes('৫, ১২, ১৩'));
      if (tripleBtn) tripleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-13-learn-pythagoras-triple-5-12-13.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-13-learn-pythagoras-triple-5-12-13.png');

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
      const partB = accordions.find((b) => b.textContent?.includes('খ (৪ নম্বর)'));
      if (partB) partB.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-14-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-14-see-example-cqs.png');

    // =========================================================================
    // STEP 3: TRY YOURSELF (3 CHALLENGES)
    // =========================================================================
    console.log('[*] Navigating to Step 3: Try Yourself (অনুশীলন)...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[2]) navButtons[2].click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Solve Challenge 1: 60
    console.log('[*] Solving Challenge 1: 180 - (55 + 65) => 60...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[0]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(inputs[0], '60');
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

    // Solve Challenge 2: 10
    console.log('[*] Solving Challenge 2: sqrt(6^2 + 8^2) => 10...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[1]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(inputs[1], '10');
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

    // Solve Challenge 3: 65
    console.log('[*] Solving Challenge 3: 110 - 45 => 65...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[2]) {
        const nativeInputValueSetter = Object.getOwnPropertyDescriptor(
          window.HTMLInputElement.prototype,
          'value'
        ).set;
        nativeInputValueSetter.call(inputs[2], '65');
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
      path: path.join(ARTIFACTS_DIR, 'math-ch6-15-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-15-try-yourself-challenges.png');

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
    // Q1: Option 2 ('90°')
    // Q2: Option 1 ('3 সেমি, 4 সেমি, 5 সেমি')
    // Q3: Option 2 ('কোণ-কোণ-কোণ (AAA)')
    // Q4: Option 0 ('পরস্পর সমান')
    // Q5: Option 1 ('55°')
    console.log('[*] Answering 5 MCQs...');
    await page.evaluate(() => {
      const qCards = Array.from(document.querySelectorAll('.rounded-3xl.border'));
      const correctIndices = [2, 1, 2, 0, 1];

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
      path: path.join(ARTIFACTS_DIR, 'math-ch6-16-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-16-check-understanding-mcqs.png');

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
      path: path.join(ARTIFACTS_DIR, 'math-ch6-17-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-17-summary-cheat-sheet.png');

    // =========================================================================
    // SHERU SOCRATIC AI COMPANION DRAWER
    // =========================================================================
    console.log('[*] Opening Sheru AI Companion drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sheruBtn = buttons.find((b) => b.textContent?.includes('শেরু') || b.textContent?.includes('সহকারী'));
      if (sheruBtn) sheruBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick prompt button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('ত্রিভুজের কোণ সমষ্টি কেন ১৮০° হয়'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch6-18-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch6-18-ai-tutor-drawer.png');

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

runMathCh6E2ETest().catch((e) => {
  console.error(e);
  process.exit(1);
});
