// src/lib/config/config-cache.ts

import type { IndiumConfig } from './types.js';
import { loadConfig, findConfigFile } from './config-loader.js';

/**
 * Global config cache with invalidation support
 *
 * This cache is shared between the Vite plugin and PostCSS plugin
 * to ensure config changes trigger CSS regeneration.
 */
class ConfigCache {
  private config: IndiumConfig | null = null;
  private configPath: string | null = null;
  private loadPromise: Promise<IndiumConfig> | null = null;
  private importCache: Map<string, any> = new Map();

  /**
   * Clear Node.js import cache for a given path
   * This is necessary because dynamic import() caches modules
   */
  private clearImportCache(path: string): void {
    // Delete all variations of the path from our import cache
    this.importCache.delete(path);

    // Also try to clear Node.js internal caches
    // For ESM, we need to delete from require.cache (if it exists there)
    if (typeof require !== 'undefined' && require.cache) {
      delete require.cache[path];

      // Also try .js version
      const jsPath = path.replace(/\.ts$/, '.js');
      delete require.cache[jsPath];
    }
  }

  /**
   * Load or return cached config
   */
  async getConfig(cwd: string = process.cwd()): Promise<IndiumConfig> {
    // If we're already loading, wait for that promise
    if (this.loadPromise) {
      return this.loadPromise;
    }

    // If we have a cached config, return it
    if (this.config) {
      return this.config;
    }

    // Find config path if not set
    if (!this.configPath) {
      this.configPath = findConfigFile(cwd);
    }

    // Clear import cache before loading to force fresh import
    if (this.configPath) {
      this.clearImportCache(this.configPath);
    }

    // Load config and cache the promise to prevent race conditions
    this.loadPromise = loadConfig(cwd);

    try {
      this.config = await this.loadPromise;
      return this.config;
    } finally {
      this.loadPromise = null;
    }
  }

  /**
   * Invalidate the cache - forces next getConfig() to reload
   */
  invalidate(): void {
    // Clear import cache first
    if (this.configPath) {
      this.clearImportCache(this.configPath);
    }

    // Then clear our own cache
    this.config = null;
    this.loadPromise = null;
  }

  /**
   * Get the current config path (if any)
   */
  getConfigPath(): string | null {
    return this.configPath;
  }

  /**
   * Set the config path (called by Vite plugin on startup)
   */
  setConfigPath(path: string | null): void {
    this.configPath = path;
  }
}

// Export singleton instance
export const configCache = new ConfigCache();
