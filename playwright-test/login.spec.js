const { test, expect } = require('@playwright/test');

test('open school management system', async ({ page }) => {
  await page.goto('http://localhost/school-management-system/');
  await expect(page).toHaveTitle(/School Management/);
}, { headless: false }); // <-- this usually goes in config, see Option 2

