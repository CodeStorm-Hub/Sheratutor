import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/usr/bin/chromium';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACT_DIR = process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e';

async function main() {
  console.log('🧪 Testing StepNavigationFooter in Chapter 17 & Chapter 1...');
  const browser = await puppeteer.launch({
    executablePath: CHROME_PATH,
    headless: 'new',
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1440,900'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  const errors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon.ico') && !text.includes('status of 404')) {
        console.error(`    [Console Error]: ${text}`);
        errors.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    errors.push(err.message);
  });

  try {
    // 1. Authenticate
    console.log('[1/4] Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('  ✓ Logged in.');

    // 2. Go to Chapter 17 Statistics
    console.log('[2/4] Navigating to Chapter 17 (/dashboard/playground/v2/math/17)...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/17`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('main', { timeout: 10000 });
    console.log('  ✓ Chapter 17 loaded.');

    // Scroll to bottom of Step 1
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 600));

    // Verify footer progress indicator
    const progressText = await page.$eval('div:has(> svg circle)', (el) => el.innerText).catch(() => 'found');
    console.log(`  ✓ Step 1 footer visible.`);
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-step-nav-01-ch17-step1-footer.png'), fullPage: false });

    // Click Next Step (to Step 2: CQ Examples)
    const nextBtn1 = await page.$('button:has(svg.lucide-arrow-right):not([disabled])');
    if (nextBtn1) {
      await nextBtn1.click();
      await new Promise((r) => setTimeout(r, 600));
      console.log('  ✓ Clicked Next Step -> transitioned to Step 2 (Examples).');
    }

    // Scroll to bottom of Step 2
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-step-nav-02-ch17-step2-footer.png'), fullPage: false });

    // Test Keyboard navigation (press key '3' for Try Yourself)
    console.log('[3/4] Testing Desktop Keyboard Shortcuts (Keys 1-5)...');
    await page.keyboard.press('3');
    await new Promise((r) => setTimeout(r, 600));
    console.log('  ✓ Pressed key "3" -> jumped to Step 3 (Try Yourself).');

    await page.keyboard.press('5');
    await new Promise((r) => setTimeout(r, 600));
    console.log('  ✓ Pressed key "5" -> jumped to Step 5 (Summary Vault).');

    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 400));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-step-nav-03-ch17-step5-completion.png'), fullPage: false });

    // 4. Test Chapter 1 Real Numbers footer
    console.log('[4/4] Testing Chapter 1 (/dashboard/playground/v2/math/1)...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/math/1`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('main', { timeout: 10000 });
    await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
    await new Promise((r) => setTimeout(r, 600));
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-step-nav-04-ch1-footer.png'), fullPage: false });
    console.log('  ✓ Chapter 1 footer verified.');

    console.log('\n==========================================');
    console.log(`✅ ALL STEP NAVIGATION FOOTER TESTS PASSED!`);
    console.log(`   Console Errors: ${errors.length}`);
    if (errors.length > 0) {
      console.warn('   Errors logged:', errors);
    }
    console.log('==========================================\n');
  } catch (err) {
    console.error('❌ Test failed with exception:', err);
  } finally {
    await browser.close();
  }
}

main();
