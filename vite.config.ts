import { sveltekit } from '@sveltejs/kit/vite'
import { defineConfig } from 'vite'
import { indiumConfigHMR } from './src/lib/vite-plugin.js'

export default defineConfig({
	plugins: [sveltekit(), indiumConfigHMR()]
})
