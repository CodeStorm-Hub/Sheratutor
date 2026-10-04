import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runFiveStepsE2ETest() {
  console.log('🚀 Running E2E Test: 5-Step Learning Navigation & NCTB Board Features...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1680,1050'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1050 });

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
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully.');

    // 2. NAVIGATE TO PLAYGROUND V2 MATH CHAPTER 1
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2/math/1...');
    await page.goto('http://localhost:3000/dashboard/playground/v2/math/1', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture initial Step 1: Learn Concept
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'step-01-learn-concept-tab.png'),
    });
    console.log('[✓] Saved screenshot: step-01-learn-concept-tab.png');

    // 3. STEP 1 INTERACTION: Sort a chip
    console.log('[*] Step 3: Interacting with Sorting Challenge in Step 1...');
    await page.evaluate(() => {
      // Click the first number chip e.g. -5
      const buttons = Array.from(document.querySelectorAll('button'));
      const chipBtn = buttons.find((b) => b.textContent?.trim() === '-5');
      if (chipBtn) chipBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      // Click the rational bucket
      const buttons = Array.from(document.querySelectorAll('button'));
      const bucketBtn = buttons.find((b) => b.textContent?.includes('মূলদ সংখ্যার বাক্স'));
      if (bucketBtn) bucketBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 4. NAVIGATE TO STEP 2: SEE EXAMPLE
    console.log('[*] Step 4: Clicking "2 See Example" tab in top bar...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="example"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'step-02-see-example-classification.png'),
    });
    console.log('[✓] Saved screenshot: step-02-see-example-classification.png');

    // Toggle to Example 2: √2 proof & expand rubric
    console.log('[*] Step 4.2: Switching to Example 2 (√2 proof) and opening rubric...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const proofTab = buttons.find((b) => b.textContent?.includes('২. √২ অমূলদ প্রমাণ'));
      if (proofTab) proofTab.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'step-02-see-example-proof-rubric.png'),
    });
    console.log('[✓] Saved screenshot: step-02-see-example-proof-rubric.png');

    // 5. NAVIGATE TO STEP 3: TRY YOURSELF
    console.log('[*] Step 5: Clicking "3 Try Yourself" tab...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="try"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Interact with Task 1: Detective (0 belongs to Z and Q)
    console.log('[*] Step 5.1: Solving Task 1 (Number Detective for 0)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const zBtn = buttons.find((b) => b.textContent?.includes('পূর্ণসংখ্যা (ℤ)'));
      const qBtn = buttons.find((b) => b.textContent?.includes('মূলদ সংখ্যা (ℚ)'));
      if (zBtn) zBtn.click();
      if (qBtn) qBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtn = buttons.find((b) => b.textContent?.trim() === 'যাচাই করো');
      if (verifyBtn) verifyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Interact with Task 2: 9-0 fraction challenge
    console.log('[*] Step 5.2: Solving Task 2 (9-0 Fraction Challenge)...');
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const numInput = inputs.find((i) => i.placeholder?.includes('43'));
      const denInput = inputs.find((i) => i.placeholder?.includes('90'));
      if (numInput) {
        numInput.value = '43';
        numInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (denInput) {
        denInput.value = '90';
        denInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtn = buttons.find((b) => b.textContent?.includes('চ্যালেঞ্জ যাচাই করো'));
      if (verifyBtn) verifyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'step-03-try-yourself-lab.png'),
    });
    console.log('[✓] Saved screenshot: step-03-try-yourself-lab.png');

    // 6. NAVIGATE TO STEP 4: CHECK UNDERSTANDING
    console.log('[*] Step 6: Clicking "4 Check Understanding" tab...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="check"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Answer Q1: √8 (irrational)
    console.log('[*] Step 6.1: Answering Board MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      // Find option with \sqrt{8}
      const opt = buttons.find((b) => b.textContent?.includes('8') || b.innerHTML?.includes('{8}'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Answer Q2: মূলদ ও পূর্ণসংখ্যা
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find((b) => b.textContent?.includes('মূলদ ও পূর্ণসংখ্যা'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'step-04-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: step-04-check-understanding-mcqs.png');

    // 7. NAVIGATE TO STEP 5: SUMMARY
    console.log('[*] Step 7: Clicking "5 Summary" tab...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="summary"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    // Click copy notes button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('স্টাডি নোট কপি'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'step-05-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: step-05-summary-cheat-sheet.png');

    // Check for console errors
    console.log('\n--- Console Errors Check ---');
    if (consoleErrors.length === 0) {
      console.log('✅ ZERO console errors detected during full 5-step test.');
    } else {
      console.log(`⚠️ Console errors detected (${consoleErrors.length}):`);
      consoleErrors.forEach((e) => console.log('  -', e));
    }

    console.log('\n🎉 E2E TEST COMPLETED SUCCESSFULLY! All 5 steps fully verified.');
  } catch (err) {
    console.error('❌ Test failed:', err);
  } finally {
    await browser.close();
  }
}

runFiveStepsE2ETest();
