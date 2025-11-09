// postcss.config.ts

import indiumThemePlugin from './src/lib/postcss-plugin';

export default {
  plugins: [
    // Indium UI theme generator
    indiumThemePlugin(),

    // Add other PostCSS plugins here if needed
    // e.g., autoprefixer, cssnano, etc.
  ],
};
