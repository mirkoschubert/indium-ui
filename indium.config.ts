/**
 * Example Indium UI Configuration
 *
 * This file demonstrates how to customize the Indium UI theme.
 * Users can create this file in their project root to override default tokens.
 *
 * @see CSS-ARCHITECTURE.md for token structure and naming conventions
 */

import { defineConfig } from './src/lib/config/config-loader';

export default defineConfig({
	// Override primitive colors
	primitives: {
		colors: {
			// Example: Change primary blue to a custom brand color
			blue: {
				500: '#0066ee', // Custom primary blue
				600: '#0052cc', // Custom primary blue hover
				700: '#003d7a', // Custom primary blue active
			},
			// Example: Add a custom brand color (WCAG AA compliant)
			brand: {
				500: '#c74a1f', // Darker orange with good contrast (4.6:1 on white)
				600: '#a33d19', // Darker for hover
				700: '#7f3014', // Even darker for active
			},
		},
	},

	// Override semantic tokens
	semantic: {
		light: {
			colors: {
				// Example: Use custom brand color for primary actions
				action: {
					primary: {
						normal: 'brand.500',
						hover: 'brand.600',
						active: 'brand.700',
					},
				},
			},
		},
	},

	// Override typography
	// typography: {
	// 	fontFamily: {
	// 		sans: 'Inter, system-ui, sans-serif',
	// 	},
	// },

	// Override spacing
	// spacing: {
	// 	scale: 1.1, // 10% larger spacing
	// },
});
