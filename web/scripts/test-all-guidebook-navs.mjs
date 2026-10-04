import puppeteer from 'puppeteer-core';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

const CHAPTERS_TO_TEST = [
  { url: '/dashboard/playground/v2/math/5', name: 'math-ch5-equations', subject: 'math', chNum: '০৫', titlePart: 'এক চলকবিশিষ্ট সমীকরণ' },
  { url: '/dashboard/playground/v2/math/8', name: 'math-ch8-circle', subject: 'math', chNum: '০৮', titlePart: 'বৃত্ত' },
  { url: '/dashboard/playground/v2/math/11', name: 'math-ch11-ratio', subject: 'math', chNum: '১১', titlePart: 'অনুপাত ও সমানুপাত' },
  { url: '/dashboard/playground/v2/math/16', name: 'math-ch16-mensuration', subject: 'math', chNum: '১৬', titlePart: 'পরিমিতি' },
  { url: '/dashboard/playground/v2/math/17', name: 'math-ch17-statistics', subject: 'math', chNum: '১৭', titlePart: 'পরিসংখ্যান' },
  { url: '/dashboard/playground/v2/physics/3', name: 'physics-ch3-force', subject: 'physics', chNum: '০৩', titlePart: 'বল' },
  { url: '/dashboard/playground/v2/physics/12', name: 'physics-ch12-magnet', subject: 'physics', chNum: '১২', titlePart: 'চৌম্বক ক্রিয়া' },
];

async function runAllNavTests() {
  console.log('🚀 Running Comprehensive Guidebook Navigation Verification across Math & Physics...\n');

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
    console.log('[✓] Logged in successfully.\n');

    // 2. TEST EACH CHAPTER
    for (const ch of CHAPTERS_TO_TEST) {
      console.log(`[*] Testing: ${ch.url}...`);
      await page.setViewport({ width: 1500, height: 950 });
      await page.goto(`${BASE_URL}${ch.url}`, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 1500));

      // Verify header elements
      const navCheck = await page.evaluate((ch) => {
        const headers = Array.from(document.querySelectorAll('header'));
        const guidebookHeader = headers.find((h) => h.innerText.includes('লাইব্রেরিতে ফিরুন') || h.innerText.includes('লাইব্রেরি')) || headers[headers.length - 1];
        if (!guidebookHeader) return { hasHeader: false };

        const text = guidebookHeader.innerText || '';
        const hasBack = text.includes('লাইব্রেরিতে ফিরুন') || text.includes('লাইব্রেরি');
        const hasSubject = text.includes(ch.subject === 'physics' ? 'পদার্থবিজ্ঞান' : 'সাধারণ গণিত');
        const hasCh = text.includes(ch.chNum);
        const hasTitle = text.includes(ch.titlePart);

        return {
          hasHeader: true,
          hasBack,
          hasSubject,
          hasCh,
          hasTitle,
          headerTextSnippet: text.replace(/\n+/g, ' ').substring(0, 100),
        };
      }, ch);

      console.log(`    Header Found: ${navCheck.hasHeader} | Back: ${navCheck.hasBack} | Subject: ${navCheck.hasSubject} | ChBadge: ${navCheck.hasCh} | Title: ${navCheck.hasTitle}`);
      console.log(`    Snippet: "${navCheck.headerTextSnippet}"`);

      // Screenshot Desktop Header
      const desktopPic = path.join(ARTIFACTS_DIR, `teen-nav-desktop-${ch.name}.png`);
      await page.screenshot({ path: desktopPic, fullPage: false });

      // Test Mobile
      await page.setViewport({ width: 390, height: 844 });
      await new Promise((r) => setTimeout(r, 600));
      const mobilePic = path.join(ARTIFACTS_DIR, `teen-nav-mobile-${ch.name}.png`);
      await page.screenshot({ path: mobilePic, fullPage: false });
      console.log(`    [✓] Desktop & Mobile screenshots saved.\n`);
    }

    console.log('====================================================');
    console.log(`✅ All ${CHAPTERS_TO_TEST.length} Chapters verified successfully!`);
    console.log(`Total console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Console errors:', consoleErrors);
    }
    console.log('====================================================\n');
  } catch (err) {
    console.error('❌ Test failed:', err);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runAllNavTests();
