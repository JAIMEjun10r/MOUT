import { defineConfig } from 'cypress';

const frontendUrl = process.env.CYPRESS_BASE_URL ?? 'https://front.serverest.dev';
const apiUrl = process.env.CYPRESS_API_URL ?? 'https://serverest.dev';

export default defineConfig({
  expose: {
    apiUrl,
  },
  e2e: {
    baseUrl: frontendUrl,
    specPattern: 'cypress/e2e/**/*.cy.js',
    supportFile: 'cypress/support/e2e.js',
  },
  defaultCommandTimeout: 10_000,
  requestTimeout: 10_000,
  responseTimeout: 20_000,
  retries: {
    runMode: 1,
    openMode: 0,
  },
  screenshotsFolder: 'artifacts/screenshots',
  videosFolder: 'artifacts/videos',
  downloadsFolder: 'artifacts/downloads',
  video: true,
});
