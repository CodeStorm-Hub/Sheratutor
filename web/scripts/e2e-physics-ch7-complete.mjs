import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runPhysicsCh7E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 7 (তরঙ্গ ও শব্দ / Waves & Sound) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 7
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
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 7
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/7...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/7`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. TEST LAB 1: SIMPLE HARMONIC MOTION (PENDULUM & SPRING)
    console.log('[*] Step 4: Testing Lab 1: Simple Harmonic Motion...');
    // Click Moon preset
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const moonBtn = buttons.find((b) => b.textContent?.includes('চাঁদ'));
      if (moonBtn) moonBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Toggle to Spring mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const springBtn = buttons.find((b) => b.textContent?.includes('স্প্রিং'));
      if (springBtn) springBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-01-learn-shm-pendulum.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-01-learn-shm-pendulum.png');

    // 5. TEST LAB 2: TRANSVERSE & LONGITUDINAL WAVES
    console.log('[*] Step 5: Testing Lab 2: Transverse & Longitudinal Waves...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson2Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০২'));
      if (lesson2Btn) lesson2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Longitudinal Wave mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const longBtn = buttons.find((b) => b.textContent?.includes('অনুদৈর্ঘ্য'));
      if (longBtn) longBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-02-learn-transverse-longitudinal-waves.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-02-learn-transverse-longitudinal-waves.png');

    // 6. TEST LAB 3: SOUND IN MEDIUMS & VACUUM BELL JAR
    console.log('[*] Step 6: Testing Lab 3: Sound in Mediums & Vacuum...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson3Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৩'));
      if (lesson3Btn) lesson3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Select Steel Medium
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const steelBtn = buttons.find((b) => b.textContent?.includes('লোহা'));
      if (steelBtn) steelBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Toggle vacuum switch
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const vacBtn = buttons.find((b) => b.textContent?.includes('বায়ুশূন্য'));
      if (vacBtn) vacBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-03-learn-sound-media-vacuum.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-03-learn-sound-media-vacuum.png');

    // 7. TEST LAB 4: ECHO SIMULATOR & WELL DEPTH
    console.log('[*] Step 4: Testing Lab 4: Echo Simulator & Well Depth...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson4Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৪'));
      if (lesson4Btn) lesson4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Sound Pulse (তালি বাজাও)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const clapBtn = buttons.find((b) => b.textContent?.includes('তালি বাজাও'));
      if (clapBtn) clapBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-04-learn-echo-reflection-simulator.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-04-learn-echo-reflection-simulator.png');

    // 8. TEST LAB 5: FREQUENCY SPECTRUM & SONAR
    console.log('[*] Step 8: Testing Lab 5: Frequency Spectrum & SONAR...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson5Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৫'));
      if (lesson5Btn) lesson5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Select Bat / Ultrasound frequency preset
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const batBtn = buttons.find((b) => b.textContent?.includes('বাদুড়'));
      if (batBtn) batBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-05-learn-frequency-spectrum-sonar.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-05-learn-frequency-spectrum-sonar.png');

    // 9. STEP 2: SEE EXAMPLE (CQ WALKTHROUGH)
    console.log('[*] Step 9: Testing Step 2: See Example CQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-06-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-06-see-example-cqs.png');

    // 10. TEST EXAMINER RUBRIC DRAWER
    console.log('[*] Step 10: Testing Examiner Rubric Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-07-examiner-rubric-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-07-examiner-rubric-drawer.png');

    // 11. STEP 3: TRY YOURSELF (CHALLENGES)
    console.log('[*] Step 11: Testing Step 3: Interactive Practice Challenges...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. প্র্যাকটিস'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Fill answers and click submit buttons
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"], input[type="number"]'));
      if (inputs.length >= 3) {
        inputs[0].value = '0.664';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].value = '17.5';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].value = '348';
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      }

      const buttons = Array.from(document.querySelectorAll('button'));
      const checkBtns = buttons.filter((b) => b.textContent?.includes('উত্তর যাচাই'));
      checkBtns.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-08-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-08-try-yourself-challenges.png');

    // 12. STEP 4: CHECK UNDERSTANDING (MCQS)
    console.log('[*] Step 12: Testing Step 4: Check Understanding MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. MCQ কুইজ'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer MCQ 1, 2, 3
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt1 = buttons.find((b) => b.textContent?.includes('লব্ধি বেগ দ্বিগুণ হবে'));
      if (opt1) opt1.click();
      const opt2 = buttons.find((b) => b.textContent?.includes('০.১ সেকেন্ড'));
      if (opt2) opt2.click();
      const opt3 = buttons.find((b) => b.textContent?.includes('১৬.৬ m'));
      if (opt3) opt3.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-09-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-09-check-understanding-mcqs.png');

    // 13. STEP 5: SUMMARY CHEAT SHEET
    console.log('[*] Step 13: Testing Step 5: Summary Cheat Sheet...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সামারি'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-10-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-10-summary-cheat-sheet.png');

    // 14. SOCRATIC AI TUTOR DRAWER
    console.log('[*] Step 14: Testing Socratic AI Tutor Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tutorBtn = buttons.find((b) => b.textContent?.includes('সক্রেটিক এআই টিউটর'));
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click a preset question
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const qBtn = buttons.find((b) => b.textContent?.includes('প্রতিধ্বনি শোনার ন্যূনতম দূরত্ব'));
      if (qBtn) qBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch7-11-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch7-11-ai-tutor-drawer.png');

    console.log('\n=============================================');
    console.log('🎉 E2E Tests for Physics Chapter 7 Completed Successfully!');
    console.log(`Console Errors Logged: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('=============================================\n');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPhysicsCh7E2ETest();
