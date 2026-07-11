import { defineConfig } from 'vite-plus';

export default defineConfig({
	run: {
		tasks: {
			play: {
				command: 'vp build --config vite.build.ts',
				dependsOn: [{ task: 'build', from: ['dependencies', 'devDependencies'] }],
			},
		},
	},
});
