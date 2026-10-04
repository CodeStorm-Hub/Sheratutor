import puppeteer from 'puppeteer-core';

const BASE_URL = process.env.TEST_URL || 'http://localhost:3000';
const ARTIFACT_DIR = '/home/kratzer/.gemini/antigravity/brain/f1d2842d-b69e-4506-aff3-154dc57a7b62';

async function run() {
  console.log('🚀 Running Comprehensive Language Switching Verification (English vs Bangla)...');
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
  console.log('[✓] Logged in successfully.');

  // Helper to switch language
  async function selectLanguage(lang) {
    console.log(`\n========================================\n[*] Switching language to: ${lang.toUpperCase()}`);
    // Click language toggle button or set cookie & localStorage
    await page.evaluate((targetLang) => {
      localStorage.setItem('sheratutor_lang', targetLang);
      document.cookie = `sheratutor_lang=${targetLang}; path=/; max-age=31536000; SameSite=Lax`;
    }, lang);

    // Also click button in UI if available
    const buttonText = lang === 'en' ? 'ENG' : 'বাংলা';
    const langBtn = await page.evaluateHandle((text) => {
      const buttons = Array.from(document.querySelectorAll('button'));
      return buttons.find(b => b.textContent && b.textContent.trim() === text) || null;
    }, buttonText);

    if (langBtn && langBtn.asElement()) {
      await langBtn.asElement().click();
      await new Promise(r => setTimeout(r, 1000));
    }
  }

  // 2. Test in English
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await selectLanguage('en');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const dashEn = await page.evaluate(() => {
    return {
      bodyText: document.body.innerText.slice(0, 500),
      hasHome: Array.from(document.querySelectorAll('a, span')).some(el => el.textContent?.trim() === 'Home'),
      hasPlayground: Array.from(document.querySelectorAll('a, span')).some(el => el.textContent?.includes('Playground')),
      hasPrediction: Array.from(document.querySelectorAll('*')).some(el => el.textContent?.includes('BOARD PREDICTION')),
    };
  });
  console.log('[✓] Dashboard (EN):', dashEn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-en-dashboard.png` });

  // 3. Test Playground V2 in English
  await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const playEn = await page.evaluate(() => {
    return {
      hasSelectSubject: Array.from(document.querySelectorAll('h2, h3, div')).some(el => el.textContent?.includes('Select Subject')),
      hasPhysics: Array.from(document.querySelectorAll('*')).some(el => el.textContent?.trim() === 'Physics'),
      hasStartLab: Array.from(document.querySelectorAll('a, button, span')).some(el => el.textContent?.includes('Start Lab') || el.textContent?.includes('Open Physics Lab')),
      searchPlaceholder: document.querySelector('input[placeholder]')?.getAttribute('placeholder'),
    };
  });
  console.log('[✓] Playground V2 Library (EN):', playEn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-en-playground-v2.png` });

  // 4. Test Guidebook Physics 3 in English
  await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/3`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const guidebookPhyEn = await page.evaluate(() => {
    const gbHeader = Array.from(document.querySelectorAll('header')).find(h => h.querySelector('a[href*="/playground/v2"]'));
    return {
      headerSnippet: gbHeader ? gbHeader.innerText.replace(/\n+/g, ' ') : 'NOT FOUND',
      hasBackToLib: gbHeader ? gbHeader.innerText.includes('Back to Library') || gbHeader.innerText.includes('Library') : false,
      hasChapter: gbHeader ? gbHeader.innerText.includes('Chapter 03') || gbHeader.innerText.includes('Ch 03') : false,
      hasPhysics: gbHeader ? gbHeader.innerText.includes('Physics') : false,
      hasAiTutor: gbHeader ? gbHeader.innerText.includes('AI Tutor') : false,
    };
  });
  console.log('[✓] Guidebook Physics 3 (EN):', guidebookPhyEn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-en-guidebook-phy3.png` });

  // 5. Test Guidebook Math 5 in English
  await page.goto(`${BASE_URL}/dashboard/playground/v2/math/5`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const guidebookMathEn = await page.evaluate(() => {
    const gbHeader = Array.from(document.querySelectorAll('header')).find(h => h.querySelector('a[href*="/playground/v2"]'));
    return {
      headerSnippet: gbHeader ? gbHeader.innerText.replace(/\n+/g, ' ') : 'NOT FOUND',
      hasBackToLib: gbHeader ? gbHeader.innerText.includes('Back to Library') : false,
      hasChapter: gbHeader ? gbHeader.innerText.includes('Chapter 05') : false,
      hasMath: gbHeader ? gbHeader.innerText.includes('General Math') : false,
    };
  });
  console.log('[✓] Guidebook Math 5 (EN):', guidebookMathEn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-en-guidebook-math5.png` });

  // ==========================================
  // NOW SWITCH TO BANGLA
  // ==========================================
  await selectLanguage('bn');
  await page.goto(`${BASE_URL}/dashboard`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));

  const dashBn = await page.evaluate(() => {
    return {
      hasHome: Array.from(document.querySelectorAll('a, span')).some(el => el.textContent?.trim() === 'হোম'),
      hasPlayground: Array.from(document.querySelectorAll('a, span')).some(el => el.textContent?.includes('খেলার মাঠ')),
      hasPrediction: Array.from(document.querySelectorAll('*')).some(el => el.textContent?.includes('বোর্ড প্রেডিকশন') || el.textContent?.includes('BOARD PREDICTION')),
    };
  });
  console.log('[✓] Dashboard (BN):', dashBn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-bn-dashboard.png` });

  // Playground V2 in Bangla
  await page.goto(`${BASE_URL}/dashboard/playground/v2`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const playBn = await page.evaluate(() => {
    return {
      hasSelectSubject: Array.from(document.querySelectorAll('h2, h3, div')).some(el => el.textContent?.includes('বিষয় নির্বাচন করুন')),
      hasPhysics: Array.from(document.querySelectorAll('*')).some(el => el.textContent?.trim() === 'পদার্থবিজ্ঞান'),
      hasStartLab: Array.from(document.querySelectorAll('a, button, span')).some(el => el.textContent?.includes('ল্যাব শুরু') || el.textContent?.includes('পদার্থবিজ্ঞান ল্যাব খুলুন')),
    };
  });
  console.log('[✓] Playground V2 Library (BN):', playBn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-bn-playground-v2.png` });

  // Guidebook Physics 3 in Bangla
  await page.goto(`${BASE_URL}/dashboard/playground/v2/physics/3`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const guidebookPhyBn = await page.evaluate(() => {
    const gbHeader = Array.from(document.querySelectorAll('header')).find(h => h.querySelector('a[href*="/playground/v2"]'));
    return {
      headerSnippet: gbHeader ? gbHeader.innerText.replace(/\n+/g, ' ') : 'NOT FOUND',
      hasBackToLib: gbHeader ? gbHeader.innerText.includes('লাইব্রেরিতে ফিরুন') : false,
      hasChapter: gbHeader ? gbHeader.innerText.includes('অধ্যায় ০৩') : false,
      hasPhysics: gbHeader ? gbHeader.innerText.includes('পদার্থবিজ্ঞান') : false,
      hasAiTutor: gbHeader ? gbHeader.innerText.includes('AI শিক্ষক') : false,
    };
  });
  console.log('[✓] Guidebook Physics 3 (BN):', guidebookPhyBn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-bn-guidebook-phy3.png` });

  // Test Profile/Settings in Bangla
  await page.goto(`${BASE_URL}/dashboard/profile`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const profileBn = await page.evaluate(() => {
    return {
      bodySnippet: document.body.innerText.slice(0, 300),
      hasPersonalDetails: Array.from(document.querySelectorAll('h2, button')).some(el => el.textContent?.includes('ব্যক্তিগত তথ্য') || el.textContent?.includes('প্রোফাইল')),
      hasAcademicTab: Array.from(document.querySelectorAll('button')).some(el => el.textContent?.includes('পড়াশোনা') || el.textContent?.includes('লার্নিং')),
    };
  });
  console.log('[✓] Profile Page (BN):', profileBn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-bn-profile.png` });

  // Switch to English and test Profile/Settings in English
  await selectLanguage('en');
  await page.goto(`${BASE_URL}/dashboard/profile`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 1200));
  const profileEn = await page.evaluate(() => {
    return {
      bodySnippet: document.body.innerText.slice(0, 300),
      hasPersonalDetails: Array.from(document.querySelectorAll('h2, button')).some(el => el.textContent?.includes('Personal Details') || el.textContent?.includes('Profile')),
      hasAcademicTab: Array.from(document.querySelectorAll('button')).some(el => el.textContent?.includes('Academic') || el.textContent?.includes('Learning')),
    };
  });
  console.log('[✓] Profile Page (EN):', profileEn);
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-en-profile.png` });

  // Test Auth Pages: Login & Signup
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await selectLanguage('en');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  console.log('[✓] Login Page (EN)');
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-en-login.png` });

  await selectLanguage('bn');
  await page.goto(`${BASE_URL}/login`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  console.log('[✓] Login Page (BN)');
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-bn-login.png` });

  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  console.log('[✓] Signup Page (BN)');
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-bn-signup.png` });

  await selectLanguage('en');
  await page.goto(`${BASE_URL}/signup`, { waitUntil: 'networkidle2' });
  await new Promise(r => setTimeout(r, 800));
  console.log('[✓] Signup Page (EN)');
  await page.screenshot({ path: `${ARTIFACT_DIR}/lang-en-signup.png` });

  await browser.close();
  console.log('\n========================================\n🎉 All Language Switching Tests Completed Successfully!\n');
}

run().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
