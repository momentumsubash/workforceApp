const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.js',
    specPattern: 'cypress/e2e/**/*.spec.cy.js',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: true,
    screenshotOnRunFailure: true,
    screenshotsFolder: 'reports/screenshots',
    videosFolder: 'reports/videos',
    defaultCommandTimeout: 10000,
    requestTimeout: 10000,
    responseTimeout: 10000,
    reporter: 'cypress-mochawesome-reporter',
    reporterOptions: {
      reportDir: 'reports/html',
      reportFilename: 'workforcepro-test-report',
      html: true,
      json: true,
      overwrite: true,
      charts: true,
      embeddedScreenshots: true,
      inlineAssets: true,
      saveAllAttempts: false,
    },
    setupNodeEvents(on, config) {
      require('cypress-mochawesome-reporter/plugin')(on);
      return config;
    },
  },
});
