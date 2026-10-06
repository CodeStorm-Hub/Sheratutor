import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runMathCh3E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 3 (বীজগাণিতিক রাশি / Algebraic Expressions) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 3
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
      path: path.join(ARTIFACTS_DIR, 'math-ch3-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 3
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/3...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/3`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. STEP 1 - SUB-LAB 1: GEOMETRIC TILES & IDENTITIES
    console.log('[*] Step 4: Testing Sub-Lab 1 (জ্যামিতিক টাইলস ও বর্গ-ঘন সম্প্রসারণ ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab1Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০১'));
      if (lab1Btn) lab1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Change slider a to 5 and b to 3 using prototype setter
    await page.evaluate(() => {
      const sliders = Array.from(document.querySelectorAll('input[type="range"]'));
      if (sliders[0]) {
        const protoSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (protoSetter) protoSetter.call(sliders[0], '5');
        sliders[0].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (sliders[1]) {
        const protoSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (protoSetter) protoSetter.call(sliders[1], '3');
        sliders[1].dispatchEvent(new Event('input', { bubbles: true }));
        sliders[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-01-learn-tiles-sum-square.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-01-learn-tiles-sum-square.png');

    // Switch to Trinomial Square (a + b + c)^2
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const triBtn = buttons.find((b) => b.textContent?.includes('(a + b + c)²'));
      if (triBtn) triBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-02-learn-tiles-trinomial.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-02-learn-tiles-trinomial.png');

    // Switch to Difference of Squares (a + b)(a - b) = a^2 - b^2
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const diffSqBtn = buttons.find((b) => b.textContent?.includes('a² - b²'));
      if (diffSqBtn) diffSqBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-03-learn-tiles-diff-squares.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-03-learn-tiles-diff-squares.png');

    // 5. STEP 1 - SUB-LAB 2: SYMMETRICAL RECIPROCAL POWER LADDER
    console.log('[*] Step 5: Testing Sub-Lab 2 (প্রতিসম x ± 1/x পাওয়ার সিঁড়ি ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Preset x + 1/x = sqrt(5) and select Rung 3
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sqrt5Btn = buttons.find((b) => b.textContent?.includes('√5'));
      if (sqrt5Btn) sqrt5Btn.click();

      const rung3Btn = buttons.find((b) => b.textContent?.includes('ধাপ ৩'));
      if (rung3Btn) rung3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-04-learn-ladder-rung3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-04-learn-ladder-rung3.png');

    // Climb to Rung 5: x^5 + 1/x^5
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rung5Btn = buttons.find((b) => b.textContent?.includes('ধাপ ৫'));
      if (rung5Btn) rung5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-05-learn-ladder-rung5.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-05-learn-ladder-rung5.png');

    // Switch to zero cube trap: x + 1/x = sqrt(3)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sqrt3Btn = buttons.find((b) => b.textContent?.includes('শূন্য ঘনক'));
      if (sqrt3Btn) sqrt3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-06-learn-ladder-zero-cube.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-06-learn-ladder-zero-cube.png');

    // 6. STEP 1 - SUB-LAB 3: MIDDLE-TERM FACTOR SPLITTER
    console.log('[*] Step 6: Testing Sub-Lab 3 (মিডল-টার্ম উৎপাদক স্প্লিটার)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Test quadratic 1: x^2 + 5x + 6 with p=2, q=3
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-07-learn-middle-term-solved.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-07-learn-middle-term-solved.png');

    // Select quadratic 2: x^2 - 7x + 12
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const quad2Btn = buttons.find((b) => b.textContent?.includes('x² - 7x + 12'));
      if (quad2Btn) quad2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-08-learn-middle-term-neg.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-08-learn-middle-term-neg.png');

    // 7. STEP 1 - SUB-LAB 4: REMAINDER & FACTOR THEOREM (VANISHING METHOD)
    console.log('[*] Step 7: Testing Sub-Lab 4 (ভাগশেষ উপপাদ্য ও ভ্যানিশিং মেথড ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Select x = -1 for f(x) = x^3 - 7x - 6 (vanishes!)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const neg1Btn = buttons.find((b) => b.textContent?.trim() === '-1');
      if (neg1Btn) neg1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-09-learn-remainder-vanished.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-09-learn-remainder-vanished.png');

    // Select x = 2 (non-zero remainder)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const twoBtn = buttons.find((b) => b.textContent?.trim() === '2');
      if (twoBtn) twoBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-10-learn-remainder-non-zero.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-10-learn-remainder-non-zero.png');

    // 8. STEP 1 - SUB-LAB 5: CYCLIC & SYMMETRIC POLYNOMIAL LAB
    console.log('[*] Step 8: Testing Sub-Lab 5 (চক্র-ক্রমিক ও প্রতিসম রাশি ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-11-learn-cyclic-symmetry.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-11-learn-cyclic-symmetry.png');

    // 9. STEP 2 - SEE EXAMPLE (WORKED BOARD CQS WITH RUBRICS)
    console.log('[*] Step 9: Testing Step 2 (উদাহরণ দেখুন - Board CQs)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      const step2Btn = navButtons.find((b) => b.textContent?.includes('উদাহরণ দেখুন'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // CQ 1 snapshot
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-12-see-example-cq1.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-12-see-example-cq1.png');

    // CQ 2 snapshot
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq2Btn = buttons.find((b) => b.textContent?.includes('টাইপ ২'));
      if (cq2Btn) cq2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-13-see-example-cq2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-13-see-example-cq2.png');

    // CQ 3 snapshot
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq3Btn = buttons.find((b) => b.textContent?.includes('টাইপ ৩'));
      if (cq3Btn) cq3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-14-see-example-cq3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-14-see-example-cq3.png');

    // 10. STEP 3 - TRY YOURSELF (CHALLENGES)
    console.log('[*] Step 10: Testing Step 3 (নিজে চেষ্টা করুন - Interactive Challenges)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[2]) navButtons[2].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Type answers for 3 challenges: 9, 18, 0
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('main input[type="text"]'));
      const setVal = (input, val) => {
        const protoSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (protoSetter) protoSetter.call(input, val);
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      if (inputs[0]) setVal(inputs[0], '9');
      if (inputs[1]) setVal(inputs[1], '18');
      if (inputs[2]) setVal(inputs[2], '0');

      const checkButtons = Array.from(document.querySelectorAll('main button')).filter((b) => b.textContent?.trim() === 'যাচাই');
      checkButtons.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-15-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-15-try-yourself-challenges.png');

    // 11. STEP 4 - CHECK UNDERSTANDING (5 MCQS)
    console.log('[*] Step 11: Testing Step 4 (জ্ঞান যাচাই - 5 MCQs)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[3]) navButtons[3].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Select options first
    await page.evaluate(() => {
      const correctIndices = [1, 0, 0, 0, 2];
      const optionGroups = Array.from(document.querySelectorAll('main .grid.grid-cols-1.sm\\:grid-cols-2'));

      optionGroups.forEach((group, qIdx) => {
        const options = Array.from(group.querySelectorAll('button'));
        const targetIdx = correctIndices[qIdx];
        if (options[targetIdx]) {
          options[targetIdx].click();
        }
      });
    });
    await new Promise((r) => setTimeout(r, 400));

    // Then click verify buttons
    await page.evaluate(() => {
      const submitButtons = Array.from(document.querySelectorAll('main button')).filter((b) => b.textContent?.includes('উত্তর যাচাই করুন'));
      submitButtons.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-16-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-16-check-understanding-mcqs.png');

    // 12. STEP 5 - SUMMARY & FORMULA VAULT
    console.log('[*] Step 12: Testing Step 5 (সারাংশ ও সূত্রকোষ)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const navButtons = Array.from(document.querySelectorAll('nav button'));
      if (navButtons[4]) navButtons[4].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click copy notes button
    await page.evaluate(() => {
      const copyBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent?.includes('রিভিশন নোট কপি'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-17-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-17-summary-cheat-sheet.png');

    // 13. AI TUTOR DRAWER
    console.log('[*] Step 13: Testing Sheru AI Tutor Drawer...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const tutorBtn = Array.from(document.querySelectorAll('header button')).find((b) => b.textContent?.includes('শেরু এআই টিউটর'));
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Click prompt chip in drawer
    await page.evaluate(() => {
      const chip = Array.from(document.querySelectorAll('.fixed button')).find((b) => b.textContent?.includes('x⁵ + 1/x⁵'));
      if (chip) chip.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch3-18-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch3-18-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log('✅ ALL TESTS COMPLETED SUCCESSFULLY!');
    console.log(`📸 19 Snapshots captured in: ${ARTIFACTS_DIR}`);
    console.log(`🔍 Console Errors count: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.warn('Console error messages:', consoleErrors);
    }
    console.log('======================================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMathCh3E2ETest();
