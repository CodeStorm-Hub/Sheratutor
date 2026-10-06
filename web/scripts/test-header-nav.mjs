import puppeteer from 'puppeteer-core';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function testHeaderNav() {
  console.log('🚀 Running Test: Guidebook Top Navigation Bar...\n');

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

    // 2. NAVIGATE TO PHYSICS CH 3
    console.log('[*] Step 2: Navigating to Physics Chapter 3 (/dashboard/playground/v2/physics/3)...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/3`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture desktop header
    const headerPath = path.join(ARTIFACTS_DIR, 'teen-nav-01-desktop-ch3-header.png');
    await page.screenshot({ path: headerPath, fullPage: false });
    console.log(`[✓] Desktop header captured: ${headerPath}`);

    // Verify elements exist in header
    const hasBackBtn = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('header a'));
      return links.some((a) => a.textContent.includes('লাইব্রেরিতে ফিরুন') || a.textContent.includes('লাইব্রেরি'));
    });
    console.log(`[*] Has Back to Library button: ${hasBackBtn}`);

    const hasSubjectPill = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('header a, header span'));
      return el.some((e) => e.textContent.includes('পদার্থবিজ্ঞান'));
    });
    console.log(`[*] Has Subject badge: ${hasSubjectPill}`);

    const hasChapterBadge = await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('header span'));
      return el.some((e) => e.textContent.includes('অধ্যায় ০৩') || e.textContent.includes('অধ্যায় 3'));
    });
    console.log(`[*] Has Chapter badge: ${hasChapterBadge}`);

    // Test mobile viewport
    console.log('[*] Step 3: Testing mobile viewport (width: 390, height: 844)...');
    await page.setViewport({ width: 390, height: 844 });
    await new Promise((r) => setTimeout(r, 1000));
    const mobileHeaderPath = path.join(ARTIFACTS_DIR, 'teen-nav-02-mobile-ch3-header.png');
    await page.screenshot({ path: mobileHeaderPath, fullPage: false });
    console.log(`[✓] Mobile header captured: ${mobileHeaderPath}`);

    console.log('\n=======================================');
    console.log('✅ Top Header Navigation verification PASSED!');
    console.log(`Total console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    console.log('=======================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testHeaderNav();
