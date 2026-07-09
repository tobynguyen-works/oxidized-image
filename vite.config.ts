import { defineConfig } from 'vite-plus';
import { recommended as casePolice } from 'oxlint-plugin-case-police';

export default defineConfig({
	staged: {
		'*': 'vp check --fix',
	},
	run: {
		cache: true,
		tasks: {
			build: {
				command: 'vp run -r build',
			},
			test: {
				command: 'vp run -r test',
				dependsOn: ['build'],
			},
			play: {
				command: 'vp run -r play',
				dependsOn: ['build'],
			},
		},
	},
	lint: {
		plugins: ['import', 'node'],
		extends: [casePolice],
		jsPlugins: [{ name: 'vite-plus', specifier: 'vite-plus/oxlint-plugin' }],
		rules: { 'vite-plus/prefer-vite-plus-imports': 'error' },
		options: {
			typeAware: true,
			typeCheck: true,
		},
		overrides: [
			{
				files: ['website/**'],
				plugins: ['react', 'react-perf'],
			},
		],
	},
	fmt: {
		useTabs: true,
		tabWidth: 4,
		printWidth: 100,
		endOfLine: 'lf',
		bracketSameLine: true,
		singleQuote: true,
		ignorePatterns: ['dist/**', 'node_modules/**'],
		overrides: [
			{
				files: ['*.yml', '*.yaml', '*.md'],
				options: {
					tabWidth: 2,
					useTabs: false,
				},
			},
		],
	},
	resolve: {
		tsconfigPaths: true,
	},
});
