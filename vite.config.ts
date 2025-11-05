import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import OSMGen from './tools/osm-gen/osm-gen';
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
	plugins: [
		OSMGen(),
		tailwindcss(),
		sveltekit(),
		Icons({
      compiler: 'svelte',
    }),
		Inspect()
	]
});
