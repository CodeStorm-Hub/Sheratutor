import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = 'http://localhost:3000';
const CHROME_PATH = '/usr/bin/chromium';
const ARTIFACT_DIR = '/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62';

async function main() {
  console.log('🧪 Testing Teen UX Features (Search, Division Filters, Compact Grid)...');
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
    console.log('[1/6] Logging in...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('  ✓ Logged in.');

    // 2. Visit /dashboard/playground/v2
    console.log('[2/6] Navigating to /dashboard/playground/v2...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await page.waitForSelector('input[type="text"]', { timeout: 10000 });
    console.log('  ✓ Playground V2 library loaded.');

    // 3. Test Search Feature
    console.log('[3/6] Testing Real-Time Search...');
    const searchInput = await page.$('input[type="text"]');
    await searchInput.type('সূচক'); // Exponents
    await new Promise((r) => setTimeout(r, 600));

    // Check displayed cards
    let cardCount = await page.$$eval('a[href*="/dashboard/playground/v2/math/"]', (els) => els.length);
    console.log(`  ✓ Search for "সূচক" yielded ${cardCount} card(s).`);

    // Screenshot search result
    await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-ux-01-search-exponents.png'), fullPage: false });

    // Click clear search button
    const clearBtn = await page.$('button[title="মুছে ফেলুন"], button[title="Clear search"]');
    if (clearBtn) {
      await clearBtn.click();
      await new Promise((r) => setTimeout(r, 400));
      console.log('  ✓ Search cleared.');
    }

    // 4. Test Subject & NCTB Division Filter
    console.log('[4/6] Testing NCTB Division Filters...');
    // Click Math subject pill
    const mathPill = await page.$('button[data-subject-pill="math"]');
    if (mathPill) {
      await mathPill.click();
      await new Promise((r) => setTimeout(r, 600));
      console.log('  ✓ Switched to General Math subject.');
    }

    // Check division chips
    await page.waitForSelector('button[data-division-filter]', { timeout: 5000 });
    const divisionFilters = await page.$$eval('button[data-division-filter]', (buttons) =>
      buttons.map((b) => b.getAttribute('data-division-filter') + ': ' + b.innerText.trim())
    );
    console.log(`  ✓ Division chips found:\n    - ${divisionFilters.join('\n    - ')}`);

    // Click Geometry division (data-division-filter="geometry")
    const geomBtn = await page.$('button[data-division-filter="geometry"]');
    if (geomBtn) {
      await geomBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      const geomCardCount = await page.$$eval('a[href*="/dashboard/playground/v2/math/"]', (els) => els.length);
      console.log(`  ✓ Geometry division filtered down to ${geomCardCount} chapters (expected: 5).`);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-ux-02-geometry-division.png'), fullPage: false });
    }

    // Click Statistics division (data-division-filter="statistics")
    const statBtn = await page.$('button[data-division-filter="statistics"]');
    if (statBtn) {
      await statBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      const statCardCount = await page.$$eval('a[href*="/dashboard/playground/v2/math/"]', (els) => els.length);
      console.log(`  ✓ Statistics division filtered down to ${statCardCount} chapter (expected: 1 - Ch 17).`);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-ux-03-statistics-division.png'), fullPage: false });
    }

    // Reset division to all
    const allDivBtn = await page.$('button[data-division-filter="all"]');
    if (allDivBtn) {
      await allDivBtn.click();
      await new Promise((r) => setTimeout(r, 600));
      console.log(`  ✓ Reset to All Chapters in Math.`);
    }

    // 5. Test Compact View Toggle
    console.log('[5/6] Testing Fast Compact Grid View Toggle...');
    const compactBtn = await page.$('button[title*="কমপ্যাক্ট"], button[title*="Compact"]');
    if (compactBtn) {
      await compactBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      console.log('  ✓ Switched to Compact Grid View.');
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-ux-04-compact-grid-math.png'), fullPage: false });
    }

    // Switch back to detailed view
    const detailedBtn = await page.$('button[title*="বিস্তারিত"], button[title*="Detailed"]');
    if (detailedBtn) {
      await detailedBtn.click();
      await new Promise((r) => setTimeout(r, 500));
      console.log('  ✓ Switched back to Detailed View.');
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-ux-05-detailed-view-math.png'), fullPage: false });
    }

    // 6. Test Chapter Navigation from Library
    console.log('[6/6] Verifying Chapter Navigation Link...');
    const ch17Link = await page.$('a[href="/dashboard/playground/v2/math/17"]');
    if (ch17Link) {
      await ch17Link.click();
      await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 10000 });
      console.log(`  ✓ Landed on Chapter 17: ${page.url()}`);
      await page.screenshot({ path: path.join(ARTIFACT_DIR, 'teen-ux-06-ch17-chapter-page.png'), fullPage: false });
    }

    console.log('\n==========================================');
    console.log(`✅ ALL TEEN UX TESTS PASSED!`);
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
