# Phase Testing Guide

Dieser Guide zeigt, wie jede Phase der CSS-Architecture-Implementation getestet werden kann.

---

## Phase 1: Foundation Fixes ✅

### Manuelle Tests
```bash
# TypeScript Check
pnpm check

# Unit Tests ausführen
pnpm test:unit src/lib/config/render-helpers.test.ts
```

### Erwartetes Ergebnis
- ✅ `pnpm check` → 0 errors, 0 warnings
- ✅ `pnpm test:unit` → All 37 tests passing

### Was wurde getestet?
- Color parsing (Hex, rgba, references mit/ohne Alpha)
- Typography resolution (family, size, weight, lineHeight, letterSpacing)
- Heading scaling calculations (h1-h6 mit Multipliers)
- Default typography resolution
- Breakpoint generation
- Flatten semantic tokens
- Generate primitive variables

---

## Phase 2: Config Infrastructure ⏳

### 2.1 Config-Loader Tests

**Erstelle Test-File:** `/src/lib/config/config-loader.test.ts`

```bash
# Unit Tests für Config-Loader
pnpm test:unit src/lib/config/config-loader.test.ts
```

**Test-Cases:**
- Deep merge with nested objects
- Deep merge with partial overrides
- Find config file (.ts, .js, .mjs)
- Load config async
- Load config sync
- Fallback to defaults when no config found
- Error handling for invalid configs
- Validate config structure

### 2.2 Config Index Export Test

**Erstelle:** `/src/lib/config/index.ts`

```typescript
// Manual test: Import in a test file
import {
  defaultConfig,
  loadConfig,
  deepMerge,
  parseColorRef,
  generatePrimitiveVariables
} from './config/index.js';
```

```bash
# TypeScript Check
pnpm check
```

### 2.3 Integration Test

**Erstelle Mock Config:** `/indium.config.test.ts` (temporary)

```typescript
import { defineConfig } from './src/lib/config/index.js';

export default defineConfig({
  primitives: {
    colors: {
      brand: {
        500: '#ff6b6b'
      }
    }
  }
});
```

**Test Loading:**
```bash
# In Node REPL or test script
node --loader tsx
> const { loadConfig } = require('./src/lib/config/config-loader.ts');
> const config = await loadConfig();
> console.log(config.primitives.colors.brand);
```

---

## Phase 3: PostCSS Plugin

### 3.1 PostCSS Plugin Tests

**Erstelle Test-File:** `/src/lib/postcss-plugin.test.ts`

**Test Input CSS:**
```css
@indium-theme;
```

**Expected Output:** Generated CSS with:
- Primitive variables (`:root`)
- Semantic Light theme (`[data-theme="light"]`)
- Semantic Dark theme (`[data-theme="dark"]`)
- Media query fallback (`@media (prefers-color-scheme: dark)`)

**Run Test:**
```bash
pnpm test:unit src/lib/postcss-plugin.test.ts
```

### 3.2 Manual PostCSS Test

**Erstelle:** `/test.css`
```css
@indium-theme;

.test {
  color: var(--color-text-primary);
}
```

**Run PostCSS:**
```bash
npx postcss test.css -o test.output.css
```

**Verify Output:**
```bash
cat test.output.css | head -50
# Should show generated CSS variables
```

---

## Phase 4: CSS Generation

### 4.1 Build Test

```bash
# Build library
pnpm build

# Check dist/ folder for generated CSS
ls -la dist/
cat dist/styles/index.css | head -100
```

### 4.2 Component CSS Verification

**Check Button still works:**
```bash
# Start dev server
pnpm dev

# Open browser: http://localhost:5173
# Verify Button component renders correctly
```

### 4.3 Theme Switching Test

**Manual test in browser:**
1. Open DevTools Console
2. Run:
```javascript
// Switch to dark mode
document.documentElement.setAttribute('data-theme', 'dark');

// Switch to light mode
document.documentElement.setAttribute('data-theme', 'light');

// Auto (system preference)
document.documentElement.removeAttribute('data-theme');
```

3. Verify CSS variables update in DevTools

---

## Phase 5: Build Integration

### 5.1 Vite Integration Test

```bash
# Development build
pnpm dev

# Production build
pnpm build

# Check build output
ls -la dist/
```

