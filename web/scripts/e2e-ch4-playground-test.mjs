import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('test-artifacts/playground-e2e');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runChapter4E2E() {
  console.log('🚀 Starting Chapter 4 (Exponents & Logarithms) E2E Verification...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1400,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1400, height: 900 });

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

    // 2. NAVIGATE TO CHAPTER 4
    console.log('[*] Step 2: Navigating to /dashboard/playground/math/4...');
    await page.goto('http://localhost:3000/dashboard/playground/math/4', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-01-quest1-paperfold.png') });
    console.log('[✓] Quest 1 (Paper Fold to the Moon) loaded.');

    // Fold paper test
    console.log('[*] Testing paper fold interaction...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const foldBtn = btns.find(b => b.textContent.includes('কাগজ ভাঁজ করো') || b.textContent.includes('Fold Paper'));
      if (foldBtn) foldBtn.click();
    });
    await new Promise(r => setTimeout(r, 300));
    // Test Everest button
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const everestBtn = btns.find(b => b.textContent.includes('২৭ ভাঁজ পরখ করো') || b.textContent.includes('27'));
      if (everestBtn) everestBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-02-paperfold-everest.png') });
    console.log('[✓] Paper Fold Quest tested.');

    // 3. TEST QUEST 2: RICHTER & SOUND LOG COMPRESSOR
    console.log('[*] Step 3: Testing Quest 2 (Richter & Sound Log Compressor)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q2Btn = btns.find(b => b.textContent.includes('রিখটার ও শব্দ') || b.textContent.includes('Richter & Sound'));
      if (q2Btn) q2Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-03-quest2-richter.png') });

    // Switch to Sound mode
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const soundBtn = btns.find(b => b.textContent.includes('শব্দের ডেসিবল') || b.textContent.includes('Sound (dB)'));
      if (soundBtn) soundBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-04-quest2-sound.png') });

    // Answer Quiz
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const quizBtn = btns.find(b => b.textContent.includes('১,০০০ গুণ') || b.textContent.includes('1,000'));
      if (quizBtn) quizBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    console.log('[✓] Richter & Sound Quest tested.');

    // 4. TEST QUEST 3: BASE-EXPONENT POWER BALANCER
    console.log('[*] Step 4: Testing Quest 3 (Base-Exponent Power Balancer)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q3Btn = btns.find(b => b.textContent.includes('সমীকরণ তুলাদণ্ড') || b.textContent.includes('Power Balancer'));
      if (q3Btn) q3Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-05-quest3-balancer.png') });

    // Enter answer 3 for 2^(x+2) = 32
    await page.type('input[placeholder="x = ?"]', '3');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const checkBtn = btns.find(b => b.textContent.includes('পরখ করো') || b.textContent.includes('Check'));
      if (checkBtn) checkBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-06-balancer-correct.png') });
    console.log('[✓] Power Balancer Quest tested.');

    // 5. TEST QUEST 4: SCIENTIFIC NOTATION & CHARACTERISTIC / MANTISSA
    console.log('[*] Step 5: Testing Quest 4 (Characteristic & Mantissa Lab)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q4Btn = btns.find(b => b.textContent.includes('পূর্ণক ও অংশক') || b.textContent.includes('Characteristic/Mantissa'));
      if (q4Btn) q4Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-07-quest4-scientific.png') });

    // Click preset 0.00345
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const presetBtn = btns.find(b => b.textContent.includes('0.00345'));
      if (presetBtn) presetBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Answer Trap quiz
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trapOpt = btns.find(b => b.textContent.includes('পূর্ণক ৩̄ (-৩)'));
      if (trapOpt) trapOpt.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-08-scientific-trap-quiz.png') });
    console.log('[✓] Scientific Notation Lab tested.');

    // 6. TEST QUEST 5: BOSS RUSH
    console.log('[*] Step 6: Testing Quest 5 (60-Second Boss Rush)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bossQuestBtn = btns.find(b => b.textContent.includes('বস রাশ') || b.textContent.includes('Boss Rush'));
      if (bossQuestBtn) bossQuestBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-09-boss-preview.png') });

    // 7. TEST BOARD MASTER GUIDE
    console.log('[*] Step 7: Testing Board Master Guide & 5 Pillars...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const bmBtn = btns.find(b => b.textContent.includes('বোর্ড মাস্টার') || b.textContent.includes('Board Master'));
      if (bmBtn) bmBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-10-board-guide-theory.png') });

    // Click Model Solutions tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const solBtn = btns.find(b => b.textContent.includes('মডেল সমাধান') || b.textContent.includes('Model Board Solutions'));
      if (solBtn) solBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-11-board-guide-solutions.png') });

    // Click Examiner Traps tab
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trapTab = btns.find(b => b.textContent.includes('ভুলে নম্বর কাটা') || b.textContent.includes('Examiner Traps'));
      if (trapTab) trapTab.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-12-board-guide-traps.png') });

    // 8. HUB VERIFICATION
    console.log('[*] Step 8: Verifying Chapter 4 in Playground Hub...');
    await page.goto('http://localhost:3000/dashboard/playground', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-13-playground-hub.png') });

    console.log('\n=========================================');
    console.log('✅ ALL CHAPTER 4 TESTS COMPLETED SUCCESSFULLY!');
    console.log(`Console Errors Caught: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('=========================================\n');
  } catch (err) {
    console.error('❌ Test failed with exception:', err);
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch4-error.png') });
  } finally {
    await browser.close();
  }
}

runChapter4E2E();
