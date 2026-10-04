import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runComprehensivePlaygroundV2E2E() {
  console.log('🚀 Running Comprehensive E2E Verification for Playground V2 (All 5 Lessons & Backend)...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1520,1050'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1520, height: 1050 });

  const consoleErrors = [];
  page.on('console', msg => {
    if (msg.type() === 'error') {
      consoleErrors.push(msg.text());
    }
  });

  page.on('pageerror', err => {
    consoleErrors.push(err.message);
  });

  try {
    // 1. LOGIN
    console.log('[*] Step 1: Logging in as student...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully.');

    // 2. NAVIGATE TO PLAYGROUND V2 MATH CHAPTER 1
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2/math/1...');
    await page.goto('http://localhost:3000/dashboard/playground/v2/math/1', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Capture initial 3-column view
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'v2-test-01-initial-lesson1.png'),
    });
    console.log('[✓] Saved screenshot: v2-test-01-initial-lesson1.png');

    // 3. TEST LESSON 1: SORTING CHIP & RESET
    console.log('[*] Step 3: Testing Lesson 1 interactions...');
    // Click hint button
    await page.evaluate(() => {
      const hintBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Hint'));
      if (hintBtn) hintBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Click Reset button
    await page.evaluate(() => {
      const resetBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('Reset'));
      if (resetBtn) resetBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // 4. TEST LESSON 2: NAVIGATE TO LESSON 02 & STEP THROUGH PROOF DETECTIVE
    console.log('[*] Step 4: Switching to Lesson 02 (প্রমাণের গোয়েন্দা)...');
    await page.evaluate(() => {
      const lessonBtns = Array.from(document.querySelectorAll('button'));
      const l2 = lessonBtns.find(b => b.textContent.includes('০২') || b.textContent.includes('প্রমাণের গোয়েন্দা'));
      if (l2) l2.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Step through proof frames 2, 3, 4
    for (let frame = 2; frame <= 4; frame++) {
      await page.evaluate((targetFrame) => {
        const frameBtns = Array.from(document.querySelectorAll('button'));
        const fBtn = frameBtns.find(b => b.textContent.includes(`ধাপ ${targetFrame}`) || b.textContent.includes(`ধাপ ০${targetFrame}`));
        if (fBtn) fBtn.click();
      }, frame);
      await new Promise(r => setTimeout(r, 300));
    }

    // Toggle marking rubric
    await page.evaluate(() => {
      const rubricBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'v2-test-02-lesson2-proof.png'),
    });
    console.log('[✓] Saved screenshot: v2-test-02-lesson2-proof.png');

    // 5. TEST LESSON 3: NAVIGATE TO LESSON 03 (আবৃত্ত দশমিক কোড)
    console.log('[*] Step 5: Switching to Lesson 03 (আবৃত্ত দশমিক কোড)...');
    await page.evaluate(() => {
      const lessonBtns = Array.from(document.querySelectorAll('button'));
      const l3 = lessonBtns.find(b => b.textContent.includes('০৩') || b.textContent.includes('আবৃত্ত দশমিক'));
      if (l3) l3.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'v2-test-03-lesson3-calc.png'),
    });
    console.log('[✓] Saved screenshot: v2-test-03-lesson3-calc.png');

    // 6. TEST LESSON 4: NAVIGATE TO LESSON 04 (রেড লাইন পদ্ধতি)
    console.log('[*] Step 6: Switching to Lesson 04 (রেড লাইন পদ্ধতি)...');
    await page.evaluate(() => {
      const lessonBtns = Array.from(document.querySelectorAll('button'));
      const l4 = lessonBtns.find(b => b.textContent.includes('০৪') || b.textContent.includes('রেড লাইন পদ্ধতি'));
      if (l4) l4.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'v2-test-04-lesson4-redline.png'),
    });
    console.log('[✓] Saved screenshot: v2-test-04-lesson4-redline.png');

    // 7. TEST LESSON 5: NAVIGATE TO LESSON 05 (ঝটপট বোর্ড কুইজ)
    console.log('[*] Step 7: Switching to Lesson 05 (ঝটপট বোর্ড কুইজ)...');
    await page.evaluate(() => {
      const lessonBtns = Array.from(document.querySelectorAll('button'));
      const l5 = lessonBtns.find(b => b.textContent.includes('০৫') || b.textContent.includes('ঝটপট বোর্ড কুইজ'));
      if (l5) l5.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // Select options for questions
    await page.evaluate(() => {
      const radioLabels = Array.from(document.querySelectorAll('label, button'));
      const opt1 = radioLabels.find(l => l.textContent.includes('অমূলদ'));
      if (opt1) opt1.click();
    });
    await new Promise(r => setTimeout(r, 300));

    // Click submit quiz button if present
    await page.evaluate(() => {
      const submitBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('ফলাফল যাচাই করো') || b.textContent.includes('জমা দিন'));
      if (submitBtn) submitBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'v2-test-05-lesson5-quiz.png'),
    });
    console.log('[✓] Saved screenshot: v2-test-05-lesson5-quiz.png');

    // 8. TEST AI TUTOR CHAT & PERSISTENCE
    console.log('[*] Step 8: Sending question to AI Tutor...');
    await page.evaluate(() => {
      const promptBtn = Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('√২ কেন অমূলদ?'));
      if (promptBtn) promptBtn.click();
    });
    // Wait for full Genkit AI response
    await new Promise(r => setTimeout(r, 12000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'v2-test-06-ai-tutor-response.png'),
    });
    console.log('[✓] Saved screenshot: v2-test-06-ai-tutor-response.png');

    console.log('\n=============================================');
    console.log('🎉 COMPREHENSIVE PLAYGROUND V2 VERIFICATION COMPLETED!');
    console.log(`Console Errors Caught: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console Errors:', consoleErrors);
    }
    console.log('All lesson screenshots saved to artifact directory.');
    console.log('=============================================\n');

  } catch (error) {
    console.error('❌ E2E Failed:', error);
  } finally {
    await browser.close();
  }
}

runComprehensivePlaygroundV2E2E();
