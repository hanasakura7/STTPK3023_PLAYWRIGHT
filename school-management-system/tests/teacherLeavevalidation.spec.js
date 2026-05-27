import { test, expect } from '@playwright/test';

const BASE_URL = 'http://localhost/school-management-system';

test.describe('Teacher Apply Leave', () => {

    test.beforeEach(async ({ page }) => {

        await page.goto(`${BASE_URL}/login.php`);
        await page.fill('input[name="email"]', 'teacher@gmail.com');
        await page.fill('input[name="password"]', '123');

        await Promise.all([
            page.waitForURL(/.*login.php/), // Wait for the redirect to happen
            page.click('button[type="submit"]')
        ]);

        // 3. Small pause to let the server "breathe"
        await page.waitForTimeout(1000);
    });

    test('Teacher can apply for a new leave successfully', async ({ page }) => {

        console.log('\n--- Test: Apply Leave Success ---');

        await page.goto(`${BASE_URL}/teacher_panel/leaves.php`);

        // 1. Fill the form
        await page.selectOption('#leave-type', 'Casual Leave');
        await page.fill('#leave-desc', 'Family matter – applying casual leave');
        await page.fill('#start-date', '2026-02-10');
        await page.fill('#end-date', '2026-02-12');

        // 2. Capture the network request (if using AJAX) or wait for navigation
        // If teacher-leave.js uses fetch/ajax, we wait for the network to be idle
        await Promise.all([
            page.waitForResponse(resp => resp.status() === 200),
            page.click('#submit-leave-btn')
        ]);

        // 3. Verify UI Updates
        // Check if the accordion now contains the text we just submitted
        const accordion = page.locator('#leave-accordion');
        await expect(accordion).toBeVisible();
        await expect(accordion).toContainText('Casual Leave');

        // 4. Verify Form Reset
        await expect(page.locator('#leave-desc')).toBeEmpty();
    });

    test('Validation errors for empty fields', async ({ page }) => {
        await page.goto(`${BASE_URL}/teacher_panel/leaves.php`);
        
        // Click submit without filling anything
        await page.click('#submit-leave-btn');

        // Check for Bootstrap's 'was-validated' class or browser validation
        // Since your code has <div class="invalid-feedback">required!</div>
        const feedback = page.locator('.invalid-feedback').first();
        await expect(feedback).toBeVisible();
    });

});
