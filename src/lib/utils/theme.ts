/**
 * Theme Utilities
 *
 * Functions for managing theme mode (light/dark/auto) and custom theme configurations.
 */

import type { ThemeConfig, ThemeMode } from './types.js';

const THEME_STORAGE_KEY = 'indium-theme-mode';

/**
 * Creates a CSS string from a theme configuration object
 * @param config - Theme configuration with CSS custom property names and values
 * @returns CSS text to be applied to an element's style
 */
export function createTheme(config: ThemeConfig): string {
  return Object.entries(config)
    .map(([key, value]) => {
      const propertyName = key.startsWith('--') ? key : `--${key}`;
      return `${propertyName}: ${value};`;
    })
    .join('\n');
}

/**
 * Applies custom theme configuration to the document root
 * @param config - Theme configuration object
 */
export function applyTheme(config: ThemeConfig): void {
  if (typeof document === 'undefined') return;

  const cssText = createTheme(config);
  const existingStyles = document.documentElement.getAttribute('style') || '';
  document.documentElement.setAttribute('style', existingStyles + '\n' + cssText);
}

/**
 * Sets the theme mode (light, dark, or auto)
 * @param mode - The theme mode to apply
 */
export function setThemeMode(mode: ThemeMode): void {
  if (typeof document === 'undefined') return;

  if (mode === 'auto') {
    document.documentElement.removeAttribute('data-theme');
  } else {
    document.documentElement.setAttribute('data-theme', mode);
  }

  if (typeof localStorage !== 'undefined') {
    localStorage.setItem(THEME_STORAGE_KEY, mode);
  }
}

/**
 * Gets the currently set theme mode from localStorage
 * @returns The stored theme mode or 'auto' as default
 */
export function getThemeMode(): ThemeMode {
  if (typeof localStorage === 'undefined') return 'auto';

  const stored = localStorage.getItem(THEME_STORAGE_KEY);
  if (stored === 'light' || stored === 'dark' || stored === 'auto') {
    return stored;
  }
  return 'auto';
}

/**
 * Gets the effective theme (light or dark) based on current mode and system preference
 * @returns 'light' or 'dark'
 */
export function getEffectiveTheme(): 'light' | 'dark' {
  if (typeof window === 'undefined') return 'light';

  const mode = getThemeMode();

  if (mode === 'auto') {
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
  }

  return mode;
}

/**
 * Initializes the theme on page load
 * Should be called as early as possible to prevent flash of wrong theme
 */
export function initTheme(): void {
  if (typeof document === 'undefined') return;

  const mode = getThemeMode();
  setThemeMode(mode);
}

/**
 * Toggles between light and dark mode (skips auto)
 */
export function toggleTheme(): void {
  const current = getEffectiveTheme();
  setThemeMode(current === 'light' ? 'dark' : 'light');
}

/**
 * Watches for system theme preference changes and updates if in auto mode
 * @param callback - Optional callback function when theme changes
 * @returns Cleanup function to remove the listener
 */
export function watchSystemTheme(callback?: (isDark: boolean) => void): () => void {
  if (typeof window === 'undefined') return () => {};

  const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');

  const handler = (e: MediaQueryListEvent | MediaQueryList) => {
    if (getThemeMode() === 'auto') {
      callback?.(e.matches);
    }
  };

  // Initial call
  handler(mediaQuery);

  // Listen for changes
  mediaQuery.addEventListener('change', handler);

  // Return cleanup function
  return () => mediaQuery.removeEventListener('change', handler);
}
