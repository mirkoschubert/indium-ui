import { defineConfig } from '@playwright/test';

/**
 * Playwright configuration for Storybook E2E tests
 *
 * This config starts Storybook on port 6006 before running tests.
 */
export default defineConfig({
	webServer: {
		command: 'pnpm storybook --no-open',
		port: 6006,
		timeout: 120000, // 2 minutes for Storybook to build
		reuseExistingServer: !process.env.CI,
	},
	testDir: 'e2e',
	testMatch: '**/phase4-storybook.spec.ts',
	use: {
		baseURL: 'http://localhost:6006',
	},
});
