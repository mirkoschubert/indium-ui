# Contributing to Indium UI

Thank you for your interest in contributing to Indium UI! This document provides guidelines and instructions for contributing to this project.

## 🚧 Project Status

**Important:** Indium UI is currently in early development (pre-v1.0). The API is subject to change, and we're not actively accepting external contributions yet.

Once we reach v1.0, we'll fully open up contributions. Until then, feel free to:
- Report bugs via [GitHub Issues](https://github.com/mirkoschubert/indium-ui/issues)
- Suggest features via [GitHub Discussions](https://github.com/mirkoschubert/indium-ui/discussions)
- Ask questions about usage

## Development Setup

### Prerequisites

- **Node.js**: v22 or higher (managed via [fnm](https://github.com/Schniz/fnm))
- **pnpm**: v10.20.0 or higher
- **Git**: For version control
- **GitHub CLI** (optional): For releases (`gh`)

### Getting Started

1. **Fork and clone the repository:**
   ```bash
   git clone https://github.com/YOUR_USERNAME/indium-ui.git
   cd indium-ui
   ```

2. **Install dependencies:**
   ```bash
   pnpm install
   ```

3. **Start development server:**
   ```bash
   pnpm dev
   ```

4. **Run Storybook (recommended for component development):**
   ```bash
   pnpm storybook
   ```

## Project Structure

```
indium-ui/
├── src/
│   ├── lib/
│   │   ├── components/
│   │   │   ├── atoms/          # Basic components
│   │   │   ├── molecules/      # Composite components
│   │   │   └── organisms/      # Complex components
│   │   ├── styles/
│   │   │   ├── tokens.css      # Design tokens (deprecated)
│   │   │   ├── reset.css       # CSS reset
│   │   │   ├── components/     # Component styles
│   │   │   └── index.css       # Main bundle
│   │   ├── config/
│   │   │   ├── types.ts        # Type definitions
│   │   │   ├── defaults.ts     # Default configuration
│   │   │   ├── config-loader.ts
│   │   │   ├── render-helpers.ts
│   │   │   └── postcss-plugin.ts
│   │   └── utils/
│   │       ├── theme.ts        # Theme utilities
│   │       ├── a11y.ts         # Accessibility helpers
│   │       └── types.ts        # Shared types
│   ├── routes/                 # Dev/test pages
│   └── stories/                # Storybook stories
├── e2e/                        # Playwright E2E tests
├── scripts/                    # Build/release scripts
└── tests/                      # Additional test utilities
```

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feature/your-feature-name
# or
git checkout -b fix/bug-description
```

### 2. Make Your Changes

Follow these guidelines:

#### Component Development
- **Location**: Place components in appropriate directory (atoms/molecules/organisms)
- **File structure**: Each component should have:
  - `ComponentName.svelte` - Component implementation
  - `ComponentName.test.ts` - Unit tests
  - `ComponentName.spec.ts` - E2E tests (optional)
  - Storybook story in `/src/stories/`

- **Svelte 5 Runes**: Use the new Runes API (`$props()`, `$derived()`, `$effect()`)
- **TypeScript**: Strict mode required, proper typing for all props
- **CSS**: Semantic class names, use design tokens, no inline styles
- **Accessibility**: WCAG 2.2 Level AA minimum (AAA target)

#### CSS Development
- **Semantic classes**: `.button-primary`, not `.btn-blue-500`
- **Design tokens**: Use CSS custom properties from config system
- **No utility classes**: This is NOT Tailwind - we use semantic CSS
- **Component styles**: Place in `src/lib/styles/components/`

#### Testing Requirements
Every component must have:
- **Unit tests** (Vitest): Logic, props, events
- **Accessibility tests** (axe-core): ARIA, keyboard navigation, focus management
- **Visual tests** (Playwright): Visual regression, responsive design
- **Dark mode**: Test both light and dark themes

### 3. Run Tests

```bash
# Type checking
pnpm check

# Unit tests
pnpm test:unit

# E2E tests
pnpm test:e2e

# Linting
pnpm lint

# Format code
pnpm format
```

### 4. Build

```bash
pnpm build
```

Ensure the build completes without errors.

### 5. Commit Your Changes

We use conventional commit messages:

```bash
git commit -m "feat(button): add loading state"
git commit -m "fix(input): correct focus ring color"
git commit -m "docs(readme): update installation steps"
```

**Commit types:**
- `feat:` - New feature
- `fix:` - Bug fix
- `docs:` - Documentation changes
- `style:` - Code style (formatting, not CSS)
- `refactor:` - Code refactoring
- `test:` - Test changes
- `chore:` - Build/tooling changes

### 6. Push and Create PR

```bash
git push origin feature/your-feature-name
```

Then create a Pull Request on GitHub.

## Code Style

### TypeScript
- Use **strict mode**
- Explicit return types for public APIs
- Prefer `interface` over `type` for object shapes
- Use `const` by default, `let` when reassignment needed

### Svelte
- Use **Svelte 5 Runes API**
- Prefer composition over inheritance
- Keep components small and focused
- Props should be explicitly typed with `interface Props`

### CSS
- **Semantic class names**: Describe what, not how
- **Mobile-first**: Start with mobile, add desktop styles
- **Dark mode**: Consider both themes
- **No !important**: Use proper specificity
- **Consistent spacing**: Use design tokens

### Naming Conventions
- Components: `PascalCase` (e.g., `Button.svelte`)
- Files: `kebab-case` for utilities (e.g., `theme-utils.ts`)
- CSS classes: `kebab-case` (e.g., `.button-primary`)
- Functions: `camelCase` (e.g., `generateId()`)
- Types: `PascalCase` (e.g., `ButtonProps`)

## Accessibility Guidelines

All components must be accessible:

1. **Keyboard Navigation**: All interactive elements must be keyboard accessible
2. **Screen Readers**: Proper ARIA labels and semantic HTML
3. **Focus Management**: Visible focus indicators
4. **Color Contrast**: WCAG AA minimum (4.5:1 text, 3:1 UI)
5. **Reduced Motion**: Respect `prefers-reduced-motion`

Test with:
- Keyboard only (no mouse)
- Screen reader (VoiceOver on macOS, NVDA on Windows)
- axe DevTools browser extension
- Automated tests with @axe-core/playwright

## Documentation

When adding features:

1. **Update CHANGELOG.md**: Add entry under `[Unreleased]`
2. **Add JSDoc comments**: Document public APIs
3. **Create Storybook story**: Show all variants
4. **Update README**: If adding major features

## Questions?

- **Bugs**: [GitHub Issues](https://github.com/mirkoschubert/indium-ui/issues)
- **Features**: [GitHub Discussions](https://github.com/mirkoschubert/indium-ui/discussions)
- **Questions**: [GitHub Discussions Q&A](https://github.com/mirkoschubert/indium-ui/discussions/categories/q-a)

## License

By contributing, you agree that your contributions will be licensed under the MIT License.
