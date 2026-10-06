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

  // 1. Login
  console.log('[*] Logging in...');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await page.type('#email', 'afsanchowdhury5@gmail.com');
  await page.type('#password', 'callofduty100');
  await page.click('form:has(#email) button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 15000 });

  async function setMode(mode) {
    await page.evaluate((targetMode) => {
      localStorage.setItem('theme', targetMode);
      if (targetMode === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
    }, mode);
    await new Promise(r => setTimeout(r, 600));
  }

  // 1. Dashboard Light & Dark
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await setMode('light');
  await page.screenshot({ path: `${ARTIFACT_DIR}/theme-current-light-dashboard.png` });

  await setMode('dark');
  await page.screenshot({ path: `${ARTIFACT_DIR}/theme-current-dark-dashboard.png` });

  // 2. Guidebook Physics 3 Light & Dark
  await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/3`, { waitUntil: 'networkidle2' });
  await setMode('light');
  await page.screenshot({ path: `${ARTIFACT_DIR}/theme-current-light-guidebook-phy3.png` });

  await setMode('dark');
  await page.screenshot({ path: `${ARTIFACT_DIR}/theme-current-dark-guidebook-phy3.png` });

  // 3. Playground V2 Library Light & Dark
  await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
  await setMode('light');
  await page.screenshot({ path: `${ARTIFACT_DIR}/theme-current-light-playground.png` });

  await setMode('dark');
  await page.screenshot({ path: `${ARTIFACT_DIR}/theme-current-dark-playground.png` });

  await browser.close();
  console.log('[✓] Theme screenshots captured successfully!');
}

run().catch((e) => {
  console.error(e);
  process.exit(1);
});
