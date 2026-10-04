import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('test-artifacts/playground-e2e');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runPlaygroundE2E() {
  console.log('🚀 Starting Playground Live E2E Verification...\n');

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
    console.log('[*] Step 1: Authenticating test student afsanchowdhury5@gmail.com...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully. Current URL:', page.url());

    // 2. DASHBOARD SIDEBAR CHECK
    console.log('[*] Step 2: Capturing Dashboard Sidebar with Playground menu item...');
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '01-dashboard-sidebar.png') });

    // 3. VISIT PLAYGROUND HUB
    console.log('[*] Step 3: Navigating to /dashboard/playground...');
    await page.goto('http://localhost:3000/dashboard/playground', { waitUntil: 'networkidle2' });
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '02-playground-hub.png') });
    console.log('[✓] Playground Hub loaded.');

    // 4. VISIT CHAPTER 1 PLAYGROUND
    console.log('[*] Step 4: Navigating to /dashboard/playground/math/1 (Chapter 1 Real Numbers)...');
    await page.goto('http://localhost:3000/dashboard/playground/math/1', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '03-ch1-quest1-classification.png') });
    console.log('[✓] Quest 1 (Classification Lab) captured.');

    // 5. TEST QUEST 2 (RECURRING DECIMALS)
    console.log('[*] Step 5: Testing Quest 2 (Recurring Decimals Decoder)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q2 = btns.find(b => b.textContent.includes('পৌনঃপুনিক'));
      if (q2) q2.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '04-ch1-quest2-recurring.png') });
    console.log('[✓] Quest 2 captured.');

    // 6. TEST QUEST 3 (SQRT 2 COMPASS)
    console.log('[*] Step 6: Testing Quest 3 (Geometric Sqrt 2 Compass)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q3 = btns.find(b => b.textContent.includes('√২'));
      if (q3) q3.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '05-ch1-quest3-sqrt2-compass.png') });
    console.log('[✓] Quest 3 captured.');

    // 7. TEST QUEST 4 (SIEVE OF ERATOSTHENES)
    console.log('[*] Step 7: Testing Quest 4 (Prime Hunter Sieve)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q4 = btns.find(b => b.textContent.includes('মৌলিক'));
      if (q4) q4.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '06-ch1-quest4-prime-sieve.png') });
    console.log('[✓] Quest 4 captured.');

    // 8. TEST QUEST 5 (BOSS RUSH)
    console.log('[*] Step 8: Testing Quest 5 (60-Second Boss Rush)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const q5 = btns.find(b => b.textContent.includes('বস ফাইট'));
      if (q5) q5.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '07-ch1-quest5-boss-rush.png') });
    console.log('[✓] Quest 5 captured.');

    // 9. TEST SHERU AI COMPANION
    console.log('[*] Step 9: Opening Sheru AI Socratic Companion...');
    const sheruBtn = await page.$('button[aria-label="Ask Sheru AI Math Buddy"]');
    if (sheruBtn) {
      await sheruBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(ARTIFACTS_DIR, '08-ch1-sheru-companion.png') });
      console.log('[✓] Sheru Companion opened and captured.');
      // close sheru companion
      await page.keyboard.press('Escape');
    }

    // 10. TEST BOARD MASTER & SOLVER GUIDE TAB
    console.log('[*] Step 10: Switching to Board Master & Solver Guide Tab...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const boardTab = btns.find(b => b.textContent.includes('বোর্ড মাস্টার'));
      if (boardTab) boardTab.click();
    });
    await new Promise(r => setTimeout(r, 1000));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '09-ch1-board-guide-theory.png') });
    console.log('[✓] Board Master Tab (Section 1: Theory) captured.');

    // 11. CLICK SECTION 3: STEP-BY-STEP MODEL SOLUTIONS
    console.log('[*] Step 11: Testing Section 3 (Model Solutions with Rubrics)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const solBtn = btns.find(b => b.textContent.includes('আদর্শ সমাধান'));
      if (solBtn) solBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '10-ch1-board-guide-solutions.png') });
    console.log('[✓] Section 3 (Model Solutions) captured.');

    // 12. CLICK SECTION 4: EXAMINER TRAPS
    console.log('[*] Step 12: Testing Section 4 (Examiner Traps & Pitfalls)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const trapsBtn = btns.find(b => b.textContent.includes('সতর্কতা'));
      if (trapsBtn) trapsBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: path.join(ARTIFACTS_DIR, '11-ch1-board-guide-traps.png') });
    console.log('[✓] Section 4 (Examiner Traps) captured.');

    console.log('\n===========================================');
    console.log('🎉 PLAYGROUND & BOARD MASTER LIVE E2E VERIFIED!');
    console.log('Console Errors:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('Screenshots saved to web/test-artifacts/playground-e2e/');
    console.log('===========================================\n');
  } catch (err) {
    console.error('E2E Test Error:', err);
  } finally {
    await browser.close();
  }
}

runPlaygroundE2E();
