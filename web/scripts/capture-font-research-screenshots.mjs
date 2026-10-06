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
      localStorage.setItem('sheratutor_language', l);
      document.documentElement.lang = l;
      window.dispatchEvent(new Event('storage'));
    }, theme, lang);
    await new Promise(r => setTimeout(r, 600));
  }

  // 1. Dashboard: English & Bangla (Dark & Light)
  console.log('[*] Capturing Dashboard in English (Dark)...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-en-dark-dashboard.png` });

  console.log('[*] Capturing Dashboard in English (Light)...');
  await setPreferences('light', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-en-light-dashboard.png` });

  console.log('[*] Capturing Dashboard in Bangla (Dark)...');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-bn-dark-dashboard.png` });

  console.log('[*] Capturing Dashboard in Bangla (Light)...');
  await setPreferences('light', 'bn');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-bn-light-dashboard.png` });

  // 2. Physics Chapter 3: English & Bangla
  console.log('[*] Capturing Physics Ch3 in English (Dark)...');
  await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/3`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-en-dark-guidebook-phy3.png` });

  console.log('[*] Capturing Physics Ch3 in Bangla (Dark)...');
  await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/3`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-bn-dark-guidebook-phy3.png` });

  // 3. Higher Math Chapter 5: Bangla & English
  console.log('[*] Capturing Math Ch5 in Bangla (Dark)...');
  await page.goto(`${BASE_URL}/dashboard/playground/v2/math/5`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-bn-dark-guidebook-math5.png` });

  console.log('[*] Capturing Math Ch5 in English (Dark)...');
  await page.goto(`${BASE_URL}/dashboard/playground/v2/math/5`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'en');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-en-dark-guidebook-math5.png` });

  // 4. Playground V2 Index
  console.log('[*] Capturing Playground V2 in Bangla (Dark)...');
  await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
  await setPreferences('dark', 'bn');
  await page.screenshot({ path: `${ARTIFACT_DIR}/font-bn-dark-playground.png` });

  await browser.close();
  console.log('[✓] All font research verification screenshots captured!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
