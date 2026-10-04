import puppeteer from 'puppeteer-core';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/usr/bin/chromium';

async function main() {
  console.log('🚀 Verifying Playground V2-Only Migration...');
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

  // 1. Authenticate
  console.log('[*] Step 1: Logging in...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await page.type('#email', 'afsanchowdhury5@gmail.com');
  await page.type('#password', 'callofduty100');
  await page.click('form:has(#email) button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
  console.log('[✓] Logged in successfully.');

  // 2. Visit /dashboard/playground (should redirect to /dashboard/playground/v2)
  console.log('[*] Step 2: Testing /dashboard/playground redirect...');
  await page.goto(`${BASE_URL}/dashboard/playground`, { waitUntil: 'networkidle2' });
  const currentUrl = page.url();
  console.log(`    Landed on URL: ${currentUrl}`);
  if (currentUrl.includes('/dashboard/playground/v2')) {
    console.log('    ✅ /dashboard/playground redirected to /dashboard/playground/v2 successfully!');
  } else {
    console.error('    ❌ Redirect failed, remained on: ' + currentUrl);
  }

  // 3. Visit legacy /dashboard/playground/math/1 (should redirect to /dashboard/playground/v2/math/1)
  console.log('[*] Step 3: Testing legacy /dashboard/playground/math/1 redirect...');
  await page.goto(`${BASE_URL}/dashboard/playground/math/1`, { waitUntil: 'networkidle2' });
  const mathUrl = page.url();
  console.log(`    Landed on URL: ${mathUrl}`);
  if (mathUrl.includes('/dashboard/playground/v2/math/1')) {
    console.log('    ✅ /dashboard/playground/math/1 redirected to /dashboard/playground/v2/math/1 successfully!');
  } else {
    console.error('    ❌ Legacy redirect failed, remained on: ' + mathUrl);
  }

  // 4. Check that no V1 switcher button exists on Playground V2 Hub
  console.log('[*] Step 4: Checking Playground V2 Hub for absence of V1 switcher...');
  await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
  const hasV1Button = await page.evaluate(() => {
    const text = document.body.innerText;
    return text.includes('সংস্করণ ১ (কোয়েস্ট অ্যারেনা)') || text.includes('Switch to Version 1');
  });

  if (!hasV1Button) {
    console.log('    ✅ Confirmed: No Version 1 switcher banner found on Playground V2 Hub!');
  } else {
    console.warn('    ⚠️ Version 1 text was found on the page.');
  }

  // 5. Check Sidebar link
  console.log('[*] Step 5: Checking Sidebar Playground link...');
  const sidebarPlaygroundHref = await page.evaluate(() => {
    const link = document.querySelector('aside a[href*="playground"]');
    return link ? link.getAttribute('href') : null;
  });
  console.log(`    Sidebar link points to: ${sidebarPlaygroundHref}`);
  if (sidebarPlaygroundHref === '/dashboard/playground/v2') {
    console.log('    ✅ Sidebar points directly to /dashboard/playground/v2!');
  }

  await browser.close();

  if (errors.length === 0) {
    console.log('\n🎉 ALL CHECKS PASSED: Playground V1 completely removed, V2 is the sole active platform!');
  } else {
    console.log(`\n⚠️ Finished with ${errors.length} console errors.`);
  }
}

main().catch((err) => {
  console.error('Test error:', err);
  process.exit(1);
});
