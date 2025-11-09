import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Button Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the preview build with Button component
		await page.goto('/');
	});

	test('should not have accessibility violations', async ({ page }) => {
		// Run axe accessibility tests
		const accessibilityScanResults = await new AxeBuilder({ page })
			.analyze();

		expect(accessibilityScanResults.violations).toEqual([]);
	});

	test('should be keyboard navigable', async ({ page }) => {
		// Find first button on page
		const button = page.locator('button').first();

		// Tab to button
		await page.keyboard.press('Tab');

		// Verify button is focused
		await expect(button).toBeFocused();

		// Press Enter
		await page.keyboard.press('Enter');

		// Verify button was clicked (you'll need to adjust based on your test page)
	});

	test('should handle disabled state', async ({ page }) => {
		const disabledButton = page.locator('button[disabled]').first();

		if (await disabledButton.count() > 0) {
			// Verify disabled button is not clickable
			await expect(disabledButton).toBeDisabled();

			// Verify disabled button has no accessibility violations
			const accessibilityScanResults = await new AxeBuilder({ page })
				.include('button[disabled]')
				.analyze();

			expect(accessibilityScanResults.violations).toEqual([]);
		}
	});

	test('should have proper focus-visible styles', async ({ page }) => {
		const button = page.locator('button').first();

		// Focus button with keyboard
		await page.keyboard.press('Tab');

		// Check that focus-visible styles are applied
		const outlineWidth = await button.evaluate((el) => {
			return window.getComputedStyle(el).outlineWidth;
		});

		// Should have visible outline when focused via keyboard
		expect(outlineWidth).not.toBe('0px');
	});

	test('should support reduced motion preference', async ({ page, context }) => {
		// Set reduced motion preference
		await context.emulateMedia({ reducedMotion: 'reduce' });

		const button = page.locator('button').first();

		// Check that transitions are disabled or instant
		const transitionDuration = await button.evaluate((el) => {
			return window.getComputedStyle(el).transitionDuration;
		});

		// Should be 0s or 0.01s for reduced motion
		expect(['0s', '0.01s']).toContain(transitionDuration);
	});

	test('should handle loading state with proper aria-busy', async ({ page }) => {
		const loadingButton = page.locator('button[aria-busy="true"]').first();

		if (await loadingButton.count() > 0) {
			// Verify loading button has aria-busy attribute
			await expect(loadingButton).toHaveAttribute('aria-busy', 'true');

			// Verify loading button is disabled
			await expect(loadingButton).toBeDisabled();
		}
	});

	test('should have appropriate color contrast', async ({ page }) => {
		// Run axe with WCAG AA contrast rules
		const accessibilityScanResults = await new AxeBuilder({ page })
			.withTags(['wcag2aa', 'wcag21aa'])
			.analyze();

		const contrastViolations = accessibilityScanResults.violations.filter(
			(violation) => violation.id === 'color-contrast'
		);

		expect(contrastViolations).toEqual([]);
	});
});
