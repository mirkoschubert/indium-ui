/**
 * Render Helpers Tests
 *
 * Unit tests for CSS generation helper functions.
 */

import { describe, it, expect, vi } from 'vitest';
import {
  parseColorRef,
  resolveTypographyReferences,
  calculateHeadingScaling,
  resolveDefaultTypography,
  generateBreakpointVariables,
  flattenSemanticTokens,
  generatePrimitiveVariables,
  hexToRgb,
  normalizeAlpha,
} from './render-helpers.js';
import type { Primitives, PrimitiveColors, SemanticHeadingTypography } from './types.js';

// ==========================================
// TEST DATA
// ==========================================

const mockPrimitiveColors: PrimitiveColors = {
  gray: {
    50: '#f9fafb',
    500: '#6b7280',
    900: '#111827',
  },
  blue: {
    500: '#3b82f6',
    700: '#1d4ed8',
  },
};

const mockPrimitives: Primitives = {
  colors: mockPrimitiveColors,
  typography: {
    default: {
      family: {
        sans: 'system-ui, sans-serif',
        serif: 'Georgia, serif',
      },
      size: {
        sm: '0.875rem',
        base: '1rem',
        lg: '1.125rem',
      },
      weight: {
        normal: 400,
        bold: 700,
      },
      lineHeight: {
        normal: 1.5,
        tight: 1.25,
      },
      letterSpacing: {
        normal: '0',
        wide: '0.05em',
      },
    },
    heading: {
      family: {
        sans: 'system-ui, sans-serif',
      },
      size: {
        base: '2rem',
      },
      weight: {
        bold: 700,
        extrabold: 800,
      },
      lineHeight: {
        tight: 1.2,
        snug: 1.375,
      },
      letterSpacing: {
        tight: '-0.02em',
        normal: '0',
      },
    },
    mono: {
      family: {
        mono: 'Consolas, monospace',
      },
      size: {
        base: '1rem',
      },
      weight: {
        normal: 400,
      },
      lineHeight: {
        normal: 1.5,
      },
      letterSpacing: {
        normal: '0',
      },
    },
  },
  spacing: {
    0: '0',
    1: '0.25rem',
    4: '1rem',
  },
  sizing: {
    full: '100%',
    auto: 'auto',
  },
  border: {
    radius: {
      none: '0',
      sm: '0.125rem',
      base: '0.25rem',
    },
  },
  shadow: {
    sm: '0 1px 2px rgba(0,0,0,0.05)',
    base: '0 1px 3px rgba(0,0,0,0.1)',
  },
  zIndex: {
    base: 1,
    dropdown: 1000,
  },
  transition: {
    fast: '150ms',
    base: '200ms',
  },
  breakpoint: {
    tablet: '768px',
    desktop: '1024px',
  },
};

// ==========================================
// COLOR PARSING TESTS
// ==========================================

describe('hexToRgb', () => {
  it('converts hex to RGB array', () => {
    expect(hexToRgb('#ffffff')).toEqual([255, 255, 255]);
    expect(hexToRgb('#000000')).toEqual([0, 0, 0]);
    expect(hexToRgb('#3b82f6')).toEqual([59, 130, 246]);
  });

  it('handles hex without # prefix', () => {
    expect(hexToRgb('ff0000')).toEqual([255, 0, 0]);
  });
});

describe('normalizeAlpha', () => {
  it('converts percentage values to decimal', () => {
    expect(normalizeAlpha('50')).toBe(0.5);
    expect(normalizeAlpha('25')).toBe(0.25);
    expect(normalizeAlpha('5')).toBe(0.05);
  });

  it('keeps decimal values as-is', () => {
    expect(normalizeAlpha('0.5')).toBe(0.5);
    expect(normalizeAlpha('.5')).toBe(0.5);
    expect(normalizeAlpha('0.25')).toBe(0.25);
  });
});

describe('parseColorRef', () => {
  it('returns plain hex color unchanged', () => {
    expect(parseColorRef('#ffffff', mockPrimitiveColors)).toBe('#ffffff');
    expect(parseColorRef('#000000', mockPrimitiveColors)).toBe('#000000');
  });

  it('converts hex with alpha to rgba', () => {
    expect(parseColorRef('#000000/0.5', mockPrimitiveColors)).toBe('rgba(0,0,0,0.5)');
    expect(parseColorRef('#ffffff/50', mockPrimitiveColors)).toBe('rgba(255,255,255,0.5)');
    expect(parseColorRef('#3b82f6/25', mockPrimitiveColors)).toBe('rgba(59,130,246,0.25)');
  });

  it('resolves color references to hex', () => {
    expect(parseColorRef('gray.500', mockPrimitiveColors)).toBe('#6b7280');
    expect(parseColorRef('blue.700', mockPrimitiveColors)).toBe('#1d4ed8');
  });

  it('resolves color references with alpha to rgba', () => {
    expect(parseColorRef('gray.500/0.5', mockPrimitiveColors)).toBe('rgba(107,114,128,0.5)');
    expect(parseColorRef('blue.700/25', mockPrimitiveColors)).toBe('rgba(29,78,216,0.25)');
  });

  it('returns original ref and warns if color not found', () => {
    const consoleSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});
    expect(parseColorRef('red.500', mockPrimitiveColors)).toBe('red.500');
    expect(consoleSpy).toHaveBeenCalled();
    consoleSpy.mockRestore();
  });
});

