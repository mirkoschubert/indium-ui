# CSS Architecture Implementation Progress

**Started:** 2025-11-09
**Status:** In Progress

---

## Phase 1: Foundation Fixes ✅ COMPLETED

### 1.1 Fix render-helpers.ts Bugs ✅
- [x] **Fixed Line 71-72:** Array destructuring for Alpha-parsing corrected
  - Changed `const colorPath = alphaParts;` to `const colorPath = alphaParts[0];`
  - Changed `const alphaStr = alphaParts;` to `const alphaStr = alphaParts[1];`

- [x] **Fixed Lines 194-203:** Correct fallback for heading typography
  - Added fallback to `semanticHeading.size` if `font.size` key doesn't exist
  - Added fallback to `semanticHeading.lineHeight` if `font.lineHeight` key doesn't exist
  - Ensures both reference keys AND direct values are supported

- [x] Color-Parsing verified: Hex and rgba() with alpha values work correctly

### 1.2 Test Render Helpers ✅ COMPLETED
- [x] Unit-Tests for `parseColorRef()` with Hex and Alpha values
- [x] Test `resolveTypographyReferences()` with correct Primitives
- [x] Test `calculateHeadingScaling()` with h1-h6 generation
- [x] Test `generatePrimitiveVariables()` for complete CSS output
- [x] **All 37 tests passing!** ✅

**Files created:**
- `/src/lib/config/render-helpers.test.ts`

---

## Phase 2: Config Infrastructure ⏳ IN PROGRESS

### 2.1 Create config-loader.ts ✅ COMPLETED
- [x] `loadConfig()` - Async config loading with dynamic import
- [x] `loadConfigSync()` - Synchronous fallback for compatibility
- [x] `findConfigFile()` - Searches for `indium.config.{ts,js,mjs}` in CWD
- [x] `deepMerge()` - Recursive merge function (User overrides Defaults)
- [x] Support for `.ts`, `.js`, `.mjs` config files
- [x] Error handling for invalid configs
- [x] `defineConfig()` - Type-safe config helper for users
- [x] `validateConfig()` - Basic config validation

**Files created:**
- `/src/lib/config/config-loader.ts`

**TypeScript Fixes:**
- [x] Fixed import extensions (`.js` for SvelteKit)
- [x] Fixed `vi` import in tests
- [x] Fixed `lhNum` undefined check
- [x] Fixed breakpoint value undefined check
- [x] **pnpm check → 0 errors ✅**

### 2.2 Create config/index.ts ✅ COMPLETED
- [x] Export all Config utilities
- [x] Export Types (all interfaces and types)
- [x] Export Defaults, Render-Helpers, Config-Loader
- [x] Clean public API for PostCSS plugin
- [x] **pnpm check → 0 errors ✅**

**Files created:**
- `/src/lib/config/index.ts`

### 2.3 Test Config Loading ✅ COMPLETED
- [x] Create config-loader.test.ts
- [x] Test Deep-Merge with nested objects (8 tests)
- [x] Test defineConfig helper (2 tests)
- [x] Test validateConfig (5 tests)
- [x] Test integration workflow (1 test)
- [x] **All 16 tests passing ✅**

**Files created:**
- `/src/lib/config/config-loader.test.ts`

**Phase 2 Summary:**
- ✅ **Total: 53 tests passing** (37 render-helpers + 16 config-loader)
- ✅ **TypeScript: 0 errors, 0 warnings**

---

## Phase 3: PostCSS Plugin

### 3.1 Create postcss-plugin.ts
- [ ] Plugin registers `@indium-theme` AtRule
- [ ] Load config via `config-loader.ts`
- [ ] Generate CSS with `render-helpers.ts`
- [ ] Replace `@indium-theme` with generated CSS
- [ ] Support for HMR (watch mode)

### 3.2 Create postcss.config.js
- [ ] Auto-load Indium PostCSS Plugin
- [ ] Compatible with other PostCSS plugins
- [ ] Configuration for library development

