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
				600: '#0000ff', // Custom primary blue hover
				700: '#003d7a', // Custom primary blue active
			},
			// Example: Add a custom brand color
			brand: {
				500: '#ff6b35',
				600: '#e85d2f',
				700: '#d14f29',
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