// ==========================================
// TYPOGRAPHY RESOLUTION TESTS
// ==========================================

describe('resolveTypographyReferences', () => {
  it('resolves font family references', () => {
    const result = resolveTypographyReferences(
      { family: 'sans' },
      mockPrimitives,
      'default'
    );
    expect(result['font-family']).toBe('system-ui, sans-serif');
  });

  it('resolves font size references', () => {
    const result = resolveTypographyReferences(
      { size: 'base' },
      mockPrimitives,
      'default'
    );
    expect(result['font-size']).toBe('1rem');
  });

  it('resolves font weight references', () => {
    const result = resolveTypographyReferences(
      { weight: 'bold' },
      mockPrimitives,
      'default'
    );
    expect(result['font-weight']).toBe('700');
  });

  it('resolves line height references', () => {
    const result = resolveTypographyReferences(
      { lineHeight: 'tight' },
      mockPrimitives,
      'default'
    );
    expect(result['line-height']).toBe('1.25');
  });

  it('resolves letter spacing references', () => {
    const result = resolveTypographyReferences(
      { letterSpacing: 'wide' },
      mockPrimitives,
      'default'
    );
    expect(result['letter-spacing']).toBe('0.05em');
  });

  it('resolves multiple properties at once', () => {
    const result = resolveTypographyReferences(
      {
        family: 'sans',
        size: 'lg',
        weight: 'bold',
        lineHeight: 'normal',
      },
      mockPrimitives,
      'default'
    );
    expect(result).toEqual({
      'font-family': 'system-ui, sans-serif',
      'font-size': '1.125rem',
      'font-weight': '700',
      'line-height': '1.5',
    });
  });

  it('uses correct typography group (heading)', () => {
    const result = resolveTypographyReferences(
      { weight: 'extrabold', lineHeight: 'tight' },
      mockPrimitives,
      'heading'
    );
    expect(result['font-weight']).toBe('800');
    expect(result['line-height']).toBe('1.2');
  });
});

// ==========================================
// HEADING SCALING TESTS
// ==========================================

describe('calculateHeadingScaling', () => {
  it('generates h1-h6 sizes with default scaling (1.0)', () => {
    const semanticHeading: SemanticHeadingTypography = {
      size: '2rem',
      lineHeight: 1.2,
      font: {
        family: 'sans',
        weight: 'bold',
        letterSpacing: 'tight',
      },
      scaling: 1.0,
    };

    const result = calculateHeadingScaling(semanticHeading, mockPrimitives);

    expect(result['--heading-h1-size']).toBe('calc(2rem * 1 * 1)');
    expect(result['--heading-h2-size']).toBe('calc(2rem * 0.875 * 1)');
    expect(result['--heading-h3-size']).toBe('calc(2rem * 0.75 * 1)');
    expect(result['--heading-h6-size']).toBe('calc(2rem * 0.5625 * 1)');
  });

  it('applies scaling multiplier to sizes', () => {
    const semanticHeading: SemanticHeadingTypography = {
      size: '2rem',
      lineHeight: 1.2,
      scaling: 1.2,
    };

    const result = calculateHeadingScaling(semanticHeading, mockPrimitives);

    expect(result['--heading-h1-size']).toBe('calc(2rem * 1 * 1.2)');
    expect(result['--heading-h2-size']).toBe('calc(2rem * 0.875 * 1.2)');
  });

  it('applies scaling to line heights', () => {
    const semanticHeading: SemanticHeadingTypography = {
      size: '2rem',
      lineHeight: 1.2,
      scaling: 1.5,
    };

    const result = calculateHeadingScaling(semanticHeading, mockPrimitives);

    // 1.2 * 1.5 = 1.8
    expect(result['--heading-h1-line-height']).toBe('1.80');
    expect(result['--heading-h2-line-height']).toBe('1.80');
  });

  it('includes font properties from resolved references', () => {
    const semanticHeading: SemanticHeadingTypography = {
      size: '2rem',
      font: {
        family: 'sans',
        weight: 'bold',
        letterSpacing: 'tight',
      },
    };

    const result = calculateHeadingScaling(semanticHeading, mockPrimitives);

    expect(result['--heading-h1-font-family']).toBe('system-ui, sans-serif');
    expect(result['--heading-h1-font-weight']).toBe('700');
    expect(result['--heading-h1-letter-spacing']).toBe('-0.02em');
  });

  it('uses font.size reference when available', () => {
    const semanticHeading: SemanticHeadingTypography = {
      font: {
        size: 'base', // Reference to primitives.typography.heading.size.base
      },
      scaling: 1.0,
    };

    const result = calculateHeadingScaling(semanticHeading, mockPrimitives);

    expect(result['--heading-h1-size']).toBe('calc(2rem * 1 * 1)');
  });

  it('falls back to direct size value when font.size is not a reference', () => {
    const semanticHeading: SemanticHeadingTypography = {
      size: '3rem',
      scaling: 1.0,
    };

    const result = calculateHeadingScaling(semanticHeading, mockPrimitives);

    expect(result['--heading-h1-size']).toBe('calc(3rem * 1 * 1)');
  });
});

