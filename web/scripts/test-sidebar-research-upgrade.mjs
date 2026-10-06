import puppeteer from 'puppeteer-core';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
// Artifacts dir: override with E2E_ARTIFACTS_DIR; defaults to web/test-artifacts/e2e
const ARTIFACT_DIR = process.env.E2E_ARTIFACTS_DIR || 'test-artifacts/e2e';

async function run() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1440, height: 900 });

  console.log('[*] Logging in...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await page.type('#email', 'afsanchowdhury5@gmail.com');
  await page.type('#password', 'callofduty100');
  await page.click('form:has(#email) button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

  async function setPreferences(theme, lang) {
    await page.evaluate((t, l) => {
      localStorage.setItem('theme', t);
      if (t === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      localStorage.setItem('sheratutor_lang', l);
      document.cookie = `sheratutor_lang=${l}; path=/; max-age=31536000; SameSite=Lax`;
      document.documentElement.lang = l;
      window.dispatchEvent(new Event('storage'));
    }, theme, lang);
    await new Promise(r => setTimeout(r, 600));
  }

  // 1. Desktop Dark - Dashboard (English)
  console.log('[*] Capturing Desktop Sidebar in Dark Mode (English)...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/sidebar-desktop-dark-en.png` });

  // 2. Desktop Light - Dashboard (English)
  console.log('[*] Capturing Desktop Sidebar in Light Mode (English)...');
  await setPreferences('light', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/sidebar-desktop-light-en.png` });

  // 3. Desktop Dark - Dashboard (Bangla)
  console.log('[*] Capturing Desktop Sidebar in Dark Mode (Bangla)...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  // Click the 'বাংলা' button in header
  const bnBtn = await page.$('button[title*="বাংলা"]');
  if (bnBtn) await bnBtn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${ARTIFACT_DIR}/sidebar-desktop-dark-bn.png` });

  // 4. Desktop Dark - Navigated to Playground V2 (Active State verification)
  console.log('[*] Capturing Desktop Sidebar with Active Playground item (Dark)...');
  await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${ARTIFACT_DIR}/sidebar-active-playground-dark-bn.png` });

  // 5. Desktop Sidebar Collapsed state
  console.log('[*] Testing Desktop Sidebar Collapse...');
  const collapseBtn = await page.$('aside button[title*="Collapse"], aside button[title*="লুকান"]');
  if (collapseBtn) {
    await collapseBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/sidebar-desktop-collapsed.png` });

    // Expand again
    const expandBtn = await page.$('button[title*="Expand"], button[title*="খুলুন"]');
    if (expandBtn) {
      await expandBtn.click();
      await new Promise(r => setTimeout(r, 500));
    }
  }

  // 6. Mobile Viewport (iPhone 14 Pro Max: 430 x 932)
  console.log('[*] Testing Mobile Sidebar Drawer...');
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  const bnBtnMobile = await page.$('button[title*="বাংলা"]');
  if (bnBtnMobile) await bnBtnMobile.click();
  await new Promise(r => setTimeout(r, 600));

  // Click hamburger menu in Header
  const menuBtn = await page.$('header button[aria-label*="menu"], header button[aria-label*="মেনু"]');
  if (menuBtn) {
    await menuBtn.click();
    await new Promise(r => setTimeout(r, 800));
    await page.screenshot({ path: `${ARTIFACT_DIR}/sidebar-mobile-drawer-open.png` });
  }

  await browser.close();
  console.log('[✓] Sidebar upgrade verification completed successfully!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
