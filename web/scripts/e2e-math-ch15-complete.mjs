import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runMathCh15E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 15 (ক্ষেত্রফল সম্পর্কিত উপপাদ্য ও সম্পাদ্য / Area Theorems & Constructions) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 15
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
      path: path.join(ARTIFACTS_DIR, 'math-ch15-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 15
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/15...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/15`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1500));

    // Scroll slightly so controls are nicely in view
    await page.evaluate(() => window.scrollTo({ top: 120, behavior: 'instant' }));
    await new Promise((r) => setTimeout(r, 300));

    // --- SNAPSHOT 01: LAB 1 - PARALLELOGRAMS ON SAME BASE STANDARD ---
    console.log('[*] Testing Lab 1: Parallelograms on Same Base Standard...');
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-01-learn-lab1-parallelograms-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-01-learn-lab1-parallelograms-standard.png');

    // --- SNAPSHOT 02: LAB 1 - HIGH TILT PRESET ---
    console.log('[*] Lab 1: Clicking high tilt preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('অধিক হেলানো'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-02-learn-lab1-parallelograms-tilted.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-02-learn-lab1-parallelograms-tilted.png');

    // --- SNAPSHOT 03: LAB 1 - LONG BASE PRESET ---
    console.log('[*] Lab 1: Clicking long base preset...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn = buttons.find((b) => b.textContent?.includes('লম্বা ভূমি'));
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-03-learn-lab1-parallelograms-longbase.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-03-learn-lab1-parallelograms-longbase.png');

    // --- SNAPSHOT 04: LAB 2 - TRIANGLE VS HALF-PARALLELOGRAM ---
    console.log('[*] Switching to Lab 2: Triangle vs Parallelogram (Theorem 36)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ত্রিভুজ ক্ষেত্রফল বনাম সামান্তরিকের অর্ধেক'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-04-learn-lab2-triangle-half-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-04-learn-lab2-triangle-half-standard.png');

    // --- SNAPSHOT 05: LAB 2 - VERTEX SLIDING ON PARALLEL LINE ---
    console.log('[*] Lab 2: Sliding apex X position along parallel line...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length > 0) {
        const slider = sliders[0];
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '6.5');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-05-learn-lab2-triangle-apex-shifted.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-05-learn-lab2-triangle-apex-shifted.png');

    // --- SNAPSHOT 06: LAB 3 - MEDIAN AREA BISECTION ---
    console.log('[*] Switching to Lab 3: Median Bisects Triangle Area Equally...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('মধ্যমা দ্বারা ত্রিভুজ ক্ষেত্রফল সমদ্বিখণ্ডন'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-06-learn-lab3-median-bisection-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-06-learn-lab3-median-bisection-standard.png');

    // --- SNAPSHOT 07: LAB 3 - ASYMMETRICAL VERTEX MEDIAN BISECTION ---
    console.log('[*] Lab 3: Adjusting apex X to 2.5 cm (oblique scalene)...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length > 0) {
        const slider = sliders[0];
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(slider, '2.5');
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-07-learn-lab3-median-oblique.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-07-learn-lab3-median-oblique.png');

    // --- SNAPSHOT 08: LAB 4 - PYTHAGORAS & GARFIELD'S TRAPEZOID (a=6, b=8) ---
    console.log("[*] Switching to Lab 4: Pythagoras & Garfield's Trapezoid Dissection (Theorem 39)...");
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('পিথাগোরাস উপপাদ্য ও গারফিল্ড ট্রাপিজিয়াম'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-08-learn-lab4-pythagoras-garfield-standard.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-08-learn-lab4-pythagoras-garfield-standard.png');

    // --- SNAPSHOT 09: LAB 4 - SLIDER a=5, b=7 ---
    console.log('[*] Lab 4: Adjusting sliders a=5, b=7...');
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders.length >= 2) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(sliders[0], '5');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(sliders[1], '7');
        sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-09-learn-lab4-pythagoras-custom.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-09-learn-lab4-pythagoras-custom.png');

    // --- SNAPSHOT 10: LAB 5 - CONSTRUCTION 13 (TRIANGLE TO PARALLELOGRAM - STEP 1) ---
    console.log('[*] Switching to Lab 5: Construction 13 (Triangle to Parallelogram)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ক্ষেত্রফল সংরক্ষণ সম্পাদ্য ল্যাব'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-10-learn-lab5-construction13-step3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-10-learn-lab5-construction13-step3.png');

    // --- SNAPSHOT 11: LAB 5 - STEP 4 COMPLETED PARALLELOGRAM ---
    console.log('[*] Lab 5: Selecting Step 4 (Completed Parallelogram CDEF)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ৪');
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-11-learn-lab5-construction13-step4.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-11-learn-lab5-construction13-step4.png');

    // --- SNAPSHOT 12: LAB 5 - STEP 1 BASE BISECTION ---
    console.log('[*] Lab 5: Selecting Step 1 (Base Bisection)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step1Btn = buttons.find((b) => b.textContent?.trim() === 'ধাপ ১');
      if (step1Btn) step1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-12-learn-lab5-construction13-step1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-12-learn-lab5-construction13-step1.png');

    // --- SNAPSHOT 13: STEP 2 - SEE EXAMPLE (CQ 1 DHAKA BOARD) ---
    console.log('[*] Navigating to Step 2: See Example (সৃজনশীল বোর্ড প্রশ্ন)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const exTab = tabButtons.find((b) => b.textContent?.includes('২. উদাহরণ দেখুন'));
      if (exTab) exTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-13-see-example-cq1-dhaka.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-13-see-example-cq1-dhaka.png');

    // --- SNAPSHOT 14: STEP 2 - SEE EXAMPLE (CQ 2 RAJSHAHI BOARD GARFIELD PROOF) ---
    console.log('[*] Selecting CQ 2 (রাজশাহী বোর্ড - গারফিল্ড ট্রাপিজিয়াম প্রমাণ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq2 = buttons.find((b) => b.textContent?.includes('রাজশাহী বোর্ড'));
      if (cq2) cq2.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-14-see-example-cq2-rajshahi.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-14-see-example-cq2-rajshahi.png');

    // --- SNAPSHOT 15: STEP 2 - SEE EXAMPLE (CQ 3 DINAJPUR BOARD CONSTRUCTION 13) ---
    console.log('[*] Selecting CQ 3 (দিনাজপুর বোর্ড - সম্পাদ্য ১৩)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq3 = buttons.find((b) => b.textContent?.includes('দিনাজপুর বোর্ড'));
      if (cq3) cq3.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-15-see-example-cq3-dinajpur.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-15-see-example-cq3-dinajpur.png');

    // --- SNAPSHOT 16: STEP 3 - TRY YOURSELF (CHALLENGES) ---
    console.log('[*] Navigating to Step 3: Try Yourself (বাস্তব সমস্যা সমাধান ও চ্যালেঞ্জ)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const tryTab = tabButtons.find((b) => b.textContent?.includes('৩. নিজে চেষ্টা করুন'));
      if (tryTab) tryTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Submit answers: C1=48, C2=15, C3=8
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs.length >= 3) {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value').set;
        nativeSetter.call(inputs[0], '48');
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(inputs[1], '15');
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));

        nativeSetter.call(inputs[2], '8');
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      }

      const buttons = Array.from(document.querySelectorAll('button'));
      const submitButtons = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      submitButtons.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-16-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-16-try-yourself-challenges.png');

    // --- SNAPSHOT 17: STEP 4 - CHECK UNDERSTANDING (MCQs) ---
    console.log('[*] Navigating to Step 4: Check Understanding (অনুধাবন যাচাই - ৫টি বোর্ড স্ট্যান্ডার্ড MCQ)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const chkTab = tabButtons.find((b) => b.textContent?.includes('৪. অনুধাবন যাচাই'));
      if (chkTab) chkTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer 5 MCQs (correct answers: 2, 0, 1, 0, 1)
    await page.evaluate(() => {
      const correctIndices = [2, 0, 1, 0, 1];
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
      path: path.join(ARTIFACTS_DIR, 'math-ch15-17-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-17-check-understanding-mcqs.png');

    // --- SNAPSHOT 18: STEP 5 - SUMMARY CHEAT SHEET ---
    console.log('[*] Navigating to Step 5: Summary (সারসংক্ষেপ ও ফর্মুলা চিটশিট)...');
    await page.evaluate(() => {
      const tabButtons = Array.from(document.querySelectorAll('button'));
      const sumTab = tabButtons.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ'));
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
      path: path.join(ARTIFACTS_DIR, 'math-ch15-18-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-18-summary-cheat-sheet.png');

    // --- SNAPSHOT 19: SHERU AI TUTOR DRAWER ---
    console.log('[*] Opening Sheru AI Area & Construction Tutor Companion Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('শেরু AI'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch15-19-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch15-19-ai-tutor-drawer.png');

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

runMathCh15E2ETest().catch((err) => {
  console.error(err);
  process.exit(1);
});