### 3.3 Test PostCSS Integration
- [ ] Test with minimal CSS file
- [ ] Verify output contains Primitives + Semantic (Light/Dark)
- [ ] Test HMR with config changes

---

## Phase 4: CSS Generation

### 4.1 Update src/lib/styles/index.css
- [ ] Replace `@import` statements with `@indium-theme` directive
- [ ] Keep `reset.css` and `base.css` imports
- [ ] Import component CSS files

### 4.2 Delete/Backup Old Files
- [ ] **DELETE:** `tokens.css` (will be generated)
- [ ] **DELETE:** `themes/light.css` (will be generated)
- [ ] **DELETE:** `themes/dark.css` (will be generated)
- [ ] **KEEP:** `components/*.css` (unchanged)

### 4.3 Verify Component CSS
- [ ] Ensure `components/button.css` still works
- [ ] Verify Semantic Tokens are correctly referenced
- [ ] Test Light/Dark theme switching

---

## Phase 5: Build Integration

### 5.1 Update vite.config.ts
- [ ] Verify PostCSS config is loaded
- [ ] Ensure CSS generation runs in build
- [ ] Test production build

### 5.2 Update Storybook Config
- [ ] Ensure `.storybook/preview.ts` imports `indium-ui/styles`
- [ ] Test PostCSS pipeline in Storybook
- [ ] Verify Dark Mode toggle works

### 5.3 Create Test indium.config.ts (in Library Root)
- [ ] For HMR testing during development
- [ ] Override individual tokens for testing
- [ ] Test HMR with `pnpm dev`

---

## Phase 6: Package Distribution

### 6.1 Update package.json
- [ ] Export PostCSS plugin: `"exports": { "./postcss": "./dist/postcss-plugin.js" }`
- [ ] Export Config types: `"./config": "./dist/config/index.js"`
- [ ] Ensure CSS is bundled in dist/

### 6.2 Create README Section
- [ ] Documentation for user installation
- [ ] Example `postcss.config.js` for user projects
- [ ] Example `indium.config.ts` with overrides

### 6.3 Test Package Installation
- [ ] Build library: `pnpm build`
- [ ] Test local install: `pnpm pack` + install in test project
- [ ] Verify CSS generation works in user project

---

## Phase 7: Testing & Documentation

### 7.1 E2E Tests
- [ ] Playwright test for theme switching
- [ ] Accessibility tests for all themes
- [ ] Test breakpoints (mobile-first)

### 7.2 Documentation
- [ ] Update CLAUDE.md with new CSS architecture
- [ ] Add CSS-ARCHITECTURE.md as permanent reference
- [ ] Storybook docs for theming system

### 7.3 Final Verification
- [ ] Library builds successfully
- [ ] Storybook loads with correct CSS
- [ ] HMR updates CSS on config change
- [ ] User can install & use library
- [ ] User config overrides work
- [ ] Light/Dark theme switching works
- [ ] All components work unchanged

---

## Key Decisions Made

1. **Color Format:** Hex stays Hex, alpha transparency uses `rgba()`
2. **PostCSS Plugin:** Auto-loaded, enables user `indium.config.ts` with HMR
3. **tokens.css:** Completely replaced by generation (Option A)
4. **Breaking Changes:** Acceptable (pre-v1.0)
5. **Components:** No changes needed - continue using `/styles/components/[component].css`
6. **Config Location:** Project root (`indium.config.ts`) like Tailwind

---

## Bugs Fixed

### render-helpers.ts
1. **Line 71-72:** Fixed array destructuring for alpha parsing
2. **Lines 194-203:** Fixed heading typography reference resolution with proper fallbacks

---

## Next Steps

**Current Focus:** Phase 1.2 - Add unit tests for render helper functions

After completing Phase 1.2, proceed to Phase 2.1 to create the config-loader.ts.
