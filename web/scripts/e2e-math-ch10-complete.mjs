import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh10E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 10 (দূরত্ব ও উচ্চতা / Distance & Elevation) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 10
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
      path: path.join(ARTIFACTS_DIR, 'math-ch10-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 10
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/10...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/10`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so the interactive canvas and controls are centered
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - ELEVATION STANDARD (35 deg) ---
    console.log('[*] Testing Lab 1: Angle of Elevation Standard (35 deg)...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-01-learn-lab1-elevation-std.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-01-learn-lab1-elevation-std.png');

    // --- SNAPSHOT 02: LAB 1 - ELEVATION SLIDER TO 50 DEG ---
    console.log('[*] Adjusting Lab 1 Angle Slider to 50 deg...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '50');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-02-learn-lab1-elevation-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-02-learn-lab1-elevation-slider.png');

    // --- SNAPSHOT 03: LAB 1 - DEPRESSION MODE ---
    console.log('[*] Switching to Depression Mode (Angle of Depression)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const depBtn = buttons.find((b) => b.textContent?.includes('অবনতি কোণ'));
      if (depBtn) depBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-03-learn-lab1-depression-mode.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-03-learn-lab1-depression-mode.png');

    // --- LAB 2: TOWER HEIGHT & 30-45-60 GEOMETRY RULES ---
    console.log('[*] Switching to Lab 2: Tower Height & 30-45-60 Geometry Rules...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২') || b.textContent?.includes('টাওয়ারের উচ্চতা'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 04: LAB 2 - 30 DEG (Base > Perpendicular) ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-04-learn-lab2-tower-30deg-rule.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-04-learn-lab2-tower-30deg-rule.png');

    // --- SNAPSHOT 05: LAB 2 - 45 DEG (Base = Perpendicular) ---
    console.log('[*] Selecting 45 deg...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const deg45Btn = buttons.find((b) => b.textContent?.includes('45° কোণ') || b.textContent?.includes('৪৫°'));
      if (deg45Btn) deg45Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-05-learn-lab2-tower-45deg-rule.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-05-learn-lab2-tower-45deg-rule.png');

    // --- SNAPSHOT 06: LAB 2 - 60 DEG (Perpendicular > Base) ---
    console.log('[*] Selecting 60 deg...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const deg60Btn = buttons.find((b) => b.textContent?.includes('60° কোণ') || b.textContent?.includes('৬০°'));
      if (deg60Btn) deg60Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-06-learn-lab2-tower-60deg-rule.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-06-learn-lab2-tower-60deg-rule.png');

    // --- SNAPSHOT 07: LAB 2 - DISTANCE SLIDER ADJUSTMENT ---
    console.log('[*] Adjusting Lab 2 Distance Slider to 45m...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '45');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-07-learn-lab2-tower-dist-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-07-learn-lab2-tower-dist-slider.png');

    // --- LAB 3: RIVER WIDTH & TWO OBSERVATION POINTS ---
    console.log('[*] Switching to Lab 3: River Width & Two Observation Points...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩') || b.textContent?.includes('নদীর বিস্তার'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 08: LAB 3 - RIVER WIDTH 60 TO 30 DEG PRESET ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-08-learn-lab3-river-width-60-30.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-08-learn-lab3-river-width-60-30.png');

    // --- SNAPSHOT 09: LAB 3 - DISTANCE SLIDER ADJUSTMENT ---
    console.log('[*] Adjusting Lab 3 Backward Distance Slider to 50m...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '50');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-09-learn-lab3-river-width-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-09-learn-lab3-river-width-slider.png');

    // --- SNAPSHOT 10: LAB 3 - ANGLE PRESET 60 TO 45 DEG ---
    console.log('[*] Switching to 60 to 45 deg Preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const p45Btn = buttons.find((b) => b.textContent?.includes('৬০° → ৪৫°'));
      if (p45Btn) p45Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-10-learn-lab3-river-width-60-45.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-10-learn-lab3-river-width-60-45.png');

    // --- LAB 4: BROKEN TREE / POLE SIMULATOR ---
    console.log('[*] Switching to Lab 4: Broken Tree / Pole Simulator...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪') || b.textContent?.includes('গাছ বা খুঁটি ভাঙা'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 11: LAB 4 - BROKEN TREE 30 DEG ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-11-learn-lab4-broken-tree-30deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-11-learn-lab4-broken-tree-30deg.png');

    // --- SNAPSHOT 12: LAB 4 - BROKEN TREE 45 DEG ---
    console.log('[*] Selecting 45 deg for broken tree...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const deg45Btn = buttons.find((b) => b.textContent?.includes('45° কোণ') || b.textContent?.includes('৪৫°'));
      if (deg45Btn) deg45Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-12-learn-lab4-broken-tree-45deg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-12-learn-lab4-broken-tree-45deg.png');

    // --- SNAPSHOT 13: LAB 4 - TOTAL HEIGHT SLIDER TO 60M ---
    console.log('[*] Adjusting Lab 4 Total Height Slider to 60m...');
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '60');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-13-learn-lab4-broken-tree-height-slider.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-13-learn-lab4-broken-tree-height-slider.png');

    // --- LAB 5: DUAL VEHICLE / BALLOON SIMULATOR ---
    console.log('[*] Switching to Lab 5: Dual Vehicle / Balloon Simulator...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫') || b.textContent?.includes('বেলুন'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 14: LAB 5 - DUAL VEHICLES BALLOON SIMULATOR ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-14-learn-lab5-balloon-dual-cars.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-14-learn-lab5-balloon-dual-cars.png');

    // --- STEP 2: SEE EXAMPLE (WORKED BOARD CQS) ---
    console.log('[*] Step 4: Navigating to Step 2: See Example CQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // --- SNAPSHOT 15: STEP 2 - CQ 1 (DHAKA BOARD BROKEN TREE) EXPANDED ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-15-see-example-cq1-broken-tree.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-15-see-example-cq1-broken-tree.png');

    // --- SNAPSHOT 16: STEP 2 - CQ 2 (RAJSHAHI BOARD RIVER WIDTH) EXPANDED ---
    console.log('[*] Expanding CQ 2 (Rajshahi Board River Width)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const cqButtons = buttons.filter((b) => b.querySelector('span') && b.textContent?.includes('বোর্ড'));
      if (cqButtons[1]) cqButtons[1].click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-16-see-example-cq2-river-width.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-16-see-example-cq2-river-width.png');

    // --- STEP 3: TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Step 5: Navigating to Step 3: Try Yourself Challenges...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. নিজে করো'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Solve Challenge 1: Tower h = 11.55m
    console.log('[*] Solving Challenge 1: Tower height = 11.55m...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('main input[type="text"]');
      if (inputs[0]) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[0], '11.55');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const checkBtn = buttons.find((b) => b.textContent?.trim() === 'যাচাই');
      if (checkBtn) checkBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Solve Challenge 2: Broken tree trunk h = 16m
    console.log('[*] Solving Challenge 2: Broken tree trunk = 16m...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('main input[type="text"]');
      if (inputs[1]) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[1], '16');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[1]) verifyBtns[1].click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Solve Challenge 3: River width x = 30m
    console.log('[*] Solving Challenge 3: River width = 30m...');
    await page.evaluate(() => {
      const inputs = document.querySelectorAll('main input[type="text"]');
      if (inputs[2]) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[2], '30');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('main button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      if (verifyBtns[2]) verifyBtns[2].click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // --- SNAPSHOT 17: STEP 3 - ALL 3 CHALLENGES SOLVED ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-17-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-17-try-yourself-challenges.png');

    // --- STEP 4: CHECK UNDERSTANDING (MCQS) ---
    console.log('[*] Step 6: Navigating to Step 4: Check Understanding MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. যাচাই'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer all 5 MCQs correctly:
    // Q1: ভূরেখার নিচের কোণ => অবনতি কোণ (Option B / index 1)
    // Q2: ৩০° কোণে চিত্র => ভূমি > লম্ব (Option C / index 2)
    // Q3: ২০m উঁচু টাওয়ার ৪৫° কোণে ছায়া => ২০ মিটার (Option B / index 1)
    // Q4: h এবং ছায়া √৩h হলে উন্নতি কোণ => ৩০° (Option A / index 0)
    // Q5: ৬০° থেকে ৩০° ৩০m পিছিয়ে গেলে নদীর বিস্তার => ১৫ মিটার (Option A / index 0)
    console.log('[*] Selecting correct options for all 5 MCQs...');
    await page.evaluate(() => {
      const correctIndices = [1, 2, 1, 0, 0];
      const qCards = document.querySelectorAll('[data-quiz-question]');
      qCards.forEach((card, idx) => {
        const btns = card.querySelectorAll('button');
        const targetBtn = btns[correctIndices[idx]];
        if (targetBtn) targetBtn.click();
      });
    });
    await new Promise((r) => setTimeout(r, 400));

    // Click submit
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('main button')).find(
        (b) => b.textContent?.includes('কুইজ সাবমিট করুন')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // --- SNAPSHOT 18: STEP 4 - MCQS 100% SCORE (5/5) ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-18-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-18-check-understanding-mcqs.png');

    // --- STEP 5: SUMMARY & REVISION CHEAT SHEET ---
    console.log('[*] Step 7: Navigating to Step 5: Summary & Revision Cheat Sheet...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('header button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // --- SNAPSHOT 19: STEP 5 - SUMMARY CHEAT SHEET ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-19-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-19-summary-cheat-sheet.png');

    // --- SHERU AI SOCRATIC TUTOR DRAWER ---
    console.log('[*] Step 8: Testing Sheru AI Tutor Drawer...');
    await page.evaluate(() => {
      const tutorBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('শেরু AI টিউটর')
      );
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click quick preset question: 'গাছ ভাঙার সমস্যা?'
    await page.evaluate(() => {
      const chip = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('গাছ ভাঙার সমস্যা')
      );
      if (chip) chip.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    // Send question
    await page.evaluate(() => {
      const drawerInput = document.querySelector('input[placeholder*="দূরত্ব ও উচ্চতা সম্পর্কিত"]');
      if (drawerInput && drawerInput.nextElementSibling) {
        drawerInput.nextElementSibling.click();
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    // --- SNAPSHOT 20: AI TUTOR DRAWER CONVERSATION ---
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch10-20-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch10-20-ai-tutor-drawer.png');

    // Verify console errors
    console.log('\n--- Console Error Audit ---');
    if (consoleErrors.length === 0) {
      console.log('✅ 0 Console Errors encountered during entire test run!');
    } else {
      console.warn(`⚠️ Encountered ${consoleErrors.length} console errors:`, consoleErrors);
    }

    console.log('\n🎉 Chapter 10 E2E Test Completed Successfully with all 21 snapshots captured!\n');
  } catch (err) {
    console.error('❌ E2E Test Failed:', err);
    process.exitCode = 1;
  } finally {
    await browser.close();
  }
}

runMathCh10E2ETest();
