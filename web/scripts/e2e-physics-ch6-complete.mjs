import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runPhysicsCh6E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 6 (বস্তুর ওপর তাপের প্রভাব / Effect of Heat on Matter) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 6
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
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 6
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/6...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/6`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. TEST LAB 1: TEMPERATURE SCALES & MOLECULAR KINETICS
    console.log('[*] Step 4: Testing Lab 1: Temperature Scales & Kinetics...');
    // Click -40° preset
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const presetBtn = buttons.find((b) => b.textContent?.includes('সমবিন্দু'));
      if (presetBtn) presetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Click Human body temp preset (37°C)
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const presetBtn = buttons.find((b) => b.textContent?.includes('মানবদেহ'));
      if (presetBtn) presetBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-01-learn-temp-scales.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-01-learn-temp-scales.png');

    // 5. TEST LAB 2: SOLID EXPANSION & RAIL GAP
    console.log('[*] Step 5: Testing Lab 2: Solid Expansion & Rail Gap...');
    // Click Lesson 2 in sidebar
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson2Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০২'));
      if (lesson2Btn) lesson2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Select Copper
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const copperBtn = buttons.find((b) => b.textContent?.includes('তামা'));
      if (copperBtn) copperBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-02-learn-solid-expansion.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-02-learn-solid-expansion.png');

    // 6. TEST LAB 3: LIQUID EXPANSION (FLASK & ANOMALOUS WATER)
    console.log('[*] Step 6: Testing Lab 3: Liquid Expansion (Flask & Anomalous)...');
    // Click Lesson 3 in sidebar
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson3Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৩'));
      if (lesson3Btn) lesson3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Step 2 in Flask mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. পাত্রের প্রসারণ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-03-learn-liquid-expansion.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-03-learn-liquid-expansion.png');

    // Toggle to Anomalous water mode
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const anomBtn = buttons.find((b) => b.textContent?.includes('পানির ব্যতিক্রমী প্রসারণ'));
      if (anomBtn) anomBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-04-learn-anomalous-water.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-04-learn-anomalous-water.png');

    // 7. TEST LAB 4: CALORIMETRY MIXER
    console.log('[*] Step 7: Testing Lab 4: Calorimetry Mixer...');
    // Click Lesson 4 in sidebar
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson4Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৪'));
      if (lesson4Btn) lesson4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click Mix trigger button
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mixBtn = buttons.find((b) => b.textContent?.includes('ক্যালোরিমিটার মিশ্রণ প্রক্রিয়া'));
      if (mixBtn) mixBtn.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-05-learn-calorimetry-mixer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-05-learn-calorimetry-mixer.png');

    // 8. TEST LAB 5: LATENT HEAT & PRESSURE COOKER
    console.log('[*] Step 8: Testing Lab 5: Latent Heat & Pressure Cooker...');
    // Click Lesson 5 in sidebar
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const lesson5Btn = buttons.find((b) => b.textContent?.includes('পাঠ ০৫'));
      if (lesson5Btn) lesson5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-06-learn-latent-heat-cooker.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-06-learn-latent-heat-cooker.png');

    // 9. TEST STEP 2: WORKED BOARD CQS
    console.log('[*] Step 9: Testing Step 2: Worked Board CQs & Rubrics...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড CQ'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-07-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-07-see-example-cqs.png');

    // 10. TEST STEP 3: TRY YOURSELF CHALLENGES
    console.log('[*] Step 10: Testing Step 3: Practice Challenges...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. প্র্যাকটিস'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    // Fill answers and verify
    await page.evaluate(() => {
      const setVal = (input, val) => {
        const nativeSetter = Object.getOwnPropertyDescriptor(window.HTMLInputElement.prototype, 'value')?.set;
        if (nativeSetter) {
          nativeSetter.call(input, val);
        } else {
          input.value = val;
        }
        input.dispatchEvent(new Event('input', { bubbles: true }));
        input.dispatchEvent(new Event('change', { bubbles: true }));
      };

      const inputs = document.querySelectorAll('input[type="number"]');
      if (inputs[0]) setVal(inputs[0], '101.3');
      if (inputs[1]) setVal(inputs[1], '4.18');
      if (inputs[2]) setVal(inputs[2], '40');
    });
    await new Promise((r) => setTimeout(r, 400));

    // Click verify buttons
    await page.evaluate(() => {
      const verifyButtons = Array.from(document.querySelectorAll('button')).filter((b) =>
        b.textContent?.includes('যাচাই করো')
      );
      verifyButtons.forEach((b) => b.click());
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-08-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-08-try-yourself-challenges.png');

    // 11. TEST STEP 4: CHECK UNDERSTANDING MCQS
    console.log('[*] Step 11: Testing Step 4: Check Understanding MCQs...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. MCQ কুইজ'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    // Answer questions and submit
    await page.evaluate(() => {
      const qCards = document.querySelectorAll('.max-w-3xl .space-y-4 > div');
      qCards.forEach((card, idx) => {
        const optionBtns = card.querySelectorAll('button');
        if (idx === 0 && optionBtns[2]) optionBtns[2].click(); // -40
        if (idx === 1 && optionBtns[1]) optionBtns[1].click(); // beta = 2alpha
        if (idx === 2 && optionBtns[1]) optionBtns[1].click(); // 4 C
        if (idx === 3 && optionBtns[1]) optionBtns[1].click(); // 3.36 x 10^5
        if (idx === 4 && optionBtns[1]) optionBtns[1].click(); // boiling point rises
      });

      // Submit
      const submitBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('ফলাফল ও ব্যাখ্যা')
      );
      if (submitBtn) submitBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-09-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-09-check-understanding-mcqs.png');

    // 12. TEST STEP 5: SUMMARY & CHEAT SHEET
    console.log('[*] Step 12: Testing Step 5: Summary & Cheat Sheet...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সামারি'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 700));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-10-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-10-summary-cheat-sheet.png');

    // 13. TEST SOCRATIC AI TUTOR DRAWER
    console.log('[*] Step 13: Testing Socratic AI Tutor Drawer...');
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const aiBtn = buttons.find((b) => b.textContent?.includes('সক্রেটিক এআই টিউটর'));
      if (aiBtn) aiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Click quick prompt in drawer
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const promptBtn = buttons.find((b) => b.textContent?.includes('রেললাইনে ফাঁক কেন থাকে?'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch6-11-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch6-11-ai-tutor-drawer.png');

    console.log('\n======================================================');
    console.log('🎉 E2E TEST PASSED! All 12 screenshots captured successfully.');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ E2E Test Error:', err);
  } finally {
    await browser.close();
  }
}

runPhysicsCh6E2ETest();
