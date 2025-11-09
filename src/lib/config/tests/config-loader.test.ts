/**
 * Config Loader Tests
 *
 * Unit tests for configuration loading and deep merge functionality.
 */

import { describe, it, expect, vi } from 'vitest';
import { deepMerge, defineConfig, validateConfig } from '../config-loader.js';
import type { IndiumConfig } from '../types.js';

// ==========================================
// DEEP MERGE TESTS
// ==========================================

describe('deepMerge', () => {
  it('merges simple flat objects', () => {
    const target = { a: 1, b: 2 };
    const source = { b: 3, c: 4 };

    const result = deepMerge(target, source);

    expect(result).toEqual({ a: 1, b: 3, c: 4 });
  });

  it('merges nested objects recursively', () => {
    const target = {
      colors: {
        blue: { 500: '#0000ff' },
        gray: { 500: '#808080' },
      },
    };

    const source = {
      colors: {
        blue: { 600: '#0000cc' },
        red: { 500: '#ff0000' },
      },
    } as any;

    const result = deepMerge(target, source);

    expect(result).toEqual({
      colors: {
        blue: { 500: '#0000ff', 600: '#0000cc' },
        gray: { 500: '#808080' },
        red: { 500: '#ff0000' },
      },
    });
  });

  it('deep merges with multiple nesting levels', () => {
    const target = {
      primitives: {
        colors: {
          blue: {
            500: '#3b82f6',
            700: '#1d4ed8',
          },
        },
        spacing: {
          4: '1rem',
        },
      },
    };

    const source = {
      primitives: {
        colors: {
          blue: {
            500: '#0000ff', // Override
          },
          red: {
            500: '#ff0000', // New palette
          },
        },
      },
    } as any;

    const result = deepMerge(target, source);

    expect((result.primitives.colors.blue as any)[500]).toBe('#0000ff'); // Overridden
    expect(result.primitives.colors.blue[700]).toBe('#1d4ed8'); // Preserved
    expect((result.primitives.colors as any).red[500]).toBe('#ff0000'); // Added
    expect(result.primitives.spacing[4]).toBe('1rem'); // Preserved
  });

  it('handles arrays by replacing, not merging', () => {
    const target = {
      items: [1, 2, 3],
    };

    const source = {
      items: [4, 5],
    };

    const result = deepMerge(target, source);

    expect(result.items).toEqual([4, 5]);
  });

  it('skips undefined and null values from source', () => {
    const target = {
      a: 1,
      b: 2,
      c: 3,
    };

    const source = {
      b: undefined,
      c: null,
      d: 4,
    } as any;

    const result = deepMerge(target, source);

    expect(result).toEqual({
      a: 1,
      b: 2, // Not overridden by undefined
      c: 3, // Not overridden by null
      d: 4,
    });
  });

  it('preserves target values when source is empty', () => {
    const target = { a: 1, b: { c: 2 } };
    const source = {};

    const result = deepMerge(target, source);

    expect(result).toEqual(target);
  });

  it('replaces primitive values correctly', () => {
    const target = {
      count: 10,
      name: 'old',
      active: false,
    };

    const source = {
      count: 20,
      name: 'new',
      active: true,
    };

    const result = deepMerge(target, source);

    expect(result).toEqual({
      count: 20,
      name: 'new',
      active: true,
    });
  });

  it('handles real IndiumConfig partial override', () => {
    const target: IndiumConfig = {
      primitives: {
        colors: {
          blue: {
            500: '#3b82f6',
            700: '#1d4ed8',
          },
        },
      },
      semantic: {
        light: {
          colors: {
            text: {
              primary: 'gray.900',
            },
          },
        },
        dark: {
          colors: {
            text: {
              primary: 'gray.50',
            },
          },
        },
      },
    };

    const source: Partial<IndiumConfig> = {
      primitives: {
        colors: {
          blue: {
            500: '#0000ff', // Custom blue
          },
        },
      },
    };

    const result = deepMerge(target, source);

    // Should override blue.500
    expect((result.primitives?.colors?.blue as any)?.[500]).toBe('#0000ff');
    // Should preserve blue.700
    expect((result.primitives?.colors?.blue as any)?.[700]).toBe('#1d4ed8');
    // Should preserve semantic config
    expect(result.semantic?.light?.colors?.text?.primary).toBe('gray.900');
  });
});

