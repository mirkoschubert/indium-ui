/**
 * Type Definitions
 *
 * Shared TypeScript types and interfaces for Indium UI.
 */

/**
 * Theme mode options
 */
export type ThemeMode = 'light' | 'dark' | 'auto';

/**
 * Theme configuration object
 * Allows customization of CSS custom properties
 */
export interface ThemeConfig {
  [key: string]: string | number;
}

/**
 * Component size variants
 */
export type ComponentSize = 'sm' | 'md' | 'lg';

/**
 * Common component variant types
 */
export type ButtonVariant = 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
export type AlertVariant = 'info' | 'success' | 'warning' | 'danger';

/**
 * Accessibility attributes for components
 */
export interface AriaAttributes {
  'aria-label'?: string;
  'aria-labelledby'?: string;
  'aria-describedby'?: string;
  'aria-hidden'?: boolean;
  'aria-expanded'?: boolean;
  'aria-pressed'?: boolean;
  'aria-disabled'?: boolean;
  'aria-busy'?: boolean;
  role?: string;
}
