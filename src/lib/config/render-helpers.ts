// src/lib/config/render-helpers.ts

import type {
  Primitives,
  PrimitiveColors,
  SemanticHeadingTypography,
} from './types.ts';

// ==========================================
// COLOR PARSING
// ==========================================

/**
 * Konvertiert HEX zu RGB-Zahlen
 * '#ffffff' → [255, 255, 255]
 */
function hexToRgb(hex: string): [number, number, number] {
  hex = hex.replace(/^#/, '');
  const r = parseInt(hex.slice(0, 2), 16);
  const g = parseInt(hex.slice(2, 4), 16);
  const b = parseInt(hex.slice(4, 6), 16);
  return [r, g, b];
}

/**
 * Normalisiert Alpha-Wert zu 0-1 Range
 * '5' → 0.05
 * '50' → 0.5
 * '0.5' → 0.5
 * '.5' → 0.5
 */
function normalizeAlpha(alpha: string): number {
  const num = parseFloat(alpha);
  // Wenn Dezimalzahl → schon normalisiert
  if (alpha.includes('.') || alpha.includes(',')) {
    return num;
  }
  // Sonst: dividiere durch 100
  return num / 100;
}

/**
 * Parst Color-Referenzen und gibt resolved HEX oder rgba zurück
 *
 * Beispiele:
 * parseColorRef('#ffffff', primitives) → '#ffffff'
 * parseColorRef('#000000/0.5', primitives) → 'rgba(0,0,0,0.5)'
 * parseColorRef('gray.500', primitives) → '#6b7280'
 * parseColorRef('gray.500/0.5', primitives) → 'rgba(107,114,128,0.5)'
 * parseColorRef('blue.700/25', primitives) → 'rgba(29,78,216,0.25)'
 */
export function parseColorRef(
  ref: string,
  primitiveColors: PrimitiveColors
): string {
  // 1. DIRECT HEX
  if (ref.startsWith('#')) {
    // Mit Alpha: '#000000/0.5'
    if (ref.includes('/')) {
      const [hex, alphaStr] = ref.split('/');
      const [r, g, b] = hexToRgb(hex);
      const alpha = normalizeAlpha(alphaStr);
      return `rgba(${r},${g},${b},${alpha})`;
    }
    // Plain HEX: '#ffffff'
    return ref;
  }

  // 2. COLOR REFERENCE: 'gray.500' or 'gray.500/0.5'
  const alphaParts = ref.split('/');
  const colorPath = alphaParts[0]; // 'gray.500'
  const alphaStr = alphaParts[1]; // '0.5' or undefined

  const [paletteName, shadeStr] = colorPath.split('.');
  const shade = parseInt(shadeStr, 10);

  // Validate
  if (!primitiveColors[paletteName]?.[shade]) {
    console.warn(`Color not found: ${colorPath}`);
    return ref; // Fallback
  }

  // Get HEX from primitive
  const hexValue = primitiveColors[paletteName]![shade];
  const [r, g, b] = hexToRgb(hexValue);

  // Without Alpha: 'gray.500'
  if (!alphaStr) {
    return hexValue;
  }

  // With Alpha: 'gray.500/0.5'
  const alpha = normalizeAlpha(alphaStr);
  return `rgba(${r},${g},${b},${alpha})`;
}

// ==========================================
// TYPOGRAPHY RESOLUTION
// ==========================================

/**
 * Resolveiert Typography-References zu tatsächlichen CSS Werten
 *
 * Input:
 * font: { size: 'base', weight: 'bold' }
 * primitives.typography.heading.size.base = '1rem'
 * primitives.typography.heading.weight.bold = 700
 *
 * Output:
 * font: { 'font-size': '1rem', 'font-weight': '700' }
 */
export function resolveTypographyReferences(
  semanticFont: Record<string, string | undefined>,
  primitives: Primitives,
  typographyGroup: 'default' | 'heading' | 'mono' = 'default'
): Record<string, string> {
  const result: Record<string, string> = {};
  const primTypog = primitives.typography?.[typographyGroup];

  Object.entries(semanticFont).forEach(([key, refKey]) => {
    if (!refKey) return;

    // Alle Properties aus dem gleichen typographyGroup auflösen
    if (key === 'family' && primTypog?.family?.[refKey]) {
      result['font-family'] = primTypog.family[refKey];
    } else if (key === 'size' && primTypog?.size?.[refKey]) {
      // ✅ WICHTIG: Nutzt primitives.typography[typographyGroup].size
      result['font-size'] = primTypog.size[refKey];
    } else if (key === 'weight' && primTypog?.weight?.[refKey]) {
      result['font-weight'] = String(primTypog.weight[refKey]);
    } else if (key === 'lineHeight' && primTypog?.lineHeight?.[refKey]) {
      result['line-height'] = String(primTypog.lineHeight[refKey]);
    } else if (key === 'letterSpacing' && primTypog?.letterSpacing?.[refKey]) {
      result['letter-spacing'] = primTypog.letterSpacing[refKey];
    } else if (key === 'transform' && primTypog?.transform?.[refKey]) {
      result['text-transform'] = primTypog.transform[refKey];
    } else {
      console.warn(
        `Typography reference not found: typography.${typographyGroup}.${key}.${refKey}`
      );
    }
  });

  return result;
}

// ==========================================
// HEADING SCALING
// ==========================================

/**
 * Berechnet h1-h6 Sizes UND LineHeights aus Base-Werten + Scaling
 *
 * Der Scaling-Faktor wird auf BEIDE angewendet:
 * - size: baseSize × sizeMultiplier × scaling
 * - lineHeight: baseLineHeight × scaling
 *
 * Beispiel:
 * baseSize: '2rem', baseLineHeight: 1.2, scaling: 1.2
 *
 * h1: size = calc(2rem * 1.0 * 1.2) = 2.4rem
 *     lineHeight = calc(1.2 * 1.2) = 1.44
 * h2: size = calc(2rem * 0.875 * 1.2) = 2.1rem
 *     lineHeight = calc(1.2 * 1.2) = 1.44
 * h3: size = calc(2rem * 0.75 * 1.2) = 1.8rem
 *     lineHeight = calc(1.2 * 1.2) = 1.44
 *
 * Gibt Record mit CSS Variable Names zurück:
 * {
 *   '--heading-h1-size': 'calc(2rem * 1.0 * 1.2)',
 *   '--heading-h1-line-height': '1.44',
 *   '--heading-h1-font-family': '...',
 *   '--heading-h1-font-weight': '700',
 *   '--heading-h1-letter-spacing': '-0.02em',
 *   ...
 * }
 */
export function calculateHeadingScaling(
  semanticHeading: SemanticHeadingTypography,
  primitives: Primitives
): Record<string, string> {
  const result: Record<string, string> = {};

  const scaling = semanticHeading.scaling ?? 1;
  // Scale Multiplikatoren für h1-h6 (relativ zu h1)
  const sizeMultipliers = [1.0, 0.875, 0.75, 0.6875, 0.625, 0.5625];

  // Resolveiere die Font-References aus heading group
  const fontResolved = semanticHeading.font
    ? resolveTypographyReferences(semanticHeading.font, primitives, 'heading')
    : {};

  // Base values extrahieren aus heading group
  // Priorisiere font.size (key), sonst direkten size-Wert
  const baseSizeKey = semanticHeading.font?.size;
  const baseSize = baseSizeKey
    ? primitives.typography?.heading?.size?.[baseSizeKey]
    : (semanticHeading.size ?? '1rem');

  const baseLineHeightKey = semanticHeading.font?.lineHeight;
  const baseLineHeight = baseLineHeightKey
    ? primitives.typography?.heading?.lineHeight?.[baseLineHeightKey]
    : (semanticHeading.lineHeight ?? 1.2);

  const lhNum =
    typeof baseLineHeight === 'string'
      ? parseFloat(baseLineHeight)
      : baseLineHeight;

  const scaledLineHeight = ((lhNum ?? 1.2) * scaling).toFixed(2);

  // Berechne h1-h6
  sizeMultipliers.forEach((multiplier, index) => {
    const heading = `h${index + 1}`;

    // Size
    result[`--heading-${heading}-size`] = `calc(${baseSize} * ${multiplier} * ${scaling})`;

    // LineHeight
    result[`--heading-${heading}-line-height`] = scaledLineHeight;

    // Andere Font-Properties (gleich für alle h1-h6)
    Object.entries(fontResolved).forEach(([cssKey, value]) => {
      if (cssKey !== 'font-size' && cssKey !== 'line-height') {
        result[`--heading-${heading}-${cssKey}`] = value;
      }
    });
  });

  return result;
}

// ==========================================
// DEFAULT TYPOGRAPHY
// ==========================================

/**
 * Resolveiert Default Typography zu CSS Variables
 */
export function resolveDefaultTypography(
  semanticDefault: Record<string, any>,
  primitives: Primitives
): Record<string, string> {
  const result: Record<string, string> = {};

  if (semanticDefault.font) {
    const fontResolved = resolveTypographyReferences(
      semanticDefault.font,
      primitives,
      'default'
    );
    Object.entries(fontResolved).forEach(([key, value]) => {
      result[`--typography-default-${key}`] = value;
    });
  }

  if (semanticDefault.color) {
    result['--typography-default-color'] = semanticDefault.color;
  }

  return result;
}

// ==========================================
// BREAKPOINTS
// ==========================================

/**
 * Generiert CSS Variables aus Primitive Breakpoints
 * Keine Umwandlung nötig, einfach durchgeben
 */
export function generateBreakpointVariables(
  primitiveBreakpoints: Record<string, string>
): Record<string, string> {
  const result: Record<string, string> = {};

  Object.entries(primitiveBreakpoints).forEach(([name, value]) => {
    result[`--breakpoint-${name}`] = value;
  });

  return result;
}

// ==========================================
// FLATTEN SEMANTIC TOKENS
// ==========================================

/**
 * Flattened nested Semantic Tokens zu CSS Variables
 * Resolveiert alle Color-Refs dabei
 *
 * Input:
 * {
 *   colors: {
 *     text: {
 *       primary: 'gray.900',
 *       secondary: 'gray.700'
 *     },
 *     background: {
 *       page: '#ffffff',
 *       overlay: '#000000/0.5'
 *     }
 *   }
 * }
 *
 * Output:
 * {
 *   '--color-text-primary': '#111827',
 *   '--color-text-secondary': '#374151',
 *   '--color-background-page': '#ffffff',
 *   '--color-background-overlay': 'rgba(0,0,0,0.5)',
 * }
 */
export function flattenSemanticTokens(
  semantic: Record<string, any>,
  primitiveColors: PrimitiveColors,
  primitives: Primitives,
  prefix = 'color'
): Record<string, string> {
  const result: Record<string, string> = {};

  function flatten(obj: any, path: string[] = []) {
    Object.entries(obj).forEach(([key, value]) => {
      // Skip breakpoints, werden separat behandelt
      if (key === 'breakpoints') {
        return;
      }

      const currentPath = [...path, key];
      const varName = `--${prefix}-${currentPath.join('-')}`;

      if (typeof value === 'string') {
        // Skip properties that are not color values (e.g., box-shadow)
        if (key === 'shadow') {
          result[varName] = value; // Pass through as-is
        } else {
          // Parse as color reference
          const cssValue = parseColorRef(value, primitiveColors);
          result[varName] = cssValue;
        }
      } else if (
        typeof value === 'object' &&
        value !== null &&
        key !== 'font' &&
        key !== 'typography'
      ) {
        // Rekursiv (aber nicht für 'font' und 'typography' da die separat behandelt werden)
        flatten(value, currentPath);
      }
    });
  }

  flatten(semantic);
  return result;
}

// ==========================================
// PRIMITIVE TOKENS OUTPUT
// ==========================================

/**
 * Generiert CSS Variables aus Primitive Tokens
 */
export function generatePrimitiveVariables(
  primitives: Primitives
): Record<string, string> {
  const result: Record<string, string> = {};

  // Colors
  if (primitives.colors) {
    Object.entries(primitives.colors).forEach(([colorName, shades]) => {
      Object.entries(shades as Record<number, string>).forEach(
        ([shade, hex]) => {
          result[`--color-${colorName}-${shade}`] = hex;
        }
      );
    });
  }

  // Typography - Default
  if (primitives.typography?.default?.family) {
    Object.entries(primitives.typography.default.family).forEach(
      ([key, value]) => {
        result[`--font-${key}`] = value;
      }
    );
  }

  if (primitives.typography?.default?.size) {
    Object.entries(primitives.typography.default.size).forEach(([key, value]) => {
      result[`--text-${key}`] = value;
    });
  }

  if (primitives.typography?.default?.weight) {
    Object.entries(primitives.typography.default.weight).forEach(
      ([key, value]) => {
        result[`--font-${key}`] = String(value);
      }
    );
  }

  if (primitives.typography?.default?.lineHeight) {
    Object.entries(primitives.typography.default.lineHeight).forEach(
      ([key, value]) => {
        result[`--leading-${key}`] = String(value);
      }
    );
  }

  if (primitives.typography?.default?.letterSpacing) {
    Object.entries(primitives.typography.default.letterSpacing).forEach(
      ([key, value]) => {
        result[`--tracking-${key}`] = value;
      }
    );
  }

  // Spacing
  if (primitives.spacing) {
    Object.entries(primitives.spacing).forEach(([key, value]) => {
      result[`--space-${key}`] = value;
    });
  }

  // Sizing
  if (primitives.sizing) {
    Object.entries(primitives.sizing).forEach(([key, value]) => {
      result[`--size-${key}`] = value;
    });
  }

  // Border Radius
  if (primitives.border?.radius) {
    Object.entries(primitives.border.radius).forEach(([key, value]) => {
      result[`--radius-${key}`] = value;
    });
  }

  // Shadows
  if (primitives.shadow) {
    Object.entries(primitives.shadow).forEach(([key, value]) => {
      result[`--shadow-${key}`] = value;
    });
  }

  // Z-Index
  if (primitives.zIndex) {
    Object.entries(primitives.zIndex).forEach(([key, value]) => {
      result[`--z-${key}`] = String(value);
    });
  }

  // Transitions
  if (primitives.transition) {
    Object.entries(primitives.transition).forEach(([key, value]) => {
      result[`--transition-${key}`] = value;
    });
  }

  // Breakpoints
  if (primitives.breakpoint) {
    Object.entries(primitives.breakpoint).forEach(([key, value]) => {
      if (value) {
        result[`--breakpoint-${key}`] = value;
      }
    });
  }

  return result;
}

// ==========================================
// EXPORT ALL
// ==========================================

export {
  hexToRgb,
  normalizeAlpha,
};
