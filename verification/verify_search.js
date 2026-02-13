const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();

  console.log('Navigating to app...');
  await page.goto('http://localhost:8080');

  // Wait for splash screen to disappear
  console.log('Waiting for splash screen...');
  await page.waitForTimeout(3000);

  // Click on "Baza Produktów" (manageDatabaseBtn)
  console.log('Clicking Manage Database...');
  await page.click('#manageDatabaseBtn');

  // Wait for animation or screen switch
  await page.waitForTimeout(500);

  // Type in search box
  console.log('Typing in search...');
  const searchInput = page.locator('#databaseSearch');
  await searchInput.fill('kebab');

  // Wait for debounce (300ms) + rendering
  await page.waitForTimeout(1000);

  // Take screenshot
  console.log('Taking screenshot...');
  await page.screenshot({ path: 'verification/verification.png' });

  await browser.close();
})();
