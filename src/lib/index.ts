/**
 * Indium UI - Semantic Component Library for Svelte 5
 *
 * A production-ready component library with accessible, themeable components
 * and an integrated semantic CSS framework.
 */

// Components - Atoms
export { default as Button } from './components/atoms/Button.svelte';

// Utils
export * from './utils/types.js';
export * from './utils/theme.js';
export * from './utils/a11y.js';

// Config
export * from './config/config-loader.js';

// Config Types (for user type-safe configuration)
export type {
  IndiumConfig,
  Primitives,
  Semantic,
  SemanticColorTheme,
  SemanticTextColors,
  SemanticBackgroundColors,
  SemanticBorderColors,
  SemanticActionColors,
  SemanticFeedbackColors,
  SemanticTypography,
  SemanticSizing
} from './config/types.js';
