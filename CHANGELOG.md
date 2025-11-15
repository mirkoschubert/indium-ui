# Changelog

All notable changes to Indium UI will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.1.0] - 2025-01-15

### Added

- Semantic CSS framework with design tokens
- Theme system with light/dark mode support
- CSS custom properties for full customization
- Configuration system via `indium.config.ts`
- PostCSS plugin for automatic CSS variable generation
- Two-tier token system (primitives → semantic)
- Theme-independent tokens (typography, sizing)
- Primitive color palette (gray, blue, red, green, yellow)
- Semantic color tokens (text, background, border, action, feedback)
- Dark mode with auto-detection and manual override

### Changed

- Button component now uses semantic CSS tokens
- Danger button uses `feedback.danger` tokens (semantically correct)

### Fixed

- CSS variable generation (removed duplicate theme-independent tokens)
- Button line-height token (added `--leading-none`)
- Deprecated `.substr()` replaced with `.slice()`
- Type exports for config types
- Test file organization (moved out of subdirectories)

## [0.0.1] - 2025-01-10

### Added

- Initial project setup with SvelteKit library mode
- Button component with variants: primary, secondary, outline, ghost, danger
- Button sizes: sm, md, lg
- Accessibility utilities (focus management, screen reader announcements)
- TypeScript support with strict mode
- Comprehensive test suite (Vitest + Playwright + axe-core)
- Storybook for component development
- Basic CSS reset and component styles

[0.1.0]: https://github.com/mirkoschubert/indium-ui/releases/tag/v0.1.0
[0.0.1]: https://github.com/mirkoschubert/indium-ui/releases/tag/v0.0.1
