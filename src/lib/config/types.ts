// src/lib/config/types.ts

/**
 * ==========================================
 * PRIMITIVE TOKENS (Layer 1 - Raw Values)
 * ==========================================
 * 
 * All base design values. User can override individual values
 * or entire sections. Erweiterbar für custom palettes/scales.
 */

// ==========================================
// Colors
// ==========================================

export type HexColor = string; // '#ffffff' or '#ffffff40'
export type ColorValue = HexColor;

export interface ColorPalette {
  [shade: number]: ColorValue;
}

export interface PrimitiveColors {
  gray?: ColorPalette;
  blue?: ColorPalette;
  green?: ColorPalette;
  yellow?: ColorPalette;
  red?: ColorPalette;
  [key: string]: ColorPalette | undefined; // Erweiterbar: purple, orange, pink, etc.
}

// ==========================================
// Typography
// ==========================================

export type FontFamily = string;
export type FontSize = string; // '0.75rem', '1rem', etc.
export type FontWeight = number | string; // 300, 400, 600, etc.
export type LineHeight = number | string; // 1, 1.5, '1.5', etc.
export type LetterSpacing = string; // '-0.02em', '0.05em', etc.
export type TextTransform = string; // 'uppercase', 'lowercase', 'capitalize', 'none'

export interface TypographyScale {
  family?: Record<string, FontFamily>;
  size?: Record<string, FontSize>;
  weight?: Record<string, FontWeight>;
  lineHeight?: Record<string, LineHeight>;
  letterSpacing?: Record<string, LetterSpacing>;
  transform?: Record<string, TextTransform>;
}

export interface PrimitiveTypography {
  default?: TypographyScale;
  heading?: TypographyScale;
  mono?: TypographyScale;
  [key: string]: TypographyScale | undefined; // Erweiterbar: display, code, etc.
}

// ==========================================
// Spacing & Sizing
// ==========================================

export type SizeValue = string; // '0', '0.25rem', '1rem', etc.

export interface PrimitiveSpacing {
  [key: string | number]: SizeValue;
}

export interface PrimitiveSizing {
  [key: string | number]: SizeValue;
}

// ==========================================
// Border Radius
// ==========================================

export interface PrimitiveBorder {
  radius?: Record<string, SizeValue>;
}

// ==========================================
// Shadows
// ==========================================

export type ShadowValue = string; // CSS box-shadow value

export interface PrimitiveShadow {
  [key: string]: ShadowValue;
}

// ==========================================
// Z-Index
// ==========================================

export interface PrimitiveZIndex {
  [key: string]: number;
}

// ==========================================
// Transitions
// ==========================================

export type TransitionValue = string; // '150ms ease-in-out', etc.

export interface PrimitiveTransition {
  [key: string]: TransitionValue;
}

// ==========================================
// Breakpoints
// ==========================================

export interface PrimitiveBreakpoint {
  tablet?: SizeValue;
  desktop?: SizeValue;
  wide?: SizeValue;
  [key: string]: SizeValue | undefined; // Erweiterbar
}

// ==========================================
// All Primitives Combined
// ==========================================

export interface Primitives {
  colors?: PrimitiveColors;
  typography?: PrimitiveTypography;
  spacing?: PrimitiveSpacing;
  sizing?: PrimitiveSizing;
  border?: PrimitiveBorder;
  shadow?: PrimitiveShadow;
  zIndex?: PrimitiveZIndex;
  transition?: PrimitiveTransition;
  breakpoint?: PrimitiveBreakpoint;
}

/**
 * ==========================================
 * SEMANTIC TOKENS (Layer 3 - Opinionated)
 * ==========================================
 *
 * Separates theme-dependent (colors) from theme-independent (typography, sizing) tokens.
 *
 * THEME-DEPENDENT: Only colors change between light/dark modes
 * THEME-INDEPENDENT: Typography & sizing are shared across all themes
 *
 * Color references can be:
 * - Direct HEX: '#ffffff' or '#ffffff/0.5'
 * - Palette ref: 'gray.500' or 'blue.700'
 * - Palette ref + alpha: 'gray.500/0.5' or 'blue.700/25'
 */

export type ColorRef = string; // '#ffffff' | 'gray.500' | 'gray.500/0.5' | etc.

// ==========================================
// Semantic Colors (THEME-DEPENDENT)
// ==========================================

export interface SemanticTextColors {
  primary?: ColorRef;
  secondary?: ColorRef;
  tertiary?: ColorRef;
  disabled?: ColorRef;
  inverse?: ColorRef;
  [key: string]: ColorRef | undefined; // Erweiterbar
}

export interface SemanticBackgroundColors {
  page?: ColorRef;
  surface?: ColorRef;
  elevated?: ColorRef;
  overlay?: ColorRef;
  [key: string]: ColorRef | undefined;
}

