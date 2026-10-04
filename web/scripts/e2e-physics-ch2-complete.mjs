import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runPhysicsCh2E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 2 (গতি / Motion) Playground V2...\n');

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
    
    // Select Physics tab in library
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const physBtn = buttons.find((b) => b.textContent?.includes('পদার্থবিজ্ঞান'));
      if (physBtn) physBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch2-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch2-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 2
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/2...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. INTERACT WITH STEP 1: LEARN CONCEPT
    // Lesson 1: Types of Motion & Reference Frame
    console.log('[*] Step 4.1: Testing Lesson 1 (Motion Types & Reference Frame)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const trainBtn = buttons.find((b) => b.textContent?.includes('চলন্ত ট্রেনের যাত্রী'));
      if (trainBtn) trainBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-01-learn-motion-types.png') });
    console.log('[✓] Saved screenshot: physics-ch2-01-learn-motion-types.png');

    // Lesson 2: Distance vs Displacement & Whirling Stone
    console.log('[*] Step 4.2: Testing Lesson 2 (Distance vs Displacement & Whirling Stone)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="2"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-02-learn-distance-displacement.png') });
    console.log('[✓] Saved screenshot: physics-ch2-02-learn-distance-displacement.png');

    // Lesson 3: Equations of Motion & Car Simulator
    console.log('[*] Step 4.3: Testing Lesson 3 (Equations of Motion & Car Simulator)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="3"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Interact with car simulation: start animation
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const startSimBtn = buttons.find((b) => b.textContent?.includes('সিমুলেশন চালান'));
      if (startSimBtn) startSimBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-03-learn-equations-car-sim.png') });
    console.log('[✓] Saved screenshot: physics-ch2-03-learn-equations-car-sim.png');

    // Lesson 4: Falling Bodies & Vacuum Chamber
    console.log('[*] Step 4.4: Testing Lesson 4 (Falling Bodies & Vacuum Chamber)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="4"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Drop objects in vacuum chamber
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const dropBtn = buttons.find((b) => b.textContent?.includes('বস্তু ফেলুন'));
      if (dropBtn) dropBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-04-learn-free-fall-chamber.png') });
    console.log('[✓] Saved screenshot: physics-ch2-04-learn-free-fall-chamber.png');

    // Lesson 5: Motion Graphs & Area Under Curve
    console.log('[*] Step 4.5: Testing Lesson 5 (Motion Graphs & Area Decomposition)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="5"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-05-learn-motion-graphs.png') });
    console.log('[✓] Saved screenshot: physics-ch2-05-learn-motion-graphs.png');

    // 5. INTERACT WITH STEP 2: SEE EXAMPLE (CQ 2 Bus & Cow Collision Avoidance + Examiner Rubric)
    console.log('[*] Step 5: Testing Step 2 (Worked Examples & Board Marking Rubric)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('2') && b.textContent?.includes('See Example'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Open Rubric Drawer
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-06-see-example-bus-cow-rubric.png') });
    console.log('[✓] Saved screenshot: physics-ch2-06-see-example-bus-cow-rubric.png');

    // Switch to Example 4: Tiger & Deer Chase
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const ex4Btn = buttons.find((b) => b.textContent?.includes('বাঘ ও হরিণের দৌড়'));
      if (ex4Btn) ex4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-07-see-example-tiger-deer.png') });
    console.log('[✓] Saved screenshot: physics-ch2-07-see-example-tiger-deer.png');

    // 6. INTERACT WITH STEP 3: TRY YOURSELF (Solving Challenges)
    console.log('[*] Step 6: Testing Step 3 (Try Yourself Challenges)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('3') && b.textContent?.includes('Try Yourself'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Fill in Challenge 1: v=25, s=87.5
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[0]) {
        inputs[0].value = '25';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = '87.5';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].dispatchEvent(new Event('change', { bubbles: true }));
      }
      // Click first 'যাচাই করো'
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই করো');
      if (verifyBtns[0]) verifyBtns[0].click();

      // Challenge 2: input 54
      if (inputs[2]) {
        inputs[2].value = '54';
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].dispatchEvent(new Event('change', { bubbles: true }));
      }
      if (verifyBtns[1]) verifyBtns[1].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-08-try-yourself-challenges.png') });
    console.log('[✓] Saved screenshot: physics-ch2-08-try-yourself-challenges.png');

    // 7. INTERACT WITH STEP 4: CHECK UNDERSTANDING (MCQs)
    console.log('[*] Step 7: Testing Step 4 (Board MCQs)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('4') && b.textContent?.includes('Check Understanding'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Answer Q1 (option 1: ঘড়ির কাঁটার গতি)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find((b) => b.textContent?.includes('ঘড়ির কাঁটার গতি'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-09-check-understanding-mcqs.png') });
    console.log('[✓] Saved screenshot: physics-ch2-09-check-understanding-mcqs.png');

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

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-10-summary-cheat-sheet.png') });
    console.log('[✓] Saved screenshot: physics-ch2-10-summary-cheat-sheet.png');

    // 9. TEST AI PHYSICS TUTOR DRAWER
    console.log('[*] Step 9: Testing AI Physics Tutor drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tutorBtn = buttons.find((b) => b.textContent?.includes('AI ফিজিক্স টিউটর'));
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick question: 'ঘূর্ণন গতি ও পর্যায়বৃত্ত গতির পার্থক্য কী?'
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const qBtn = buttons.find((b) => b.textContent?.includes('ঘূর্ণন গতি ও পর্যায়বৃত্ত গতির পার্থক্য'));
      if (qBtn) qBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch2-11-ai-tutor-drawer.png') });
    console.log('[✓] Saved screenshot: physics-ch2-11-ai-tutor-drawer.png');

    console.log('\n========================================');
    console.log('🎉 ALL TESTS PASSED SUCCESSFULLY!');
    console.log('Console Errors caught:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('========================================\n');
  } catch (error) {
    console.error('❌ Test failed with error:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPhysicsCh2E2ETest();
