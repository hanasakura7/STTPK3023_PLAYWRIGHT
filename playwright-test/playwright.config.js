// playwright.config.js
const { defineConfig } = require('@playwright/test');

module.exports = defineConfig({
  timeout: 60000,
  use: {
    headless: false,
    slowMo: 300,              // 👈 THIS is where slow-mo goes
    viewport: { width: 1280, height: 720 },
    actionTimeout: 30000,
  },
});