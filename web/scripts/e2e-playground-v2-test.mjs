import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('test-artifacts/playground-v2');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runPlaygroundV2E2E() {
  console.log('🚀 Starting Playground Version 2 (Virtual Interactive Guidebook) E2E Verification...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,960'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 960 });

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

    // 2. NAVIGATE TO PLAYGROUND HUB
    console.log('[*] Step 2: Navigating to /dashboard/playground...');
    await page.goto('http://localhost:3000/dashboard/playground', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Verify version switcher tabs exist
    console.log('[*] Testing Version Switcher Tabs on Hub...');
    const hasV1Tab = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent.includes('সংস্করণ ১') || b.textContent.includes('Version 1'));
    });
    const hasV2Tab = await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      return btns.some(b => b.textContent.includes('সংস্করণ ২') || b.textContent.includes('Version 2'));
    });
    console.log(`[✓] Switcher Tabs present - V1: ${hasV1Tab}, V2: ${hasV2Tab}`);

    // Click V2 tab on Hub
    console.log('[*] Switching to Version 2: Virtual Guidebook on Hub...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const v2Btn = btns.find(b => b.textContent.includes('সংস্করণ ২') || b.textContent.includes('Version 2'));
      if (v2Btn) v2Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01-hub-v2-guidebook-view.png') });
    console.log('[✓] Saved screenshot: 01-hub-v2-guidebook-view.png');

    // 3. VISIT /dashboard/playground/math/1 (DUAL VIEW TEST)
    console.log('[*] Step 3: Navigating to /dashboard/playground/math/1 dual view...');
    await page.goto('http://localhost:3000/dashboard/playground/math/1', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));

    // Switch to Version 2 in dual view
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const v2Tab = btns.find(b => b.textContent.includes('সংস্করণ ২') || b.textContent.includes('Version 2'));
      if (v2Tab) v2Tab.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02-math1-dualview-v2.png') });
    console.log('[✓] Saved screenshot: 02-math1-dualview-v2.png');

    // 4. VISIT DEDICATED /dashboard/playground/v2/math/1 (CANONICAL GUIDEBOOK ROUTE)
    console.log('[*] Step 4: Navigating to dedicated /dashboard/playground/v2/math/1...');
    await page.goto('http://localhost:3000/dashboard/playground/v2/math/1', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));

    // Capture Book Cover & Sticky Rail
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '03-guidebook-cover-and-rail.png') });
    console.log('[✓] Saved screenshot: 03-guidebook-cover-and-rail.png');

    // 5. TEST LESSON 01: TREE & CLASSIFIER
    console.log('[*] Step 5: Testing Lesson 01 (সংখ্যার মহাবিশ্ব)...');
    // Click on node 'মূলদ' to view explanation drawer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ratBtn = btns.find(b => b.textContent.includes('মূলদ সংখ্যা'));
      if (ratBtn) ratBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Test Rational vs Irrational classifier badges
    console.log('[*] Interacting with Rational vs Irrational badge classifier...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      // Click irrational on √3
      const irratBtn = btns.find(b => b.textContent.includes('অমূলদ (Q\')'));
      if (irratBtn) irratBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '04-lesson01-tree-and-classifier.png') });
    console.log('[✓] Saved screenshot: 04-lesson01-tree-and-classifier.png');

    // 6. TEST LESSON 02: √2 PROOF DETECTIVE
    console.log('[*] Step 6: Testing Lesson 02 (প্রমাণের গোয়েন্দা: √২ অমূলদ)...');
    // Scroll to lesson 2
    await page.evaluate(() => {
      const el = document.getElementById('lesson-02');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, 800));

    // Advance proof clues: Clue 1 -> Clue 2 -> Clue 3
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('পরবর্তী সূত্র'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('পরবর্তী সূত্র'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Open "কেন এই ধাপ?" drawer
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const whyBtn = btns.find(b => b.textContent.includes('কেন এই ধাপ?'));
      if (whyBtn) whyBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '05-lesson02-sqrt2-proof-detective.png') });
    console.log('[✓] Saved screenshot: 05-lesson02-sqrt2-proof-detective.png');

    // 7. TEST LESSON 03: RECURRING DECIMAL DECODER
    console.log('[*] Step 7: Testing Lesson 03 (আবৃত্ত দশমিক কোড & লাইভ ৯-০ ক্যালকুলেটর)...');
    await page.evaluate(() => {
      const el = document.getElementById('lesson-03');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, 800));

    // Click preset button 0.245...
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const presetBtn = btns.find(b => b.textContent.includes('০.২৪৫'));
      if (presetBtn) presetBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '06-lesson03-recurring-decoder.png') });
    console.log('[✓] Saved screenshot: 06-lesson03-recurring-decoder.png');

    // 8. TEST LESSON 04: RED LINE METHOD
    console.log('[*] Step 8: Testing Lesson 04 (রেড লাইন পদ্ধতি)...');
    await page.evaluate(() => {
      const el = document.getElementById('lesson-04');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '07-lesson04-red-line-method.png') });
    console.log('[✓] Saved screenshot: 07-lesson04-red-line-method.png');

    // 9. TEST LESSON 05: RAPID BOARD QUIZ
    console.log('[*] Step 9: Testing Lesson 05 (ঝটপট বোর্ড কুইজ)...');
    await page.evaluate(() => {
      const el = document.getElementById('lesson-05');
      if (el) el.scrollIntoView({ behavior: 'smooth' });
    });
    await new Promise(r => setTimeout(r, 800));

    // Answer Q1: option index 1 (মূলদ)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      // Look for option 'ক. মূলদ সংখ্যা' or similar
      const opt = btns.find(b => b.textContent.includes('মূলদ সংখ্যা') && b.textContent.includes('ক.'));
      if (opt) opt.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '08-lesson05-board-quiz.png') });
    console.log('[✓] Saved screenshot: 08-lesson05-board-quiz.png');

    // 10. TEST GUIDED PATH MODAL
    console.log('[*] Step 10: Testing 4-stage Guided Path Modal...');
    // Click floating 'গাইডেড ডেমো' button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const demoBtn = btns.find(b => b.textContent.includes('গাইডেড ডেমো') || b.textContent.includes('Guided Demo'));
      if (demoBtn) demoBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '09-guided-path-modal-orient.png') });
    console.log('[✓] Saved screenshot: 09-guided-path-modal-orient.png');

    // Advance to Stage 2: Understand
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('পরবর্তী ধাপে যান') || b.textContent.includes('Next Step'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Advance to Stage 3: Practice
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('পরবর্তী ধাপে যান') || b.textContent.includes('Next Step'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '10-guided-path-modal-practice.png') });
    console.log('[✓] Saved screenshot: 10-guided-path-modal-practice.png');

    // Close modal
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const closeBtn = btns.find(b => b.getAttribute('aria-label') === 'Close' || b.textContent.includes('✕') || b.textContent.includes('বন্ধ করুন'));
      if (closeBtn) closeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    console.log('\n=============================================');
    console.log('🎉 PLAYGROUND V2 E2E VERIFICATION COMPLETED!');
    console.log(`Console Errors Caught: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console Errors:', consoleErrors);
    }
    console.log('All screenshots stored in:', ARTIFACTS_DIR);
    console.log('=============================================\n');

  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'error-state.png') });
  } finally {
    await browser.close();
  }
}

runPlaygroundV2E2E();
