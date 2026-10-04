import puppeteer from 'puppeteer-core';
import fs from 'fs';
import path from 'path';

const ARTIFACTS_DIR = path.resolve('/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62');

async function runVisualClarityTest() {
  console.log('🚀 Running E2E Test: Top Bar Space Optimization & High-Clarity Real Numbers Visualizer...\n');

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
    console.log('[*] Step 2: Navigating to /dashboard/playground/v2/math/1...');
    await page.goto('http://localhost:3000/dashboard/playground/v2/math/1', { waitUntil: 'networkidle2' });
    await new Promise((r) => setTimeout(r, 2000));

    // Capture initial view showing the new compact top bar + high clarity nested set map
    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'visual-01-compact-topbar-nested-sets.png'),
    });
    console.log('[✓] Saved screenshot: visual-01-compact-topbar-nested-sets.png');

    // 3. CLICK ON IRRATIONAL NUMBERS (Q') REGION TO VERIFY ACTIVE GLOW & INSPECTOR
    console.log('[*] Step 3: Clicking on Irrational Numbers Q\' region in diagram...');
    await page.evaluate(() => {
      const qPrimeEl = document.querySelector('[data-set-region="Q_prime"]');
      if (qPrimeEl) qPrimeEl.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Scroll down slightly so inspector and diagram are in view
    await page.evaluate(() => window.scrollBy(0, 200));
    await new Promise((r) => setTimeout(r, 300));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'visual-02-irrational-set-active-inspector.png'),
    });
    console.log('[✓] Saved screenshot: visual-02-irrational-set-active-inspector.png');

    // 4. CLICK ON NATURAL NUMBERS (N) TO VERIFY NESTED REGION INTERACTION & CAUTION
    console.log('[*] Step 4: Clicking on Natural Numbers N region in diagram...');
    await page.evaluate(() => {
      const nEl = document.querySelector('[data-set-region="N"]');
      if (nEl) nEl.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'visual-03-natural-set-active-caution.png'),
    });
    console.log('[✓] Saved screenshot: visual-03-natural-set-active-caution.png');

    // Reset scroll back to top before mode switch
    await page.evaluate(() => window.scrollTo(0, 0));
    await new Promise((r) => setTimeout(r, 300));

    // 5. SWITCH VISUAL MODE TO TAXONOMY TREE VIEW
    console.log('[*] Step 5: Switching to Taxonomy Tree View...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const treeBtn = btns.find((b) => b.textContent.includes('শ্রেণিবিন্যাস বৃক্ষ'));
      if (treeBtn) treeBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'visual-04-taxonomy-tree-view.png'),
    });
    console.log('[✓] Saved screenshot: visual-04-taxonomy-tree-view.png');

    // 6. COLLAPSE SIDEBAR TO VIEW FULL-WIDTH CLARITY
    console.log('[*] Step 6: Toggling Left Sidebar closed for maximum visual canvas...');
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const toggleBtn = btns.find((b) => b.textContent.includes('পাঠ তালিকা লুকান'));
      if (toggleBtn) toggleBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    // Switch back to Nested Map in wide canvas
    await page.evaluate(() => {
      const btns = Array.from(document.querySelectorAll('button'));
      const mapBtn = btns.find((b) => b.textContent.includes('মানচিত্র'));
      if (mapBtn) mapBtn.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'visual-05-wide-canvas-nested-map.png'),
    });
    console.log('[✓] Saved screenshot: visual-05-wide-canvas-nested-map.png');

    // 7. TEST INTERACTIVE SORTING
    console.log('[*] Step 7: Testing Interactive Sorting activity...');
    await page.evaluate(() => {
      // Click on chip '√2'
      const buttons = Array.from(document.querySelectorAll('button'));
      const sqrt2Chip = buttons.find((b) => b.textContent.trim() === '√2');
      if (sqrt2Chip) sqrt2Chip.click();
    });
    await new Promise((r) => setTimeout(r, 400));

    // Drop into irrational bucket
    await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const irrBucket = buttons.find((b) => b.textContent.includes('অমূলদ সংখ্যার বাক্স'));
      if (irrBucket) irrBucket.click();
    });
    await new Promise((r) => setTimeout(r, 600));

    await page.screenshot({
      path: path.join(ARTIFACTS_DIR, 'visual-06-interactive-sorting-drop.png'),
    });
    console.log('[✓] Saved screenshot: visual-06-interactive-sorting-drop.png');

    console.log('\n==========================================');
    console.log(`Test Completed! Console errors: ${consoleErrors.length}`);
    if (consoleErrors.length > 0) {
      console.log('Errors logged:', consoleErrors);
    }
    console.log('==========================================\n');

  } catch (err) {
    console.error('Test execution failed:', err);
  } finally {
    await browser.close();
  }
}

runVisualClarityTest();
