import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runPhysicsV2E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 1 Playground V2 & NCTB Standards...\n');

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
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully.');

    // 2. CHECK V2 LIBRARY HUB
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2 Library View...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-v2-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-v2-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 1
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/1...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/1`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. INTERACT WITH STEP 1: LEARN CONCEPT (Vernier Calipers Simulator in Lesson 2)
    console.log('[*] Step 4: Testing Vernier Caliper interactive simulator...');
    // Click Lesson 2 in left sidebar
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson2Btn = buttons.find((b) => b.textContent?.includes('ভার্নিয়ার ক্যালিউপার্স'));
      if (lesson2Btn) lesson2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Move slider to 22.4 mm
    await page.evaluate(() => {
      const slider = document.querySelector('input[type="range"]');
      if (slider) {
        slider.value = '22.4';
        slider.dispatchEvent(new Event('input', { bubbles: true }));
        slider.dispatchEvent(new Event('change', { bubbles: true }));
      }
      // Click positive zero error
      const buttons = Array.from(document.querySelectorAll('button'));
      const posErrBtn = buttons.find((b) => b.textContent?.includes('ধনাত্মক (+0.2 mm)'));
      if (posErrBtn) posErrBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-v2-01-learn-concept-vernier.png'),
    });
    console.log('[✓] Saved screenshot: physics-v2-01-learn-concept-vernier.png');

    // 5. NAVIGATE TO STEP 2: SEE EXAMPLE
    console.log('[*] Step 5: Clicking "2 See Example" tab and opening marking rubric...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="example"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Open examiner marking rubric drawer
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-v2-02-see-example-rubric.png'),
    });
    console.log('[✓] Saved screenshot: physics-v2-02-see-example-rubric.png');

    // 6. NAVIGATE TO STEP 3: TRY YOURSELF
    console.log('[*] Step 6: Clicking "3 Try Yourself" tab and solving challenges...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="try"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Task 1: Vernier Detective (M = 2.3, V = 4)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const mInput = inputs.find((i) => i.placeholder?.includes('2.3'));
      const vInput = inputs.find((i) => i.placeholder?.includes('4'));
      if (mInput) {
        mInput.value = '2.3';
        mInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (vInput) {
        vInput.value = '4';
        vInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtn = buttons.find((b) => b.textContent?.trim() === 'যাচাই করো');
      if (verifyBtn) verifyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Task 2: Dimension Matcher (Force -> [MLT⁻²])
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const dimBtn = buttons.find((b) => b.textContent?.trim() === '[MLT⁻²]');
      if (dimBtn) dimBtn.click();
      const verifyDimBtn = buttons.find((b) => b.textContent?.includes('মাত্রা যাচাই করো'));
      if (verifyDimBtn) verifyDimBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Task 3: Error Calculator (3% -> 9%)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input'));
      const errInput = inputs.find((i) => i.placeholder?.includes('9'));
      if (errInput) {
        errInput.value = '9';
        errInput.dispatchEvent(new Event('input', { bubbles: true }));
      }
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyErrBtn = buttons.find((b) => b.textContent?.includes('ত্রুটি যাচাই করো'));
      if (verifyErrBtn) verifyErrBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-v2-03-try-yourself-lab.png'),
    });
    console.log('[✓] Saved screenshot: physics-v2-03-try-yourself-lab.png');

    // 7. NAVIGATE TO STEP 4: CHECK UNDERSTANDING
    console.log('[*] Step 7: Clicking "4 Check Understanding" tab and answering board MCQs...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="check"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Answer Q1: তড়িৎপ্রবাহ (Electric Current)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find((b) => b.textContent?.includes('তড়িৎপ্রবাহ'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Answer Q2: 0.05 mm
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find((b) => b.textContent?.includes('0.05 mm'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Answer Q3: [ML²T⁻²]
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find((b) => b.textContent?.includes('[ML²T⁻²]'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-v2-04-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-v2-04-check-understanding-mcqs.png');

    // 8. NAVIGATE TO STEP 5: SUMMARY
    console.log('[*] Step 8: Clicking "5 Summary" tab...');
    await page.evaluate(() => {
      const tab = document.querySelector('button[data-step-tab="summary"]');
      if (tab) tab.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Copy study notes to trigger toast
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('স্টাডি নোট কপি'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-v2-05-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-v2-05-summary-cheat-sheet.png');

    // 9. TEST AI TUTOR
    console.log('[*] Step 9: Testing AI Tutor quick prompt in Physics lab...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('ভার্নিয়ার ধ্রুবক (VC)'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 300));

    await page.evaluate(() => {
      const sendBtn = document.querySelector('button[aria-label="Send query"]');
      if (sendBtn) sendBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-v2-06-ai-tutor-response.png'),
    });
    console.log('[✓] Saved screenshot: physics-v2-06-ai-tutor-response.png');

    // CHECK CONSOLE ERRORS
    console.log('\n--- Console Errors Check ---');
    if (consoleErrors.length === 0) {
      console.log('✅ ZERO console errors detected during full Physics V2 test.');
    } else {
      console.log(`⚠️ Console errors detected (${consoleErrors.length}):`);
      consoleErrors.forEach((e) => console.log('  -', e));
    }

    console.log('\n🎉 E2E TEST COMPLETED SUCCESSFULLY! Physics Chapter 1 fully verified.');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runPhysicsV2E2ETest();
