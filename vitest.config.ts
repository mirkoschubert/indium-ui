import { defineConfig } from 'vitest/config'
import { sveltekit } from '@sveltejs/kit/vite'
import { svelteTesting } from '@testing-library/svelte/vite'

export default defineConfig({
  plugins: [
    sveltekit(),
    svelteTesting()
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    exclude: ['src/**/*.stories.ts', 'src/**/*.stories.svelte']
  },
  resolve: {
    conditions: ['browser']
  }
})
