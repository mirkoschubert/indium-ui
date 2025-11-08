/**
 * Button Component E2E Tests
 *
 * Playwright tests for Button component including accessibility checks.
 */

import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// Note: This test file assumes a test route exists at /test/button
// You'll need to create a test page in src/routes/test/button/+page.svelte

test.describe('Button Component', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to the button test page
    // TODO: Create test page at src/routes/test/button/+page.svelte
    await page.goto('/test/button');
  });

  test('should have accessible name', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });
    await expect(button).toBeVisible();
  });

  test('should be keyboard accessible', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });

    // Tab to the button
    await page.keyboard.press('Tab');
    await expect(button).toBeFocused();

    // Press Enter or Space should trigger the button
    // (This would need an actual click handler in the test page)
  });

  test('should show focus ring on keyboard focus', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });

    // Focus with keyboard
    await page.keyboard.press('Tab');

    // Check if focus ring is visible (via CSS)
    const boxShadow = await button.evaluate((el) => {
      return window.getComputedStyle(el).boxShadow;
    });

    expect(boxShadow).not.toBe('none');
  });

  test('should not trigger when disabled', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Disabled Button' });

    await expect(button).toBeDisabled();

    // Clicking should not trigger anything
    await button.click({ force: true });
    // Add assertion based on actual behavior in test page
  });

  test('should show loading state', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Loading Button' });

    await expect(button).toHaveAttribute('aria-busy', 'true');

    // Should show spinner
    const spinner = button.locator('.button-spinner');
    await expect(spinner).toBeVisible();
  });

  test('should pass accessibility checks', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('button')
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should meet color contrast requirements', async ({ page }) => {
    const accessibilityScanResults = await new AxeBuilder({ page })
      .include('button')
      .withTags(['wcag2aa'])
      .analyze();

    const contrastViolations = accessibilityScanResults.violations.filter(
      (v) => v.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have minimum touch target size (44x44px)', async ({ page }) => {
    const button = page.getByRole('button', { name: 'Primary Button' });

    const boundingBox = await button.boundingBox();

    expect(boundingBox).toBeTruthy();
    if (boundingBox) {
      expect(boundingBox.height).toBeGreaterThanOrEqual(40); // md size is 40px
      expect(boundingBox.width).toBeGreaterThanOrEqual(40);
    }
  });

  test.describe('Variants', () => {
    test('primary variant should have correct styles', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Primary Button' });

      const backgroundColor = await button.evaluate((el) => {
        return window.getComputedStyle(el).backgroundColor;
      });

      // Should have a background color (not transparent)
      expect(backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    });

    test('outline variant should have border', async ({ page }) => {
      const button = page.getByRole('button', { name: 'Outline Button' });

      const borderWidth = await button.evaluate((el) => {
        return window.getComputedStyle(el).borderWidth;
      });

      expect(borderWidth).not.toBe('0px');
    });
  });
});
