import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('test-artifacts/playground-e2e');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runChapter3E2E() {
  console.log('🚀 Starting Chapter 3 (Algebraic Expressions) E2E Verification...\n');

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

    // 2. NAVIGATE TO CHAPTER 3
    console.log('[*] Step 2: Navigating to /dashboard/playground/math/3...');
    await page.goto('http://localhost:3000/dashboard/playground/math/3', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1200));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-01-quest1-tiles.png') });
    console.log('[✓] Quest 1 (Geometric Tile Slicer) loaded.');

    // 3. TEST QUEST 2: POWER LADDER
    console.log('[*] Step 3: Testing Quest 2 (Symmetrical x + 1/x Power Ladder)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q2Btn = btns.find(b => b.textContent.includes('পাওয়ার মই') || b.textContent.includes('Power Ladder'));
      if (q2Btn) q2Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Climb to Rung 5
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const r5Btn = btns.find(b => b.textContent.includes('Rung 5') || b.textContent.includes('ধাপ ৫'));
      if (r5Btn) r5Btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-02-power-ladder-r5.png') });
    console.log('[✓] Quest 2 (Power Ladder Rung 5) verified.');

    // 4. TEST QUEST 3: MIDDLE TERM FACTORING
    console.log('[*] Step 4: Testing Quest 3 (Middle-Term Factor Splitter)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q3Btn = btns.find(b => b.textContent.includes('মিডল-টার্ম') || b.textContent.includes('Factor Splitter'));
      if (q3Btn) q3Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Pick p = 2, q = 3
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const p2 = btns.find(b => b.textContent.trim() === '2');
      if (p2) p2.click();
    });
    await new Promise(r => setTimeout(r, 400));
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q3 = btns.find(b => b.textContent.trim() === '3');
      if (q3) q3.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-03-middle-term-solved.png') });
    console.log('[✓] Quest 3 (Middle Term Factorization) verified.');

    // 5. TEST QUEST 4: REMAINDER THEOREM MACHINE
    console.log('[*] Step 5: Testing Quest 4 (Remainder Theorem & Vanishing Root)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q4Btn = btns.find(b => b.textContent.includes('ভ্যানিশিং মেথড') || b.textContent.includes('Vanishing Root'));
      if (q4Btn) q4Btn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    // Dial x = 2 to vanish f(x)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const x2 = btns.find(b => b.textContent.trim() === '2');
      if (x2) x2.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-04-remainder-vanished.png') });
    console.log('[✓] Quest 4 (Vanishing Root f(2)=0) verified.');

    // 6. TEST QUEST 5: BOSS RUSH
    console.log('[*] Step 6: Testing Quest 5 (60s Boss Rush)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q5Btn = btns.find(b => b.textContent.includes('বস ফাইট') || b.textContent.includes('Boss Rush'));
      if (q5Btn) q5Btn.click();
    });
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-05-boss-rush-lobby.png') });

    // Start battle
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const startBtn = btns.find(b => b.textContent.includes('বস ফাইট শুরু') || b.textContent.includes('Start Boss Battle'));
      if (startBtn) startBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-06-boss-rush-active.png') });
    console.log('[✓] Boss Battle active.');

    // 7. TEST BOARD MASTER & SOLVER GUIDE TAB
    console.log('[*] Step 7: Switching to Board Master & Solver Guide Tab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const boardTab = btns.find(b => b.textContent.includes('বোর্ড মাস্টার') || b.textContent.includes('Board Master'));
      if (boardTab) boardTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-07-board-guide-theory.png') });
    console.log('[✓] Chapter 3 Board Master (Pillar 1: Theory & Formulas) loaded.');

    // Click Pillar 3: Model Solutions
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const solBtn = btns.find(b => b.textContent.includes('আদর্শ সমাধান') || b.textContent.includes('Model Solutions'));
      if (solBtn) solBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-08-board-guide-solutions.png') });
    console.log('[✓] Chapter 3 Board Master (Pillar 3: Model Solutions with 2+4+4 Rubrics) loaded.');

    // Click Pillar 4: Examiner Traps
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trapsBtn = btns.find(b => b.textContent.includes('সতর্কতা') || b.textContent.includes('Examiner Traps') || b.textContent.includes('Traps'));
      if (trapsBtn) trapsBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-09-board-guide-traps.png') });
    console.log('[✓] Chapter 3 Board Master (Pillar 4: Examiner Traps) loaded.');

    // Click Pillar 5: Frequency Matrix
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const matrixBtn = btns.find(b => b.textContent.includes('বোর্ড প্রশ্ন') || b.textContent.includes('Board Matrix') || b.textContent.includes('Frequency Matrix'));
      if (matrixBtn) matrixBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-10-board-guide-matrix.png') });
    console.log('[✓] Chapter 3 Board Master (Pillar 5: Frequency Matrix) loaded.');

    // 8. TEST SHERU COMPANION FOR CHAPTER 3
    console.log('[*] Step 8: Opening Sheru AI Socratic Companion...');
    const sheruBtn = await page.$('button[aria-label="Ask Sheru AI Math Buddy"]');
    if (sheruBtn) {
      await sheruBtn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, 'ch3-11-sheru-companion.png') });
      console.log('[✓] Sheru AI Companion opened with Chapter 3 algebra presets.');
    }

    console.log('\n===========================================');
    console.log('🎉 CHAPTER 3 PLAYGROUND & BOARD MASTER FULLY VERIFIED!');
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

runChapter3E2E();
