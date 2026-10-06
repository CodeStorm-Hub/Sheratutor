import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACTS_DIR = path.resolve(process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e');

async function runPhysicsCh11E2ETest() {
  console.log('🚀 Running E2E Test: Physics Chapter 11 (চল তড়িৎ / Current Electricity) Playground V2...\n');

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

    // 2. CHECK V2 LIBRARY HUB FOR CHAPTER 11
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2 Library View...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1000));

    // Select Physics tab in library
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const physBtn = buttons.find((b) => b.textContent?.includes('Physics'));
      if (physBtn) physBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-00-library-hub.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-00-library-hub.png');

    // 3. NAVIGATE TO PHYSICS CHAPTER 11
    console.log('[*] Step 3: Navigating to /dashboard/playground/v2/physics/11...');
    await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/11`, { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 1200));

    // 4. LAB 1: OHM'S LAW & RESISTOR LAB
    console.log('[*] Step 4: Testing Lab 1 (ওহমের সূত্র ও রোধক ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step1Btn = buttons.find((b) => b.textContent?.includes('১. মূল ধারণা ও ল্যাব'));
      if (step1Btn) step1Btn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Test clicking formula triangle 'I' symbol
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const triangleBtn = buttons.find((b) => b.textContent?.trim() === 'I');
      if (triangleBtn) triangleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-01-learn-ohms-law.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-01-learn-ohms-law.png');

    // 5. LAB 2: RESISTIVITY & WIRE GEOMETRY LAB
    console.log('[*] Step 5: Testing Lab 2 (আপেক্ষিক রোধ ও তারের জ্যামিতি ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab2Btn = buttons.find((b) => b.textContent?.includes('আপেক্ষিক রোধ'));
      if (lab2Btn) lab2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-02-learn-resistivity-geometry.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-02-learn-resistivity-geometry.png');

    // 6. LAB 3: SERIES, PARALLEL CIRCUITS & LOST VOLTS
    console.log('[*] Step 6: Testing Lab 3 (শ্রেণি ও সমান্তরাল বর্তনী সিমুলেটর)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab3Btn = buttons.find((b) => b.textContent?.includes('শ্রেণি ও'));
      if (lab3Btn) lab3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Switch to parallel circuit
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const parallelBtn = buttons.find((b) => b.textContent?.includes('সমান্তরাল সমবায়'));
      if (parallelBtn) parallelBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-03-learn-circuits-parallel.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-03-learn-circuits-parallel.png');

    // Test breaking a bulb in series to demonstrate circuit failure
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const seriesBtn = buttons.find((b) => b.textContent?.includes('শ্রেণি সমবায়'));
      if (seriesBtn) seriesBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const breakBulbBtn = buttons.find((b) => b.textContent?.includes('R₁ বিচ্ছিন্ন'));
      if (breakBulbBtn) breakBulbBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-04-learn-circuits-series-break.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-04-learn-circuits-series-break.png');

    // Reset broken bulb
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const restoreBtn = buttons.find((b) => b.textContent?.includes('সব বাল্ব ঠিক আছে'));
      if (restoreBtn) restoreBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // 7. LAB 4: ELECTRIC POWER & ELECTRICITY BILL
    console.log('[*] Step 7: Testing Lab 4 (তড়িৎ ক্ষমতা ও বিদ্যুৎ বিল ক্যালকুলেটর)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab4Btn = buttons.find((b) => b.textContent?.includes('তড়িৎ ক্ষমতা'));
      if (lab4Btn) lab4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-05-learn-power-billing.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-05-learn-power-billing.png');

    // Test High Voltage Grid transmission button (132 kV) and scroll to grid loss
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const grid132Btn = buttons.find((b) => b.textContent?.includes('১৩২ kV'));
      if (grid132Btn) grid132Btn.click();

      const el = Array.from(document.querySelectorAll('h4')).find((h) => h.textContent?.includes('উচ্চ ভোল্টেজ'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-06-learn-grid-transmission-loss.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-06-learn-grid-transmission-loss.png');

    // 8. LAB 5: HOUSEHOLD ELECTRICAL SAFETY & SHORT-CIRCUITS
    console.log('[*] Step 8: Testing Lab 5 (গৃহস্থালি নিরাপদ বর্তনী ও শর্ট-সার্কিট ল্যাব)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const lab5Btn = buttons.find((b) => b.textContent?.includes('গৃহস্থালি নিরাপদ'));
      if (lab5Btn) lab5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Test chassis leakage without earth connection
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const leakBtn = buttons.find((b) => b.textContent?.includes('বডি লিক ত্রুটি'));
      if (leakBtn) leakBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const earthBtn = buttons.find((b) => b.textContent?.includes('আর্থিং বিচ্ছিন্ন'));
      if (earthBtn) earthBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-07-learn-household-safety.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-07-learn-household-safety.png');

    // Scroll to bird and bat electrocution cards
    await page.evaluate(() => {
      const el = Array.from(document.querySelectorAll('h4, span')).find((h) => h.textContent?.includes('পাখি বনাম বাদুড়'));
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-08-learn-electrocution-bird-bat.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-08-learn-electrocution-bird-bat.png');

    // 9. STEP 2: SEE EXAMPLE (WORKED CQS & RUBRIC)
    console.log('[*] Step 9: Testing Step 2 (বোর্ড সৃজনশীল প্রশ্নব্যাংক ও রুব্রিক)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step2Btn = buttons.find((b) => b.textContent?.includes('২. বোর্ড সমাধান'));
      if (step2Btn) step2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-09-see-example-cqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-09-see-example-cqs.png');

    // Open CQ 2 (Alvi vs Alif Electric bill) and scroll into view
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const cq2Btn = buttons.find((b) => b.textContent?.includes('সৃজনশীল ২'));
      if (cq2Btn) cq2Btn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-10-examiner-rubric.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-10-examiner-rubric.png');

    // 10. STEP 3: TRY YOURSELF CHALLENGES
    console.log('[*] Step 10: Testing Step 3 (নিজে চেষ্টা করো - ৩টি ইন্টারেক্টিভ চ্যালেঞ্জ)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step3Btn = buttons.find((b) => b.textContent?.includes('৩. নিজে অনুশীলন'));
      if (step3Btn) step3Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Input answers for Challenge 1 (4), Challenge 2 (1.0), Challenge 3 (30)
    const inputs = await page.$$('input[type="number"]');
    if (inputs.length >= 3) {
      await inputs[0].type('4');
      await inputs[1].type('1.0');
      await inputs[2].type('30');

      // Click ONLY verify buttons with exact trim 'যাচাই'
      await page.evaluate(() => {
        const verifyBtns = Array.from(document.querySelectorAll('button')).filter((b) =>
          b.textContent?.trim() === 'যাচাই'
        );
        verifyBtns.forEach((btn) => btn.click());
      });
      await new Promise((r) => setTimeout(r, 600));
    }

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-11-try-yourself-challenges.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-11-try-yourself-challenges.png');

    // 11. STEP 4: CHECK UNDERSTANDING (MCQS)
    console.log('[*] Step 11: Testing Step 4 (বহুনির্বাচনি প্রশ্নাবলি / MCQs)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step4Btn = buttons.find((b) => b.textContent?.includes('৪. যাচাই ও কুইজ'));
      if (step4Btn) step4Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Select options for MCQs and reveal answers
    await page.evaluate(() => {
      const optionButtons = Array.from(document.querySelectorAll('button')).filter(
        (b) => b.textContent?.includes('দ্বিগুণ হবে') || b.textContent?.includes('১ ওহম') || b.textContent?.includes('৪ গুণ')
      );
      optionButtons.forEach((btn) => btn.click());
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.evaluate(() => {
      const showBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('ফলাফল ও ব্যাখ্যা')
      );
      if (showBtn) showBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-12-check-understanding-mcqs.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-12-check-understanding-mcqs.png');

    // 12. STEP 5: SUMMARY & CHEAT SHEET
    console.log('[*] Step 12: Testing Step 5 (সারসংক্ষেপ ও চিট-শিট)...');
    await page.evaluate(() => {
      window.scrollTo(0, 0);
      const buttons = Array.from(document.querySelectorAll('button'));
      const step5Btn = buttons.find((b) => b.textContent?.includes('৫. সারসংক্ষেপ'));
      if (step5Btn) step5Btn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Trigger copy notes
    await page.evaluate(() => {
      const copyBtn = Array.from(document.querySelectorAll('button')).find((b) =>
        b.textContent?.includes('নোট কপি করো')
      );
      if (copyBtn) copyBtn.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-13-summary-cheat-sheet.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-13-summary-cheat-sheet.png');

    // 13. SOCRATIC AI TUTOR (SHERU DRAWER)
    console.log('[*] Step 13: Testing Socratic AI Tutor Drawer...');
    await page.evaluate(() => {
      const tutorBtn = Array.from(document.querySelectorAll('button')).find(
        (b) => b.textContent?.includes('শেরু এআই টিউটর')
      );
      if (tutorBtn) tutorBtn.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Type a question into Sheru tutor
    const tutorInput = await page.$('input[placeholder*="প্রশ্ন করো"]');
    if (tutorInput) {
      await tutorInput.type('গ্রিডে ভোল্টেজ বাড়ালে সিস্টেম লস কীভাবে কমে?');
      await page.evaluate(() => {
        const sendBtn = Array.from(document.querySelectorAll('button')).find((b) => b.querySelector('svg.lucide-send'));
        if (sendBtn) sendBtn.click();
      });
      await new Promise((r) => setTimeout(r, 800));
    }

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'physics-ch11-14-ai-tutor-drawer.png'),
    });
    console.log('[✓] Saved screenshot: physics-ch11-14-ai-tutor-drawer.png');

    // 14. CONSOLE ERRORS CHECK
    console.log('\n--- Test Diagnostics ---');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.warn('⚠️ Console errors detected:', consoleErrors);
    } else {
      console.log('✅ 0 console errors detected throughout the entire run.');
    }

    console.log('\n🎉 Chapter 11 E2E Test Suite successfully completed 15 snapshots!');
  } catch (error) {
    console.error('❌ E2E Test Failed:', error);
    process.exit(1);
  } finally {
    await browser.close();
  }
}

runPhysicsCh11E2ETest();
