const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost/school-management-system';

test.describe('Admin Password Flow', () => {

    test.beforeEach(async ({ page }) => {
        // Login as Admin before each test
        await page.goto(`${BASE_URL}/login.php`);
        await page.fill('input[name="email"]', 'admin@gmail.com');
        await page.fill('input[name="password"]', '123');

        await Promise.all([
            page.waitForURL(/.*login.php/), // Wait for the redirect to happen
            page.click('button[type="submit"]')
        ]);

        // 3. Small pause to let the server "breathe"
        await page.waitForTimeout(1000);

    });

    test('Change password successfully', async ({ page }) => {
        console.log('\n--- Test: Change Password Success ---');

        await page.goto('http://localhost/school-management-system/admin_panel/settings.php');

        console.log('Opening Change Password modal...');
        await page.click('#passwordDialogBtn');
        await expect(page.locator('#change-password')).toBeVisible();

        console.log('Filling password fields...');
        await page.fill('#currentPass', '123');
        await page.fill('#newPass', '1234');
        await page.fill('#confirmPass', '1234');

        console.log('Saving new password...');
        await page.click('#savePasswordBtn');
        await page.waitForTimeout(2000);

        await expect(page.locator('#liveToast').first()).toBeVisible();
        console.log('✔ Password changed successfully');

        await page.click('#passwordDialogBtn');
        await page.fill('#currentPass', '1234');
        await page.fill('#newPass', '123');
        await page.fill('#confirmPass', '123');
        await page.click('#savePasswordBtn');
        console.log('✔ Password changed and reset to 123');
    });

    test('Change password with mismatched confirmation', async ({ page }) => {
        console.log('\n--- Test: Password Mismatch ---');

        await page.goto('http://localhost/school-management-system/admin_panel/settings.php');
        await page.click('#passwordDialogBtn');

        await page.fill('#currentPass', '123');
        await page.fill('#newPass', '12345');
        await page.fill('#confirmPass', '1234');

        await page.click('#savePasswordBtn');
        await page.waitForTimeout(1000);

        const mismatchError = await page.locator('.notSamePasswords').isVisible();
        expect(mismatchError).toBe(true);

        console.log('✔ Password mismatch validation triggered');
    });

    test('Verify old password is rejected after change', async ({ page }) => {
        const email = 'admin@gmail.com';
        const oldPass = '123';
        const newerPass = '1234';

        // 1. Navigate to Settings
        await page.goto(`${BASE_URL}/admin_panel/settings.php`);

        // 2. Change password 123 -> 1234
        await page.click('#passwordDialogBtn');
        await page.fill('#currentPass', oldPass);
        await page.fill('#newPass', newerPass);
        await page.fill('#confirmPass', newerPass);
        await page.click('#savePasswordBtn');

        // Wait for change to confirm in DB
        await expect(page.locator('#liveToast').first()).toBeVisible();
        console.log('✔ Password changed successfully');

        // 3. Logout flow
        // A. Open menu
        await page.locator('.bx-dots-vertical-rounded, .three-dots-icon').first().click();

        // B. Click the Logout LINK (The one that triggers the modal)
        const logoutLink = page.locator('a.logout');
        await logoutLink.waitFor({ state: 'visible' });
        await logoutLink.click();

        // C. Click the red "Logout" button inside the MODAL
        // We target the specific button that calls the logout() function
        const confirmBtn = page.locator('button[onclick="logout()"]');
        await confirmBtn.waitFor({ state: 'visible' });
        await confirmBtn.click();

        await page.waitForURL(/.*login.php/);

        // 4. Test Old Password (Attempting to log in with '123')
        await page.fill('input[name="email"]', email);
        await page.fill('input[name="password"]', oldPass);
        await page.click('button[type="submit"]');

        // 5. Assert Failure (This is the goal of the test)
        // Using a more generic locator in case the class name is slightly different
        const errorAlert = page.locator('.alert, .error, [class*="danger"]').first();
        await expect(errorAlert).toBeVisible();
        console.log('✔ Success: Old password was rejected.');

        // 6. Cleanup (Log in with 1234 and change it back to 123)
        await page.fill('input[name="password"]', newerPass);
        await page.click('button[type="submit"]');

        await page.waitForURL(/.*dashboard.php/);

        await page.goto(`${BASE_URL}/admin_panel/settings.php`);
        await page.click('#passwordDialogBtn');
        await page.fill('#currentPass', newerPass);
        await page.fill('#newPass', oldPass);
        await page.fill('#confirmPass', oldPass);
        await page.click('#savePasswordBtn');
        await expect(page.locator('#liveToast').first()).toBeVisible();
        console.log('✔ Cleanup: Password reset to 123.');
    });

});