// ==========================================
// DEFINE CONFIG TESTS
// ==========================================

describe('defineConfig', () => {
  it('returns the config object as-is', () => {
    const config: Partial<IndiumConfig> = {
      primitives: {
        colors: {
          brand: {
            500: '#ff6b6b',
          },
        },
      },
    };

    const result = defineConfig(config);

    expect(result).toBe(config);
    expect(result).toEqual(config);
  });

  it('provides type safety for config', () => {
    // This test mainly verifies TypeScript compilation
    const config = defineConfig({
      primitives: {
        colors: {
          custom: {
            100: '#f0f0f0',
            500: '#808080',
            900: '#101010',
          },
        },
        spacing: {
          custom: '2.5rem',
        },
      },
      semantic: {
        light: {
          colors: {
            text: {
              custom: 'custom.900',
            },
          },
        },
      },
    });

    expect(config).toBeDefined();
    expect((config.primitives?.colors?.custom as any)?.[500]).toBe('#808080');
  });
});

// ==========================================
// VALIDATE CONFIG TESTS
// ==========================================

describe('validateConfig', () => {
  it('validates a valid config object', () => {
    const config: IndiumConfig = {
      primitives: {
        colors: {
          blue: { 500: '#0000ff' },
        },
      },
    };

    expect(() => validateConfig(config)).not.toThrow();
    expect(validateConfig(config)).toBe(true);
  });

  it('throws error for null config', () => {
    expect(() => validateConfig(null)).toThrow('Config must be an object');
  });

  it('throws error for non-object config', () => {
    expect(() => validateConfig('not an object')).toThrow('Config must be an object');
    expect(() => validateConfig(123)).toThrow('Config must be an object');
    expect(() => validateConfig([])).toThrow('Config must be an object');
  });

  it('accepts empty config object', () => {
    expect(() => validateConfig({})).not.toThrow();
  });

  it('warns about unknown top-level keys', () => {
    const consoleWarnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

    const config = {
      primitives: {},
      unknownKey: 'value',
    };

    validateConfig(config);

    expect(consoleWarnSpy).toHaveBeenCalledWith('Unknown config key: unknownKey');
    consoleWarnSpy.mockRestore();
  });
});

// ==========================================
// INTEGRATION TESTS
// ==========================================

describe('Config Integration', () => {
  it('full user config override workflow', () => {
    // Simulate default config
    const defaults: IndiumConfig = {
      primitives: {
        colors: {
          gray: {
            50: '#f9fafb',
            500: '#6b7280',
            900: '#111827',
          },
          blue: {
            500: '#3b82f6',
            700: '#1d4ed8',
          },
        },
        spacing: {
          0: '0',
          4: '1rem',
          8: '2rem',
        },
      },
      semantic: {
        light: {
          colors: {
            text: {
              primary: 'gray.900',
            },
            action: {
              primary: {
                base: 'blue.500',
              },
            },
          },
        },
      },
    };

    // User wants to customize brand color
    const userConfig = defineConfig({
      primitives: {
        colors: {
          brand: {
            500: '#ff6b6b',
            700: '#ee5a52',
          },
        },
      },
      semantic: {
        light: {
          colors: {
            action: {
              primary: {
                base: 'brand.500',
              },
            },
          },
        },
      },
    });

    // Merge
    const finalConfig = deepMerge(defaults, userConfig);

    // Verify merge results
    expect((finalConfig.primitives?.colors?.gray as any)?.[500]).toBe('#6b7280'); // Preserved
    expect((finalConfig.primitives?.colors?.brand as any)?.[500]).toBe('#ff6b6b'); // Added
    expect(finalConfig.semantic?.light?.colors?.text?.primary).toBe('gray.900'); // Preserved
    expect(finalConfig.semantic?.light?.colors?.action?.primary?.base).toBe('brand.500'); // Overridden
  });
});
