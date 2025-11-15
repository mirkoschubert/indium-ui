import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

test.describe('Button Component', () => {
	test.beforeEach(async ({ page }) => {
		// Navigate to the preview build with Button component
		await page.goto('/');
	});

	test('should not have accessibility violations', async ({ page }) => {
		// Run axe accessibility tests
		const accessibilityScanResults = await new AxeBuilder({ page }).analyze();

		// Filter out known test setup issues (not button-related)
		const knownSetupIssues = ['region']; // Page content in landmarks (now fixed with <main>)
		const buttonViolations = accessibilityScanResults.violations.filter(
			(v) => !knownSetupIssues.includes(v.id)
		);

		// Log violations for debugging
		if (buttonViolations.length > 0) {
			console.log('Accessibility violations found:');
			buttonViolations.forEach((v) => {
				console.log(`  - ${v.id}: ${v.help}`);
			});
		}

		expect(buttonViolations).toEqual([]);
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
		await expect(button).toBeFocused();

		// Check for focus indicator (outline OR box-shadow)
		const styles = await button.evaluate((el) => {
			const computed = window.getComputedStyle(el);
			return {
				outlineWidth: computed.outlineWidth,
				outlineStyle: computed.outlineStyle,
				boxShadow: computed.boxShadow
			};
		});

		// Should have EITHER visible outline OR box-shadow (for focus ring)
		const hasOutline = styles.outlineWidth !== '0px' && styles.outlineStyle !== 'none';
		const hasFocusRing = styles.boxShadow !== 'none';

		expect(hasOutline || hasFocusRing).toBeTruthy();
	});

	test('should support reduced motion preference', async ({ page }) => {
		// Set reduced motion preference
		await page.emulateMedia({ reducedMotion: 'reduce' });

		const button = page.locator('button').first();

		// Check that transitions are disabled or instant
		const transitionDuration = await button.evaluate((el) => {
			return window.getComputedStyle(el).transitionDuration;
		});

		// Should be very short duration for reduced motion (0s, 0.01s, or scientific notation like 1e-05s)
		expect(transitionDuration).toMatch(/^(0s|0\.01s|.*e-.*s)$/);
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

	test('should have appropriate color contrast in light mode', async ({ page }) => {
		// Run axe test specifically for color contrast
		const contrastResults = await new AxeBuilder({ page })
			.include('button')
			.withRules(['color-contrast'])
			.analyze();

		const contrastViolations = contrastResults.violations;

		// Log violations for debugging
		if (contrastViolations.length > 0) {
			console.log('Color contrast violations (light mode):');
			contrastViolations.forEach((v) => {
				v.nodes.forEach((node) => {
					console.log(`  - ${node.html}`);
					console.log(`    ${node.failureSummary}`);
				});
			});
		}

		expect(contrastViolations).toEqual([]);
	});

	test('should have appropriate color contrast in dark mode', async ({ page }) => {
		// Enable dark mode by setting data-theme attribute
		await page.evaluate(() => {
			document.documentElement.setAttribute('data-theme', 'dark');
		});

		// Wait for styles to apply
		await page.waitForTimeout(100);

		// Run axe test specifically for color contrast
		const contrastResults = await new AxeBuilder({ page })
			.include('button')
			.withRules(['color-contrast'])
			.analyze();

		const contrastViolations = contrastResults.violations;

		// Log violations for debugging
		if (contrastViolations.length > 0) {
			console.log('Color contrast violations (dark mode):');
			contrastViolations.forEach((v) => {
				v.nodes.forEach((node) => {
					console.log(`  - ${node.html}`);
					console.log(`    ${node.failureSummary}`);
				});
			});
		}

		expect(contrastViolations).toEqual([]);
	});
});
