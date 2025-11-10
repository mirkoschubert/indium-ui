// src/lib/vite-plugin.ts

import type { Plugin, ViteDevServer } from 'vite';
import { findConfigFile } from './config/config-loader.js';

/**
 * Vite plugin to enable HMR for indium.config.ts
 *
 * This plugin watches the config file and invalidates CSS modules
 * when the config changes, triggering a re-generation of the theme CSS.
 */
export function indiumConfigHMR(): Plugin {
  let configPath: string | null = null;
  let server: ViteDevServer | null = null;

  return {
    name: 'indium-ui:config-hmr',

    configResolved(config) {
      // Find config file once at startup
      configPath = findConfigFile(config.root || process.cwd());

      if (configPath && config.command === 'serve') {
        config.logger.info(`Watching Indium config: ${configPath}`, {
          timestamp: true,
        });
      }
    },

    configureServer(devServer) {
      server = devServer;
    },

    async handleHotUpdate({ file, server, modules }) {
      // Check if the changed file is the indium config
      if (configPath && file === configPath) {
        try {
          // CRITICAL: Invalidate the config cache
          // This forces the PostCSS plugin to reload the config on next CSS request
          const { configCache } = await import('./config/config-cache.js');
          configCache.invalidate();

          // Find all CSS modules currently in the module graph
          const moduleGraph = server.moduleGraph;
          if (!moduleGraph) {
            return [];
          }

          const cssModules = Array.from(moduleGraph.urlToModuleMap.entries())
            .filter(([url]) => url.endsWith('.css') || url.includes('.css?'))
            .map(([, mod]) => mod);

          if (cssModules.length === 0) {
            return [];
          }

          // Filter out non-file modules (like proxies) that can't be transformed
          const realCssModules = cssModules.filter(mod =>
            mod.file && !mod.url.includes('?html-proxy')
          );

          for (const mod of realCssModules) {
            // Invalidate the module
            moduleGraph.invalidateModule(mod, new Set(), Date.now(), true);

            // Clear transform cache to force PostCSS to run again
            if (mod.transformResult) {
              mod.transformResult = null;
            }
          }

          // Return the real CSS modules for HMR
          // Vite will automatically re-transform them through PostCSS
          // which will use the fresh config from our cache
          return realCssModules;
        } catch (error) {
          console.error('Indium UI HMR error:', error);
          return [];
        }
      }
    },
  };
}
