import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runPhysicsCh12E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 12 (বিদ্যুতের চৌম্বক ক্রিয়া / Magnetic Effects) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 12
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2 Library View...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Select Physics tab in library
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const physBtn = buttons.find((b) => b.textContent?.includes('Physics'));
      if (physBtn) physBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 12
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/12...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/12`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. LAB 1: OERSTED EXPERIMENT & RIGHT-HAND THUMB RULE
    console.log('[*] Step 4: Testing Lab 1 (ওয়েরস্টেডের পরীক্ষা ও ডান হাতের নিয়ম)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step1Btn = buttons.find((b) => b.textContent?.includes('১. মূল ধারণা ও ল্যাব'));
      if (step1Btn) step1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-01-learn-oersted-experiment.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-01-learn-oersted-experiment.png');

    // Test reversing polarity and placing compass below wire
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const belowBtn = buttons.find((b) => b.textContent?.includes('তারের নিচে'));
      if (belowBtn) belowBtn.click();
      const revBtn = buttons.find((b) => b.textContent?.includes('প্রবাহের দিক উল্টাও'));
      if (revBtn) revBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-02-learn-oersted-reversed-below.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-02-learn-oersted-reversed-below.png');

    // 5. LAB 2: SOLENOID & ELECTROMAGNET
    console.log('[*] Step 5: Testing Lab 2 (সলিনয়েড ও তাড়িতচুম্বক ডোমেইন ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('সলিনয়েড ও তাড়িতচুম্বক'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-03-learn-solenoid-electromagnet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-03-learn-solenoid-electromagnet.png');

    // Test Power Cut button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cutBtn = buttons.find((b) => b.textContent?.includes('বিদ্যুৎ কাটো'));
      if (cutBtn) cutBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-04-learn-solenoid-power-cut.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-04-learn-solenoid-power-cut.png');

    // 6. LAB 3: DC MOTOR & FLEMING'S LEFT-HAND RULE
    console.log('[*] Step 6: Testing Lab 3 (ডিসি মোটর ও ফ্লেমিং-এর বাম হস্ত নিয়ম)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('ডিসি মোটর'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-05-learn-dc-motor-running.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-05-learn-dc-motor-running.png');

    // Toggle without commutator
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const commBtn = buttons.find((b) => b.textContent?.includes('কমিউটেটর সক্রিয়'));
      if (commBtn) commBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-06-learn-dc-motor-without-commutator.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-06-learn-dc-motor-without-commutator.png');

    // 7. LAB 4: ELECTROMAGNETIC INDUCTION & GENERATOR
    console.log('[*] Step 7: Testing Lab 4 (তাড়িতচৌম্বক আবেশ ও এসি জেনারেটর)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('তাড়িতচৌম্বক আবেশ'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Test pushing magnet in
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const inBtn = buttons.find((b) => b.textContent?.includes('ভেতরে ঢোকাও'));
      if (inBtn) {
        inBtn.dispatchEvent(new MouseEvent('mousedown', { bubbles: true }));
      }
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-07-learn-faraday-induction.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-07-learn-faraday-induction.png');

    // Switch to Generator sub-mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const genBtn = buttons.find((b) => b.textContent?.includes('মোড খ:'));
      if (genBtn) genBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-08-learn-ac-generator-waveform.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-08-learn-ac-generator-waveform.png');

    // 8. LAB 5: TRANSFORMER & POWER GRID LOSS
    console.log('[*] Step 8: Testing Lab 5 (ট্রান্সফরমার সিমুলেটর ও পাওয়ার গ্রিড)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('ট্রান্সফরমার'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-09-learn-transformer-step-up.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-09-learn-transformer-step-up.png');

    // Test DC Battery Trap button in Lab 5
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const dcBtn = buttons.find((b) => b.textContent?.includes('ডিসি (DC - ব্যাটারি ফাঁদ!)'));
      if (dcBtn) dcBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-10-learn-transformer-dc-trap.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-10-learn-transformer-dc-trap.png');

    // Switch to Grid Loss mode in Lab 5
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const gridBtn = buttons.find((b) => b.textContent?.includes('মোড খ: জাতীয় গ্রিড'));
      if (gridBtn) gridBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-11-learn-grid-transmission-loss.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-11-learn-grid-transmission-loss.png');

    // 9. STEP 2: WORKED CQS & EXAMINER SECRET RUBRIC
    console.log('[*] Step 9: Testing Step 2 (সৃজনশীল উদাহরণ ও পরীক্ষকের গোপন কথা)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. সৃজনশীল উদাহরণ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Open examiner rubric
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const rubricBtn = buttons.find((b) => b.textContent?.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-12-see-example-cqs-rubric.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-12-see-example-cqs-rubric.png');

    // 10. STEP 3: TRY YOURSELF CHALLENGES
    console.log('[*] Step 10: Testing Step 3 (নিজে করো চ্যালেঞ্জ)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. নিজে করো চ্যালেঞ্জ'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Fill in challenge inputs:
    // Challenge 1: Vs = (500/50)*20 = 200
    // Challenge 2: Is = (220/11)*0.5 = 10
    // Challenge 3: n = 100 / 0.2 = 500
    await page.evaluate(() => {
      const inputs = Array.from(document.querySelectorAll('input[type="number"]'));
      if (inputs[0]) {
        inputs[0].value = '200';
        inputs[0].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[1]) {
        inputs[1].value = '10';
        inputs[1].dispatchEvent(new Event('input', { bubbles: true }));
      }
      if (inputs[2]) {
        inputs[2].value = '500';
        inputs[2].dispatchEvent(new Event('input', { bubbles: true }));
      }

      // Click each exact verify button
      const buttons = Array.from(document.querySelectorAll('button'));
      const verifyBtns = buttons.filter((b) => b.textContent?.trim() === 'যাচাই');
      verifyBtns.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-13-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-13-try-yourself-challenges.png');

    // 11. STEP 4: CHECK UNDERSTANDING MCQS
    console.log('[*] Step 11: Testing Step 4 (যাচাই ও কুইজ)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. যাচাই ও কুইজ'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Answer MCQs and check
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      // MCQ 1: option index 1 (ঘনীভূত ও শক্তিশালী হবে)
      const q1Btn = buttons.find((b) => b.textContent?.includes('ঘনীভূত ও শক্তিশালী হবে'));
      if (q1Btn) q1Btn.click();
      // MCQ 2: option index 2 (ট্রান্সফরমার)
      const q2Btn = buttons.find((b) => b.textContent?.includes('ট্রান্সফরমার'));
      if (q2Btn) q2Btn.click();
      // MCQ 3: option index 2 (0 V)
      const q3Btn = buttons.find((b) => b.textContent?.includes('0 V'));
      if (q3Btn) q3Btn.click();
      // MCQ 4: option index 1 (প্রতি অর্ধ-ঘূর্ণনে কারেন্টের দিক পরিবর্তন করে একমুখী ঘূর্ণন টর্ক বজায় রাখা)
      const q4Btn = buttons.find((b) => b.textContent?.includes('প্রতি অর্ধ-ঘূর্ণনে কারেন্টের দিক'));
      if (q4Btn) q4Btn.click();
      // MCQ 5: option index 1 (প্রবাহমাত্রা (I) কমিয়ে লাইনে I²R তাপীয় অপচয় বিপুল পরিমাণ হ্রাস করা)
      const q5Btn = buttons.find((b) => b.textContent?.includes('প্রবাহমাত্রা (I) কমিয়ে'));
      if (q5Btn) q5Btn.click();

      // Submit
      const checkBtn = buttons.find((b) => b.textContent?.includes('উত্তর ও ব্যাখ্যা যাচাই করো'));
      if (checkBtn) checkBtn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-14-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-14-check-understanding-mcqs.png');

    // 12. STEP 5: SUMMARY CHEAT SHEET
    console.log('[*] Step 12: Testing Step 5 (সারসংক্ষেপ ও সূত্র ভাণ্ডার)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সূত্র ও চিট-শিট'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    // Test Copy button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copyBtn = buttons.find((b) => b.textContent?.includes('নোট কপি করুন'));
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-15-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-15-summary-cheat-sheet.png');

    // 13. SOCRATIC AI TUTOR DRAWER
    console.log('[*] Step 13: Testing Socratic AI Tutor Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const drawerBtn = buttons.find((b) => b.textContent?.includes('শেরু এআই গাইড'));
      if (drawerBtn) drawerBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick prompt chip
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const chip = buttons.find((b) => b.textContent?.includes('ট্রান্সফরমার ডিসিতে কাজ করে না কেন?'));
      if (chip) chip.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch12-16-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch12-16-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log('🎉 E2E Test Completed Successfully with 17 Snapshots!');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.error('Console Errors:', consoleErrors);
    }
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    throw err;
  } finally {
    await browser.close();
  }
}

runPhysicsCh12E2ETest().catch((err) => {
  console.error(err);
  process.exit(1);
});
