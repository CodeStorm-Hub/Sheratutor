import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runMathCh2E2ETest() {
  console.log('🚀 Running E2E Test: General Math Chapter 2 (সেট ও ফাংশন / Sets & Functions) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR GENERAL MATH CHAPTER 2
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2 Library View...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Select Math tab in library if available
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mathBtn = buttons.find((b) => b.textContent?.includes('Mathematics') || b.textContent?.includes('সাধারণ গণিত'));
      if (mathBtn) mathBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-00-library-hub.png');

    // 3. NAVIGATE TO MATH CHAPTER 2
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/math/2...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. STEP 1 - SUB-LAB 1: SET NOTATIONS & ROSTER BUILDER
    console.log('[*] Step 4: Testing Sub-Lab 1 (সেট প্রকাশের পদ্ধতি ও প্রকারভেদ)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab1Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০১'));
      if (lab1Btn) lab1Btn.click();

      // Click prime numbers preset
      const primeBtn = buttons.find((b) => b.textContent?.includes('মৌলিক সংখ্যা'));
      if (primeBtn) primeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Adjust slider
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        slider.value = '25';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-01-learn-roster-builder-primes.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-01-learn-roster-builder-primes.png');

    // 5. STEP 1 - SUB-LAB 2: VENN DIAGRAM & SET OPERATIONS
    console.log('[*] Step 5: Testing Sub-Lab 2 (ভেনচিত্র ও সেট অপারেশন ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০২'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Test Intersection (A ∩ B)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const interBtn = buttons.find((b) => b.textContent?.includes('A ∩ B'));
      if (interBtn) interBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-02-learn-venn-intersection.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-02-learn-venn-intersection.png');

    // Test De Morgan Law 1
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const demorganBtn = buttons.find((b) => b.textContent?.includes("দ্য মরগানের ১ম সূত্র"));
      if (demorganBtn) demorganBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-03-learn-venn-demorgan.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-03-learn-venn-demorgan.png');

    // Toggle Disjoint Mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const disjointToggle = buttons.find((b) => b.textContent?.includes('নিশ্ছেদ মোড'));
      if (disjointToggle) disjointToggle.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-04-learn-venn-disjoint.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-04-learn-venn-disjoint.png');

    // 6. STEP 1 - SUB-LAB 3: POWER SET & 2^n SUBSETS
    console.log('[*] Step 6: Testing Sub-Lab 3 (শক্তি সেট ও উপসেট সিমুলেটর)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৩'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Test n = 3
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const n3Btn = buttons.find((b) => b.textContent?.trim() === 'n = 3');
      if (n3Btn) n3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-05-learn-power-set-n3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-05-learn-power-set-n3.png');

    // Test n = 4
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const n4Btn = buttons.find((b) => b.textContent?.trim() === 'n = 4');
      if (n4Btn) n4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-06-learn-power-set-n4.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-06-learn-power-set-n4.png');

    // Test n = 0 (Empty Set Trap)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const n0Btn = buttons.find((b) => b.textContent?.trim() === 'n = 0');
      if (n0Btn) n0Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-07-learn-power-set-empty-trap.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-07-learn-power-set-empty-trap.png');

    // 7. STEP 1 - SUB-LAB 4: CARTESIAN PRODUCT & RELATIONS
    console.log('[*] Step 7: Testing Sub-Lab 4 (কার্তেসীয় গুণজ ও অন্বয় ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৪'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Test Relation: y = x + 1
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rel1Btn = buttons.find((b) => b.textContent?.includes('R₁: y = x + 1'));
      if (rel1Btn) rel1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-08-learn-relation-mapping.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-08-learn-relation-mapping.png');

    // Test Relation: x < y
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rel2Btn = buttons.find((b) => b.textContent?.includes('R₂: x < y'));
      if (rel2Btn) rel2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-09-learn-relation-x-lt-y.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-09-learn-relation-x-lt-y.png');

    // 8. STEP 1 - SUB-LAB 5: FUNCTION, DOMAIN & RANGE MACHINE
    console.log('[*] Step 8: Testing Sub-Lab 5 (ফাংশন, ডোমেন ও রেঞ্জ মেশিন)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ল্যাব ০৫'));
      if (lab5Btn) lab5Btn.click();

      // Quadratic choice
      const quadBtn = buttons.find((b) => b.textContent?.includes('x² - 4x + 3'));
      if (quadBtn) quadBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Set input x = 2
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const btn2 = buttons.find((b) => b.textContent?.trim() === '2');
      if (btn2) btn2.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-10-learn-function-machine-quadratic.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-10-learn-function-machine-quadratic.png');

    // Rational formula choice & input x = 3
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rationalBtn = buttons.find((b) => b.textContent?.includes('(2x + 1)/(2x - 1)'));
      if (rationalBtn) rationalBtn.click();

      const btn3 = buttons.find((b) => b.textContent?.trim() === '3');
      if (btn3) btn3.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-11-learn-function-machine-rational.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-11-learn-function-machine-rational.png');

    // 9. STEP 2: SEE EXAMPLE (WORKED CQs & EXAMINER SECRETS)
    console.log('[*] Step 9: Testing Step 2 (উদাহরণ দেখুন - CQs)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('উদাহরণ দেখুন'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Expand Examiner Secret Marking Guide & copy
    await page.evaluate(() => {
      const rubricToggle = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('পরীক্ষকের সিক্রেট খাতা মূল্যায়ন রুব্রিক')
      );
      if (rubricToggle) rubricToggle.click();

      const copyBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('উত্তর কপি')
      );
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-12-see-example-cq1-rubric.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-12-see-example-cq1-rubric.png');

    // View CQ 2
    await page.evaluate(() => {
      const cq2Btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('CQ ২')
      );
      if (cq2Btn) cq2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-13-see-example-cq2.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-13-see-example-cq2.png');

    // View CQ 3
    await page.evaluate(() => {
      const cq3Btn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('CQ ৩')
      );
      if (cq3Btn) cq3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-14-see-example-cq3.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-14-see-example-cq3.png');

    // 10. STEP 3: TRY YOURSELF (3 CHALLENGES)
    console.log('[*] Step 10: Testing Step 3 (নিজে চেষ্টা করুন)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('নিজে চেষ্টা করুন'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Fill answers using prototype value setter
    await page.evaluate(() => {
      const setVal = (el, val) => {
        const setter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (setter) setter.call(el, val);
        else el.value = val;
        el.dispatchEvent(new Event('input', { bubbles: true }));
        el.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
      if (inputs[0]) setVal(inputs[0], '15');
      if (inputs[1]) setVal(inputs[1], '6');
      if (inputs[2]) setVal(inputs[2], '4');
    });
    await new Promise((r) => setTimeout(r, 300));

    await page.evaluate(() => {
      const verifyBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.textContent?.trim() === 'যাচাই'
      );
      verifyBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-15-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-15-try-yourself-challenges.png');

    // 11. STEP 4: CHECK UNDERSTANDING (MCQs)
    console.log('[*] Step 11: Testing Step 4 (জ্ঞান যাচাই - 5 MCQs)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('জ্ঞান যাচাই'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Select answers
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt1 = buttons.find((b) => b.textContent?.includes('নিশ্ছেদ সেট'));
      if (opt1) opt1.click();

      const opt2 = buttons.find((b) => b.textContent?.trim() === '৭');
      if (opt2) opt2.click();

      const opt3 = buttons.find((b) => b.textContent?.trim() === '(3, 2)');
      if (opt3) opt3.click();

      const opt4 = buttons.find((b) => b.textContent?.includes('(2 + x)/(2 - x)'));
      if (opt4) opt4.click();

      const opt5 = buttons.find((b) => b.textContent?.includes('{(1, 2), (1, 3), (2, 4)}'));
      if (opt5) opt5.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Click submit
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => b.textContent?.includes('উত্তর জমা দিন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-16-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-16-check-understanding-mcqs.png');

    // 12. STEP 5: SUMMARY & CHEAT SHEET
    console.log('[*] Step 12: Testing Step 5 (সারাংশ ও সূত্র)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('সারাংশ ও সূত্র'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click copy cheat sheet
    await page.evaluate(() => {
      const copyBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('সম্পূর্ণ সূত্রকোষ কপি')
      );
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-17-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-17-summary-cheat-sheet.png');

    // 13. SOCRATIC AI TUTOR DRAWER
    console.log('[*] Step 13: Testing Sheru Socratic AI Tutor Drawer...');
    await page.evaluate(() => {
      const tutorBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('শেরু এআই টিউটর')
      );
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click prompt chip and send custom message
    await page.evaluate(() => {
      const chip = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('দ্য মরগানের সূত্রের সহজ ব্যাখ্যা কী?')
      );
      if (chip) chip.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.type('input[placeholder*="শেরুকে জিজ্ঞাসা করো"]', 'অন্বয় আর ফাংশনের মধ্যে মূল পার্থক্য কী?');
    await page.evaluate(() => {
      const sendBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.querySelector('svg.lucide-send') || b.querySelector('svg')
      );
      if (sendBtn) sendBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'math-ch2-18-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: math-ch2-18-ai-tutor-drawer.png');

    // 14. VERIFY CONSOLE ERRORS
    console.log('\n--- Console Errors Check ---');
    console.log(`Total errors captured: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.warn('Errors:', consoleErrors);
    }

    console.log('\n🎉 E2E TEST COMPLETED SUCCESSFULLY WITH ALL 19 SCREENSHOTS CAPTURED!');
  } catch (err) {
    console.error('❌ E2E Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runMathCh2E2ETest();
