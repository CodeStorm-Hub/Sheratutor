import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh8E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 8 (বৃত্ত / Circle) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 8
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
      path: path.join(ARTIFACTS_DIR, 'math-ch8-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 8
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/8...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/8`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so the interactive canvas and controls are beautifully centered
    await page.evaluate(() => window.scrollTo({ top: 180, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 1: LAB 1 - CHORD & CENTER STANDARD (AB = 8cm, OD = 3cm) ---
    console.log('[*] Testing Lab 1: Center & Chords Standard...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-01-learn-lab1-chords-std.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-01-learn-lab1-chords-std.png');

    // --- SNAPSHOT 2: LAB 1 - CHORD SLIDER ADJUSTMENT ---
    console.log('[*] Testing Lab 1: Adjusting Chord Slider to 6cm...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '6');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-02-learn-lab1-chords-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-02-learn-lab1-chords-slider.png');

    // --- LAB 2: CENTRAL VS INSCRIBED ANGLE (THEOREM 20) ---
    console.log('[*] Testing Lab 2: Central vs Inscribed Angle...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২') || b.textContent?.includes('কেন্দ্রস্থ কোণ'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 3: LAB 2 - STANDARD (90 deg central / 45 deg inscribed) ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-03-learn-lab2-central-inscribed-90deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-03-learn-lab2-central-inscribed-90deg.png');

    // --- SNAPSHOT 4: LAB 2 - SLIDER TO 120 DEG ---
    console.log('[*] Adjusting Lab 2 Central Angle Slider to 120 deg...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '120');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-04-learn-lab2-central-inscribed-120deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-04-learn-lab2-central-inscribed-120deg.png');

    // --- SNAPSHOT 5: LAB 2 - COROLLARY 1 (TWIN INSCRIBED POINT A2) ---
    console.log('[*] Enabling Corollary 1 (Twin Inscribed Point A2)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const cor1Btn = buttons.find((b) => b.textContent?.includes('অনুসিদ্ধান্ত ১') || b.textContent?.includes('লুকানো'));
      if (cor1Btn) cor1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-05-learn-lab2-corollary1-twin-inscribed.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-05-learn-lab2-corollary1-twin-inscribed.png');

    // --- SNAPSHOT 6: LAB 2 - COROLLARY 2 (SEMICIRCLE = 90 DEG) ---
    console.log('[*] Enabling Corollary 2 (Semicircle = 90 deg)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const semiBtn = buttons.find((b) => b.textContent?.includes('অনুসিদ্ধান্ত ২') || b.textContent?.trim() === 'বন্ধ');
      if (semiBtn) semiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-06-learn-lab2-corollary2-semicircle-90deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-06-learn-lab2-corollary2-semicircle-90deg.png');

    // --- LAB 3: CYCLIC QUADRILATERAL (THEOREMS 23 & 24) ---
    console.log('[*] Testing Lab 3: Cyclic Quadrilateral...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩') || b.textContent?.includes('বৃত্তস্থ চতুর্ভুজ'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 7: LAB 3 - SUPPLEMENTARY OPPOSITE ANGLES ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-07-learn-lab3-cyclic-quad-supplementary.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-07-learn-lab3-cyclic-quad-supplementary.png');

    // --- SNAPSHOT 8: LAB 3 - SLIDER ANGLES MODIFICATION ---
    console.log('[*] Adjusting Lab 3 Angle Slider to 105 deg...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '105');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-08-learn-lab3-cyclic-quad-slider-angles.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-08-learn-lab3-cyclic-quad-slider-angles.png');

    // --- SNAPSHOT 9: LAB 3 - EXTERIOR ANGLE RAY TOGGLE ---
    console.log('[*] Enabling Exterior Angle Ray (∠BCE = ∠BAD)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const extBtn = buttons.find((b) => b.textContent?.includes('বহিঃস্থ কোণ') || b.textContent?.trim() === 'বন্ধ');
      if (extBtn) extBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-09-learn-lab3-cyclic-quad-ext-angle.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-09-learn-lab3-cyclic-quad-ext-angle.png');

    // --- LAB 4: TANGENTS & SECANTS (THEOREMS 25, 26, 27) ---
    console.log('[*] Testing Lab 4: Tangents & Secants...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪') || b.textContent?.includes('স্পর্শক'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 10: LAB 4 - TANGENT PAIR PA = PB ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-10-learn-lab4-tangent-pair-pa-pb.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-10-learn-lab4-tangent-pair-pa-pb.png');

    // --- SNAPSHOT 11: LAB 4 - OP DISTANCE SLIDER ---
    console.log('[*] Adjusting Lab 4 OP Slider to 8.5 cm...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '8.5');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-11-learn-lab4-tangent-slider-op.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-11-learn-lab4-tangent-slider-op.png');

    // --- SNAPSHOT 12: LAB 4 - TOUCHING CIRCLES (EXTERNAL TOUCH) ---
    console.log('[*] Switching to Touching Circles (External Touch)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const touchBtn = buttons.find((b) => b.textContent?.includes('স্পর্শক বৃত্তদ্বয়'));
      if (touchBtn) touchBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-12-learn-lab4-touching-circles-external.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-12-learn-lab4-touching-circles-external.png');

    // --- SNAPSHOT 13: LAB 4 - TOUCHING CIRCLES (INTERNAL TOUCH) ---
    console.log('[*] Switching to Internal Touch Mode (d = R - r)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const internalBtn = buttons.find((b) => b.textContent?.includes('অন্তঃস্পর্শ'));
      if (internalBtn) internalBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-13-learn-lab4-touching-circles-internal.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-13-learn-lab4-touching-circles-internal.png');

    // --- LAB 5: CIRCUMCIRCLE & INCIRCLE (CONSTRUCTIONS 8, 9, 10) ---
    console.log('[*] Testing Lab 5: Constructions Simulator...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫') || b.textContent?.includes('পরিবৃত্ত'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 14: LAB 5 - CIRCUMCIRCLE (STEP 3 COMPLETE) ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-14-learn-lab5-circumcircle-step3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-14-learn-lab5-circumcircle-step3.png');

    // --- SNAPSHOT 15: LAB 5 - INCIRCLE (STEP 3 COMPLETE) ---
    console.log('[*] Switching to Incircle Simulator (Construction 9)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const incircleBtn = buttons.find((b) => b.textContent?.includes('সম্পাদ্য ৯'));
      if (incircleBtn) incircleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-15-learn-lab5-incircle-step3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-15-learn-lab5-incircle-step3.png');

    // =========================================================================
    // STEP 2: WORKED BOARD CQS
    // =========================================================================
    console.log('[*] Step 4: Navigating to Step 2 (Board CQs)...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Scroll up to view CQs
    await page.evaluate(() => window.scrollTo({ top: 100, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // Expand CQ 2 (Rajshahi Board) as well
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const cq2 = buttons.find((b) => b.textContent?.includes('রাজশাহী বোর্ড'));
      if (cq2) cq2.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-16-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-16-see-example-cqs.png');

    // =========================================================================
    // STEP 3: TRY YOURSELF (INTERACTIVE CHALLENGES)
    // =========================================================================
    console.log('[*] Step 5: Navigating to Step 3 (Try Yourself Challenges)...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('৩. নিজে করো'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Solve Challenge 1 (Angle: 55), Challenge 2 (Tangent: 8), Challenge 3 (Opposite: 105)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('main input[type="text"]'));
      const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;

      if (inputs[0]) {
        nativeSetter.call(inputs[0], '55');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[1]) {
        nativeSetter.call(inputs[1], '8');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[2]) {
        nativeSetter.call(inputs[2], '105');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const verifyBtns = Array.from(document.querySelectorAll('main button')).filter(
        (b) => b.textContent?.trim() === 'যাচাই'
      );
      verifyBtns.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-17-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-17-try-yourself-challenges.png');

    // =========================================================================
    // STEP 4: CHECK UNDERSTANDING (5 MCQS)
    // =========================================================================
    console.log('[*] Step 6: Navigating to Step 4 (Check Understanding MCQs)...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('৪. যাচাই'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer all 5 MCQs correctly
    await page.evaluate(() => {
      const qCards = Array.from(document.querySelectorAll('[data-quiz-question]'));
      const correctIndices = [2, 1, 1, 0, 2];

      qCards.forEach((card, idx) => {
        const optionButtons = Array.from(card.querySelectorAll('button'));
        const targetOpt = optionButtons[correctIndices[idx]];
        if (targetOpt) targetOpt.click();
      });
    });
    await new Promise((r) => setTimeout(r, 400));

    // Submit Quiz
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('main button')).find((b) =>
        b.textContent?.includes('কুইজ সাবমিট করুন')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-18-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-18-check-understanding-mcqs.png');

    // =========================================================================
    // STEP 5: SUMMARY & CHEAT SHEET
    // =========================================================================
    console.log('[*] Step 7: Navigating to Step 5 (Summary & Cheat Sheet)...');
    await page.evaluate(() => {
      const btn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('৫. সারসংক্ষেপ'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-19-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-19-summary-cheat-sheet.png');

    // =========================================================================
    // SHERU AI SOCRATIC GEOMETRY DRAWER
    // =========================================================================
    console.log('[*] Step 8: Opening Sheru AI Geometry Tutor Drawer...');
    await page.evaluate(() => {
      const tutorBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('শেরু AI টিউটর')
      );
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click suggested prompt chip
    await page.evaluate(() => {
      const chip = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('উপপাদ্য ২০ প্রমাণ?')
      );
      if (chip) chip.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Send message
    await page.evaluate(() => {
      const sendBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.querySelector('svg') && b.className?.includes('bg-[#FF6B57]')
      );
      if (sendBtn) sendBtn.click();
    });
    await new Promise((r) => setTimeout(r, 900));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch8-20-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch8-20-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log('🎉 E2E TEST SUMMARY FOR GENERAL MATH CHAPTER 8:');
    console.log(`- Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      consoleErrors.forEach((e) => console.error('  Console Error:', e));
    }
    console.log('- Total Snapshots Captured: 20');
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Test failed with exception:', error);
  } finally {
    await browser.close();
  }
}

runMathCh8E2ETest();
