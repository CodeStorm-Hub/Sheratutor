import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh14E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 14 (অনুপাত, সদৃশতা ও প্রতিসমতা / Ratio, Similarity & Symmetry) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 14
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
      path: path.join(ARTIFACTS_DIR, 'math-ch14-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 14
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/14...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/14`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so controls are nicely in view
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - THALES THEOREM STANDARD ---
    console.log('[*] Testing Lab 1: Thales Theorem Standard...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-01-learn-lab1-thales-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-01-learn-lab1-thales-standard.png');

    // --- SNAPSHOT 02: LAB 1 - RATIO 1:2 PRESET ---
    console.log('[*] Lab 1: Clicking ratio 1:2 preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('অনুপাত ১:২'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-02-learn-lab1-thales-ratio1-2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-02-learn-lab1-thales-ratio1-2.png');

    // --- SNAPSHOT 03: LAB 1 - RATIO 2:3 PRESET ---
    console.log('[*] Lab 1: Clicking ratio 2:3 preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('অনুপাত ২:৩'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-03-learn-lab1-thales-ratio2-3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-03-learn-lab1-thales-ratio2-3.png');

    // --- SNAPSHOT 04: LAB 2 - ANGLE BISECTOR DIVISION ---
    console.log('[*] Switching to Lab 2: Angle Bisector Theorem...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('কোণের অন্তঃসমদ্বিখণ্ডক'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-04-learn-lab2-angle-bisector-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-04-learn-lab2-angle-bisector-standard.png');

    // --- SNAPSHOT 05: LAB 2 - ISOSCELES PRESET ---
    console.log('[*] Lab 2: Clicking isosceles triangle preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('সমদ্বিবাহু'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-05-learn-lab2-angle-bisector-isosceles.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-05-learn-lab2-angle-bisector-isosceles.png');

    // --- SNAPSHOT 06: LAB 2 - RATIO 3:4 PRESET ---
    console.log('[*] Lab 2: Clicking ratio 3:4 preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('অনুপাত ৩:৪'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-06-learn-lab2-angle-bisector-ratio3-4.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-06-learn-lab2-angle-bisector-ratio3-4.png');

    // --- SNAPSHOT 07: LAB 3 - SIMILAR TRIANGLES (k=1.5) ---
    console.log('[*] Switching to Lab 3: Similar Triangles Side Proportions...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('সদৃশকোণী ত্রিভুজ'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-07-learn-lab3-similar-triangles-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-07-learn-lab3-similar-triangles-standard.png');

    // --- SNAPSHOT 08: LAB 3 - DOUBLE SIZE PRESET (k=2) ---
    console.log('[*] Lab 3: Clicking double scale factor k=2...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('২ গুণ বড়'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-08-learn-lab3-similar-triangles-k2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-08-learn-lab3-similar-triangles-k2.png');

    // --- SNAPSHOT 09: LAB 3 - HALF SIZE PRESET (k=0.5) ---
    console.log('[*] Lab 3: Clicking half scale factor k=0.5...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('অর্ধেক রূপ'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-09-learn-lab3-similar-triangles-half.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-09-learn-lab3-similar-triangles-half.png');

    // --- SNAPSHOT 10: LAB 4 - SIMILAR TRIANGLES AREA RATIO THEOREM 33 ---
    console.log('[*] Switching to Lab 4: Similar Triangles Area Ratio Theorem 33...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ক্ষেত্রফল বনাম বাহুর বর্গ'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-10-learn-lab4-area-ratio-k2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-10-learn-lab4-area-ratio-k2.png');

    // --- SNAPSHOT 11: LAB 4 - ADJUST SLIDER k=3 ---
    console.log('[*] Lab 4: Adjusting scale factor slider k to 3.0...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length > 0) {
        const slider = sliders[sliders.length - 1];
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '3');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-11-learn-lab4-area-ratio-k3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-11-learn-lab4-area-ratio-k3.png');

    // --- SNAPSHOT 12: LAB 5 - LINE & ROTATIONAL SYMMETRY (EQUILATERAL TRIANGLE) ---
    console.log('[*] Switching to Lab 5: Line & Rotational Symmetry...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('রৈখিক ও ঘূর্ণন প্রতিসমতা'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-12-learn-lab5-symmetry-triangle.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-12-learn-lab5-symmetry-triangle.png');

    // --- SNAPSHOT 13: LAB 5 - SQUARE (4 lines, order 4) ---
    console.log('[*] Lab 5: Selecting Square shape...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('বর্গক্ষেত্র'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-13-learn-lab5-symmetry-square.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-13-learn-lab5-symmetry-square.png');

    // --- SNAPSHOT 14: LAB 5 - RECTANGLE (2 lines, order 2) ---
    console.log('[*] Lab 5: Selecting Rectangle shape...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('আয়তক্ষেত্র'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-14-learn-lab5-symmetry-rectangle.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-14-learn-lab5-symmetry-rectangle.png');

    // --- SNAPSHOT 15: STEP 2 - SEE EXAMPLE (CQ 1 DHAKA BOARD) ---
    console.log('[*] Navigating to Step 2: See Example (সৃজনশীল বোর্ড প্রশ্ন)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const exTab = tabButtons.find((b) => b.textContent?.includes('২. উদাহরণ দেখুন') || b.textContent?.includes('See Example'));
      if (exTab) exTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-15-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-15-see-example-cq1-dhaka.png');

    // --- SNAPSHOT 16: STEP 2 - SEE EXAMPLE (CQ 2 RAJSHAHI BOARD) ---
    console.log('[*] Selecting CQ 2 (রাজশাহী বোর্ড)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq2 = buttons.find((b) => b.textContent?.includes('রাজশাহী বোর্ড'));
      if (cq2) cq2.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-16-see-example-cq2-rajshahi.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-16-see-example-cq2-rajshahi.png');

    // --- SNAPSHOT 17: STEP 3 - TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Navigating to Step 3: Try Yourself (বাস্তব সমস্যা সমাধান ও চ্যালেঞ্জ)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const tryTab = tabButtons.find((b) => b.textContent?.includes('৩. নিজে চেষ্টা করুন') || b.textContent?.includes('Try Yourself'));
      if (tryTab) tryTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Submit answers: C1=7.5, C2=8, C3=4
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]'));
      if (inputs.length >= 3) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[0], '7.5');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(inputs[1], '8');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(inputs[2], '4');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      }

      const buttons = Array.from(document.querySelectorAll('button'));
      const submitButtons = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      submitButtons.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-17-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-17-try-yourself-challenges.png');

    // --- SNAPSHOT 18: STEP 4 - CHECK UNDERSTANDING (MCQs) ---
    console.log('[*] Navigating to Step 4: Check Understanding (অনুধাবন যাচাই - ৫টি বোর্ড স্ট্যান্ডার্ড MCQ)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const chkTab = tabButtons.find((b) => b.textContent?.includes('৪. অনুধাবন যাচাই') || b.textContent?.includes('Check Understanding'));
      if (chkTab) chkTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer 5 MCQs (correct answers: 0, 1, 2, 2, 3)
    await page.evaluate(() => {
      const correctIndices = [0, 1, 2, 2, 3];
      const allOptionButtons = Array.from(document.querySelectorAll('button')).filter((b) => {
        const text = b.textContent?.trim() || '';
        return text.startsWith('A.') || text.startsWith('B.') || text.startsWith('C.') || text.startsWith('D.');
      });

      if (allOptionButtons.length >= 20) {
        for (let q = 0; q < 5; q++) {
          const targetBtn = allOptionButtons[q * 4 + correctIndices[q]];
          if (targetBtn) targetBtn.click();
        }
      }

      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => b.textContent?.includes('উত্তর যাচাই করুন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-18-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-18-check-understanding-mcqs.png');

    // --- SNAPSHOT 19: STEP 5 - SUMMARY CHEAT SHEET ---
    console.log('[*] Navigating to Step 5: Summary (সারসংক্ষেপ ও ফর্মুলা চিটশিট)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const sumTab = tabButtons.find((b) => b.textContent?.trim() === '৫. সারসংক্ষেপ' || b.textContent?.includes('Summary'));
      if (sumTab) sumTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click copy cheat sheet button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('চিটশিট কপি করুন') || b.textContent?.includes('কপি করুন'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-19-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-19-summary-cheat-sheet.png');

    // --- SNAPSHOT 20: SHERU AI TUTOR DRAWER ---
    console.log('[*] Opening Sheru AI Similarity & Symmetry Tutor Companion Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('শেরু AI') || b.textContent?.includes('AI টিউটর'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch14-20-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch14-20-ai-tutor-drawer.png');

    console.log('\n========================================');
    console.log(`🎉 Test Completed!`);
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors Detected:', consoleErrors);
    }
    console.log('========================================\n');

    if (consoleErrors.length > 0) {
      throw new Error(`Browser console errors detected: ${JSON.stringify(consoleErrors)}`);
    }

  } catch (err) {
    console.error('❌ Test failed:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runMathCh14E2ETest().catch((err) => {
  console.error(err);
  process.exit(1);
});
