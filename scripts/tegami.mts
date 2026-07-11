import { tegami } from 'tegami';
import { runCli } from 'tegami/cli';
import { github } from 'tegami/plugins/github';
import { x } from 'tinyexec';

const paper = tegami({
	plugins: [
		github({
			repo: 'tobynguyen-works/oxidized-image',
			versionPr: {
				base: 'main',
			},
		}),
		{
			name: 'custom',
			async willPublish({ pkg }) {
				await x('vp', ['run', '--filter', pkg.name, 'build'], {
					throwOnError: true,
				});
			},
			async applyCliDraft() {
				await x('vp', ['check', '--fix'], {
					throwOnError: true,
				});
			},
		},
	],
	npm: {
		client: 'pnpm',
		trustedPublish: {
			provider: 'github',
			workflow: 'release.yml',
		},
	},
	ignore: ['@oxidized-image/website', /-playground$/],
});

await runCli(paper);
