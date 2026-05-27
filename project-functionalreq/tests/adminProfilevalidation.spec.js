const { test, expect } = require('@playwright/test');

const BASE_URL = 'http://localhost/school-management-system';

test.describe('Admin Settings Flow', () => {

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

    test('Edit profile with valid details', async ({ page }) => {
        console.log('\n--- Test: Edit Profile Success ---');

        await page.goto('http://localhost/school-management-system/admin_panel/settings.php');

        console.log('Opening Edit Profile modal...');
        await page.click('#showEditDialogBtn');
        await expect(page.locator('#edit-profile-model')).toBeVisible();

        console.log('Filling edit profile form...');
        await page.fill('#eidtFname', 'Admin');
        await page.fill('#editLname', 'Nana');
        await page.fill('#editEmail', `admin@gmail.com`);
        await page.fill('#editDOB', '2005-08-11');
        await page.selectOption('#editGender', { label: 'Female' });
        await page.fill('#editPhone', '0123456789');
        await page.fill('#editAddress', '123 Jalan Kebun, Selangor');

        console.log('Clicking Save Changes to trigger confirmation...');
        await page.click('#saveChangesBtn');

        // --- NEW STEPS TO HANDLE CONFIRMATION MODAL ---
        console.log('Confirming changes in the secondary modal...');
        // Ensure the confirmation modal appears
        await expect(page.locator('#edit-confirmation-modal')).toBeVisible();
        // Click the "Yes" button in the confirmation modal
        await page.click('#EditProfileBtn');
        // ----------------------------------------------

        console.log('Waiting for success notification...');
        // It is better to wait for the specific locator than using a hard-coded timeout
        await expect(page.locator('#liveToast').first()).toBeVisible();

        console.log('✔ Profile updated successfully');
    });


    //edit profile with empty fields
    test('Edit profile with empty required fields', async ({ page }) => {
        console.log('\n--- Test: Edit Profile Validation ---');

        await page.goto('http://localhost/school-management-system/admin_panel/settings.php');

        await page.click('#showEditDialogBtn');
        await expect(page.locator('#edit-profile-model')).toBeVisible();

        console.log('Clearing required fields...');
        await page.fill('#eidtFname', '');
        await page.fill('#editLname', '');
        await page.fill('#editEmail', '');
        await page.fill('#editAddress', '');

        console.log('Attempting to save...');
        await page.click('#saveChangesBtn');
        await page.waitForTimeout(1000);

        const modalStillOpen = await page.locator('#edit-profile-model').isVisible();
        expect(modalStillOpen).toBe(true);

        console.log('✔ Validation prevented submission');
    });

    //edit profile with invalid phone number
    test('Edit profile with invalid phone number', async ({ page }) => {
        console.log('\n--- Test: Invalid Phone Number ---');

        await page.goto('http://localhost/school-management-system/admin_panel/settings.php');
        await page.click('#showEditDialogBtn');

        await page.fill('#eidtFname', 'Admin');
        await page.fill('#editLname', 'Nana');
        await page.fill('#editEmail', 'adminana@gmail.com');
        await page.fill('#editDOB', '2005-08-11');
        await page.selectOption('#editGender', { label: 'Female' });
        await page.fill('#editPhone', '012345678901234');
        await page.fill('#editAddress', '123 Jalan Kebun, Selangor');

        await page.click('#saveChangesBtn');
        await page.waitForTimeout(1000);

        const errorVisible = await page.locator('#phone-mdg').isVisible();
        expect(errorVisible).toBe(true);

        console.log('✔ Phone number validation triggered correctly');
    });

});