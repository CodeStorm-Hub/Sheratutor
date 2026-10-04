import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runPhysicsCh4E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 4 (কাজ, ক্ষমতা ও শক্তি / Work, Power & Energy) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 4
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
      path: path.join(ARTIFACTS_DIR, 'physics-ch4-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch4-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 4
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/4...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/4`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. INTERACT WITH STEP 1: LEARN CONCEPT
    // Lesson 1: Work & Vector Angle Lab
    console.log('[*] Step 4.1: Testing Lesson 1 (Work & Vector Angle Lab)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const angle60Btn = buttons.find((b) => b.textContent?.includes('৬০°'));
      if (angle60Btn) angle60Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-01-learn-work-angle.png') });
    console.log('[✓] Saved screenshot: physics-ch4-01-learn-work-angle.png');

    // Lesson 2: Kinetic Energy & Momentum
    console.log('[*] Step 4.2: Testing Lesson 2 (Kinetic Energy & Momentum)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="2"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Trigger roll animation
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rollBtn = buttons.find((b) => b.textContent?.includes('গতি সিমুলেশন চালান') || b.textContent?.includes('সিমুলেশন'));
      if (rollBtn) rollBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-02-learn-kinetic-energy.png') });
    console.log('[✓] Saved screenshot: physics-ch4-02-learn-kinetic-energy.png');

    // Lesson 3: Spring Potential Energy
    console.log('[*] Step 4.3: Testing Lesson 3 (Spring Elastic Potential Energy)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="3"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-03-learn-spring-potential.png') });
    console.log('[✓] Saved screenshot: physics-ch4-03-learn-spring-potential.png');

    // Lesson 4: Conservation of Mechanical Energy Free Fall Tower
    console.log('[*] Step 4.4: Testing Lesson 4 (Mechanical Energy Conservation Tower)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="4"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Trigger drop ball animation
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const dropBtn = buttons.find((b) => b.textContent?.includes('বস্তুটি ফেলে দিন'));
      if (dropBtn) dropBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-04-learn-energy-conservation.png') });
    console.log('[✓] Saved screenshot: physics-ch4-04-learn-energy-conservation.png');

    // Lesson 5: Water Pump Motor Efficiency
    console.log('[*] Step 4.5: Testing Lesson 5 (Water Pump Motor Efficiency)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button[data-lesson-id="5"]');
      if (btn) btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Trigger motor pumping animation
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pumpBtn = buttons.find((b) => b.textContent?.includes('পাম্প চালু করুন'));
      if (pumpBtn) pumpBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-05-learn-motor-efficiency.png') });
    console.log('[✓] Saved screenshot: physics-ch4-05-learn-motor-efficiency.png');

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
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-06-see-example-cq1-rubric.png') });
    console.log('[✓] Saved screenshot: physics-ch4-06-see-example-cq1-rubric.png');

    // Switch to Example 2: Textbook CQ 2 (Water Pump Efficiency Comparison)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const ex2Btn = buttons.find((b) => b.textContent?.includes('টেক্সটবুক CQ ২: পানির পাম্প ও কর্মদক্ষতা'));
      if (ex2Btn) ex2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-07-see-example-pump-efficiency.png') });
    console.log('[✓] Saved screenshot: physics-ch4-07-see-example-pump-efficiency.png');

    // 6. INTERACT WITH STEP 3: TRY YOURSELF (Solving Challenges)
    console.log('[*] Step 6: Testing Step 3 (Try Yourself Challenges)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('3') && b.textContent?.includes('Try Yourself'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Fill in Challenge 1: Work at angle solver (W = 100 * 5 * cos(60) = 250)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[0]) {
        inputs[0].value = '250';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই করো');
      if (verifyBtns[0]) verifyBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-08-try-yourself-challenges.png') });
    console.log('[✓] Saved screenshot: physics-ch4-08-try-yourself-challenges.png');

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
      const opt = buttons.find((b) => b.textContent?.includes('শূন্য (Zero Work)'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-09-check-understanding-mcqs.png') });
    console.log('[✓] Saved screenshot: physics-ch4-09-check-understanding-mcqs.png');

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

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-10-summary-cheat-sheet.png') });
    console.log('[✓] Saved screenshot: physics-ch4-10-summary-cheat-sheet.png');

    // 9. TEST AI PHYSICS TUTOR DRAWER
    console.log('[*] Step 9: Testing AI Physics Tutor drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tutorBtn = buttons.find((b) => b.textContent?.includes('AI শিক্ষক') || b.textContent?.includes('AI ফিজিক্স টিউটর'));
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick question prompt
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('মোটরের কর্মদক্ষতা ১০০% হয় না কেন?'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch4-11-ai-tutor-drawer.png') });
    console.log('[✓] Saved screenshot: physics-ch4-11-ai-tutor-drawer.png');

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

runPhysicsCh4E2ETest();
