// src/lib/config/config-loader.ts

import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import type { IndiumConfig } from './types.js';
import { defaultConfig } from './defaults.js';

/**
 * Deep merge two objects recursively
 * User values override default values at the leaf level
 *
 * @param target - Default config object
 * @param source - User config object (overrides)
 * @returns Merged config object
 */
export function deepMerge<T extends Record<string, any>>(
  target: T,
  source: Partial<T>
): T {
  const result = { ...target };

  for (const key in source) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue === undefined || sourceValue === null) {
      continue;
    }

    // If both are objects and not arrays, merge recursively
    if (
      typeof sourceValue === 'object' &&
      !Array.isArray(sourceValue) &&
      typeof targetValue === 'object' &&
      !Array.isArray(targetValue) &&
      targetValue !== null
    ) {
      result[key] = deepMerge(targetValue, sourceValue);
    } else {
      // Override with source value
      result[key] = sourceValue as T[Extract<keyof T, string>];
    }
  }

  return result;
}

/**
 * Searches for indium.config.{ts,js,mjs} in the current working directory
 *
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Path to config file or null if not found
 */
export function findConfigFile(cwd: string = process.cwd()): string | null {
  const extensions = ['ts', 'js', 'mjs'];

  for (const ext of extensions) {
    const configPath = resolve(cwd, `indium.config.${ext}`);
    if (existsSync(configPath)) {
      return configPath;
    }
  }

  return null;
}

/**
 * Dynamically imports a config file
 * Supports both ESM (export default) and CJS (module.exports)
 *
 * @param configPath - Absolute path to config file
 * @returns User config object
 */
async function importConfig(configPath: string): Promise<Partial<IndiumConfig>> {
  try {
    // Use jiti for loading TypeScript config files
    // jiti compiles TS on-the-fly and doesn't have ESM caching issues
    const { createJiti } = await import('jiti');
    const jiti = createJiti(import.meta.url, {
      interopDefault: true,
      esmResolve: true,
    });

    // Clear jiti's own cache for this file
    delete jiti.cache[configPath];

    // Load the config file (works with both .ts and .js)
    const mod = jiti(configPath);

    // Handle both ESM (export default) and CJS (module.exports)
    return mod.default || mod;
  } catch (error) {
    console.error(`Error loading config from ${configPath}:`, error);
    throw new Error(`Failed to load Indium config: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}

/**
 * Loads user config and deep merges it with defaults
 *
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Merged config (defaults + user overrides)
 */
export async function loadConfig(cwd: string = process.cwd()): Promise<IndiumConfig> {
  const configPath = findConfigFile(cwd);

  if (!configPath) {
    // No user config found, return defaults
    return defaultConfig;
  }

  try {
    const userConfig = await importConfig(configPath);

    // Deep merge user config into defaults
    return deepMerge(defaultConfig, userConfig);
  } catch (error) {
    console.warn(`Failed to load config, using defaults:`, error);
    return defaultConfig;
  }
}

/**
 * Synchronous version of loadConfig for environments that don't support async
 * Falls back to defaults if user config exists (requires async import)
 *
 * @param cwd - Current working directory (defaults to process.cwd())
 * @returns Default config (or merged if sync import is possible)
 */
export function loadConfigSync(cwd: string = process.cwd()): IndiumConfig {
  const configPath = findConfigFile(cwd);

  if (!configPath) {
    return defaultConfig;
  }

  try {
    // For sync loading, we can only use require() for .js/.mjs
    // .ts files require async compilation, so we fall back to defaults
    if (configPath.endsWith('.ts')) {
      console.warn(
        'TypeScript config files require async loading. Using defaults. ' +
        'Use loadConfig() instead of loadConfigSync() to enable user config.'
      );
      return defaultConfig;
    }

    // Use require for .js/.mjs (CommonJS/ESM)
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const mod = require(configPath);
    const userConfig = mod.default || mod;

    return deepMerge(defaultConfig, userConfig);
  } catch (error) {
    console.warn(`Failed to load config synchronously, using defaults:`, error);
    return defaultConfig;
  }
}

/**
 * Validates that a user config object conforms to IndiumConfig interface
 *
 * @param config - Config object to validate
 * @returns True if valid, throws error if invalid
 */
export function validateConfig(config: any): config is IndiumConfig {
  if (typeof config !== 'object' || config === null || Array.isArray(config)) {
    throw new Error('Config must be an object');
  }

  // Basic validation - just check top-level structure
  const validKeys = ['primitives', 'semantic'];
  const configKeys = Object.keys(config);

  for (const key of configKeys) {
    if (!validKeys.includes(key)) {
      console.warn(`Unknown config key: ${key}`);
    }
  }

  return true;
}

/**
 * Creates a config object from user overrides
 * Provides type safety and auto-completion for user configs
 *
 * @param config - User config overrides
 * @returns Typed config object
 */
export function defineConfig(config: Partial<IndiumConfig>): Partial<IndiumConfig> {
  return config;
}
