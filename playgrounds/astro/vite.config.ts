import { defineConfig } from 'vite-plus';

export default defineConfig({
	run: {
		tasks: {
			play: {
				command: 'astro build',
			},
		},
	},
});
