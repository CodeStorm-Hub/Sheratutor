import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runPhysicsCh5E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 5 (পদার্থের অবস্থা ও চাপ / States of Matter & Pressure) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 5
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
      path: path.join(ARTIFACTS_DIR, 'physics-ch5-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch5-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 5
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/5...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/5`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. INTERACT WITH STEP 1: LEARN CONCEPT
    // Lesson 1: Pressure & Density
    console.log('[*] Step 4.1: Testing Lesson 1 (Pressure & Material Density Lab)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const heelBtn = buttons.find((b) => b.textContent?.includes('হাই-হিল'));
      if (heelBtn) heelBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-01-learn-pressure-density.png') });
    console.log('[✓] Saved screenshot: physics-ch5-01-learn-pressure-density.png');

    // Lesson 2: Liquid Pressure (P = h * rho * g)
    console.log('[*] Step 4.2: Testing Lesson 2 (Liquid Pressure & Depth Lab)...');
    await page.evaluate(() => {
      const btn = document.querySelector('button:has(p)');
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson2Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০২') || b.textContent?.includes('তরলের অভ্যন্তরে চাপ'));
      if (lesson2Btn) lesson2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Choose Mercury
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mercBtn = buttons.find((b) => b.textContent?.includes('পারদ'));
      if (mercBtn) mercBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-02-learn-liquid-pressure.png') });
    console.log('[✓] Saved screenshot: physics-ch5-02-learn-liquid-pressure.png');

    // Lesson 3: Archimedes & Buoyancy Lab
    console.log('[*] Step 4.3: Testing Lesson 3 (Archimedes Principle & Buoyancy Lab)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson3Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৩') || b.textContent?.includes('আর্কিমিডিসের নীতি'));
      if (lesson3Btn) lesson3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click 'পানিতে নিমজ্জিত করুন'
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const submergeBtn = buttons.find((b) => b.textContent?.includes('নিমজ্জিত করুন'));
      if (submergeBtn) submergeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-03-learn-archimedes-buoyancy.png') });
    console.log('[✓] Saved screenshot: physics-ch5-03-learn-archimedes-buoyancy.png');

    // Lesson 4: Pascal Hydraulic Press Multiplier
    console.log('[*] Step 4.4: Testing Lesson 4 (Pascal Hydraulic Multiplier Lab)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson4Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৪') || b.textContent?.includes('প্যাসকেলের সূত্র'));
      if (lesson4Btn) lesson4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click 'পাম্প হ্যান্ডেল চাপুন'
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const pumpBtn = buttons.find((b) => b.textContent?.includes('পাম্প হ্যান্ডেল'));
      if (pumpBtn) pumpBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-04-learn-pascal-hydraulic.png') });
    console.log('[✓] Saved screenshot: physics-ch5-04-learn-pascal-hydraulic.png');

    // Lesson 5: Hooke's Elasticity & Young's Modulus
    console.log('[*] Step 4.5: Testing Lesson 5 (Hooke Elasticity & Young Modulus Lab)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson5Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৫') || b.textContent?.includes('স্থিতিস্থাপকতা'));
      if (lesson5Btn) lesson5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Select Copper
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copperBtn = buttons.find((b) => b.textContent?.includes('তামা'));
      if (copperBtn) copperBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-05-learn-young-modulus.png') });
    console.log('[✓] Saved screenshot: physics-ch5-05-learn-young-modulus.png');

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
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-06-see-example-cq1-rubric.png') });
    console.log('[✓] Saved screenshot: physics-ch5-06-see-example-cq1-rubric.png');

    // Switch to Example 3: Dhaka Board Hydraulic Press
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const ex3Btn = buttons.find((b) => b.textContent?.includes('ঢাকা বোর্ড: হাইড্রোলিক প্রেস'));
      if (ex3Btn) ex3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-07-see-example-hydraulic-car.png') });
    console.log('[✓] Saved screenshot: physics-ch5-07-see-example-hydraulic-car.png');

    // 6. INTERACT WITH STEP 3: TRY YOURSELF (Solving Challenges)
    console.log('[*] Step 6: Testing Step 3 (Try Yourself Challenges)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('3') && b.textContent?.includes('Try Yourself'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Fill in Challenge 1: Liquid Pressure (25 * 1025 * 9.8 = 251125)
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="text"]'));
      if (inputs[0]) {
        inputs[0].value = '251125';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[0].dispatchEvent(new Event('change', { bubbles: true }));
      }
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই করো');
      if (verifyBtns[0]) verifyBtns[0].click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-08-try-yourself-challenges.png') });
    console.log('[✓] Saved screenshot: physics-ch5-08-try-yourself-challenges.png');

    // 7. INTERACT WITH STEP 4: CHECK UNDERSTANDING (MCQs)
    console.log('[*] Step 7: Testing Step 4 (Board MCQs)...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('4') && b.textContent?.includes('Check Understanding'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click answer for Q1: ব্যারোমিটার
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt = buttons.find((b) => b.textContent?.includes('ব্যারোমিটার'));
      if (opt) opt.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-09-check-understanding-mcqs.png') });
    console.log('[✓] Saved screenshot: physics-ch5-09-check-understanding-mcqs.png');

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

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-10-summary-cheat-sheet.png') });
    console.log('[✓] Saved screenshot: physics-ch5-10-summary-cheat-sheet.png');

    // 9. TEST AI PHYSICS TUTOR DRAWER
    console.log('[*] Step 9: Testing AI Physics Tutor drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const tutorBtn = buttons.find((b) => b.textContent?.includes('AI শিক্ষক') || b.textContent?.includes('AI ফিজিক্স শিক্ষক'));
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick question prompt: 'বরফ পানিতে ভাসে কেন?'
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('বরফ পানিতে ভাসে কেন?'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'physics-ch5-11-ai-tutor-drawer.png') });
    console.log('[✓] Saved screenshot: physics-ch5-11-ai-tutor-drawer.png');

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

runPhysicsCh5E2ETest();
