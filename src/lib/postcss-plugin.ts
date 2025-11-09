// src/lib/postcss-plugin.ts

import type { Plugin, AtRule, Root } from 'postcss';
import { loadConfigSync } from './config/config-loader.js';
import {
  generatePrimitiveVariables,
  flattenSemanticTokens,
  resolveDefaultTypography,
  calculateHeadingScaling,
} from './config/render-helpers.js';
import type { IndiumConfig } from './config/types.js';

/**
 * PostCSS plugin for Indium UI theme generation
 *
 * Processes the @indium-theme directive and generates CSS variables
 * from the merged configuration (defaults + user overrides).
 *
 * Usage in CSS:
 * ```css
 * @indium-theme;
 * ```
 *
 * Output:
 * - :root { primitive variables }
 * - [data-theme="light"] { semantic light theme }
 * - [data-theme="dark"] { semantic dark theme }
 * - @media (prefers-color-scheme: dark) { auto dark theme }
 */

interface PluginOptions {
  /**
   * Path to user config file (optional)
   * If not provided, will search for indium.config.{ts,js,mjs} in CWD
   */
  configPath?: string;

  /**
   * Current working directory for config resolution
   * Defaults to process.cwd()
   */
  cwd?: string;
}

/**
 * Generates CSS variable declarations from a key-value object
 */
function generateCSSVariables(variables: Record<string, string>): string {
  return Object.entries(variables)
    .map(([key, value]) => `  ${key}: ${value};`)
    .join('\n');
}

/**
 * Generates the complete theme CSS from config
 */
function generateThemeCSS(config: IndiumConfig): string {
  const cssBlocks: string[] = [];

  // ==========================================
  // PRIMITIVES - :root
  // ==========================================
  if (config.primitives) {
    const primitiveVars = generatePrimitiveVariables(config.primitives);
    const primitivesCSS = `:root {\n${generateCSSVariables(primitiveVars)}\n}`;
    cssBlocks.push(primitivesCSS);
  }

  // ==========================================
  // SEMANTIC LIGHT THEME
  // ==========================================
  if (config.semantic?.light) {
    const lightTheme = config.semantic.light;
    const lightVars: Record<string, string> = {};

    // Colors
    if (lightTheme.colors && config.primitives?.colors) {
      const colorVars = flattenSemanticTokens(
        lightTheme.colors,
        config.primitives.colors,
        config.primitives
      );
      Object.assign(lightVars, colorVars);
    }

    // Typography - Default
    if (lightTheme.typography?.default && config.primitives) {
      const defaultTypoVars = resolveDefaultTypography(
        lightTheme.typography.default,
        config.primitives
      );
      Object.assign(lightVars, defaultTypoVars);
    }

    // Typography - Heading
    if (lightTheme.typography?.heading && config.primitives) {
      const headingVars = calculateHeadingScaling(
        lightTheme.typography.heading,
        config.primitives
      );
      Object.assign(lightVars, headingVars);
    }

    // Generate Light Theme CSS
    const lightCSS = `[data-theme="light"],
:root:not([data-theme="dark"]) {
  color-scheme: light;
${generateCSSVariables(lightVars)}
}`;
    cssBlocks.push(lightCSS);
  }

  // ==========================================
  // SEMANTIC DARK THEME
  // ==========================================
  if (config.semantic?.dark) {
    const darkTheme = config.semantic.dark;
    const darkVars: Record<string, string> = {};

    // Colors
    if (darkTheme.colors && config.primitives?.colors) {
      const colorVars = flattenSemanticTokens(
        darkTheme.colors,
        config.primitives.colors,
        config.primitives
      );
      Object.assign(darkVars, colorVars);
    }

    // Typography - Default
    if (darkTheme.typography?.default && config.primitives) {
      const defaultTypoVars = resolveDefaultTypography(
        darkTheme.typography.default,
        config.primitives
      );
      Object.assign(darkVars, defaultTypoVars);
    }

    // Typography - Heading
    if (darkTheme.typography?.heading && config.primitives) {
      const headingVars = calculateHeadingScaling(
        darkTheme.typography.heading,
        config.primitives
      );
      Object.assign(darkVars, headingVars);
    }

    // Generate Dark Theme CSS (explicit)
    const darkCSS = `[data-theme="dark"] {
  color-scheme: dark;
${generateCSSVariables(darkVars)}
}`;
    cssBlocks.push(darkCSS);

    // Generate Dark Theme CSS (auto via media query)
    const autoDarkCSS = `@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    color-scheme: dark;
${generateCSSVariables(darkVars)}
  }
}`;
    cssBlocks.push(autoDarkCSS);
  }

  return cssBlocks.join('\n\n');
}

/**
 * Indium UI PostCSS Plugin
 *
 * Replaces @indium-theme directive with generated CSS variables
 */
export default function indiumThemePlugin(options: PluginOptions = {}): Plugin {
  return {
    postcssPlugin: 'indium-ui/theme',

    AtRule(atRule: AtRule, { result }: { result: any }) {
      // Only process @indium-theme directives
      if (atRule.name !== 'indium-theme') {
        return;
      }

      try {
        // Load config (defaults + user overrides)
        const config = loadConfigSync(options.cwd || process.cwd());

        // Generate CSS from config
        const generatedCSS = generateThemeCSS(config);

        // Parse generated CSS and insert into AST
        const root = result.root as Root;
        const parsedCSS = result.processor.process(generatedCSS, {
          from: undefined,
        }).root;

        // Replace @indium-theme with generated nodes
        atRule.replaceWith(parsedCSS.nodes);

        // Log success (optional, can be removed in production)
        if (process.env.NODE_ENV !== 'test') {
          console.log('✓ Indium UI theme generated');
        }
      } catch (error) {
        // Log error and keep @indium-theme directive for debugging
        console.error('Error generating Indium UI theme:', error);
        atRule.warn(
          result,
          `Failed to generate theme: ${error instanceof Error ? error.message : 'Unknown error'}`
        );
      }
    },
  };
}

// Required for PostCSS plugin registration
indiumThemePlugin.postcss = true;
