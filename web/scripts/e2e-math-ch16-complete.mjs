import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh16E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 16 (পরিমিতি / Mensuration) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 16
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
      path: path.join(ARTIFACTS_DIR, 'math-ch16-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 16
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/16...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/16`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so controls are nicely in view
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - EQUILATERAL TRIANGLE ---
    console.log('[*] Testing Lab 1: Equilateral triangle...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-01-learn-lab1-equilateral.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-01-learn-lab1-equilateral.png');

    // --- SNAPSHOT 02: LAB 1 - RIGHT TRIANGLE ---
    console.log('[*] Lab 1: Switching to Right Triangle...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('সমকোণী ত্রিভুজ'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-02-learn-lab1-right-triangle.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-02-learn-lab1-right-triangle.png');

    // --- SNAPSHOT 03: LAB 1 - ISOSCELES TRIANGLE ---
    console.log('[*] Lab 1: Switching to Isosceles Triangle...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('সমদ্বিবাহু ত্রিভুজ'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-03-learn-lab1-isosceles.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-03-learn-lab1-isosceles.png');

    // --- SNAPSHOT 04: LAB 1 - HERON'S FORMULA ---
    console.log('[*] Lab 1: Switching to Heron formula...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('বিষমবাহু (হেরন)'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-04-learn-lab1-heron.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-04-learn-lab1-heron.png');

    // --- SNAPSHOT 05: LAB 1 - TWO SIDES AND INCLUDED ANGLE ---
    console.log('[*] Lab 1: Switching to angle mode...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('দুই বাহু ও কোণ'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-05-learn-lab1-included-angle.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-05-learn-lab1-included-angle.png');

    // --- SNAPSHOT 06: LAB 2 - PARALLELOGRAM ---
    console.log('[*] Switching to Lab 2: Quadrilaterals...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('চতুর্ভুজ ও ট্রাপিজিয়াম'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-06-learn-lab2-parallelogram.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-06-learn-lab2-parallelogram.png');

    // --- SNAPSHOT 07: LAB 2 - RHOMBUS ---
    console.log('[*] Lab 2: Switching to Rhombus...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('রম্বস'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-07-learn-lab2-rhombus.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-07-learn-lab2-rhombus.png');

    // --- SNAPSHOT 08: LAB 2 - TRAPEZOID ---
    console.log('[*] Lab 2: Switching to Trapezoid...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.trim() === 'ট্রাপিজিয়াম');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-08-learn-lab2-trapezoid.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-08-learn-lab2-trapezoid.png');

    // --- SNAPSHOT 09: LAB 3 - REGULAR HEXAGON ---
    console.log('[*] Switching to Lab 3: Regular Polygons...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('সুষম বহুভুজ'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-09-learn-lab3-regular-hexagon.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-09-learn-lab3-regular-hexagon.png');

    // --- SNAPSHOT 10: LAB 3 - REGULAR PENTAGON ---
    console.log('[*] Lab 3: Switching to Pentagon (n=5)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('n=5'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-10-learn-lab3-regular-pentagon.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-10-learn-lab3-regular-pentagon.png');

    // --- SNAPSHOT 11: LAB 3 - REGULAR OCTAGON ---
    console.log('[*] Lab 3: Switching to Octagon (n=8)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('n=8'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-11-learn-lab3-regular-octagon.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-11-learn-lab3-regular-octagon.png');

    // --- SNAPSHOT 12: LAB 4 - CIRCLE & SECTOR ---
    console.log('[*] Switching to Lab 4: Circle & Sector...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('বৃত্ত, বৃত্তকলা ও চাকার'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-12-learn-lab4-circle-sector.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-12-learn-lab4-circle-sector.png');

    // --- SNAPSHOT 13: LAB 5 - RECTANGULAR CUBOID ---
    console.log('[*] Switching to Lab 5: 3D Solids...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('৩-মাত্রিক আয়তাকার ঘনবস্তু'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-13-learn-lab5-cuboid.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-13-learn-lab5-cuboid.png');

    // --- SNAPSHOT 14: LAB 5 - CUBE ---
    console.log('[*] Lab 5: Switching to Cube...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('ঘনক (Cube)'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-14-learn-lab5-cube.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-14-learn-lab5-cube.png');

    // --- SNAPSHOT 15: LAB 5 - CYLINDER ---
    console.log('[*] Lab 5: Switching to Cylinder...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('বেলন (সিলিন্ডার)'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-15-learn-lab5-cylinder.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-15-learn-lab5-cylinder.png');

    // --- STEP 2: SEE EXAMPLES (3 WORKED CQS) ---
    console.log('[*] Step 4: Navigating to Step 2: See Examples...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const exBtn = navButtons.find((b) => b.textContent?.includes('উদাহরণ দেখুন'));
      if (exBtn) exBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Scroll to CQ 1
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-16-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-16-see-example-cq1-dhaka.png');

    // Scroll to CQ 2
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-17-see-example-cq2-chattogram.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-17-see-example-cq2-chattogram.png');

    // Scroll to CQ 3
    await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-18-see-example-cq3-rajshahi.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-18-see-example-cq3-rajshahi.png');

    // --- STEP 3: TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Step 5: Navigating to Step 3: Try Yourself...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const chBtn = navButtons.find((b) => b.textContent?.includes('নিজে চেষ্টা করুন'));
      if (chBtn) chBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));

    // Fill in challenge inputs: Challenge 1 = 2, Challenge 2 = 40, Challenge 3 = 440
    console.log('[*] Solving 3 interactive challenges...');
    const numInputs = await page.$$('input[type="number"]');
    if (numInputs[0]) {
      await numInputs[0].click({ clickCount: 3 });
      await numInputs[0].type('2');
    }
    if (numInputs[1]) {
      await numInputs[1].click({ clickCount: 3 });
      await numInputs[1].type('40');
    }
    if (numInputs[2]) {
      await numInputs[2].click({ clickCount: 3 });
      await numInputs[2].type('440');
    }
    await new Promise((r) => setTimeout(r, 300));

    // Click verify on all 3
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyButtons = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      verifyButtons.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-19-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-19-try-yourself-challenges.png');

    // --- STEP 4: CHECK UNDERSTANDING (MCQS) ---
    console.log('[*] Step 6: Navigating to Step 4: Check Understanding...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const mcqBtn = navButtons.find((b) => b.textContent?.includes('অনুধাবন যাচাই'));
      if (mcqBtn) mcqBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));

    // Solve MCQs: 1: B (idx 1), 2: A (idx 0), 3: D (idx 3), 4: A (idx 0), 5: B (idx 1)
    console.log('[*] Answering all 5 MCQs correctly...');
    await page.evaluate(() => {
      const mcqCards = Array.from(document.querySelectorAll('main > div > div.space-y-4 > div'));
      const correctIdxs = [1, 0, 3, 0, 1]; // B, A, D, A, B

      mcqCards.forEach((card, cIdx) => {
        const optionButtons = Array.from(card.querySelectorAll('div.grid button'));
        const targetOpt = optionButtons[correctIdxs[cIdx]];
        if (targetOpt) targetOpt.click();
      });
    });
    await new Promise((r) => setTimeout(r, 400));

    // Submit MCQs
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => b.textContent?.includes('উত্তর যাচাই করুন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-20-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-20-check-understanding-mcqs.png');

    // --- STEP 5: SUMMARY (CHEAT SHEET) ---
    console.log('[*] Step 7: Navigating to Step 5: Summary...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const sumBtn = navButtons.find((b) => b.textContent?.includes('সারসংক্ষেপ'));
      if (sumBtn) sumBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));

    // Click copy button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('কপি করুন'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-21-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-21-summary-cheat-sheet.png');

    // --- SHERU AI DRAWER TEST ---
    console.log('[*] Step 8: Opening Sheru AI Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('শেরু এআই টিউটর'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click a prompt chip
    await page.evaluate(() => {
      const chips = Array.from(document.querySelectorAll('button'));
      const chip = chips.find((c) => c.textContent?.includes('সমবাহু ত্রিভুজের'));
      if (chip) chip.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Send the prompt
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sendBtn = buttons.find((b) => b.querySelector('svg') && b.closest('.fixed'));
      if (sendBtn) sendBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch16-22-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch16-22-ai-tutor-drawer.png');

    console.log('\n======================================');
    console.log('✅ ALL E2E STEPS COMPLETED SUCCESSFULLY!');
    console.log('Total Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.error('Console Errors Detected:', consoleErrors);
    }
    console.log('======================================\n');
  } catch (err) {
    console.error('❌ E2E Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMathCh16E2ETest();
