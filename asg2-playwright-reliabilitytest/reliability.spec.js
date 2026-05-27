const { test, expect } = require('@playwright/test');
const PDFDocument = require('pdfkit');
const fs = require('fs');
const path = require('path');

test('Reliability Test: Admin Edits Student`s Details (20 iterations, video for first 5, PDF report)', async ({ browser }) => {
  const iterations = 20;
  const videoIterations = 5;
  const reportFile = path.join(__dirname, 'reliability_report.pdf');

  // Initialize PDF
  const doc = new PDFDocument();
  doc.pipe(fs.createWriteStream(reportFile));
  doc.fontSize(20).text('Reliability Test Report', { align: 'center' });
  doc.moveDown();

  for (let i = 1; i <= iterations; i++) {
    doc.fontSize(14).text(`Iteration ${i}:`, { underline: true });
    console.log(`\n🔹 Iteration ${i} starting...`);

    let iterationStatus = 'Passed';

    try {
      const context = await browser.newContext({
        recordVideo: i <= videoIterations ? { dir: 'videos/' } : undefined,
      });
      const page = await context.newPage();

      // Login
      await page.goto('http://localhost/school-management-system/login.php', { waitUntil: 'networkidle' });
      await page.fill('input[type="email"]', 'admin@gmail.com');
      await page.fill('input[type="password"]', '123');
      await page.click('button[type="submit"]');

      await page.waitForURL(/dashboard\.php/, { timeout: 20000 });
      console.log('✅ Logged in, dashboard loaded');

      // Go to Student page
      await page.goto('http://localhost/school-management-system/admin_panel/student.php', { waitUntil: 'networkidle' });
      await page.getByText('Show Students', { exact: false }).click();
      console.log('✅ Show Students section opened');

      // Click Edit for first student
      await page.locator('a.edit').first().click();
      console.log('✅ Edit student clicked');

      // Multi-step form
      await page.locator('#general-info-btn').click();
      console.log('✅ Moved to Address Details');

      await page.locator('#personal-info-btn').click();
      console.log('✅ Moved to Emergency Contact Details');

      // Submit without edits
      await page.click('#guardian-form-btn');

      await expect(page.getByText('Nothing edited!', { exact: false })).toBeVisible({ timeout: 10000 });
      console.log('Iteration completed successfully');

      await context.close();
    } catch (err) {
      iterationStatus = 'Failed: ';
      console.log(`⚠️ Iteration ${i} failed: ${err.message}`);
      doc.fontSize(12).fillColor('red').text(`Error: ${err.message}`);
    }

    doc.fontSize(12).fillColor('black').text(`Status: ${iterationStatus}`);
    doc.moveDown();
  }

  doc.fontSize(16).text(`All ${iterations} iterations completed.`, { align: 'center' });
  doc.end();

  console.log(`\n PDF report generated at: ${reportFile}`);
});
