// indium.config.example.ts
//
// Complete example configuration for Indium UI
// This file demonstrates all available configuration options.
//
// To use this configuration:
// 1. Copy this file to `indium.config.ts`
// 2. Customize the values to match your design system
// 3. The config will be automatically loaded by the PostCSS plugin

import { defineConfig } from 'indium-ui/config';

export default defineConfig({
	// ==========================================
	// PRIMITIVES (Layer 1 - Raw Design Values)
	// ==========================================
	//
	// These are your foundational design tokens.
	// Override any subset - missing values will use defaults.

	primitives: {
		// Custom Color Palettes
		// Add your brand colors or override default palettes
		colors: {
			// Brand palette (replaces default blue)
			brand: {
				50: '#fff7ed',
				100: '#ffedd5',
				200: '#fed7aa',
				300: '#fdba74',
				400: '#fb923c',
				500: '#f97316', // Primary brand color
				600: '#ea580c',
				700: '#c2410c',
				800: '#9a3412',
				900: '#7c2d12',
				950: '#431407'
			},

			// You can also add completely new palettes
			purple: {
				50: '#faf5ff',
				100: '#f3e8ff',
				200: '#e9d5ff',
				300: '#d8b4fe',
				400: '#c084fc',
				500: '#a855f7',
				600: '#9333ea',
				700: '#7e22ce',
				800: '#6b21a8',
				900: '#581c87',
				950: '#3b0764'
			}
		},

		// Typography Scales
		typography: {
			default: {
				// Custom font families
				family: {
					sans: 'Inter, system-ui, sans-serif',
					serif: 'Merriweather, Georgia, serif',
					mono: 'JetBrains Mono, monospace'
				},
				// Custom font sizes
				size: {
					xs: '0.75rem',
					sm: '0.875rem',
					base: '1rem',
					lg: '1.125rem',
					xl: '1.25rem',
					'2xl': '1.5rem' // Add custom sizes
				},
				// Font weights
				weight: {
					light: 300,
					normal: 400,
					medium: 500,
					semibold: 600,
					bold: 700,
					extrabold: 800
				},
				// Line heights
				lineHeight: {
					tight: 1.25,
					normal: 1.5,
					relaxed: 1.625,
					loose: 2
				},
				// Letter spacing
				letterSpacing: {
					tight: '-0.02em',
					normal: '0',
					wide: '0.05em'
				}
			},

			// Heading-specific typography
			heading: {
				family: {
					sans: 'Inter, sans-serif'
				},
				size: {
					base: '2rem' // h1 base size
				},
				weight: {
					bold: 700,
					extrabold: 800
				},
				lineHeight: {
					tight: 1.2
				},
				letterSpacing: {
					tight: '-0.02em'
				}
			}
		},

		// Spacing Scale
		spacing: {
			0: '0',
			1: '0.25rem',
			2: '0.5rem',
			3: '0.75rem',
			4: '1rem',
			5: '1.25rem',
			6: '1.5rem',
			8: '2rem',
			10: '2.5rem',
			12: '3rem',
			16: '4rem',
			20: '5rem',
			24: '6rem',
			32: '8rem' // Add custom spacing values
		},

		// Border Radius
		border: {
			radius: {
				none: '0',
				sm: '0.125rem',
				base: '0.25rem',
				md: '0.5rem',
				lg: '0.75rem',
				xl: '1rem',
				'2xl': '1.5rem', // Custom radius
				full: '9999px'
			}
		},

		// Shadows
		shadow: {
			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
			'2xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)' // Custom shadow
		},

		// Z-Index Layers
		zIndex: {
			base: 0,
			dropdown: 1000,
			sticky: 1020,
			fixed: 1030,
			modalBackdrop: 1040,
			modal: 1050,
			popover: 1060,
			tooltip: 1070
		},

		// Transitions
		transition: {
			fast: '150ms ease-in-out',
			base: '200ms ease-in-out',
			slow: '300ms ease-in-out',
			slowest: '500ms ease-in-out' // Custom transition
		},

		// Breakpoints
		breakpoint: {
			tablet: '768px',
			desktop: '1024px',
			wide: '1440px',
			ultrawide: '1920px' // Custom breakpoint
		}
	},

	// ==========================================
	// SEMANTIC TOKENS (Layer 2 - Contextual Usage)
	// ==========================================
	//
	// Define the meaning and usage of colors in your UI.
	// Theme-dependent (colors) vs. theme-independent (typography, sizing).

	semantic: {
		// THEME-DEPENDENT: Colors that change between light/dark modes
		colors: {
			// ========== LIGHT THEME ==========
			light: {
				text: {
					primary: 'gray.900',
					secondary: 'gray.700',
					tertiary: 'gray.600',
					disabled: 'gray.400',
					inverse: 'gray.50'
				},

				background: {
					page: '#ffffff',
					surface: 'gray.50',
					elevated: '#ffffff',
					overlay: '#000000/0.5' // Using alpha transparency
				},

				border: {
					normal: 'gray.200',
					hover: 'gray.300',
					focus: 'brand.500' // Using custom brand color
				},

				action: {
					primary: {
						normal: 'brand.600',
						hover: 'brand.700',
						active: 'brand.800',
						disabled: 'gray.300'
					},
					secondary: {
						normal: 'gray.600',
						hover: 'gray.700',
						active: 'gray.800',
						disabled: 'gray.300'
					}
				},

				feedback: {
					success: {
						color: 'green.700',
						bg: 'green.50',
						border: 'green.200',
						text: 'green.900'
					},
					warning: {
						color: 'yellow.700',
						bg: 'yellow.50',
						border: 'yellow.200',
						text: 'yellow.900'
					},
					danger: {
						color: 'red.700',
						bg: 'red.50',
						border: 'red.200',
						text: 'red.900'
					},
					info: {
						color: 'blue.600',
						bg: 'blue.50',
						border: 'blue.200',
						text: 'blue.900'
					}
				},

				focusRing: {
					color: 'brand.500',
					shadow: '0 0 0 3px rgba(249, 115, 22, 0.2)' // Brand color with alpha
				}
			},

			// ========== DARK THEME ==========
			dark: {
				text: {
					primary: 'gray.50',
					secondary: 'gray.400',
					tertiary: 'gray.500',
					disabled: 'gray.600',
					inverse: 'gray.900'
				},

				background: {
					page: 'gray.950',
					surface: 'gray.900',
					elevated: 'gray.800',
					overlay: '#000000/0.7'
				},

				border: {
					normal: 'gray.700',
					hover: 'gray.600',
					focus: 'brand.400'
				},

				action: {
					primary: {
						normal: 'brand.500',
						hover: 'brand.600',
						active: 'brand.700',
						disabled: 'gray.700'
					},
					secondary: {
						normal: 'gray.700',
						hover: 'gray.600',
						active: 'gray.500',
						disabled: 'gray.800'
					}
				},

				feedback: {
					success: {
						color: 'green.400',
						bg: 'green.950',
						border: 'green.800',
						text: 'green.200'
					},
					warning: {
						color: 'yellow.400',
						bg: 'yellow.950',
						border: 'yellow.800',
						text: 'yellow.200'
					},
					danger: {
						color: 'red.400',
						bg: 'red.950',
						border: 'red.800',
						text: 'red.200'
					},
					info: {
						color: 'blue.400',
						bg: 'blue.950',
						border: 'blue.800',
						text: 'blue.200'
					}
				},

				focusRing: {
					color: 'brand.400',
					shadow: '0 0 0 3px rgba(251, 146, 60, 0.3)'
				}
			}

			// ========== CUSTOM THEMES (OPTIONAL) ==========
			// You can define additional themes like high-contrast:
			//
			// 'high-contrast': {
			//   text: {
			//     primary: '#000000',
			//     secondary: '#000000',
			//     // ...
			//   },
			//   // ...
			// }
		},

		// THEME-INDEPENDENT: Typography shared across all themes
		// Color references (like 'text.primary') are theme-aware
		typography: {
			default: {
				font: {
					family: 'sans', // References primitives.typography.default.family.sans
					size: 'base',
					weight: 'normal',
					lineHeight: 'normal',
					letterSpacing: 'normal'
				},
				color: 'text.primary' // References semantic.colors.{theme}.text.primary
			},

			heading: {
				font: {
					family: 'sans',
					weight: 'bold',
					lineHeight: 'tight',
					letterSpacing: 'tight'
				},
				size: '2rem', // h1 base size
				scaling: 1.2, // Global multiplier for heading sizes (makes all headings 20% larger)
				color: 'text.primary'
			}
		},

		// THEME-INDEPENDENT: Component sizing shared across all themes
		sizing: {
			scaling: 1 // Global component size multiplier (1 = default, 1.2 = 20% larger)
		}
	}
});
