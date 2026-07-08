import { defineConfig } from 'vite-plus';

export default defineConfig({
	resolve: {
		tsconfigPaths: true,
	},
	staged: {
		'*': 'vp check --fix',
	},
	run: {
		tasks: {
			build: {
				command: 'vp pack',
				input: ['src/**'],
				output: ['dist/**'],
			},
		},
	},
	pack: {
		dts: true,
		clean: true,
		format: ['esm'],
		exports: true,
	},
	test: {
		testTimeout: 1000 * 60,
	},
});
