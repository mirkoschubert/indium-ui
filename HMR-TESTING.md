# HMR Testing Guide for indium.config.ts

This document explains how to test Hot Module Replacement (HMR) for the Indium UI configuration system.

## How It Works

The `indiumConfigHMR()` Vite plugin watches for changes to `indium.config.ts` and automatically reloads the browser when the config changes. This ensures theme customizations are immediately visible during development.

**Technical Implementation:**
- Vite plugin detects config file changes via `handleHotUpdate` hook
- Sends `full-reload` message to browser instead of HMR (theme changes are global)
- Invalidates all CSS modules to force PostCSS re-processing with fresh config
- Cache-busting ensures fresh config values on each reload

## Manual Testing Steps

### 1. Start Development Server

```bash
# For SvelteKit development
pnpm dev

# OR for Storybook development (recommended)
pnpm storybook
```

**Expected console output:**
```
Watching Indium config: /path/to/indium.config.ts
```

### 2. Open Browser

Visit `http://localhost:5173` (or `http://localhost:6006` for Storybook)

### 3. Make Config Changes

Edit `/indium.config.ts` and change a color value:

```typescript
blue: {
  500: '#ff0000', // Changed to red for testing
  600: '#0052a3',
  700: '#003d7a',
},
```

### 4. Observe Behavior

**Expected terminal output:**
```
🔄 Indium config changed, triggering full reload...
✓ Indium UI theme generated
```

**Expected browser behavior:**
- Browser automatically reloads (full page reload, not HMR)
- New theme colors are immediately visible
- No manual refresh needed

### 5. Verify Changes

Check that the blue color has changed to red:
- Button components using `blue.500` should now be red
- CSS variables in DevTools should show `--color-blue-500: #ff0000`

## Testing in User Projects

When users install `indium-ui` and create their own `indium.config.ts`:

**User's vite.config.ts:**
```typescript
import { sveltekit } from '@sveltejs/kit/vite';
import { indiumConfigHMR } from 'indium-ui'; // Import from package
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [sveltekit(), indiumConfigHMR()], // Add HMR plugin
});
```

The plugin will automatically:
1. Find `indium.config.ts` in the user's project root
2. Watch for changes
3. Trigger browser reload when config changes
4. Re-generate theme CSS with new values

## Why Full Reload Instead of HMR?

The plugin uses **full page reload** instead of Hot Module Replacement because:

1. **Empty module graph** - CSS modules might not be loaded yet before first page visit
2. **Global changes** - Theme changes affect all components, not just one module
3. **Reliability** - Full reload ensures consistency across the entire application
4. **Simplicity** - No need to track which components use which tokens

## Troubleshooting

### "Watching Indium config" message not appearing

**Cause:** Config file not found or not in correct location
**Fix:** Ensure `indium.config.ts` exists in project root (same directory as `vite.config.ts`)

### Changes not triggering reload

**Cause:** Plugin not registered in Vite config
**Fix:** Add `indiumConfigHMR()` to plugins array in `vite.config.ts`

### Old values still showing after reload

**Cause:** Browser cache
**Fix:** Hard refresh (Cmd+Shift+R on Mac, Ctrl+Shift+R on Windows) or disable cache in DevTools

### TypeScript errors in config file

**Cause:** Config syntax error or wrong import
**Fix:** Use `defineConfig()` helper for type safety:
```typescript
import { defineConfig } from 'indium-ui';

export default defineConfig({
  // Your config here
});
```

## Known Limitations

- **Full reload required** - Not true HMR, browser does full page reload
- **Config only** - Doesn't watch CSS files (Vite handles that automatically)
- **TypeScript config** - Requires Vite/esbuild to compile .ts files (already handled)

## Performance Notes

- Config loading is **cached by Node.js** between reloads
- Cache-busting via `?t=${Date.now()}` ensures fresh imports
- PostCSS only re-runs on CSS modules, not all files
- Full reload is fast (~100-300ms) for small-to-medium projects
