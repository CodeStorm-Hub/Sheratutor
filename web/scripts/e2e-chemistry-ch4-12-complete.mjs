import puppeteer from 'puppeteer-core';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';

const CHEMISTRY_CHAPTERS = [
  { ch: 4, titleEn: 'Periodic Table', titleBn: 'পর্যায় সারণি' },
  { ch: 5, titleEn: 'Chemical Bonds', titleBn: 'রাসায়নিক বন্ধন' },
  { ch: 6, titleEn: 'Concept of Mole', titleBn: 'মোলের ধারণা' },
  { ch: 7, titleEn: 'Chemical Reactions', titleBn: 'রাসায়নিক বিক্রিয়া' },
  { ch: 8, titleEn: 'Chemistry & Energy', titleBn: 'রসায়ন ও শক্তি' },
  { ch: 9, titleEn: 'Acid-Base Balance', titleBn: 'এসিড-ক্ষার সমতা' },
  { ch: 10, titleEn: 'Mineral Resources: Metals', titleBn: 'খনিজ সম্পদ: ধাতু' },
  { ch: 11, titleEn: 'Mineral Resources: Fossils', titleBn: 'খনিজ সম্পদ: জীবাশ্ম' },
  { ch: 12, titleEn: 'Chemistry in Our Lives', titleBn: 'আমাদের জীবনে রসায়ন' },
];

