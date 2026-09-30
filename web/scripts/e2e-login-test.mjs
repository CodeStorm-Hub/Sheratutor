import puppeteer from 'puppeteer-core';
import fs from 'node:fs';
import path from 'node:path';

async function runE2ETest() {
  console.log('🚀 Starting Live E2E Login Test with Chromium...');
  
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });

  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });

  const consoleLogs = [];
  page.on('console', msg => {
    consoleLogs.push(`[${msg.type()}] ${msg.text()}`);
    console.log(`[Browser Console ${msg.type()}]`, msg.text());
  });

  page.on('pageerror', err => {
    console.error('[Browser Error]', err.toString());
  });

  console.log('🌐 Navigating to http://localhost:3000/login...');
  const response = await page.goto('http://localhost:3000/login', {
    waitUntil: 'networkidle2',
    timeout: 30000,
  });

  console.log(`📡 Navigation response status: ${response ? response.status() : 'N/A'}`);

  // Check form inputs
  const emailInput = await page.$('#email');
  const passwordInput = await page.$('#password');
  const submitButton = await page.$('form:has(#email) button[type="submit"]');

  if (!emailInput || !passwordInput || !submitButton) {
    throw new Error(`Login form elements missing: email=${!!emailInput}, pass=${!!passwordInput}, submit=${!!submitButton}`);
  }
  console.log('✅ Form inputs found on page.');

  // Type credentials
  console.log('⌨️ Typing credentials...');
  await emailInput.type('afsanchowdhury5@gmail.com', { delay: 20 });
  await passwordInput.type('callofduty100', { delay: 20 });

  const screenshotDir = path.resolve('test-artifacts');
  if (!fs.existsSync(screenshotDir)) {
    fs.mkdirSync(screenshotDir, { recursive: true });
  }

  await page.screenshot({ path: path.join(screenshotDir, '01-before-login.png') });
  console.log('📸 Saved before-login screenshot to test-artifacts/01-before-login.png');

  console.log('🖱️ Clicking submit button...');
  await Promise.all([
    submitButton.click(),
    // Wait for either navigation or response
  ]);

  // Give it time to process server action and redirect / show error
  console.log('⏳ Waiting for response / navigation...');
  await new Promise(r => setTimeout(r, 6000));

  const currentUrl = page.url();
  console.log(`📍 Current URL after login submission: ${currentUrl}`);

  await page.screenshot({ path: path.join(screenshotDir, '02-after-login.png'), fullPage: true });
  console.log('📸 Saved after-login screenshot to test-artifacts/02-after-login.png');

  // Check page content
  const pageTitle = await page.title();
  const bodyText = await page.evaluate(() => document.body.innerText);

  // Check if error message is displayed
  const errorElement = await page.$('p.text-destructive');
  let errorMessage = null;
  if (errorElement) {
    errorMessage = await page.evaluate(el => el.textContent, errorElement);
    console.log(`⚠️ Error message displayed: "${errorMessage}"`);
  }

  console.log(`📄 Page Title: ${pageTitle}`);
  console.log(`📄 First 300 chars of body text:\n${bodyText.slice(0, 300)}...`);

  await browser.close();

  return {
    initialUrl: 'http://localhost:3000/login',
    finalUrl: currentUrl,
    pageTitle,
    errorMessage,
    consoleLogs,
    isLoggedIn: currentUrl.includes('/dashboard'),
  };
}

runE2ETest()
  .then(res => {
    console.log('\n🏁 Test Completed with Result:');
    console.log(JSON.stringify(res, null, 2));
    process.exit(0);
  })
  .catch(err => {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  });
