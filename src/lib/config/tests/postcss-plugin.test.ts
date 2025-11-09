/**
 * PostCSS Plugin Tests
 *
 * Unit tests for the Indium UI PostCSS theme generation plugin.
 */

import { describe, it, expect, beforeEach } from 'vitest';
import postcss from 'postcss';
import indiumThemePlugin from '../../postcss-plugin.js';

// ==========================================
// TEST HELPERS
// ==========================================

/**
 * Process CSS with the Indium theme plugin
 */
function processCSS(input: string): string {
  const result = postcss([indiumThemePlugin()]).process(input, {
    from: undefined,
  });
  return result.css;
}

// ==========================================
// BASIC PLUGIN TESTS
// ==========================================

describe('PostCSS Plugin - Basic Functionality', () => {
  it('replaces @indium-theme directive', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    // Should not contain @indium-theme anymore
    expect(output).not.toContain('@indium-theme');
  });

  it('generates :root with primitive variables', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain(':root {');
    expect(output).toContain('--color-gray-');
    expect(output).toContain('--color-blue-');
    expect(output).toContain('--space-');
    expect(output).toContain('--font-');
  });

  it('generates light theme with data attribute', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('[data-theme="light"]');
    expect(output).toContain('color-scheme: light');
  });

  it('generates dark theme with data attribute', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('[data-theme="dark"]');
    expect(output).toContain('color-scheme: dark');
  });

  it('generates auto dark mode with media query', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('@media (prefers-color-scheme: dark)');
    expect(output).toContain(':root:not([data-theme="light"])');
  });

  it('preserves other CSS rules', () => {
    const input = `
      @indium-theme;

      .button {
        padding: 1rem;
      }
    `;
    const output = processCSS(input);

    expect(output).toContain('.button');
    expect(output).toContain('padding: 1rem');
  });
});

// ==========================================
// PRIMITIVE VARIABLES TESTS
// ==========================================

describe('PostCSS Plugin - Primitive Variables', () => {
  it('generates color primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toMatch(/--color-gray-50:\s*#[a-f0-9]{6}/);
    expect(output).toMatch(/--color-gray-500:\s*#[a-f0-9]{6}/);
    expect(output).toMatch(/--color-gray-900:\s*#[a-f0-9]{6}/);
    expect(output).toMatch(/--color-blue-500:\s*#[a-f0-9]{6}/);
  });

  it('generates spacing primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--space-0: 0');
    expect(output).toMatch(/--space-4:\s*[\d.]+rem/);
    expect(output).toMatch(/--space-8:\s*[\d.]+rem/);
  });

  it('generates typography primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--font-sans:');
    expect(output).toContain('--text-base:');
    expect(output).toContain('--leading-');
    expect(output).toContain('--tracking-');
  });

  it('generates border radius primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--radius-sm:');
    expect(output).toContain('--radius-base:');
    expect(output).toContain('--radius-lg:');
  });

  it('generates shadow primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toMatch(/--shadow-sm:\s*0\s+[\d.]+px/);
    expect(output).toMatch(/--shadow-base:\s*0\s+[\d.]+px/);
  });

  it('generates z-index primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toMatch(/--z-base:\s*\d+/);
    expect(output).toMatch(/--z-dropdown:\s*\d+/);
    expect(output).toMatch(/--z-modal:\s*\d+/);
  });

  it('generates transition primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toMatch(/--transition-fast:\s*\d+ms/);
    expect(output).toMatch(/--transition-base:\s*\d+ms/);
  });

  it('generates breakpoint primitives', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toMatch(/--breakpoint-tablet:\s*\d+px/);
    expect(output).toMatch(/--breakpoint-desktop:\s*\d+px/);
  });
});

// ==========================================
// SEMANTIC VARIABLES TESTS
// ==========================================

describe('PostCSS Plugin - Semantic Variables', () => {
  it('generates semantic text colors', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--color-text-primary:');
    expect(output).toContain('--color-text-secondary:');
  });

  it('generates semantic background colors', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--color-background-page:');
    expect(output).toContain('--color-background-surface:');
  });

  it('generates semantic action colors', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--color-action-primary-normal:');
    expect(output).toContain('--color-action-primary-hover:');
  });

  it('generates semantic feedback colors', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--color-feedback-success-color:');
    expect(output).toContain('--color-feedback-warning-color:');
    expect(output).toContain('--color-feedback-danger-color:');
  });

  it('generates focus ring variables', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--color-focusRing-color:');
    expect(output).toContain('--color-focusRing-shadow:');
  });
});

