import puppeteer from 'puppeteer-core';

async function testGenerationFlow() {
  const browser = await puppeteer.launch({
    executablePath: '/usr/bin/chromium',
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-dev-shm-usage'],
  });
  const page = await browser.newPage();
  
  // Login
  await page.goto('http://localhost:3000/login', { waitUntil: 'networkidle2' });
  await page.type('#email', 'afsanchowdhury5@gmail.com');
  await page.type('#password', 'callofduty100');
  await page.click('form:has(#email) button[type="submit"]');
  await page.waitForNavigation({ waitUntil: 'networkidle2' }).catch(() => {});
  
  // Go to generate page
  console.log('Navigating to generate page...');
  await page.goto('http://localhost:3000/dashboard/practice/generate', { waitUntil: 'networkidle2' });
  
  // Select chapter
  console.log('Selecting chapter...');
  const firstCheckbox = await page.$('input[name="chapterCheck"]');
  if (firstCheckbox) {
    await firstCheckbox.click();
  }
  
  // Set total marks to 10
  const marksInput = await page.$('#totalMarks');
  if (marksInput) {
    await marksInput.click({ clickCount: 3 });
    await marksInput.type('10');
  }
  
  // Submit
  console.log('Clicking generate paper button...');
  const genBtn = await page.$('button[type="submit"]');
  await genBtn.click();
  
  console.log('Waiting for generation and redirect (up to 60s)...');
  await page.waitForNavigation({ waitUntil: 'networkidle2', timeout: 60000 }).catch(err => console.log('Nav timed out or handled:', err.message));
  
  await new Promise(r => setTimeout(r, 3000));
  const finalUrl = page.url();
  console.log('Final URL:', finalUrl);
  const bodyText = await page.evaluate(() => document.body.innerText);
  const is404 = bodyText.includes('404') || bodyText.includes('Page not found');
  console.log('Is 404:', is404);
  console.log('First 300 chars of page:\n', bodyText.slice(0, 300).replace(/\n+/g, ' '));
  
  await browser.close();
}

testGenerationFlow().catch(console.error);