// ==========================================
// DEFAULT TYPOGRAPHY TESTS
// ==========================================

describe('resolveDefaultTypography', () => {
  it('resolves font properties to CSS variables', () => {
    const semanticDefault = {
      font: {
        family: 'sans',
        size: 'base',
        weight: 'normal',
      },
    };

    const result = resolveDefaultTypography(semanticDefault, mockPrimitives);

    expect(result['--typography-default-font-family']).toBe('system-ui, sans-serif');
    expect(result['--typography-default-font-size']).toBe('1rem');
    expect(result['--typography-default-font-weight']).toBe('400');
  });

  it('includes color property', () => {
    const semanticDefault = {
      font: { family: 'sans' },
      color: 'gray.900',
    };

    const result = resolveDefaultTypography(semanticDefault, mockPrimitives);

    expect(result['--typography-default-color']).toBe('gray.900');
  });
});

// ==========================================
// BREAKPOINT TESTS
// ==========================================

describe('generateBreakpointVariables', () => {
  it('generates CSS variables from breakpoints', () => {
    const breakpoints = {
      tablet: '768px',
      desktop: '1024px',
      wide: '1440px',
    };

    const result = generateBreakpointVariables(breakpoints);

    expect(result).toEqual({
      '--breakpoint-tablet': '768px',
      '--breakpoint-desktop': '1024px',
      '--breakpoint-wide': '1440px',
    });
  });
});

// ==========================================
// FLATTEN SEMANTIC TOKENS TESTS
// ==========================================

describe('flattenSemanticTokens', () => {
  it('flattens nested color tokens', () => {
    const semantic = {
      text: {
        primary: 'gray.900',
        secondary: 'gray.500',
      },
      background: {
        page: '#ffffff',
      },
    };

    const result = flattenSemanticTokens(semantic, mockPrimitiveColors, mockPrimitives);

    expect(result['--color-text-primary']).toBe('#111827');
    expect(result['--color-text-secondary']).toBe('#6b7280');
    expect(result['--color-background-page']).toBe('#ffffff');
  });

  it('handles alpha transparency in color refs', () => {
    const semantic = {
      overlay: '#000000/0.5',
      border: 'gray.500/50',
    };

    const result = flattenSemanticTokens(semantic, mockPrimitiveColors, mockPrimitives);

    expect(result['--color-overlay']).toBe('rgba(0,0,0,0.5)');
    expect(result['--color-border']).toBe('rgba(107,114,128,0.5)');
  });

  it('skips breakpoints object', () => {
    const semantic = {
      text: 'gray.900',
      breakpoints: {
        tablet: '768px',
      },
    };

    const result = flattenSemanticTokens(semantic, mockPrimitiveColors, mockPrimitives);

    expect(result['--color-text']).toBe('#111827');
    expect(result['--color-breakpoints-tablet']).toBeUndefined();
  });
});

// ==========================================
// PRIMITIVE VARIABLES TESTS
// ==========================================

describe('generatePrimitiveVariables', () => {
  it('generates color variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--color-gray-50']).toBe('#f9fafb');
    expect(result['--color-gray-500']).toBe('#6b7280');
    expect(result['--color-blue-700']).toBe('#1d4ed8');
  });

  it('generates typography variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--font-sans']).toBe('system-ui, sans-serif');
    expect(result['--text-base']).toBe('1rem');
    expect(result['--font-bold']).toBe('700');
    expect(result['--leading-tight']).toBe('1.25');
    expect(result['--tracking-wide']).toBe('0.05em');
  });

  it('generates spacing variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--space-0']).toBe('0');
    expect(result['--space-4']).toBe('1rem');
  });

  it('generates sizing variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--size-full']).toBe('100%');
    expect(result['--size-auto']).toBe('auto');
  });

  it('generates border radius variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--radius-sm']).toBe('0.125rem');
    expect(result['--radius-base']).toBe('0.25rem');
  });

  it('generates shadow variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--shadow-sm']).toBe('0 1px 2px rgba(0,0,0,0.05)');
    expect(result['--shadow-base']).toBe('0 1px 3px rgba(0,0,0,0.1)');
  });

  it('generates z-index variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--z-base']).toBe('1');
    expect(result['--z-dropdown']).toBe('1000');
  });

  it('generates transition variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--transition-fast']).toBe('150ms');
    expect(result['--transition-base']).toBe('200ms');
  });

  it('generates breakpoint variables', () => {
    const result = generatePrimitiveVariables(mockPrimitives);

    expect(result['--breakpoint-tablet']).toBe('768px');
    expect(result['--breakpoint-desktop']).toBe('1024px');
  });
});
