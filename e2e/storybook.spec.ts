import { test, expect } from '@playwright/test';

/**
 * Phase 4 Integration Test: Storybook CSS Generation
 *
 * Tests that the PostCSS plugin correctly generates CSS variables
 * in the Storybook environment and that theme switching works.
 */

test.describe('Phase 4: Storybook Integration', () => {
  test.beforeEach(async ({ page }) => {
    // Navigate to Button story in Storybook
    await page.goto('http://localhost:6006/?path=/story/components-atoms-button--primary');

    // Wait for Storybook to fully load
    await page.waitForSelector('#storybook-preview-iframe');
  });

  test('should generate CSS variables in Storybook', async ({ page }) => {
    // Get the iframe content
    const frame = page.frameLocator('#storybook-preview-iframe');

    // Check that CSS variables are defined on :root in the iframe
    const rootStyles = await frame.locator('body').evaluate((el) => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        // Primitive variables
        colorBlue500: styles.getPropertyValue('--color-blue-500').trim(),
        spaceBase: styles.getPropertyValue('--space-base').trim(),
        fontFamilySans: styles.getPropertyValue('--font-family-sans').trim(),

        // Semantic variables (light theme defaults)
        colorTextPrimary: styles.getPropertyValue('--color-text-primary').trim(),
        colorBackgroundPage: styles.getPropertyValue('--color-background-page').trim(),
        colorActionPrimary: styles.getPropertyValue('--color-action-primary-normal').trim(),
      };
    });

    // Verify primitive variables exist
    expect(rootStyles.colorBlue500).toBeTruthy();
    expect(rootStyles.colorBlue500).toMatch(/#[0-9a-f]{6}/i); // Hex color format
    expect(rootStyles.spaceBase).toBeTruthy();
    expect(rootStyles.fontFamilySans).toBeTruthy();

    // Verify semantic variables exist
    expect(rootStyles.colorTextPrimary).toBeTruthy();
    expect(rootStyles.colorBackgroundPage).toBeTruthy();
    expect(rootStyles.colorActionPrimary).toBeTruthy();
  });

  test('should render Button component with correct styles', async ({ page }) => {
    const frame = page.frameLocator('#storybook-preview-iframe');

    // Wait for the story to render - look for the button inside the story container
    await page.waitForTimeout(2000); // Give Storybook time to render

    const button = frame.locator('.sb-show-main button.button').first();

    // Wait for button to be visible
    await expect(button).toBeVisible({ timeout: 10000 });

    // Check that button has the correct classes
    const buttonClasses = await button.getAttribute('class');
    expect(buttonClasses).toContain('button');
    expect(buttonClasses).toContain('button-primary');

    // Check computed styles use CSS variables
    const buttonStyles = await button.evaluate((el) => {
      const styles = getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        color: styles.color,
        padding: styles.padding,
        borderRadius: styles.borderRadius,
      };
    });

    // Verify button has styles applied (not default browser styles)
    expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
    expect(buttonStyles.padding).not.toBe('0px');
    expect(buttonStyles.borderRadius).not.toBe('0px');
  });

  test('should support dark theme switching', async ({ page }) => {
    const frame = page.frameLocator('#storybook-preview-iframe');

    // Get light theme colors
    const lightThemeColors = await frame.locator('body').evaluate((el) => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        textPrimary: styles.getPropertyValue('--color-text-primary').trim(),
        backgroundPage: styles.getPropertyValue('--color-background-page').trim(),
      };
    });

    // Switch to dark theme by setting data-theme attribute
    await frame.locator('body').evaluate((el) => {
      document.documentElement.setAttribute('data-theme', 'dark');
    });

    // Wait a bit for CSS to update
    await page.waitForTimeout(100);

    // Get dark theme colors
    const darkThemeColors = await frame.locator('body').evaluate((el) => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        textPrimary: styles.getPropertyValue('--color-text-primary').trim(),
        backgroundPage: styles.getPropertyValue('--color-background-page').trim(),
        colorScheme: styles.getPropertyValue('color-scheme').trim(),
      };
    });

    // Verify that theme colors changed
    expect(darkThemeColors.textPrimary).not.toBe(lightThemeColors.textPrimary);
    expect(darkThemeColors.backgroundPage).not.toBe(lightThemeColors.backgroundPage);

    // Verify color-scheme is set to dark
    expect(darkThemeColors.colorScheme).toBe('dark');
  });

  test('should have all semantic color tokens defined', async ({ page }) => {
    const frame = page.frameLocator('#storybook-preview-iframe');

    const semanticTokens = await frame.locator('body').evaluate((el) => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        // Text colors
        textPrimary: styles.getPropertyValue('--color-text-primary').trim(),
        textSecondary: styles.getPropertyValue('--color-text-secondary').trim(),
        textTertiary: styles.getPropertyValue('--color-text-tertiary').trim(),

        // Background colors
        backgroundPage: styles.getPropertyValue('--color-background-page').trim(),
        backgroundSurface: styles.getPropertyValue('--color-background-surface').trim(),
        backgroundElevated: styles.getPropertyValue('--color-background-elevated').trim(),

        // Action colors
        actionPrimary: styles.getPropertyValue('--color-action-primary-normal').trim(),
        actionPrimaryHover: styles.getPropertyValue('--color-action-primary-hover').trim(),

        // Border colors
        borderNormal: styles.getPropertyValue('--color-border-normal').trim(),
      };
    });

    // Verify all semantic tokens are defined
    Object.entries(semanticTokens).forEach(([key, value]) => {
      expect(value, `Token --color-${key} should be defined`).toBeTruthy();
      expect(value, `Token --color-${key} should not be empty`).not.toBe('');
    });
  });

  test('should have typography tokens defined', async ({ page }) => {
    const frame = page.frameLocator('#storybook-preview-iframe');

    const typographyTokens = await frame.locator('body').evaluate((el) => {
      const root = document.documentElement;
      const styles = getComputedStyle(root);
      return {
        // Default typography
        fontSizeBase: styles.getPropertyValue('--font-size-base').trim(),
        lineHeightBase: styles.getPropertyValue('--line-height-base').trim(),

        // Heading typography
        h1FontSize: styles.getPropertyValue('--typography-h1-fontSize').trim(),
        h1LineHeight: styles.getPropertyValue('--typography-h1-lineHeight').trim(),
        h2FontSize: styles.getPropertyValue('--typography-h2-fontSize').trim(),
      };
    });

    // Verify typography tokens are defined
    expect(typographyTokens.fontSizeBase).toBeTruthy();
    expect(typographyTokens.lineHeightBase).toBeTruthy();
    expect(typographyTokens.h1FontSize).toBeTruthy();
    expect(typographyTokens.h1LineHeight).toBeTruthy();
    expect(typographyTokens.h2FontSize).toBeTruthy();
  });

  test('should have Storybook-specific styles applied', async ({ page }) => {
    // Check Storybook docs styles (outside iframe)
    const docsPanel = page.locator('.sbdocs').first();

    if (await docsPanel.isVisible()) {
      const docsStyles = await docsPanel.evaluate((el) => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
        };
      });

      // Verify docs panel has background and text colors applied
      expect(docsStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(docsStyles.color).toBeTruthy();
    }
  });
});
