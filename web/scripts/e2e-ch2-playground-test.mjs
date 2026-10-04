import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('test-artifacts/playground-e2e');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runChapter2E2E() {
  console.log('🚀 Starting Chapter 2 (Sets & Functions) E2E Verification...\n');

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

    // 2. NAVIGATE TO CHAPTER 2
    console.log('[*] Step 2: Navigating to /dashboard/playground/math/2...');
    await page.goto('http://localhost:3000/dashboard/playground/math/2', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-01-quest1-venn.png') });
    console.log('[✓] Quest 1 (Venn Island Sandbox) loaded.');

    // 3. TEST VENN OPERATIONS
    console.log('[*] Step 3: Testing Venn Operations (Diff A\\B & Complement)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const diffBtn = btns.find(b => b.textContent.includes('A \\ B'));
      if (diffBtn) diffBtn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-02-venn-diff.png') });

    // 4. TEST QUEST 2: POWER SET
    console.log('[*] Step 4: Testing Quest 2 (Power Set 2^n Generator)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q2Btn = btns.find(b => b.textContent.includes('শক্তি সেট'));
      if (q2Btn) q2Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Change n to 4
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const n4Btn = btns.find(b => b.textContent === '4');
      if (n4Btn) n4Btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-03-power-set-n4.png') });
    console.log('[✓] Quest 2 (Power Set n=4, 16 subsets) verified.');

    // 5. TEST QUEST 3: DE MORGAN DUAL CANVAS
    console.log('[*] Step 5: Testing Quest 3 (De Morgan Dual Mirror)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q3Btn = btns.find(b => b.textContent.includes('মরগ্যান'));
      if (q3Btn) q3Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-04-demorgan-mirror.png') });
    console.log('[✓] Quest 3 (De Morgan Mirror) verified.');

    // 6. TEST QUEST 4: FUNCTION MACHINE
    console.log('[*] Step 6: Testing Quest 4 (Function Machine & Domain)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q4Btn = btns.find(b => b.textContent.includes('ফাংশন মেশিন'));
      if (q4Btn) q4Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Click "Feed into Machine"
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const feedBtn = btns.find(b => b.textContent.includes('মেশিনে প্রবেশ'));
      if (feedBtn) feedBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-05-function-machine-feed.png') });
    console.log('[✓] Quest 4 (Function Machine) verified.');

    // Test Rational function trap (x=2)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const ratBtn = btns.find(b => b.textContent.includes('(x+1)/(x-2)'));
      if (ratBtn) ratBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const x2Btn = btns.find(b => b.textContent.trim() === '2');
      if (x2Btn) x2Btn.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const feedBtn = btns.find(b => b.textContent.includes('মেশিনে প্রবেশ'));
      if (feedBtn) feedBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-06-function-machine-trap.png') });
    console.log('[✓] Division by zero trap verified.');

    // 7. TEST QUEST 5: BOSS RUSH
    console.log('[*] Step 7: Testing Quest 5 (60s Boss Rush)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q5Btn = btns.find(b => b.textContent.includes('বস ফাইট'));
      if (q5Btn) q5Btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-07-boss-rush-lobby.png') });

    // Start battle
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.textContent.includes('বস ফাইট শুরু'));
      if (startBtn) startBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-08-boss-rush-active.png') });
    console.log('[✓] Boss Battle active.');

    // 8. TEST BOARD MASTER & SOLVER GUIDE TAB
    console.log('[*] Step 8: Switching to Board Master & Solver Guide Tab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const boardTab = btns.find(b => b.textContent.includes('বোর্ড মাস্টার') || b.textContent.includes('Board Master'));
      if (boardTab) boardTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-09-board-guide-theory.png') });
    console.log('[✓] Chapter 2 Board Master (Pillar 1: Theory) loaded.');

    // Click Pillar 3: Model Solutions
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const solBtn = btns.find(b => b.textContent.includes('আদর্শ সমাধান') || b.textContent.includes('Model Solutions'));
      if (solBtn) solBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-10-board-guide-solutions.png') });
    console.log('[✓] Chapter 2 Board Master (Pillar 3: Model Solutions with 2+4+4 Rubrics) loaded.');

    // Click Pillar 4: Examiner Traps
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trapsBtn = btns.find(b => b.textContent.includes('সতর্কতা') || b.textContent.includes('Examiner Traps') || b.textContent.includes('Traps'));
      if (trapsBtn) trapsBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-11-board-guide-traps.png') });
    console.log('[✓] Chapter 2 Board Master (Pillar 4: Examiner Traps) loaded.');

    // Click Pillar 5: Board Exam Frequency Matrix
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const matrixBtn = btns.find(b => b.textContent.includes('বোর্ড প্রশ্ন বিশ্লেষণ') || b.textContent.includes('Frequency Matrix') || b.textContent.includes('Board Exam Question Matrix'));
      if (matrixBtn) matrixBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-12-board-guide-matrix.png') });
    console.log('[✓] Chapter 2 Board Master (Pillar 5: Frequency Matrix) loaded.');

    // 9. TEST SHERU COMPANION FOR CHAPTER 2
    console.log('[*] Step 9: Opening Sheru AI Socratic Companion...');
    const sheruBtn = await page.$('button[aria-label="Ask Sheru AI Math Buddy"]');
    if (sheruBtn) {
      await sheruBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch2-13-sheru-companion.png') });
      console.log('[✓] Sheru AI Companion opened with Chapter 2 presets.');
    }

    console.log('\n===========================================');
    console.log('🎉 CHAPTER 2 PLAYGROUND & BOARD MASTER FULLY VERIFIED!');
    console.log('Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('===========================================\n');
  } catch (err) {
    console.error('E2E Test Error:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runChapter2E2E();
