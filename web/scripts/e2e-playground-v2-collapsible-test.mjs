import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runCollapsibleAndFocusTest() {
  console.log('🚀 Running E2E Test: Hideable Sidebars, Empty Space Utilization & Component Focus...\n');

  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage', '--window-size=1680,1050'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1680, height: 1050 });

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
    await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
    await page.type('#email', 'afsanchowdhury5@gmail.com');
    await page.type('#password', 'callofduty100');
    await page.click('form:has(#email) button[type="submit"]');
    await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });
    console.log('[✓] Logged in successfully.');

    // 2. NAVIGATE TO PLAYGROUND V2 MATH CHAPTER 1
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2/math/1 on 1680px viewport...');
    await page.goto('http://localhost:3000/dashboard/playground/v2/math/1', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Screenshot 1: Full 3-column view with wide spacing and larger typography
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-01-initial-3column-wide.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-01-initial-3column-wide.png');

    // 3. COLLAPSE LEFT SIDEBAR
    console.log('[*] Step 3: Toggling Left Lesson Sidebar closed...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const toggleBtn = btns.find((b) => b.textContent.includes('পাঠ তালিকা লুকান'));
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-02-left-sidebar-closed.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-02-left-sidebar-closed.png');

    // 4. COLLAPSE RIGHT AI SIDEBAR (ULTRA-FOCUS MODE)
    console.log('[*] Step 4: Toggling AI Sidebar closed (Entering Ultra-Focus Mode)...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const toggleAiBtn = btns.find((b) => b.textContent.includes('AI শিক্ষক'));
      if (toggleAiBtn) toggleAiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-03-ultra-focus-12cols.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-03-ultra-focus-12cols.png');

    // 5. COLLAPSE DASHBOARD APP SIDEBAR (FULL SCREEN IMMERSION VIA DESKTOP TOGGLE)
    console.log('[*] Step 5: Toggling Dashboard desktop sidebar closed...');
    await page.evaluate(() => {
      const desktopToggle = document.querySelector('header button.hidden.lg\\:flex');
      if (desktopToggle) {
        desktopToggle.click();
      } else {
        const edgeBtn = document.querySelector('aside button[title*="Collapse sidebar"]');
        if (edgeBtn) edgeBtn.click();
      }
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-04-full-immersion-desktop.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-04-full-immersion-desktop.png');

    // 6. SWITCH TO LESSON 02 USING TOP HORIZONTAL PILL SWITCHER BAR
    console.log('[*] Step 6: Switching to Lesson 02 using the top horizontal lesson pill bar...');
    await page.evaluate(() => {
      const lessonPills = Array.from(document.querySelectorAll('button'));
      const l2Pill = lessonPills.find((b) => b.textContent.includes('প্রমাণের গোয়েন্দা'));
      if (l2Pill) l2Pill.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Advance to Clue 3 (The Crimson Contradiction)
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const nextBtn = btns.find((b) => b.textContent.includes('পরবর্তী সূত্র'));
      if (nextBtn) {
        nextBtn.click();
        setTimeout(() => {
          const nextBtn2 = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('পরবর্তী সূত্র'));
          if (nextBtn2) nextBtn2.click();
        }, 300);
      }
    });
    await new Promise((r) => setTimeout(r, 800));

    // Open Rubric drawer
    await page.evaluate(() => {
      const rubricBtn = Array.from(document.querySelectorAll('button')).find((b) => b.textContent.includes('পরীক্ষকের গোপন কথা'));
      if (rubricBtn) rubricBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-05-lesson2-proof-expanded.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-05-lesson2-proof-expanded.png');

    // 7. SWITCH TO LESSON 03 (9-0 CALCULATOR)
    console.log('[*] Step 7: Switching to Lesson 03 (9-0 Calculator)...');
    await page.evaluate(() => {
      const lessonPills = Array.from(document.querySelectorAll('button'));
      const l3Pill = lessonPills.find((b) => b.textContent.includes('আবৃত্ত দশমিক কোড'));
      if (l3Pill) l3Pill.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-06-lesson3-calculator-expanded.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-06-lesson3-calculator-expanded.png');

    // 8. SWITCH TO LESSON 04 (RED LINE BUFFER METHOD)
    console.log('[*] Step 8: Switching to Lesson 04 (Red Line Buffer Method)...');
    await page.evaluate(() => {
      const lessonPills = Array.from(document.querySelectorAll('button'));
      const l4Pill = lessonPills.find((b) => b.textContent.includes('রেড লাইন পদ্ধতি'));
      if (l4Pill) l4Pill.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-07-lesson4-buffer-expanded.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-07-lesson4-buffer-expanded.png');

    // 9. SWITCH TO LESSON 05 (BOARD QUIZ)
    console.log('[*] Step 9: Switching to Lesson 05 (Board Quiz) and selecting answers...');
    await page.evaluate(() => {
      const lessonPills = Array.from(document.querySelectorAll('button'));
      const l5Pill = lessonPills.find((b) => b.textContent.includes('ঝটপট বোর্ড কুইজ'));
      if (l5Pill) l5Pill.click();
    });
    await new Promise((r) => setTimeout(r, 800));

    // Click √8 in Question 1
    await page.evaluate(() => {
      const optBtns = Array.from(document.querySelectorAll('button'));
      const q1Opt = optBtns.find((b) => b.textContent.includes('\\sqrt{8}') || b.textContent.includes('√8'));
      if (q1Opt) q1Opt.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Click 'মূলদ সংখ্যা' in Question 2
    await page.evaluate(() => {
      const optBtns = Array.from(document.querySelectorAll('button'));
      const q2Opt = optBtns.find((b) => b.textContent.includes('মূলদ সংখ্যা') && !b.textContent.includes('অমূলদ'));
      if (q2Opt) q2Opt.click();
    });
    await new Promise((r) => setTimeout(r, 500));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-08-lesson5-quiz-expanded.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-08-lesson5-quiz-expanded.png');

    // 10. TOGGLE ALL SIDEBARS BACK ON (RESTORE 3-COLUMN LAYOUT)
    console.log('[*] Step 10: Restoring sidebars back to 3-column view...');
    await page.evaluate(() => {
      // Restore desktop sidebar
      const desktopToggle = document.querySelector('header button.hidden.lg\\:flex');
      if (desktopToggle) {
        desktopToggle.click();
      } else {
        const floatingOpen = document.querySelector('button[title*="Expand sidebar"]');
        if (floatingOpen) floatingOpen.click();
      }

      // Restore left lesson sidebar
      const btns = Array.from(document.querySelectorAll('button'));
      const showLeftBtn = btns.find((b) => b.textContent.includes('পাঠ তালিকা দেখুন'));
      if (showLeftBtn) showLeftBtn.click();

      // Restore AI tutor sidebar
      const showAiBtn = btns.find((b) => b.textContent.includes('AI শিক্ষক'));
      if (showAiBtn) showAiBtn.click();
    });
    await new Promise((r) => setTimeout(r, 1000));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'collapsible-09-restored-3column-view.png'),
    });
    console.log('[✓] Saved screenshot: collapsible-09-restored-3column-view.png');

    console.log('\n=========================================');
    console.log('🎉 E2E TEST COMPLETED SUCCESSFULLY!');
    console.log(`Console Errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors:', consoleErrors);
    }
    console.log('=========================================\n');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
  } finally {
    await browser.close();
  }
}

runCollapsibleAndFocusTest();
