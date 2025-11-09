// src/lib/config/index.ts

/**
 * Public API for Indium UI Configuration System
 *
 * This module exports all configuration utilities, types, and helpers
 * needed for both library development and user customization.
 */

// ==========================================
// TYPES
// ==========================================

export type {
  // Main Config
  IndiumConfig,
  IndiumConfigFull,
  ConfigBuilder,

  // Primitives
  Primitives,
  PrimitiveColors,
  ColorPalette,
  PrimitiveTypography,
  TypographyScale,
  PrimitiveSpacing,
  PrimitiveSizing,
  PrimitiveBorder,
  PrimitiveShadow,
  PrimitiveZIndex,
  PrimitiveTransition,
  PrimitiveBreakpoint,

  // Semantic
  Semantic,
  SemanticTheme,
  SemanticColors,
  SemanticTextColors,
  SemanticBackgroundColors,
  SemanticBorderColors,
  SemanticActionColors,
  SemanticActionPrimary,
  SemanticActionSecondary,
  SemanticFeedbackColors,
  SemanticFeedbackState,
  SemanticFocusRing,
  SemanticTypography,
  SemanticDefaultTypography,
  SemanticHeadingTypography,
  SemanticSizing,

  // Utility Types
  ColorRef,
  ColorValue,
  HexColor,
  SizeValue,
  ShadowValue,
  TransitionValue,
  FontFamily,
  FontSize,
  FontWeight,
  LineHeight,
  LetterSpacing,
  TextTransform,
} from './types.js';

// ==========================================
// DEFAULT CONFIGURATION
// ==========================================

export { defaultConfig } from './defaults.js';

// ==========================================
// CONFIG LOADER
// ==========================================

export {
  loadConfig,
  loadConfigSync,
  findConfigFile,
  deepMerge,
  defineConfig,
  validateConfig,
} from './config-loader.js';

// ==========================================
// RENDER HELPERS
// ==========================================

export {
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
