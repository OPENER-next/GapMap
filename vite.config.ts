import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';
import Icons from 'unplugin-icons/vite'
import OSMData from './tools/osm-data/osm-data';
import Inspect from 'vite-plugin-inspect'

export default defineConfig({
	plugins: [
		OSMData(),
		tailwindcss(),
		sveltekit(),
		Icons({
      compiler: 'svelte',
    }),
		Inspect()
	]
});