export interface SemanticBorderColors {
  normal?: ColorRef;
  hover?: ColorRef;
  focus?: ColorRef;
  [key: string]: ColorRef | undefined;
}

export interface SemanticActionPrimary {
  normal?: ColorRef;
  hover?: ColorRef;
  active?: ColorRef;
  disabled?: ColorRef;
  [key: string]: ColorRef | undefined;
}

export interface SemanticActionSecondary {
  normal?: ColorRef;
  hover?: ColorRef;
  active?: ColorRef;
  disabled?: ColorRef;
  [key: string]: ColorRef | undefined;
}

export interface SemanticActionColors {
  primary?: SemanticActionPrimary;
  secondary?: SemanticActionSecondary;
  [key: string]: SemanticActionPrimary | SemanticActionSecondary | undefined;
}

export interface SemanticFeedbackState {
  color?: ColorRef;
  bg?: ColorRef;
  border?: ColorRef;
  text?: ColorRef;
  [key: string]: ColorRef | undefined;
}

export interface SemanticFeedbackColors {
  success?: SemanticFeedbackState;
  warning?: SemanticFeedbackState;
  danger?: SemanticFeedbackState;
  info?: SemanticFeedbackState;
  [key: string]: SemanticFeedbackState | undefined;
}

export interface SemanticFocusRing {
  color?: ColorRef;
  shadow?: string; // CSS box-shadow value
  [key: string]: ColorRef | string | undefined;
}

/**
 * Color theme for one mode (light, dark, or custom)
 */
export interface SemanticColorTheme {
  text?: SemanticTextColors;
  background?: SemanticBackgroundColors;
  border?: SemanticBorderColors;
  action?: SemanticActionColors;
  feedback?: SemanticFeedbackColors;
  focusRing?: SemanticFocusRing;
  [key: string]: Record<string, any> | undefined; // Erweiterbar
}

// ==========================================
// Semantic Typography (THEME-INDEPENDENT)
// ==========================================

export interface SemanticDefaultTypography {
  font?: Record<string, string>; // 'family', 'size', 'weight', etc.
  color?: ColorRef; // References semantic color token (e.g. 'text.primary')
  [key: string]: any;
}

export interface SemanticHeadingTypography {
  font?: Record<string, string>; // 'family', 'size', 'weight', etc.
  size?: SizeValue;        // h1 base size (e.g. '2rem')
  lineHeight?: LineHeight; // Base line-height (e.g. 1.2)
  scaling?: number;        // Global multiplier for BOTH size & lineHeight
  color?: ColorRef;        // References semantic color token (e.g. 'text.primary')
  [key: string]: any;
}

export interface SemanticTypography {
  default?: SemanticDefaultTypography;
  heading?: SemanticHeadingTypography;
  [key: string]: Record<string, any> | undefined; // Erweiterbar
}

// ==========================================
// Semantic Sizing (THEME-INDEPENDENT)
// ==========================================

export interface SemanticSizing {
  scaling?: number; // Global component size multiplier (1 = no scaling)
  [key: string]: any;
}

// ==========================================
// All Semantic Tokens
// ==========================================

export interface Semantic {
  /**
   * Theme-dependent color tokens
   * Define different values for each theme (light, dark, custom)
   */
  colors?: {
    light?: SemanticColorTheme;
    dark?: SemanticColorTheme;
    [key: string]: SemanticColorTheme | undefined; // Custom themes (e.g. 'high-contrast')
  };

  /**
   * Theme-independent typography
   * Shared across all themes (only color references are theme-aware)
   */
  typography?: SemanticTypography;

  /**
   * Theme-independent sizing
   * Shared across all themes
   */
  sizing?: SemanticSizing;

  [key: string]: any; // Erweiterbar für custom categories
}

// ==========================================
// MAIN CONFIG INTERFACE
// ==========================================

export interface IndiumConfig {
  primitives?: Primitives;
  semantic?: Semantic;
}

/**
 * Full config with all required defaults filled in
 * Used internally after merging with defaults
 */
export interface IndiumConfigFull extends Required<IndiumConfig> {
  primitives: Required<Primitives>;
  semantic: Required<Semantic> & {
    colors: {
      light: Required<SemanticColorTheme>;
      dark: Required<SemanticColorTheme>;
      [key: string]: SemanticColorTheme | undefined;
    };
    typography: Required<SemanticTypography>;
    sizing: Required<SemanticSizing>;
  };
}

/**
 * ==========================================
 * HELPER TYPES
 * ==========================================
 */

/**
 * Helper to ensure type safety when writing config
 * Usage: export default { ... } satisfies IndiumConfig;
 */
export type ConfigBuilder = IndiumConfig;
