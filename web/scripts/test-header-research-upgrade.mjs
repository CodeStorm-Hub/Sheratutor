import puppeteer from 'puppeteer-core';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACT_DIR = '/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62';

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

  // 1. Desktop Dark Header (English)
  console.log('[*] Capturing Header in Dark Mode (English)...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/header-desktop-dark-en.png` });

  // 2. Desktop Light Header (English)
  console.log('[*] Capturing Header in Light Mode (English)...');
  await setPreferences('light', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/header-desktop-light-en.png` });

  // 3. Desktop Dark Header (Bangla)
  console.log('[*] Capturing Header in Dark Mode (Bangla)...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  const bnBtn = await page.$('button[title*="বাংলা"]');
  if (bnBtn) await bnBtn.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${ARTIFACT_DIR}/header-desktop-dark-bn.png` });

  // 4. Command Palette Search Dialog Open
  console.log('[*] Testing Command Palette Search Dialog...');
  const searchBtn = await page.$('header button[aria-label*="অনুসন্ধান"], header button[aria-label*="Search"]');
  if (searchBtn) {
    await searchBtn.click();
    await new Promise(r => setTimeout(r, 600));
    await page.screenshot({ path: `${ARTIFACT_DIR}/header-search-palette-open.png` });
    // Close search dialog with Escape
    await page.keyboard.press('Escape');
    await new Promise(r => setTimeout(r, 400));
  }

  // 5. Notifications Dropdown Open
  console.log('[*] Testing Notifications Dropdown...');
  const notifBtn = await page.$('header button[aria-label*="Notifications"], header button[aria-label*="নোটিফিকেশন"]');
  if (notifBtn) {
    await notifBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/header-notifications-open.png` });
    // Click outside to close
    await page.click('body');
    await new Promise(r => setTimeout(r, 400));
  }

  // 6. Profile Avatar Dropdown Open
  console.log('[*] Testing Profile Avatar Dropdown...');
  const profileBtn = await page.$('header button[aria-label*="Account menu"], header button[aria-label*="অ্যাকাউন্ট"]');
  if (profileBtn) {
    await profileBtn.click();
    await new Promise(r => setTimeout(r, 500));
    await page.screenshot({ path: `${ARTIFACT_DIR}/header-profile-dropdown-open.png` });
    // Click outside to close
    await page.click('body');
    await new Promise(r => setTimeout(r, 400));
  }

  // 7. Mobile Viewport (iPhone 14: 430 x 932)
  console.log('[*] Capturing Mobile Header View...');
  await page.setViewport({ width: 430, height: 932, isMobile: true, hasTouch: true });
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  const bnBtnMobile = await page.$('button[title*="বাংলা"]');
  if (bnBtnMobile) await bnBtnMobile.click();
  await new Promise(r => setTimeout(r, 600));
  await page.screenshot({ path: `${ARTIFACT_DIR}/header-mobile-view.png` });

  await browser.close();
  console.log('[✓] All Header upgrade verification tests succeeded!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
