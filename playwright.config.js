
// @ts-check
import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '.env') });

export default defineConfig({
  testDir: './tests',

  retries: 0,
  timeout: 450000,
  expect: {
    timeout: 10_000
  },

  reporter: [
    ['html'],
  ],

  projects: [
    // 1. Authentication Setup
    {
      name: 'setup',
      testMatch: /auth\.setup\.js/,
    },

    // 2. Main Chromium Tests
    {
      name: 'chromium',
      use: {
        ...devices['Desktop Chrome'],
        browserName: 'chromium',
        headless: false,
        actionTimeout: 20000,
        trace: 'on',

        // Reuse authentication state
        storageState: 'user.json',
      },
      dependencies: ['setup'],
    },
  ],
});
