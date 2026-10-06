import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runPhysicsCh8E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 8 (আলোর প্রতিফলন / Reflection of Light) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 8
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
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 8
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/8...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/8`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. TEST LAB 1: LAWS OF REFLECTION & PLANE MIRROR
    console.log('[*] Step 4: Testing Lab 1: Laws of Reflection & Plane Mirror...');
    // Click Rough surface toggle
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const roughBtn = buttons.find((b) => b.textContent?.includes('ব্যাপ্ত প্রতিফলন'));
      if (roughBtn) roughBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Switch back to Smooth
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const smoothBtn = buttons.find((b) => b.textContent?.includes('নিয়মিত প্রতিফলন'));
      if (smoothBtn) smoothBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-01-learn-laws-reflection-plane.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-01-learn-laws-reflection-plane.png');

    // 5. TEST LAB 2: CONCAVE MIRROR 6-POSITION RAY TRACING
    console.log('[*] Step 5: Testing Lab 2: Concave Mirror Ray Tracing...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson2Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০২'));
      if (lesson2Btn) lesson2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Preset 4: Between C and F
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const preset4 = buttons.find((b) => b.textContent?.includes('৪. C ও F মাঝে'));
      if (preset4) preset4.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-02-learn-concave-mirror-ray-tracing.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-02-learn-concave-mirror-ray-tracing.png');

    // 6. TEST LAB 3: CONVEX MIRROR & WIDE FOV
    console.log('[*] Step 6: Testing Lab 3: Convex Mirror & FOV...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson3Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৩'));
      if (lesson3Btn) lesson3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Toggle FOV compare to Plane Mirror
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const planeBtn = buttons.find((b) => b.textContent?.includes('সমতল দর্পণ'));
      if (planeBtn) planeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Switch back to Convex Mirror
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const convexBtn = buttons.find((b) => b.textContent?.includes('উত্তল দর্পণ'));
      if (convexBtn) convexBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-03-learn-convex-mirror-wide-fov.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-03-learn-convex-mirror-wide-fov.png');

    // 7. TEST LAB 4: MIRROR EQUATION SOLVER
    console.log('[*] Step 7: Testing Lab 4: Mirror Equation Solver...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson4Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৪'));
      if (lesson4Btn) lesson4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Convex Mirror solver button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cvxBtn = buttons.find((b) => b.textContent?.includes('উত্তল দর্পণ (f < ০)'));
      if (cvxBtn) cvxBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-04-learn-mirror-formula-solver.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-04-learn-mirror-formula-solver.png');

    // 8. TEST LAB 5: REAL WORLD DEVICES & MOUNTAIN CURVE
    console.log('[*] Step 8: Testing Lab 5: Real-world Devices & Mountain Curve...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson5Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৫'));
      if (lesson5Btn) lesson5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Dentist mirror tab
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const dentistBtn = buttons.find((b) => b.textContent?.includes('ডেন্টিস্ট'));
      if (dentistBtn) dentistBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Switch back to Mountain curve
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mtnBtn = buttons.find((b) => b.textContent?.includes('পাহাড়ি'));
      if (mtnBtn) mtnBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-05-learn-mountain-curve-devices.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-05-learn-mountain-curve-devices.png');

    // 9. STEP 2: SEE EXAMPLE (CQ WALKTHROUGH)
    console.log('[*] Step 9: Testing Step 2: See Example CQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-06-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-06-see-example-cqs.png');

    // 10. TEST EXAMINER RUBRIC DRAWER
    console.log('[*] Step 10: Testing Examiner Rubric Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-07-examiner-rubric-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-07-examiner-rubric-drawer.png');

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
        inputs[0].value = '20';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[1].value = '30';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
        inputs[2].value = '-6';
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      }

      const buttons = Array.from(document.querySelectorAll('button'));
      const checkBtns = buttons.filter((b) => b.textContent?.includes('যাচাই করো'));
      checkBtns.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-08-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-08-try-yourself-challenges.png');

    // 12. STEP 4: CHECK UNDERSTANDING (MCQS)
    console.log('[*] Step 12: Testing Step 4: Check Understanding MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. MCQ কুইজ'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Answer MCQs
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const opt1 = buttons.find((b) => b.textContent?.includes('অবাস্তব ও সোজা'));
      if (opt1) opt1.click();
      const opt2 = buttons.find((b) => b.textContent?.includes('১২ cm'));
      if (opt2) opt2.click();
      const opt3 = buttons.find((b) => b.textContent?.includes('অবাস্তব, সোজা ও বিবর্ধিত'));
      if (opt3) opt3.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-09-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-09-check-understanding-mcqs.png');

    // 13. STEP 5: SUMMARY CHEAT SHEET
    console.log('[*] Step 13: Testing Step 5: Summary Cheat Sheet...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সামারি'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-10-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-10-summary-cheat-sheet.png');

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
      const qBtn = buttons.find((b) => b.textContent?.includes('গাড়িতে উত্তল আয়না'));
      if (qBtn) qBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch8-11-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch8-11-ai-tutor-drawer.png');

    console.log('\n=============================================');
    console.log('🎉 E2E Tests for Physics Chapter 8 Completed Successfully!');
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

runPhysicsCh8E2ETest();
