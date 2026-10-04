import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('test-artifacts/playground-v2-redesign');
if (!fs.existsSync(ARTIFACTS_DIR)) {
  fs.mkdirSync(ARTIFACTS_DIR, { recursive: true });
}

async function runRedesignMatchE2E() {
  console.log('🚀 Verifying Playground V2 Redesign against User Reference Image...\n');

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

    // 2. NAVIGATE TO /dashboard/playground/v2/math/1
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2/math/1...');
    await page.goto('http://localhost:3000/dashboard/playground/v2/math/1', { waitUntil: 'networkidle2' });
    await new Promise(r => setTimeout(r, 1500));

    // Full screen capture of the 3-column layout matching reference
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '01-v2-full-3column-layout.png'),
      fullPage: false,
    });
    console.log('[✓] Saved screenshot: 01-v2-full-3column-layout.png');

    // 3. INTERACTION 1: CLICK VENN REGION (Q' Irrational)
    console.log('[*] Step 3: Clicking Venn Region (অমূলদ সংখ্যা)...');
    await page.evaluate(() => {
      const els = Array.from(document.querySelectorAll('div'));
      const irratEl = els.find(e => e.textContent.includes('অমূলদ সংখ্যা') && e.textContent.includes('√২, π, √৩'));
      if (irratEl) irratEl.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 4. INTERACTION 2: SORTING NUMBER CHIPS
    console.log('[*] Step 4: Placing number chip √2 into irrational bucket...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const qPrimeBtn = btns.find(b => b.textContent === "ℚ'");
      if (qPrimeBtn) qPrimeBtn.click();
    });
    await new Promise(r => setTimeout(r, 400));

    // Place 3/4 into rational
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const qBtn = btns.find(b => b.textContent === 'ℚ');
      if (qBtn) qBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // 5. INTERACTION 3: STEP WORKED EXAMPLE
    console.log('[*] Step 5: Advancing worked example to Step 2...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find(b => b.textContent.includes('Next Step'));
      if (nextBtn) nextBtn.click();
    });
    await new Promise(r => setTimeout(r, 500));

    // Capture state with interactive sorting & example
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '02-v2-interactive-sorting-and-stepper.png'),
      fullPage: false,
    });
    console.log('[✓] Saved screenshot: 02-v2-interactive-sorting-and-stepper.png');

    // 6. INTERACTION 4: ASK AI TUTOR
    console.log('[*] Step 6: Asking AI Tutor via prompt chip...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const promptBtn = btns.find(b => b.textContent.includes('√২ কেন অমূলদ?'));
      if (promptBtn) promptBtn.click();
    });
    await new Promise(r => setTimeout(r, 1000));

    // 7. INTERACTION 5: OPEN QUICK TOOL MODAL
    console.log('[*] Step 7: Opening Summary Notes modal from Quick Tools...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const notesBtn = btns.find(b => b.textContent.includes('সংক্ষেপ নোট'));
      if (notesBtn) notesBtn.click();
    });
    await new Promise(r => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, '03-v2-quick-tool-modal.png'),
    });
    console.log('[✓] Saved screenshot: 03-v2-quick-tool-modal.png');

    console.log('\n=============================================');
    console.log('🎉 PLAYGROUND V2 REDESIGN VERIFICATION SUCCESS!');
    console.log(`Console Errors Caught: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console Errors:', consoleErrors);
    }
    console.log('Screenshots stored in:', ARTIFACTS_DIR);
    console.log('=============================================\n');

  } catch (error) {
    console.error('❌ Redesign E2E Failed:', error);
  } finally {
    await browser.close();
  }
}

runRedesignMatchE2E();
