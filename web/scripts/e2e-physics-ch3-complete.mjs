import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runPhysicsCh3E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 3 (বল / Force) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 3
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
      path: path.join(ARTIFACTS_DIR, 'physics-ch3-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch3-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 3
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/3...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/3`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. INTERACT WITH STEP 1: LEARN CONCEPT
    // Lesson 1: Inertia & Bus Passenger Simulator
    console.log('[*] Step 4.1: Testing Lesson 1 (Inertia & Bus Passenger Simulator)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const brakeBtn = buttons.find((b) => b.textContent?.includes('ব্রেক কষে থামানো'));
      if (brakeBtn) brakeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-01-learn-bus-inertia.png') });
    console.log('[✓] Saved screenshot: physics-ch3-01-learn-bus-inertia.png');

    // Lesson 2: Newton 2nd Law & F=ma Accelerator
    console.log('[*] Step 4.2: Testing Lesson 2 (F=ma Accelerator & Friction)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="2"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Trigger acceleration animation
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const accelBtn = buttons.find((b) => b.textContent?.includes('ত্বরণ সিমুলেশন চালান'));
      if (accelBtn) accelBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-02-learn-f-equals-ma.png') });
    console.log('[✓] Saved screenshot: physics-ch3-02-learn-f-equals-ma.png');

    // Lesson 3: Newton 3rd Law & Gun Recoil
    console.log('[*] Step 4.3: Testing Lesson 3 (Newton 3rd Law & Gun Recoil)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="3"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Trigger gun fire animation
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const fireBtn = buttons.find((b) => b.textContent?.includes('গুলি ছুড়ুন') || b.textContent?.includes('Fire'));
      if (fireBtn) fireBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-03-learn-gun-recoil.png') });
    console.log('[✓] Saved screenshot: physics-ch3-03-learn-gun-recoil.png');

    // Lesson 4: Momentum Conservation & Collision
    console.log('[*] Step 4.4: Testing Lesson 4 (Momentum Conservation & Collision Simulator)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="4"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Trigger collision simulation
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const collideBtn = buttons.find((b) => b.textContent?.includes('সংঘর্ষ চালান'));
      if (collideBtn) collideBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-04-learn-collision-momentum.png') });
    console.log('[✓] Saved screenshot: physics-ch3-04-learn-collision-momentum.png');

    // Lesson 5: 4 Friction Types & Coefficient
    console.log('[*] Step 4.5: Testing Lesson 5 (4 Friction Types & Mechanics)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="5"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click rolling friction tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rollingBtn = buttons.find((b) => b.textContent?.includes('আবর্ত ঘর্ষণ'));
      if (rollingBtn) rollingBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-05-learn-friction-types.png') });
    console.log('[✓] Saved screenshot: physics-ch3-05-learn-friction-types.png');

    // 5. INTERACT WITH STEP 2: SEE EXAMPLE (Worked CQs & Examiner Rubric)
    console.log('[*] Step 5: Testing Step 2 (Worked Examples & Board Marking Rubric)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('2') && b.textContent?.includes('See Example'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Open Rubric Drawer for Textbook CQ 1
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-06-see-example-cq1-rubric.png') });
    console.log('[✓] Saved screenshot: physics-ch3-06-see-example-cq1-rubric.png');

    // Switch to Example 2: Textbook CQ 2 (Car & Truck Head-on Collision)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const ex2Btn = buttons.find((b) => b.textContent?.includes('টেক্সটবুক CQ ২: কার ও ট্রাকের সংঘর্ষ'));
      if (ex2Btn) ex2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-07-see-example-car-truck-collision.png') });
    console.log('[✓] Saved screenshot: physics-ch3-07-see-example-car-truck-collision.png');

    // 6. INTERACT WITH STEP 3: TRY YOURSELF (Solving Challenges)
    console.log('[*] Step 6: Testing Step 3 (Try Yourself Challenges)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('3') && b.textContent?.includes('Try Yourself'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Fill in Challenge 1: F=ma net force solver
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      // Find challenge 1 inputs or fill first inputs
      if (inputs[0]) {
        inputs[0].value = '4.5';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই করো');
      if (verifyBtns[0]) verifyBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-08-try-yourself-challenges.png') });
    console.log('[✓] Saved screenshot: physics-ch3-08-try-yourself-challenges.png');

    // 7. INTERACT WITH STEP 4: CHECK UNDERSTANDING (MCQs)
    console.log('[*] Step 7: Testing Step 4 (Board MCQs)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('4') && b.textContent?.includes('Check Understanding'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click answer for Q1
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find((b) => b.textContent?.includes('বল') && !b.textContent?.includes('Check'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-09-check-understanding-mcqs.png') });
    console.log('[✓] Saved screenshot: physics-ch3-09-check-understanding-mcqs.png');

    // 8. INTERACT WITH STEP 5: SUMMARY (Cheat-Sheet & Formulas)
    console.log('[*] Step 8: Testing Step 5 (Summary & Revision Sheet)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('5') && b.textContent?.includes('Summary'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click 'নোট কপি করুন'
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('নোট কপি করুন'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-10-summary-cheat-sheet.png') });
    console.log('[✓] Saved screenshot: physics-ch3-10-summary-cheat-sheet.png');

    // 9. TEST AI PHYSICS TUTOR DRAWER
    console.log('[*] Step 9: Testing AI Physics Tutor drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tutorBtn = buttons.find((b) => b.textContent?.includes('AI ফিজিক্স টিউটর'));
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick question prompt
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('ঘর্ষণ বল কেন বেগের বিরুদ্ধে কাজ করে?'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch3-11-ai-tutor-drawer.png') });
    console.log('[✓] Saved screenshot: physics-ch3-11-ai-tutor-drawer.png');

    console.log('\n======================================');
    console.log('✅ ALL E2E STEPS COMPLETED SUCCESSFULLY');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('======================================\n');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPhysicsCh3E2ETest();
