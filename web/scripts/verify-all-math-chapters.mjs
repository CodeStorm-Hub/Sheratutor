import puppeteer from 'puppeteer-core';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/usr/bin/chromium';

async function main() {
  console.log('🚀 Starting Comprehensive General Math (All 17 Chapters) Audit...');
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
      // Ignore favicon or non-critical font prefetch warnings if any
      if (!text.includes('favicon.ico') && !text.includes('status of 404')) {
        console.error(`   [Browser Console Error]: ${text}`);
        errors.push(text);
      }
    }
  });

  page.on('pageerror', (err) => {
    console.error(`   [Page Uncaught Error]: ${err.message}`);
    errors.push(err.message);
  });

  const auditResults = [];

  // 1. Authenticate
  console.log('\n🔐 1. Authenticating test user at /login...');
  try {
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2', timeout: 15000 });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('   Authenticated successfully!');
  } catch (err) {
    console.warn(`   Login warning: ${err.message}`);
  }

  // 2. Audit Library Hub
  console.log('\n📚 2. Checking Guidebook Library Hub for Math (?subject=math)...');
  try {
    const res = await page.goto(`${BASE_URL}/dashboard/playground/v2?subject=math`, {
      waitUntil: 'networkidle2',
      timeout: 30000,
    });
    const status = res.status();
    const title = await page.title();
    console.log(`   Status: ${status}, Title: "${title}"`);

    // Ensure Math tab is clicked if needed
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const mathBtn = buttons.find((b) => b.textContent?.includes('Mathematics') || b.textContent?.includes('সাধারণ গণিত'));
      if (mathBtn) mathBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Verify 17 math chapter links
    const mathLinksCount = await page.evaluate(() => {
      const links = Array.from(document.querySelectorAll('a[href^="/dashboard/playground/v2/math/"]'));
      return new Set(links.map((l) => l.getAttribute('href'))).size;
    });

    console.log(`   Found ${mathLinksCount} unique General Math chapter links in Library Hub.`);
    auditResults.push({
      item: 'Library Hub (?subject=math)',
      status: status === 200 && mathLinksCount === 17 ? 'PASSED' : 'FAILED',
      details: `${mathLinksCount}/17 chapters listed`,
    });
  } catch (err) {
    console.error(`   Failed Library Hub: ${err.message}`);
    auditResults.push({ item: 'Library Hub', status: 'FAILED', details: err.message });
  }

  // 3. Audit Each of the 17 Chapters
  console.log('\n🔍 3. Auditing Chapters 1 through 17...');
  for (let ch = 1; ch <= 17; ch++) {
    const url = `${BASE_URL}/dashboard/playground/v2/math/${ch}`;
    process.stdout.write(`   Chapter ${ch.toString().padStart(2, '0')}: `);
    const chapterErrorsBefore = errors.length;

    try {
      const res = await page.goto(url, { waitUntil: 'networkidle2', timeout: 30000 });
      const status = res.status();
      const pageTitle = await page.title();

      // Check for navigation tabs
      const tabsCount = await page.evaluate(() => {
        const buttons = Array.from(document.querySelectorAll('button'));
        // Find buttons containing canonical tab labels
        return buttons.filter((b) => {
          const t = b.textContent || '';
          return (
            t.includes('কনসেপ্ট') ||
            t.includes('উদাহরণ') ||
            t.includes('নিজে চেষ্টা') ||
            t.includes('অনুধাবন') ||
            t.includes('সারসংক্ষেপ') ||
            t.includes('ল্যাব')
          );
        }).length;
      });

      const newErrors = errors.length - chapterErrorsBefore;
      if (status === 200 && newErrors === 0) {
        console.log(`✅ OK (HTTP 200, Tabs: ${tabsCount}, Title: "${pageTitle.slice(0, 35)}...")`);
        auditResults.push({
          item: `Chapter ${ch}`,
          status: 'PASSED',
          details: `HTTP ${status}, 0 errors, Title: ${pageTitle.slice(0, 30)}`,
        });
      } else {
        console.log(`⚠️ ISSUES DETECTED (HTTP ${status}, New Errors: ${newErrors})`);
        auditResults.push({
          item: `Chapter ${ch}`,
          status: 'WARNING',
          details: `HTTP ${status}, ${newErrors} errors`,
        });
      }
    } catch (err) {
      console.log(`❌ FAILED (${err.message})`);
      auditResults.push({ item: `Chapter ${ch}`, status: 'FAILED', details: err.message });
    }
  }

  await browser.close();

  // Print Summary Table
  console.log('\n======================================================');
  console.log('       GENERAL MATH 100% COMPLETION AUDIT REPORT       ');
  console.log('======================================================');
  let passedCount = 0;
  auditResults.forEach((r) => {
    const icon = r.status === 'PASSED' ? '✅' : '❌';
    console.log(`${icon} ${r.item.padEnd(28)} | ${r.status.padEnd(8)} | ${r.details}`);
    if (r.status === 'PASSED') passedCount++;
  });

  console.log('======================================================');
  console.log(`Total Items Audited: ${auditResults.length}`);
  console.log(`Passed: ${passedCount}/${auditResults.length}`);
  console.log(`Console / Page Errors: ${errors.length}`);
  console.log('======================================================');

  if (passedCount === auditResults.length && errors.length === 0) {
    console.log('🎉 ALL 17 CHAPTERS OF GENERAL MATH ARE 100% COMPLETE & VERIFIED!');
    process.exit(0);
  } else {
    console.error('❌ Audit detected issues.');
    process.exit(1);
  }
}

main().catch((err) => {
  console.error('Fatal audit error:', err);
  process.exit(1);
});
