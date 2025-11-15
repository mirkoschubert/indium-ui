// postcss.config.ts

import indiumThemePlugin from './src/lib/config/postcss-plugin';

export default {
  plugins: [
    // Indium UI theme generator
    indiumThemePlugin(),

    // Add other PostCSS plugins here if needed
    // e.g., autoprefixer, cssnano, etc.
  ],
};
