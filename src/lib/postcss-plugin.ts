// src/lib/postcss-plugin.ts

import postcss, { type Plugin, type AtRule, type Root } from 'postcss';
import { loadConfig, findConfigFile } from './config/config-loader.js';
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
  if (config.semantic?.colors?.light || config.semantic?.typography || config.semantic?.sizing) {
    const lightVars: Record<string, string> = {};

    // Colors (theme-dependent)
    if (config.semantic.colors?.light && config.primitives?.colors) {
      const colorVars = flattenSemanticTokens(
        config.semantic.colors.light,
        config.primitives.colors,
        config.primitives
      );
      Object.assign(lightVars, colorVars);
    }

    // Typography - Default (theme-independent, but included in light theme)
    if (config.semantic.typography?.default && config.primitives) {
      const defaultTypoVars = resolveDefaultTypography(
        config.semantic.typography.default,
        config.primitives
      );
      Object.assign(lightVars, defaultTypoVars);
    }

    // Typography - Heading (theme-independent, but included in light theme)
    if (config.semantic.typography?.heading && config.primitives) {
      const headingVars = calculateHeadingScaling(
        config.semantic.typography.heading,
        config.primitives
      );
      Object.assign(lightVars, headingVars);
    }

    // Sizing (theme-independent, but included in light theme)
    if (config.semantic.sizing?.scaling !== undefined) {
      lightVars['--sizing-scaling'] = String(config.semantic.sizing.scaling);
    }

    // Generate Light Theme CSS (default + explicit)
    // We use :where() to lower specificity so dark mode media query can override
    const lightCSS = `:where(:root),
[data-theme="light"] {
  color-scheme: light;
${generateCSSVariables(lightVars)}
}`;
    cssBlocks.push(lightCSS);
  }

  // ==========================================
  // SEMANTIC DARK THEME
  // ==========================================
  if (config.semantic?.colors?.dark || config.semantic?.typography || config.semantic?.sizing) {
    const darkVars: Record<string, string> = {};

    // Colors (theme-dependent - only colors differ between light/dark)
    if (config.semantic.colors?.dark && config.primitives?.colors) {
      const colorVars = flattenSemanticTokens(
        config.semantic.colors.dark,
        config.primitives.colors,
        config.primitives
      );
      Object.assign(darkVars, colorVars);
    }

    // Typography - Default (theme-independent, same as light)
    if (config.semantic.typography?.default && config.primitives) {
      const defaultTypoVars = resolveDefaultTypography(
        config.semantic.typography.default,
        config.primitives
      );
      Object.assign(darkVars, defaultTypoVars);
    }

    // Typography - Heading (theme-independent, same as light)
    if (config.semantic.typography?.heading && config.primitives) {
      const headingVars = calculateHeadingScaling(
        config.semantic.typography.heading,
        config.primitives
      );
      Object.assign(darkVars, headingVars);
    }

    // Sizing (theme-independent, same as light)
    if (config.semantic.sizing?.scaling !== undefined) {
      darkVars['--sizing-scaling'] = String(config.semantic.sizing.scaling);
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

    async AtRule(atRule: AtRule, { result }: { result: any }) {
      // Only process @indium-theme directives
      if (atRule.name !== 'indium-theme') {
        return;
      }

      try {
        const cwd = options.cwd || process.cwd();

        // Find config file path for HMR dependency tracking
        const configPath = findConfigFile(cwd);

        // ⭐ Register config file as dependency for Vite's HMR (Tailwind 4 approach)
        // This makes Vite watch the config file and trigger transform on changes
        if (configPath && result.messages) {
          result.messages.push({
            type: 'dependency',
            plugin: 'indium-ui/theme',
            file: configPath,
            parent: result.opts?.from,
          });
        }

        // ⭐ Load config directly with cache-busting (no cache layer needed)
        // The cache-busting in loadConfig ensures fresh config on every run
        const config = await loadConfig(cwd);

        // Generate CSS from config
        const generatedCSS = generateThemeCSS(config);

        // Parse generated CSS using postcss.parse (synchronous)
        const parsedCSS = postcss.parse(generatedCSS);

        // Replace @indium-theme with generated nodes
        atRule.replaceWith(parsedCSS.nodes);
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
