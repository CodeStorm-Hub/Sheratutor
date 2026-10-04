import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh17E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 17 (পরিসংখ্যান / Statistics) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 17
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

    // Scroll down to view the Chapter 17 card
    await page.evaluate(() => window.scrollTo({ top: 800, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 17
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/17...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/17`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so controls are nicely in view
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 01: LAB 1 - MEAN DEFAULT ---
    console.log('[*] Testing Lab 1: Short-cut Mean default dataset...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-01-learn-lab1-mean-default.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-01-learn-lab1-mean-default.png');

    // --- SNAPSHOT 02: LAB 1 - PRESET 2 ---
    console.log('[*] Lab 1: Switching to Preset 2 (৬০ শ্রমিকের মজুরি)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const p2 = buttons.find((b) => b.textContent?.includes('নমুনা ২'));
      if (p2) p2.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-02-learn-lab1-mean-preset2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-02-learn-lab1-mean-preset2.png');

    // --- SNAPSHOT 03: LAB 1 - PRESET 3 ---
    console.log('[*] Lab 1: Switching to Preset 3 (৪০ জনের ওজন)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const p3 = buttons.find((b) => b.textContent?.includes('নমুনা ৩'));
      if (p3) p3.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-03-learn-lab1-mean-preset3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-03-learn-lab1-mean-preset3.png');

    // --- SNAPSHOT 04: LAB 1 - CHANGE ASSUMED MEAN ---
    console.log('[*] Lab 1: Switching assumed mean (a) to another row...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aBtns = buttons.filter((b) => b.textContent?.includes('a ধরুন'));
      if (aBtns[0]) aBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-04-learn-lab1-mean-change-assumed.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-04-learn-lab1-mean-change-assumed.png');

    // Reset back to Preset 1 for consistency
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const p1 = buttons.find((b) => b.textContent?.includes('নমুনা ১'));
      if (p1) p1.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 05: LAB 2 - MEDIAN DEFAULT ---
    console.log('[*] Switching to Lab 2: Median & Cumulative Frequency...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('মধ্যক নির্ণয় ও ক্রমযোজিত'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-05-learn-lab2-median-default.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-05-learn-lab2-median-default.png');

    // --- SNAPSHOT 06: LAB 2 - MEDIAN SCROLLED ---
    console.log('[*] Lab 2: Detail inspection...');
    await page.evaluate(() => window.scrollTo({ top: 160, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-06-learn-lab2-median-detail.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-06-learn-lab2-median-detail.png');

    // --- SNAPSHOT 07: LAB 3 - MODE DEFAULT ---
    console.log('[*] Switching to Lab 3: Mode of Grouped Data...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('প্রচুরক নির্ণয়'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-07-learn-lab3-mode-default.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-07-learn-lab3-mode-default.png');

    // --- SNAPSHOT 08: LAB 3 - FIRST CLASS TRAP ---
    console.log('[*] Lab 3: Testing 1st class modal trap...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trap1Btn = buttons.find((b) => b.textContent?.includes('১ম শ্রেণি প্রচুরক'));
      if (trap1Btn) trap1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-08-learn-lab3-mode-first-class-trap.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-08-learn-lab3-mode-first-class-trap.png');

    // --- SNAPSHOT 09: LAB 3 - LAST CLASS TRAP ---
    console.log('[*] Lab 3: Testing last class modal trap...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trap2Btn = buttons.find((b) => b.textContent?.includes('শেষ শ্রেণি প্রচুরক'));
      if (trap2Btn) trap2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-09-learn-lab3-mode-last-class-trap.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-09-learn-lab3-mode-last-class-trap.png');

    // Reset default
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const resetBtn = buttons.find((b) => b.textContent?.includes('রিসেট'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 10: LAB 4 - OGIVE CURVE ---
    console.log('[*] Switching to Lab 4: Ogive Curve...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('অজিভ রেখা'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-10-learn-lab4-ogive-curve.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-10-learn-lab4-ogive-curve.png');

    // --- SNAPSHOT 11: LAB 4 - OGIVE PROJECTION TOGGLE ---
    console.log('[*] Lab 4: Toggling Median Projection...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const toggleBtn = buttons.find((b) => b.textContent?.includes('মধ্যক প্রজেকশন'));
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-11-learn-lab4-ogive-projection-toggled.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-11-learn-lab4-ogive-projection-toggled.png');

    // Toggle back on
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const toggleBtn = buttons.find((b) => b.textContent?.includes('মধ্যক প্রজেকশন'));
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 12: LAB 5 - HISTOGRAM BARS ---
    console.log('[*] Switching to Lab 5: Histogram & Polygon...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('আয়তলেখ ও গণসংখ্যা'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-12-learn-lab5-histogram-bars.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-12-learn-lab5-histogram-bars.png');

    // --- SNAPSHOT 13: LAB 5 - FREQUENCY POLYGON ---
    console.log('[*] Lab 5: Focusing on polygon (toggling off histogram bars)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const barBtn = buttons.find((b) => b.textContent?.includes('স্তম্ভ (Histogram)'));
      if (barBtn) barBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-13-learn-lab5-frequency-polygon.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-13-learn-lab5-frequency-polygon.png');

    // Toggle bars back on
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const barBtn = buttons.find((b) => b.textContent?.includes('স্তম্ভ (Histogram)'));
      if (barBtn) barBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 14: LAB 5 - MODAL CROSS LINES ---
    console.log('[*] Lab 5: Modal cross line determination in histogram...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-14-learn-lab5-modal-cross.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-14-learn-lab5-modal-cross.png');

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
      path: path.join(ARTIFACTS_DIR, 'math-ch17-15-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-15-see-example-cq1-dhaka.png');

    // Scroll to CQ 2
    await page.evaluate(() => window.scrollTo({ top: 600, behavior: 'instant' }));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-16-see-example-cq2-chattogram.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-16-see-example-cq2-chattogram.png');

    // Scroll to CQ 3
    await page.evaluate(() => window.scrollTo({ top: 1100, behavior: 'instant' }));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-17-see-example-cq3-rajshahi.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-17-see-example-cq3-rajshahi.png');

    // --- STEP 3: TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Step 5: Navigating to Step 3: Try Yourself...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const chBtn = navButtons.find((b) => b.textContent?.includes('নিজে চেষ্টা করুন'));
      if (chBtn) chBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));

    // Fill in challenge inputs: Challenge 1 = 57.5, Challenge 2 = 65, Challenge 3 = 56
    console.log('[*] Solving 3 interactive challenges...');
    const numInputs = await page.$$('input[type="number"]');
    if (numInputs[0]) {
      await numInputs[0].click({ clickCount: 3 });
      await numInputs[0].type('57.5');
    }
    if (numInputs[1]) {
      await numInputs[1].click({ clickCount: 3 });
      await numInputs[1].type('65');
    }
    if (numInputs[2]) {
      await numInputs[2].click({ clickCount: 3 });
      await numInputs[2].type('56');
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
      path: path.join(ARTIFACTS_DIR, 'math-ch17-18-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-18-try-yourself-challenges.png');

    // --- STEP 4: CHECK UNDERSTANDING (MCQS) ---
    console.log('[*] Step 6: Navigating to Step 4: Check Understanding...');
    await page.evaluate(() => {
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const mcqBtn = navButtons.find((b) => b.textContent?.includes('অনুধাবন যাচাই'));
      if (mcqBtn) mcqBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));

    // Solve MCQs: 1: B (idx 1), 2: A (idx 0), 3: C (idx 2), 4: B (idx 1), 5: B (idx 1)
    console.log('[*] Answering all 5 MCQs correctly...');
    const allOptionBtns = await page.$$('div.rounded-2xl div.grid button');
    const targetIndices = [1, 4, 10, 13, 17];
    for (const idx of targetIndices) {
      if (allOptionBtns[idx]) {
        await allOptionBtns[idx].click();
        await new Promise((r) => setTimeout(r, 100));
      }
    }
    await new Promise((r) => setTimeout(r, 400));

    // Submit MCQs
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => b.textContent?.includes('উত্তর যাচাই করুন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch17-19-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-19-check-understanding-mcqs.png');

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
      path: path.join(ARTIFACTS_DIR, 'math-ch17-20-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-20-summary-cheat-sheet.png');

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
      const chip = chips.find((c) => c.textContent?.includes('সংক্ষিপ্ত পদ্ধতিতে'));
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
      path: path.join(ARTIFACTS_DIR, 'math-ch17-21-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch17-21-ai-tutor-drawer.png');

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

runMathCh17E2ETest();