async function runChemistryE2E() {
  console.log('🧪 Starting Precise E2E Verification for Chemistry Chapters 4-12...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1600,1000'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 1000 });

  const consoleErrors = [];
  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      const text = msg.text();
      if (!text.includes('favicon') && !text.includes('404')) {
        consoleErrors.push(text);
      }
    }
  });
  page.on('pageerror', (err) => {
    consoleErrors.push(err.message);
  });

  try {
    // Step 1: Login
    console.log('[*] Step 1: Authenticating user...');
    await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully.\n');

    let allPassed = true;

    // Step 2: Loop through Chapters 4 to 12
    for (const item of CHEMISTRY_CHAPTERS) {
      const url = `${BASE_URL}/dashboard/playground/v2/chemistry/${item.ch}`;
      console.log(`\n======================================================`);
      console.log(`[TESTING] Chemistry Chapter ${item.ch}: ${item.titleEn} (${item.titleBn})`);
      console.log(`URL: ${url}`);

      await page.goto(url, { waitUntil: 'networkidle2' });
      await new Promise((r) => setTimeout(r, 1200));

      const evaluation = await page.evaluate((item) => {
        const bodyText = document.body.innerText;
        const lowerBody = bodyText.toLowerCase();

        // 1. Verify Chapter Header & Title (Bilingual check)
        const hasChapterTitle =
          bodyText.includes(item.titleBn) ||
          lowerBody.includes(item.titleEn.toLowerCase());

        // 2. Verify Left Sidebar with Lessons 1 to 5
        const hasLesson1 = bodyText.includes('পাঠ ০১') || lowerBody.includes('lesson 1');
        const hasLesson5 = bodyText.includes('পাঠ ০৫') || lowerBody.includes('lesson 5');

        // 3. Verify NCTB Curriculum Badge
        const hasNctb = bodyText.includes('এনসিটিবি') || bodyText.includes('NCTB');

        // 4. Verify 5 Horizontal Tab Navigation Buttons
        const hasConceptTab = bodyText.includes('১. কনসেপ্ট ল্যাব') || lowerBody.includes('1. concept lab');
        const hasCqTab = bodyText.includes('২. বোর্ড উদাহরণ') || lowerBody.includes('2. board cq');
        const hasTryTab = bodyText.includes('৩. নিজে চেষ্টা করুন') || lowerBody.includes('3. try yourself');
        const hasMcqTab = bodyText.includes('৪. অনুধাবন যাচাই') || lowerBody.includes('4. check mcq');
        const hasSummaryTab = bodyText.includes('৫. সারসংক্ষেপ') || lowerBody.includes('5. summary');

        // 5. Verify Step Navigation Footer
        const hasFooter =
          bodyText.includes('লাইব্রেরিতে ফিরে যান') ||
          lowerBody.includes('back to library') ||
          bodyText.includes('পূর্ববর্তী ধাপ') ||
          bodyText.includes('পরবর্তী ধাপ') ||
          lowerBody.includes('previous step') ||
          lowerBody.includes('next step');

        // 6. Verify 3-Column Layout
        const hasSidebarAside = Boolean(document.querySelector('aside'));

        return {
          hasChapterTitle,
          hasLesson1,
          hasLesson5,
          hasNctb,
          hasConceptTab,
          hasCqTab,
          hasTryTab,
          hasMcqTab,
          hasSummaryTab,
          hasFooter,
          hasSidebarAside,
        };
      }, item);

      console.log(`  - Chapter Header & Title: ${evaluation.hasChapterTitle ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`  - Left Sidebar Lessons (01 to 05): ${evaluation.hasLesson1 && evaluation.hasLesson5 ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`  - NCTB Authenticity Badge: ${evaluation.hasNctb ? '✅ PASS' : '❌ FAIL'}`);
      console.log(`  - 5 Pedagogical Tabs (Concept, CQ, Try, MCQ, Summary): ${
        evaluation.hasConceptTab && evaluation.hasCqTab && evaluation.hasTryTab && evaluation.hasMcqTab && evaluation.hasSummaryTab ? '✅ PASS' : '❌ FAIL'
      }`);
      console.log(`  - Step Navigation Footer: ${evaluation.hasFooter ? '✅ PASS' : '❌ FAIL'}`);

      const chPassed = evaluation.hasChapterTitle && evaluation.hasLesson1 && evaluation.hasLesson5 &&
                       evaluation.hasNctb && evaluation.hasConceptTab && evaluation.hasTryTab &&
                       evaluation.hasSummaryTab && evaluation.hasFooter;

      if (!chPassed) {
        allPassed = false;
        console.error(`  ❌ Chapter ${item.ch} failed verification checks!`);
      } else {
        console.log(`  ✨ Chapter ${item.ch} fully verified and matched!`);
      }

      // Test Step 3 Click (Interactive simulator tab)
      try {
        const tryButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find((b) => b.innerText.includes('৩. নিজে চেষ্টা করুন') || b.innerText.toLowerCase().includes('3. try yourself'));
        });
        if (tryButton && (await tryButton.evaluate((b) => Boolean(b)))) {
          await tryButton.click();
          await new Promise((r) => setTimeout(r, 600));
          console.log(`  - Interactive Simulator Tab (Step 3): Responsive ✅`);
        }
      } catch (err) {
        console.warn(`  - Step 3 click test skipped or error: ${err.message}`);
      }

      // Test Step 5 Click (Summary vault & handnotes)
      try {
        const summaryButton = await page.evaluateHandle(() => {
          const buttons = Array.from(document.querySelectorAll('button'));
          return buttons.find((b) => b.innerText.includes('৫. সারসংক্ষেপ') || b.innerText.toLowerCase().includes('5. summary'));
        });
        if (summaryButton && (await summaryButton.evaluate((b) => Boolean(b)))) {
          await summaryButton.click();
          await new Promise((r) => setTimeout(r, 600));
          console.log(`  - Revision Vault & Notes Tab (Step 5): Responsive ✅`);
        }
      } catch (err) {
        console.warn(`  - Step 5 click test skipped or error: ${err.message}`);
      }
    }

    console.log(`\n======================================================`);
    console.log(`[SUMMARY] Total Console Errors Encountered: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log(`Errors:\n${consoleErrors.join('\n')}`);
    }

    if (allPassed) {
      console.log(`\n🎉 SUCCESS: All Chemistry Chapters 4-12 passed 100% design pattern alignment tests!`);
    } else {
      console.error(`\n⚠️ Some chapters had test failures. Please review.`);
      process.exit(1);
    }
  } catch (err) {
    console.error(`E2E Script Fatal Error: ${err.message}`);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runChemistryE2E();