**Verify:**
- ✅ CSS is generated in dist/
- ✅ PostCSS plugin ran during build
- ✅ No build errors

### 5.2 Storybook Test

```bash
# Start Storybook
pnpm storybook

# Open browser: http://localhost:6006
```

**Verify:**
- ✅ Stories load without errors
- ✅ Dark mode toggle works
- ✅ Components use generated CSS variables
- ✅ Theme switching updates visuals

### 5.3 HMR Test

**Terminal 1:**
```bash
pnpm dev
```

**Terminal 2:**
```bash
# Edit indium.config.ts
# Change a color value
# Save file
```

**Browser:**
- ✅ Page auto-reloads
- ✅ New color appears
- ✅ No errors in console

---

## Phase 6: Package Distribution

### 6.1 Build & Pack Test

```bash
# Build library
pnpm build

# Create tarball
pnpm pack

# Output: indium-ui-0.0.1.tgz
```

### 6.2 Local Install Test

**Create test project:**
```bash
cd /tmp
pnpm create svelte@latest test-indium
cd test-indium

# Install local package
pnpm add /path/to/indium-ui/indium-ui-0.0.1.tgz
```

**Test import:**
```typescript
// src/routes/+page.svelte
<script>
  import { Button } from 'indium-ui';
  import 'indium-ui/styles';
</script>

<Button>Test</Button>
```

**Create user config:**
```bash
# /tmp/test-indium/indium.config.ts
import { defineConfig } from 'indium-ui/config';

export default defineConfig({
  primitives: {
    colors: {
      blue: {
        500: '#00ff00' // Override blue
      }
    }
  }
});
```

**Add PostCSS config:**
```javascript
// postcss.config.js
import indiumPlugin from 'indium-ui/postcss';

export default {
  plugins: [indiumPlugin()]
};
```

**Run:**
```bash
pnpm dev
# Verify blue.500 is now green
```

---

## Phase 7: E2E & Final Tests

### 7.1 Playwright E2E Tests

```bash
# Run E2E tests
pnpm test:e2e
```

**Test scenarios:**
- Theme switching (light/dark)
- CSS variable values match config
- Components render with correct styles
- Accessibility (contrast, focus states)

### 7.2 Accessibility Tests

```bash
# Run a11y tests with axe
pnpm test:e2e --grep="accessibility"
```

**Verify:**
- ✅ WCAG 2.2 Level AA compliance
- ✅ Color contrast ratios
- ✅ Focus indicators visible
- ✅ Screen reader compatibility

### 7.3 Full Build Test

```bash
# Clean install
rm -rf node_modules dist .svelte-kit
pnpm install

# Full test suite
pnpm test        # All tests
pnpm check       # TypeScript
pnpm lint        # ESLint
pnpm build       # Production build

# Final verification
ls -la dist/
```

---

## Quick Test Commands Summary

```bash
# After each phase, run:
pnpm check                    # TypeScript validation
pnpm test:unit               # Unit tests
pnpm build                   # Build library
pnpm dev                     # Test in dev mode
pnpm storybook              # Visual testing

# Full validation:
pnpm test && pnpm check && pnpm build
```

---

## Automated Phase Completion Checklist

### Phase 1
- [ ] `pnpm check` → 0 errors
- [ ] `pnpm test:unit src/lib/config/render-helpers.test.ts` → All passing

### Phase 2
- [ ] `pnpm check` → 0 errors
- [ ] `pnpm test:unit src/lib/config/config-loader.test.ts` → All passing
- [ ] Manual import test of `config/index.ts` works

### Phase 3
- [ ] `pnpm check` → 0 errors
- [ ] `pnpm test:unit src/lib/postcss-plugin.test.ts` → All passing
- [ ] Manual PostCSS test generates CSS

### Phase 4
- [ ] `pnpm build` → Success
- [ ] Generated CSS exists in dist/
- [ ] `pnpm dev` → Components render

### Phase 5
- [ ] `pnpm storybook` → Stories load
- [ ] Dark mode toggle works
- [ ] HMR works with config changes

### Phase 6
- [ ] `pnpm pack` → Creates tarball
- [ ] Local install test works
- [ ] User config override works

### Phase 7
- [ ] `pnpm test:e2e` → All passing
- [ ] `pnpm test` → Full suite passing
- [ ] Final build successful
