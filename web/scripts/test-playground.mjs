import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

async function testPlayground() {
  const artifactDir = path.resolve('test-artifacts/playground');
  fs.mkdirSync(artifactDir, { recursive: true });

  console.log('[*] Launching Chromium to test Playground...');
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1280,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 900 });

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
    // 1. Visit Playground Hub
    console.log('[*] Navigating to /dashboard/playground...');
    await page.goto('http://localhost:3000/dashboard/playground', { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: path.join(artifactDir, '01-playground-hub.png'), fullPage: false });
    console.log('[-] Captured 01-playground-hub.png');

    // 2. Visit Chapter 1 Playground
    console.log('[*] Navigating to /dashboard/playground/math/1...');
    await page.goto('http://localhost:3000/dashboard/playground/math/1', { waitUntil: 'networkidle0', timeout: 30000 });
    await page.screenshot({ path: path.join(artifactDir, '02-ch1-classification.png'), fullPage: false });
    console.log('[-] Captured 02-ch1-classification.png');

    // 3. Click on Quest 2 (Recurring Decimals)
    console.log('[*] Testing Quest 2 (Recurring Decimals)...');
    const quest2Btn = await page.waitForSelector('button:has-text("২. পৌনঃপুনিকের এক্স-রে")', { timeout: 5000 });
    if (quest2Btn) {
      await quest2Btn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(artifactDir, '03-ch1-recurring.png'), fullPage: false });
      console.log('[-] Captured 03-ch1-recurring.png');
    }

    // 4. Click on Quest 3 (Sqrt 2 Compass)
    console.log('[*] Testing Quest 3 (Geometric Compass)...');
    const quest3Btn = await page.waitForSelector('button:has-text("৩. √২ এর জ্যামিতিক কাঁটা")', { timeout: 5000 });
    if (quest3Btn) {
      await quest3Btn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(artifactDir, '04-ch1-sqrt2-compass.png'), fullPage: false });
      console.log('[-] Captured 04-ch1-sqrt2-compass.png');
    }

    // 5. Click on Quest 4 (Sieve of Eratosthenes)
    console.log('[*] Testing Quest 4 (Prime Sieve)...');
    const quest4Btn = await page.waitForSelector('button:has-text("৪. মৌলিক সংখ্যা শিকারী")', { timeout: 5000 });
    if (quest4Btn) {
      await quest4Btn.click();
      await new Promise(r => setTimeout(r, 800));
      await page.screenshot({ path: path.join(artifactDir, '05-ch1-prime-sieve.png'), fullPage: false });
      console.log('[-] Captured 05-ch1-prime-sieve.png');
    }

    // 6. Test Sheru AI Companion Trigger
    console.log('[*] Testing Sheru AI Companion...');
    const sheruBtn = await page.$('button[aria-label="Ask Sheru AI Math Buddy"]');
    if (sheruBtn) {
      await sheruBtn.click();
      await new Promise(r => setTimeout(r, 600));
      await page.screenshot({ path: path.join(artifactDir, '06-ch1-sheru-companion.png'), fullPage: false });
      console.log('[-] Captured 06-ch1-sheru-companion.png');
    }

    console.log('[✓] All tests finished. Console errors count:', consoleErrors.length);
    if (consoleErrors.length > 0) {
      console.log('[!] Console errors encountered:', consoleErrors);
    }
  } catch (err) {
    console.error('Test execution error:', err);
  } finally {
    await browser.close();
  }
}

testPlayground();
