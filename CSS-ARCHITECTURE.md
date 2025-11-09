# Indium UI - CSS Framework Architecture

## Overview

**Goal:** Complete semantic CSS framework for Svelte 5 + SvelteKit with:
- Customizable design tokens (Primitives + Semantic)
- Light & Dark theme support
- PostCSS-based CSS generation
- Zero-config for library users
- Mobile-first responsive design

---

## Architecture

### Layer 1: Primitive Tokens (Raw Values)
**Location:** `src/lib/config/defaults.ts`

All base design values - **not theme-dependent**:
- **Colors**: Gray (shadcn-svelte), Blue, Green, Yellow, Red (11 shades each)
- **Typography**: default, heading, mono (family, size, weight, lineHeight, letterSpacing)
- **Spacing**: 4px base scale (0-24)
- **Sizing**: full, auto, fit, min, max
- **Border Radius**: none, sm, base, md, lg, xl, full
- **Shadows**: sm, base, md, lg, xl
- **Z-Index**: base, dropdown, sticky, fixed, modalBackdrop, modal, popover, tooltip
- **Transitions**: fast, base, slow
- **Breakpoints** (mobile-first): tablet (768px), desktop (1024px), wide (1440px)

### Layer 2: Semantic Tokens (Opinionated)
**Location:** `src/lib/config/defaults.ts`

Theme-aware color intentions + typography roles:

**Colors (Light & Dark):**
- Text: primary, secondary, tertiary, disabled, inverse
- Background: page, surface, elevated, overlay
- Border: normal, hover, focus
- Action: primary (4 states), secondary (3 states)
- Feedback: success, warning, danger, info (4 properties each)
- FocusRing: color, shadow

**Typography (Light & Dark):**
- Default: font refs + color
- Heading: font refs + size (base h1) + scaling (1.0 multiplier) + color
  - Scaling affects both size AND lineHeight proportionally
  - h1-h6 calculated: `calc(baseSize * sizeMultiplier * scaling)`

**Sizing:**
- Global scaling multiplier for components

**References:**
- Color: `'gray.500'` or `'gray.500/0.5'` or `'#ffffff'` or `'#ffffff/0.5'`
- Typography: keys like `'sans'`, `'base'`, `'bold'`, `'tight'`

---

## Data Flow

### Development (Library)

```
Library Dev
├── src/lib/config/
│   ├── types.ts           ✅ DONE (with fixes)
│   ├── defaults.ts        ✅ DONE
│   ├── render-helpers.ts  ⚠️ HALF (has errors)
│   └── config-loader.ts   ❌ TODO
├── src/lib/
│   ├── postcss-plugin.ts  ❌ TODO
│   └── styles/
│       └── index.css      (with @indium-theme marker)
├── postcss.config.js      ❌ TODO (auto-loads plugin)
└── .storybook/
    └── preview.ts         (imports CSS)

Flow:
pnpm dev
  → Vite loads postcss.config.js
  → PostCSS plugin finds @indium-theme in index.css
  → Loads defaults.ts (or optional indium.config.ts for testing)
  → Generates CSS
  → HMR updates Storybook
```

### User Installation

```
user-project/
├── node_modules/indium-ui/
├── postcss.config.js      (optional, inherits indium plugin)
├── indium.config.ts       (optional overrides)
└── src/
    └── app.svelte         (imports 'indium-ui/styles')

Flow:
pnpm install indium-ui
  → User creates postcss.config.js with indium plugin
  → User creates indium.config.ts (only overrides)
  → pnpm dev
    → PostCSS plugin finds ./indium.config.ts
    → Deep merges with defaults
    → Generates CSS with user config
    → CSS is theme-ready!
```

---

## Render Helpers (`src/lib/config/render-helpers.ts`)

**Status:** Half done, needs fixes

### Completed Functions
- ✅ `parseColorRef()` - Resolve color references to HEX or rgba
- ✅ `hexToRgb()` - Convert HEX to RGB numbers
- ✅ `normalizeAlpha()` - Parse alpha values (50 → 0.5, 0.5 → 0.5)

### Completed Functions (need testing)
- ✅ `resolveTypographyReferences()` - Map font keys to primitive values
- ✅ `calculateHeadingScaling()` - Generate h1-h6 with proportional scaling
- ✅ `resolveDefaultTypography()` - Resolve default typography
- ✅ `generateBreakpointVariables()` - Output breakpoints as CSS vars
- ✅ `flattenSemanticTokens()` - Flatten nested semantic tokens
- ✅ `generatePrimitiveVariables()` - Output all primitives as CSS vars

