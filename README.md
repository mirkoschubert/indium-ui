# @indium/ui

> Semantic component library for Svelte 5 with accessible, themeable components and integrated CSS framework

[![npm version](https://img.shields.io/npm/v/@indium/ui.svg)](https://www.npmjs.com/package/@indium/ui)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## 🚧 Work in Progress

This library is currently in early development. The API may change frequently until v1.0.

## Features

- 🎨 **Semantic CSS** - Readable class names instead of utility classes
- ♿ **Accessibility First** - WCAG 2.2 Level AA compliance (AAA target)
- 🌓 **Dark Mode** - Built-in light/dark themes with auto-detection
- 🎯 **Type Safe** - Full TypeScript support with comprehensive types
- 🎨 **Themeable** - Customizable via CSS custom properties
- 📦 **Tree-shakeable** - Import only what you need
- 🚀 **Svelte 5** - Built with the latest Svelte Runes API

## Installation

```bash
# pnpm (recommended)
pnpm add @indium/ui

# npm
npm install @indium/ui

# yarn
yarn add @indium/ui
```

## Quick Start

```svelte
<script>
  import { Button } from '@indium/ui';
  import '@indium/ui/styles';
</script>

<Button variant="primary" size="md">
  Click me
</Button>
```

### Theme Setup

Initialize the theme in your root layout:

```svelte
<!-- +layout.svelte -->
<script>
  import { initTheme } from '@indium/ui/theme';
  import '@indium/ui/styles';

  // Initialize theme on mount
  $effect(() => {
    initTheme();
  });
</script>

<slot />
```

## Available Components

### Atoms (1/15)
- ✅ Button
- ⏳ Input
- ⏳ Checkbox
- ⏳ Radio
- ⏳ Select
- ⏳ Textarea
- ⏳ Link
- ⏳ Badge
- ⏳ Tag
- ⏳ Icon
- ⏳ Heading
- ⏳ Text
- ⏳ Image
- ⏳ Video
- ⏳ Divider

_More components coming soon..._

## Theme Customization

```typescript
import { applyTheme } from '@indium/ui/theme';

applyTheme({
  'color-action-primary': '#ff6b6b',
  'color-action-primary-hover': '#ff5252',
  'radius-md': '0.75rem',
});
```

## Dark Mode

```typescript
import { setThemeMode, getThemeMode, toggleTheme } from '@indium/ui/theme';

// Set theme mode
setThemeMode('dark');   // Force dark mode
setThemeMode('light');  // Force light mode
setThemeMode('auto');   // Follow system preference

// Toggle between light and dark
toggleTheme();

// Get current mode
const mode = getThemeMode(); // 'light' | 'dark' | 'auto'
```

## Development

```bash
# Install dependencies
pnpm install

# Start dev server
pnpm dev

# Run Storybook
pnpm storybook

# Run tests
pnpm test
pnpm test:unit
pnpm test:e2e

# Build library
pnpm build

# Check types
pnpm check

# Lint
pnpm lint
```

## Project Structure

```
src/
├── lib/
│   ├── components/
│   │   ├── atoms/      # Basic components (Button, Input, etc.)
│   │   ├── molecules/  # Composite components (Card, Alert, etc.)
│   │   └── organisms/  # Complex components (Modal, Header, etc.)
│   ├── styles/
│   │   ├── tokens.css      # Design tokens
│   │   ├── reset.css       # CSS reset
│   │   ├── themes/         # Light & dark themes
│   │   └── components/     # Component styles
│   └── utils/
│       ├── theme.ts        # Theme utilities
│       ├── a11y.ts         # Accessibility helpers
│       └── types.ts        # TypeScript types
```

## Documentation

- 📚 Full documentation: _Coming soon_
- 📖 [Component Specifications](./module-1-components.md)
- 🎨 [CSS Framework Philosophy](./module-2-css-framework.md)
- 🤖 [AI Development Guide](./CLAUDE.md)

## Contributing

This project is currently in early development. Contributions will be welcome once we reach v1.0.

## License

MIT © [Mirko Schubert](https://github.com/mirkoschubert)

## Acknowledgments

- Built with [Svelte 5](https://svelte.dev/)
- Icons by [Lucide](https://lucide.dev/)
- Inspired by semantic design systems and accessibility-first development
