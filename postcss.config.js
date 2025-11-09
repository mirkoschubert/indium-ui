// postcss.config.js

import indiumThemePlugin from './src/lib/postcss-plugin.js';

export default {
  plugins: [
    // Indium UI theme generator
    indiumThemePlugin(),

    // Add other PostCSS plugins here if needed
    // e.g., autoprefixer, cssnano, etc.
  ],
};
