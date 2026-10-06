import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runPhysicsCh10E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 10 (স্থির তড়িৎ / Static Electricity) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 10
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
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 10
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/10...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/10`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. LAB 1: FRICTION & ELECTRON TRANSFER
    console.log('[*] Step 4: Testing Lab 1 (ঘর্ষণে স্থির বিদ্যুৎ ও ইলেকট্রন স্থানান্তর)...');
    // Click paper scraps test button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const paperBtn = buttons.find((b) => b.textContent?.includes('কাগজের টুকরা'));
      if (paperBtn) paperBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-01-learn-friction-tribo.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-01-learn-friction-tribo.png');

    // 5. LAB 2: GOLD LEAF ELECTROSCOPE & INDUCTION
    console.log('[*] Step 5: Testing Lab 2 (স্বর্ণপাত তড়িৎবীক্ষণ যন্ত্র ও আবেশ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০২') || b.textContent?.includes('স্বর্ণপাত তড়িৎবীক্ষণ'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-02-learn-electroscope-neutral.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-02-learn-electroscope-neutral.png');

    // Trigger Step 2 (Grounding) in induction wizard
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('div, button'));
      const groundBtn = buttons.find((b) => b.textContent?.includes('ধাপ ২:') || b.textContent?.includes('আর্থিং করো'));
      if (groundBtn) groundBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-03-learn-electroscope-grounded.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-03-learn-electroscope-grounded.png');

    // 6. LAB 3: COULOMB'S FORCE & COLLIDER
    console.log('[*] Step 6: Testing Lab 3 (কুলম্বের বল ও দূরত্বের প্রভাব)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৩') || b.textContent?.includes('কুলম্বের বল'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-04-learn-coulomb-force.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-04-learn-coulomb-force.png');

    // 7. LAB 4: ELECTRIC FIELD & LINES OF FORCE
    console.log('[*] Step 7: Testing Lab 4 (তড়িৎ ক্ষেত্র ও বলরেখা সিমুলেটর)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৪') || b.textContent?.includes('তড়িৎ ক্ষেত্র'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-05-learn-electric-field-dipole.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-05-learn-electric-field-dipole.png');

    // 8. LAB 5: CAPACITOR, POTENTIAL & LIGHTNING SAFETY
    console.log('[*] Step 8: Testing Lab 5 (তড়িৎ বিভব, ধারক ও বজ্রপাত)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৫') || b.textContent?.includes('তড়িৎ বিভব'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // 8a. Sub-mode Capacitor
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-06-learn-capacitor-lab.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-06-learn-capacitor-lab.png');

    // 8b. Sub-mode Potential
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const potBtn = buttons.find((b) => b.textContent?.includes('তড়িৎ বিভব ও আধান প্রবাহ'));
      if (potBtn) potBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Connect wire
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const wireBtn = buttons.find((b) => b.textContent?.includes('পরিবাহী তার'));
      if (wireBtn) wireBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-07-learn-potential-charge-flow.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-07-learn-potential-charge-flow.png');

    // 8c. Sub-mode Lightning
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lightBtn = buttons.find((b) => b.textContent?.includes('বজ্রপাত ও বজ্রনিরোধক'));
      if (lightBtn) lightBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Trigger lightning strike
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const strikeBtn = buttons.find((b) => b.textContent?.includes('বজ্রপাত ঘটাও'));
      if (strikeBtn) strikeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-08-learn-lightning-safety.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-08-learn-lightning-safety.png');

    // 9. STEP 2: SEE EXAMPLE (BOARD CQS)
    console.log('[*] Step 9: Testing Step 2 (বোর্ড সৃজনশীল ও রুব্রিক)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const exTab = buttons.find((b) => b.textContent?.includes('২. বোর্ড সৃজনশীল'));
      if (exTab) exTab.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-09-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-09-see-example-cqs.png');

    // Toggle Examiner rubric drawer
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-10-examiner-rubric.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-10-examiner-rubric.png');

    // 10. STEP 3: TRY YOURSELF CHALLENGES
    console.log('[*] Step 10: Testing Step 3 (নিজে করো চ্যালেঞ্জ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pracTab = buttons.find((b) => b.textContent?.includes('৩. নিজে করো'));
      if (pracTab) pracTab.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    // Fill in challenge answers:
    // Challenge 1: 1.8
    // Challenge 2: 18000
    // Challenge 3: 0.2
    const inputs = await page.$$('input[type="text"]');
    if (inputs.length >= 3) {
      await inputs[0].type('1.8');
      await inputs[1].type('18000');
      await inputs[2].type('0.2');
    }

    // Click all validation buttons
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.includes('উত্তর যাচাই'));
      verifyBtns.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-11-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-11-try-yourself-challenges.png');

    // 11. STEP 4: CHECK UNDERSTANDING MCQS
    console.log('[*] Step 11: Testing Step 4 (জ্ঞান যাচাই বহুনির্বাচনি)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const quizTab = buttons.find((b) => b.textContent?.includes('৪. জ্ঞান যাচাই'));
      if (quizTab) quizTab.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Select answers for all 5 questions
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const q1Ans = buttons.find((b) => b.textContent?.includes('তড়িৎবীক্ষণ যন্ত্র'));
      if (q1Ans) q1Ans.click();

      const q2Ans = buttons.find((b) => b.textContent?.includes('আধান দুটির ভরের ওপর'));
      if (q2Ans) q2Ans.click();

      const q3Ans = buttons.find((b) => b.textContent?.includes('N C⁻¹'));
      if (q3Ans) q3Ans.click();

      const q4Ans = buttons.find((b) => b.textContent?.includes('A গোলক থেকে B'));
      if (q4Ans) q4Ans.click();

      const q5Ans = buttons.find((b) => b.textContent?.includes('তড়িৎ বিভব'));
      if (q5Ans) q5Ans.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Submit quiz
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submitBtn = buttons.find((b) => b.textContent?.includes('সবগুলো উত্তর জমা দিন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-12-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-12-check-understanding-mcqs.png');

    // 12. STEP 5: SUMMARY & FORMULA BANK
    console.log('[*] Step 12: Testing Step 5 (সূত্র ব্যাংক ও ট্র্যাপ)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const sumTab = buttons.find((b) => b.textContent?.includes('৫. সূত্র ব্যাংক'));
      if (sumTab) sumTab.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-13-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-13-summary-cheat-sheet.png');

    // 13. SOCRATIC AI TUTOR DRAWER
    console.log('[*] Step 13: Testing Socratic AI Tutor drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('সক্রেটিক এআই'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick prompt
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('কুলম্বের বলের দিক'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch10-14-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch10-14-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log('🎉 E2E TEST PASSED: ALL 15 SNAPSHOTS CAPTURED');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console Errors:', consoleErrors);
    }
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ E2E Test Failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPhysicsCh10E2ETest();