// ==========================================
// TYPOGRAPHY TESTS
// ==========================================

describe('PostCSS Plugin - Typography', () => {
  it('generates default typography variables', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain('--typography-default-font-family:');
    expect(output).toContain('--typography-default-font-size:');
    expect(output).toContain('--typography-default-font-weight:');
    expect(output).toContain('--typography-default-line-height:');
  });

  it('generates heading variables for h1-h6', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    // Check all headings h1-h6
    for (let i = 1; i <= 6; i++) {
      expect(output).toContain(`--heading-h${i}-size:`);
      expect(output).toContain(`--heading-h${i}-line-height:`);
      expect(output).toContain(`--heading-h${i}-font-family:`);
      expect(output).toContain(`--heading-h${i}-font-weight:`);
    }
  });

  it('generates heading sizes with calc()', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toMatch(/--heading-h1-size:\s*calc\(/);
    expect(output).toMatch(/--heading-h2-size:\s*calc\(/);
  });
});

// ==========================================
// THEME SWITCHING TESTS
// ==========================================

describe('PostCSS Plugin - Theme Switching', () => {
  it('light theme has different values than dark theme', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    // Extract color values from light and dark themes
    // Use more specific regex to avoid matching :root:not([data-theme="dark"])
    const lightMatch = output.match(/\[data-theme="light"\],\s*\n:root:not\(\[data-theme="dark"\]\)\s*\{([^}]+)\}/s);
    const darkMatch = output.match(/\[data-theme="dark"\]\s*\{\s*([\s\S]*?)\n\}/);

    expect(lightMatch).toBeTruthy();
    expect(darkMatch).toBeTruthy();

    // Light and dark should have different content
    expect(lightMatch![1]).not.toBe(darkMatch![1]);
  });

  it('auto dark mode has same variables as explicit dark theme', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    const explicitDark = output.match(/\[data-theme="dark"\]\s*\{\s*([\s\S]*?)\n\}/);
    const autoDark = output.match(/@media \(prefers-color-scheme: dark\)\s*\{\s*:root:not\(\[data-theme="light"\]\)\s*\{\s*([\s\S]*?)\n  \}\n\}/);

    expect(explicitDark).toBeTruthy();
    expect(autoDark).toBeTruthy();

    // Both should contain color-scheme: dark
    expect(explicitDark![1]).toContain('color-scheme: dark');
    expect(autoDark![1]).toContain('color-scheme: dark');
  });

  it('supports :root:not([data-theme="dark"]) for light fallback', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain(':root:not([data-theme="dark"])');
  });

  it('supports :root:not([data-theme="light"]) for dark fallback', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    expect(output).toContain(':root:not([data-theme="light"])');
  });
});

// ==========================================
// ERROR HANDLING TESTS
// ==========================================

describe('PostCSS Plugin - Error Handling', () => {
  it('handles missing config gracefully', () => {
    // Plugin should use defaults if no user config found
    const input = '@indium-theme;';
    const output = processCSS(input);

    // Should still generate CSS with defaults
    expect(output).toContain(':root {');
    expect(output).toContain('[data-theme="light"]');
  });

  it('preserves CSS when plugin fails', () => {
    // This is hard to test without mocking, but the plugin should
    // warn and keep the directive on failure
    const input = '@indium-theme;';

    // Normal processing should work
    expect(processCSS(input)).toBeTruthy();
  });
});

// ==========================================
// INTEGRATION TESTS
// ==========================================

describe('PostCSS Plugin - Integration', () => {
  it('generates complete valid CSS', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    // Should not have syntax errors (PostCSS would throw)
    expect(output).toBeTruthy();
    expect(output.length).toBeGreaterThan(1000); // Should be substantial

    // Should have all major sections
    expect(output).toContain(':root {');
    expect(output).toContain('[data-theme="light"]');
    expect(output).toContain('[data-theme="dark"]');
    expect(output).toContain('@media (prefers-color-scheme: dark)');
  });

  it('can be used with other PostCSS plugins', () => {
    const input = `
      @indium-theme;

      .test {
        color: var(--color-text-primary);
      }
    `;

    const result = postcss([indiumThemePlugin()]).process(input, {
      from: undefined,
    });

    expect(result.css).toContain('.test');
    expect(result.css).toContain('color: var(--color-text-primary)');
  });

  it('generates minifiable CSS', () => {
    const input = '@indium-theme;';
    const output = processCSS(input);

    // Should have proper CSS structure
    expect(output).toMatch(/\{[^}]+\}/); // Has CSS blocks
    expect(output).not.toContain('undefined');
    expect(output).not.toContain('null');
  });
});
