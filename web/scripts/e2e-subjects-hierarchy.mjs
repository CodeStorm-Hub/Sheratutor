import puppeteer from 'puppeteer-core';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function testSubjectsHierarchy() {
  console.log('🚀 Running E2E Test: Subject -> Chapter Hierarchy in Playground V2...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1500,1050'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1500, height: 1050 });

  try {
    // 1. LOGIN
    console.log('[*] Step 1: Logging in...');
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully.');

    // 2. NAVIGATE TO PLAYGROUND V2 HUB
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // Capture All Subjects Overview
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'subjects-01-all-subjects-overview.png'),
    });
    console.log('[✓] Saved screenshot: subjects-01-all-subjects-overview.png');

    // 3. SELECT PHYSICS SUBJECT
    console.log('[*] Step 3: Clicking Physics subject card...');
    await page.evaluate(() => {
      const phyBtn = document.querySelector('button[data-subject-card="physics"]') ||
        document.querySelector('button[data-subject-pill="physics"]');
      if (phyBtn) phyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'subjects-02-physics-filtered.png'),
    });
    console.log('[✓] Saved screenshot: subjects-02-physics-filtered.png');

    // Scroll to Physics Chapter 1 Card
    await page.evaluate(() => {
      window.scrollBy({ top: 450, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'subjects-02b-physics-chapters.png'),
    });
    console.log('[✓] Saved screenshot: subjects-02b-physics-chapters.png');

    // 4. SELECT GENERAL MATH SUBJECT
    console.log('[*] Step 4: Clicking General Math subject card...');
    await page.evaluate(() => {
      window.scrollTo({ top: 0, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const mathBtn = document.querySelector('button[data-subject-card="math"]') ||
        document.querySelector('button[data-subject-pill="math"]');
      if (mathBtn) mathBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'subjects-03-math-filtered.png'),
    });
    console.log('[✓] Saved screenshot: subjects-03-math-filtered.png');

    // Scroll to Math Chapter 1 Card
    await page.evaluate(() => {
      window.scrollBy({ top: 450, behavior: 'instant' });
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'subjects-03b-math-chapters.png'),
    });
    console.log('[✓] Saved screenshot: subjects-03b-math-chapters.png');

    console.log('\n🎉 ALL SUBJECT HIERARCHY SCREENSHOTS CAPTURED SUCCESSFULLY!');
  } catch (error) {
    console.error('❌ Test failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

testSubjectsHierarchy();