### Fixes Needed
- Check `calculateHeadingScaling()` - ensure h1-h6 all get same lineHeight (not individual)
- Verify color parsing edge cases
- Test with actual build

---

## PostCSS Integration (`src/lib/postcss-plugin.ts`)

**TODO - Implementation needed**

```typescript
export default function indiumThemePlugin() {
  return {
    postcssPlugin: 'indium-ui/theme',
    AtRule: {
      'indium-theme': (atRule) => {
        // Load user config
        // Generate CSS
        // Replace @indium-theme with generated CSS
      }
    }
  };
}
```

**Key Points:**
- Auto-included in library's postcss.config.js
- User inherits plugin automatically
- No user config needed for PostCSS
- Respects user's other PostCSS plugins

---

## Config Loader (`src/lib/config/config-loader.ts`)

**TODO - Implementation needed**

```typescript
export function loadUserConfig(): IndiumConfig {
  // Search for indium.config.ts/.js in CWD
  // Return user config or empty object
}

export function deepMerge(target: IndiumConfig, source: IndiumConfig): IndiumConfig {
  // Recursively merge source into target
  // User values override defaults
}
```

---

## CSS Generation (`src/lib/postcss-plugin.ts` or `generate-theme.ts`)

**TODO - Implementation needed**

### Output Structure

```css
/* Primitives - All raw values */
:root {
  --color-gray-50: #f9fafb;
  --color-blue-700: #1d4ed8;
  /* ... all colors, spacing, typography, shadows, zIndex, transitions, breakpoints */
}

/* Semantic Light Theme */
[data-theme="light"],
:root:not([data-theme="dark"]) {
  color-scheme: light;
  --color-text-primary: #111827;
  --color-bg-page: #ffffff;
  --color-action-primary: #1d4ed8;
  --color-focus-ring-shadow: 0 0 0 3px rgba(59, 130, 246, 0.2);
  
  /* Heading scales */
  --heading-h1-size: calc(2rem * 1.0 * 1);
  --heading-h1-line-height: 1.2;
  --heading-h1-font-family: var(--font-sans);
  --heading-h1-font-weight: 700;
  /* ... h2-h6 */
  
  /* Typography Default */
  --typography-default-font-family: ...;
  --typography-default-font-size: 1rem;
}

/* Semantic Dark Theme */
[data-theme="dark"] {
  color-scheme: dark;
  --color-text-primary: #f9fafb;
  /* ... dark values */
}

@media (prefers-color-scheme: dark) {
  :root:not([data-theme="light"]) {
    /* ... same as [data-theme="dark"] */
  }
}
```

---

## Type System (`src/lib/config/types.ts`)

**Status:** ✅ DONE (with TS7008/7010 fixes)

- `IndiumConfig` - User config interface
- `Primitives` - All primitive tokens
- `Semantic` - Light/Dark semantic tokens
- `SemanticHeadingTypography` - Heading with scaling
- `ColorRef` - Color reference type

---

## File Structure (Target)

```
src/lib/
├── config/
│   ├── types.ts              ✅
│   ├── defaults.ts           ✅
│   ├── render-helpers.ts     ⚠️ (half, needs fixes)
│   ├── config-loader.ts      ❌
│   └── index.ts              ❌ (exports)
├── postcss-plugin.ts         ❌
├── styles/
│   ├── index.css             ❌ (with @indium-theme)
│   ├── reset.css             ❌
│   ├── base.css              ❌
│   └── components/
│       ├── button.css        ❌
│       └── ...
└── components/
    ├── atoms/
    ├── molecules/
    └── organisms/

postcss.config.js             ❌
```

---

## Next Steps (Priority Order)

1. **Fix `render-helpers.ts`** - Debug errors, test functions
2. **Create `config-loader.ts`** - Deep merge + config loading
3. **Create `postcss-plugin.ts`** - @indium-theme directive handler
4. **Create `postcss.config.js`** - Auto-loads plugin
5. **Create `src/lib/styles/index.css`** - Base file with @indium-theme
6. **Restructure existing components** - Use new CSS variables
7. **Test with user scenario** - Verify packaging & npm install

---

## Testing Checklist

- [ ] Library builds successfully
- [ ] Storybook loads with correct CSS
- [ ] HMR updates CSS on config change
- [ ] User can install & use library
- [ ] User config overrides work
- [ ] Light/Dark theme switching works
- [ ] Breakpoints work (mobile-first)
- [ ] All primitives accessible via CSS vars
- [ ] PostCSS plugin coexists with other plugins
