// src/lib/config/defaults.ts

import type { IndiumConfig } from './types.ts'

/**
 * Default configuration for Indium UI
 *
 * Includes:
 * - Primitive Tokens: shadcn-svelte gray palette + brand colors
 * - Semantic Tokens: Light & Dark theme with opinionated color intentions
 *
 * User can override any value by providing a partial config
 * and using deep merge strategy.
 */

export const defaultConfig: IndiumConfig = {
	primitives: {
		colors: {
			// Gray Palette (from shadcn-svelte - neutral)
			gray: {
				50: '#f9fafb',
				100: '#f3f4f6',
				200: '#e5e7eb',
				300: '#d1d5db',
				400: '#9ca3af',
				500: '#6b7280',
				600: '#4b5563',
				700: '#374151',
				800: '#1f2937',
				900: '#111827',
				950: '#030712'
			},

			// Blue Palette (Brand Primary)
			blue: {
				50: '#eff6ff',
				100: '#dbeafe',
				200: '#bfdbfe',
				300: '#93c5fd',
				400: '#60a5fa',
				500: '#3b82f6',
				600: '#2563eb',
				700: '#1d4ed8',
				800: '#1e40af',
				900: '#1e3a8a',
				950: '#172554'
			},

			// Green Palette (Success)
			green: {
				50: '#f0fdf4',
				100: '#dcfce7',
				200: '#bbf7d0',
				300: '#86efac',
				400: '#4ade80',
				500: '#22c55e',
				600: '#16a34a',
				700: '#15803d',
				800: '#166534',
				900: '#145231',
				950: '#052e16'
			},

			// Yellow Palette (Warning)
			yellow: {
				50: '#fefce8',
				100: '#fef3c7',
				200: '#fde68a',
				300: '#fcd34d',
				400: '#fbbf24',
				500: '#f59e0b',
				600: '#d97706',
				700: '#b45309',
				800: '#92400e',
				900: '#78350f',
				950: '#451a03'
			},

			// Red Palette (Danger)
			red: {
				50: '#fef2f2',
				100: '#fee2e2',
				200: '#fecaca',
				300: '#fca5a5',
				400: '#f87171',
				500: '#ef4444',
				600: '#dc2626',
				700: '#b91c1c',
				800: '#991b1b',
				900: '#7f1d1d',
				950: '#450a0a'
			}
		},

		typography: {
			default: {
				family: {
					sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
					serif: 'ui-serif, Georgia, Cambria, "Times New Roman", Times, serif'
				},
				size: {
					xs: '0.75rem', // 12px
					sm: '0.875rem', // 14px
					base: '1rem', // 16px
					lg: '1.125rem', // 18px
					xl: '1.25rem' // 20px
				},
				weight: {
					light: 300,
					normal: 400,
					medium: 500,
					semibold: 600,
					bold: 700
				},
				lineHeight: {
					tight: 1.25,
					normal: 1.5,
					relaxed: 1.625,
					loose: 2
				},
				letterSpacing: {
					tight: '-0.02em',
					normal: '0',
					wide: '0.05em'
				}
			},

			heading: {
				family: {
					sans: 'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
				},
				size: {
					base: '2rem'
				},
				weight: {
					bold: 700,
					extrabold: 800
				},
				lineHeight: {
					tight: 1.2,
					snug: 1.375
				},
				letterSpacing: {
					tight: '-0.02em',
					normal: '0'
				}
			},

			mono: {
				family: {
					mono: 'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'
				},
				size: {
					sm: '0.875rem',
					base: '1rem'
				},
				weight: {
					normal: 400,
					semibold: 600
				},
				lineHeight: {
					normal: 1.5,
					tight: 1.25
				}
			}
		},

		spacing: {
			0: '0',
			1: '0.25rem', // 4px
			2: '0.5rem', // 8px
			3: '0.75rem', // 12px
			4: '1rem', // 16px
			5: '1.25rem', // 20px
			6: '1.5rem', // 24px
			8: '2rem', // 32px
			10: '2.5rem', // 40px
			12: '3rem', // 48px
			16: '4rem', // 64px
			20: '5rem', // 80px
			24: '6rem' // 96px
		},

		sizing: {
			full: '100%',
			auto: 'auto',
			fit: 'fit-content',
			min: 'min-content',
			max: 'max-content'
		},

		border: {
			radius: {
				none: '0',
				sm: '0.125rem', // 2px
				base: '0.25rem', // 4px
				md: '0.5rem', // 8px
				lg: '0.75rem', // 12px
				xl: '1rem', // 16px
				full: '9999px'
			}
		},

		shadow: {
			sm: '0 1px 2px 0 rgb(0 0 0 / 0.05)',
			base: '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
			md: '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
			lg: '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
			xl: '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)'
		},

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

		transition: {
			fast: '150ms ease-in-out',
			base: '200ms ease-in-out',
			slow: '300ms ease-in-out'
		},

		breakpoint: {
			tablet: '768px',
			desktop: '1024px',
			wide: '1440px'
		}
	},

	semantic: {
		light: {
			colors: {
				text: {
					primary: 'gray.900', // #111827
					secondary: 'gray.700', // #374151
					tertiary: 'gray.600', // #4b5563
					disabled: 'gray.400', // #9ca3af
					inverse: 'gray.50' // #f9fafb
				},

				background: {
					page: '#ffffff',
					surface: 'gray.50', // #f9fafb
					elevated: '#ffffff',
					overlay: '#000000/0.5' // rgba(0,0,0,0.5)
				},

				border: {
					normal: 'gray.200', // #e5e7eb
					hover: 'gray.300', // #d1d5db
					focus: 'blue.500' // #3b82f6
				},

				action: {
					primary: {
						normal: 'blue.700', // #1d4ed8
						hover: 'blue.800', // #1e40af
						active: 'blue.900', // #1e3a8a
						disabled: 'gray.300' // #d1d5db
					},
					secondary: {
						normal: 'gray.200', // #e5e7eb
						hover: 'gray.300', // #d1d5db
						active: 'gray.400', // #9ca3af
						disabled: 'gray.100' // #f3f4f6
					}
				},

				feedback: {
					success: {
						color: 'green.700', // #15803d
						bg: 'green.50', // #f0fdf4
						border: 'green.200', // #bbf7d0
						text: 'green.900' // #145231
					},
					warning: {
						color: 'yellow.700', // #b45309
						bg: 'yellow.50', // #fefce8
						border: 'yellow.200', // #fde68a
						text: 'yellow.900' // #78350f
					},
					danger: {
						color: 'red.700', // #b91c1c
						bg: 'red.50', // #fef2f2
						border: 'red.200', // #fecaca
						text: 'red.900' // #7f1d1d
					},
					info: {
						color: 'blue.600', // #2563eb
						bg: 'blue.50', // #eff6ff
						border: 'blue.200', // #bfdbfe
						text: 'blue.900' // #1e3a8a
					}
				},

				focusRing: {
					color: 'blue.500', // #3b82f6
					shadow: '0 0 0 3px rgba(59, 130, 246, 0.2)'
				}
			},

			typography: {
				default: {
					font: {
						family: 'sans',
						size: 'base',
						weight: 'normal',
						lineHeight: 'normal',
						letterSpacing: 'normal'
					},
					color: 'text.primary'
				},

				heading: {
					font: {
						family: 'sans',
						weight: 'bold',
						lineHeight: 'tight',
						letterSpacing: 'tight'
					},
					size: '2rem', // h1 base size (32px)
					scaling: 1,
					color: 'text.primary'
				}
			},

			sizing: {
				scaling: 1 // 1 = no scaling (default)
			}
		},

		dark: {
			colors: {
				text: {
					primary: 'gray.50', // #f9fafb
					secondary: 'gray.400', // #9ca3af
					tertiary: 'gray.500', // #6b7280
					disabled: 'gray.600', // #4b5563
					inverse: 'gray.900' // #111827
				},

				background: {
					page: 'gray.950', // #030712
					surface: 'gray.900', // #111827
					elevated: 'gray.800', // #1f2937
					overlay: '#000000/0.7' // rgba(0,0,0,0.7)
				},

				border: {
					normal: 'gray.700', // #374151
					hover: 'gray.600', // #4b5563
					focus: 'blue.400' // #60a5fa
				},

				action: {
					primary: {
						normal: 'blue.600', // #2563eb
						hover: 'blue.700', // #1d4ed8
						active: 'blue.800', // #1e40af
						disabled: 'gray.700' // #374151
					},
					secondary: {
						normal: 'gray.700', // #374151
						hover: 'gray.600', // #4b5563
						active: 'gray.500', // #6b7280
						disabled: 'gray.800' // #1f2937
					}
				},

				feedback: {
					success: {
						color: 'green.500', // #22c55e
						bg: 'green.950', // #052e16 (custom dark)
						border: 'green.800', // #166534
						text: 'green.200' // #bbf7d0
					},
					warning: {
						color: 'yellow.500', // #f59e0b
						bg: 'yellow.950', // #451a03 (custom dark)
						border: 'yellow.800', // #92400e
						text: 'yellow.200' // #fde68a
					},
					danger: {
						color: 'red.500', // #ef4444
						bg: 'red.950', // #450a0a (custom dark)
						border: 'red.800', // #991b1b
						text: 'red.200' // #fecaca
					},
					info: {
						color: 'blue.400', // #60a5fa
						bg: 'blue.950', // #172554 (custom dark)
						border: 'blue.800', // #1e40af
						text: 'blue.200' // #bfdbfe
					}
				},

				focusRing: {
					color: 'blue.400', // #60a5fa
					shadow: '0 0 0 3px rgba(96, 165, 250, 0.3)'
				}
			},

			typography: {
				default: {
					font: {
						family: 'sans',
						size: 'base',
						weight: 'normal',
						lineHeight: 'normal',
						letterSpacing: 'normal'
					},
					color: 'text.primary'
				},

				heading: {
					font: {
						family: 'sans',
						size: 'base',
						weight: 'bold',
						lineHeight: 'tight',
						letterSpacing: 'tight'
					},
					scaling: 1,
					color: 'text.primary'
				}
			},

			sizing: {
				scaling: 1
			}
		}
	}
}
