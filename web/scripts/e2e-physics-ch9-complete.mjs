import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runPhysicsCh9E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 9 (আলোর প্রতিসরণ / Refraction of Light) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 9
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2 Library View...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Select Physics tab in library
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const physBtn = buttons.find((b) => b.textContent?.includes('পদার্থবিজ্ঞান'));
      if (physBtn) physBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 9
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/9...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/9`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. LAB 1: SNELL'S LAW & APPARENT DEPTH
    console.log('[*] Step 4: Testing Lab 1 (স্নেলের সূত্র ও প্রতিসরণাঙ্ক)...');
    // Toggle apparent depth coin
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const coinBtn = buttons.find((b) => b.textContent?.includes('মুদ্রা ও আপাত'));
      if (coinBtn) coinBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-01-learn-snell-law-apparent-depth.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-01-learn-snell-law-apparent-depth.png');

    // 5. LAB 2: CRITICAL ANGLE & TIR
    console.log('[*] Step 5: Testing Lab 2 (সংকট কোণ ও পূর্ণ অভ্যন্তরীণ প্রতিফলন)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২') || b.textContent?.includes('সংকট কোণ'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click TIR button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tirBtn = buttons.find((b) => b.textContent?.includes('θ > θ_c'));
      if (tirBtn) tirBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-02-learn-critical-angle-tir.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-02-learn-critical-angle-tir.png');

    // 6. LAB 3: OPTICAL FIBER, MIRAGE & PRISM
    console.log('[*] Step 6: Testing Lab 3 (অপটিক্যাল ফাইবার, মরীচিকা ও প্রিজম)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩') || b.textContent?.includes('অপটিক্যাল ফাইবার'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Screenshot sub-tab 1: Optical Fiber
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-03-learn-optical-fiber.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-03-learn-optical-fiber.png');

    // Switch to Mirage sub-tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mirageBtn = buttons.find((b) => b.textContent?.includes('মরুভূমির মরীচিকা'));
      if (mirageBtn) mirageBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-04-learn-desert-mirage.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-04-learn-desert-mirage.png');

    // Switch to Prism sub-tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const prismBtn = buttons.find((b) => b.textContent?.includes('প্রিজম ও বর্ণচ্ছত্র'));
      if (prismBtn) prismBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-05-learn-prism-dispersion.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-05-learn-prism-dispersion.png');

    // 7. LAB 4: CONVEX & CONCAVE LENS RAY TRACING
    console.log('[*] Step 7: Testing Lab 4 (উত্তল ও অবতল লেন্সের রশ্মিচিত্র)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪') || b.textContent?.includes('রশ্মিচিত্র'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click 2f preset
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const presetBtn = buttons.find((b) => b.textContent?.includes('u = 2f'));
      if (presetBtn) presetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-06-learn-convex-concave-lens-ray-tracing.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-06-learn-convex-concave-lens-ray-tracing.png');

    // 8. LAB 5: EYE DEFECTS & LENS POWER
    console.log('[*] Step 8: Testing Lab 5 (চোখের দৃষ্টিত্রুটি ও লেন্স সমীকরণ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫') || b.textContent?.includes('দৃষ্টির ত্রুটি'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Toggle corrective glass
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const glassBtn = buttons.find((b) => b.textContent?.includes('চশমা পরাও'));
      if (glassBtn) glassBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-07-learn-eye-defects-power-calc.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-07-learn-eye-defects-power-calc.png');

    // 9. STEP 2: BOARD CQ SOLUTIONS
    console.log('[*] Step 9: Testing Step 2 (বোর্ড CQ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cqTabBtn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (cqTabBtn) cqTabBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-08-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-08-see-example-cqs.png');

    // Open Rubric Drawer
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-09-examiner-rubric-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-09-examiner-rubric-drawer.png');

    // 10. STEP 3: TRY YOURSELF (PRACTICE)
    console.log('[*] Step 10: Testing Step 3 (প্র্যাকটিস চ্যালেঞ্জ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const practiceTabBtn = buttons.find((b) => b.textContent?.includes('৩. প্র্যাকটিস'));
      if (practiceTabBtn) practiceTabBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    // Fill in challenge inputs
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length >= 3) {
      await inputs[0].type('1.33');
      await inputs[1].type('75');
      await inputs[2].type('2');
    }

    // Click all "যাচাই" buttons
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.includes('যাচাই'));
      verifyBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-10-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-10-try-yourself-challenges.png');

    // 11. STEP 4: CHECK UNDERSTANDING (MCQ QUIZ)
    console.log('[*] Step 11: Testing Step 4 (MCQ কুইজ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const quizTabBtn = buttons.find((b) => b.textContent?.includes('৪. MCQ কুইজ'));
      if (quizTabBtn) quizTabBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    // Click first option of each question
    await page.evaluate(() => {
      const cards = Array.from(document.querySelectorAll('.space-y-4 > div'));
      cards.forEach((card) => {
        const optionButtons = card.querySelectorAll('button');
        if (optionButtons.length > 2) {
          optionButtons[2].click(); // pick option 3
        }
      });
    });
    await new Promise((r) => setTimeout(r, 500));

    // Submit Quiz
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const scoreBtn = buttons.find((b) => b.textContent?.includes('স্কোর দেখুন'));
      if (scoreBtn) scoreBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-11-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-11-check-understanding-mcqs.png');

    // 12. STEP 5: SUMMARY & CHEAT SHEET
    console.log('[*] Step 12: Testing Step 5 (সামারি ও রিভিশন নোট)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const summaryTabBtn = buttons.find((b) => b.textContent?.includes('৫. সামারি'));
      if (summaryTabBtn) summaryTabBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-12-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-12-summary-cheat-sheet.png');

    // 13. AI SOCRATIC TUTOR DRAWER
    console.log('[*] Step 13: Testing Socratic AI Tutor Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('সক্রেটিক এআই টিউটর'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    // Click prompt pill
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pill = buttons.find((b) => b.textContent?.includes('অপটিক্যাল ফাইবার'));
      if (pill) pill.click();
    });
    await new Promise((r) => setTimeout(r, 900));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch9-13-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch9-13-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log('🎉 E2E TEST COMPLETE: All 14 screenshots captured!');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors Detected:', consoleErrors);
    }
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ E2E Test Failed with error:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runPhysicsCh9E2ETest();
