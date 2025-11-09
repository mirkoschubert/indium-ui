import type { Preview } from '@storybook/sveltekit';
import { initTheme, setThemeMode } from '../src/lib/utils/theme';

// Import global styles
import '../src/lib/styles/index.css';
import '../src/lib/styles/storybook.css';

// Initialize theme on load
if (typeof window !== 'undefined') {
  initTheme();
}

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    backgrounds: {
      disable: true,
    },
    layout: 'padded',
  },
  globalTypes: {
    theme: {
      description: 'Global theme for components',
      defaultValue: 'auto',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', icon: 'sun', title: 'Light' },
          { value: 'dark', icon: 'moon', title: 'Dark' },
          { value: 'auto', icon: 'contrast', title: 'Auto' },
        ],
        dynamicTitle: true,
      },
    },
  },
  decorators: [
    (Story, context) => {
      const theme = context.globals.theme || 'auto';
      if (typeof window !== 'undefined') {
        setThemeMode(theme);
      }

      return Story();
    },
  ],
};

export default preview;
