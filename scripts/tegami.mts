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
			async willPublish() {
				await x('vp', ['run', 'build'], {
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
	},
});

await runCli(paper);
