import type { AstroIntegration } from 'astro';
import { defaultOptions, type Config } from './config';
import { name as packageName } from '../package.json';

export default function oxidizedImage(config: Partial<Config> = {}): AstroIntegration {
	return {
		name: packageName,
		hooks: {
			'astro:config:setup'({ updateConfig }) {
				updateConfig({
					image: {
						service: {
							entrypoint: `${packageName}/service`,
							config: { ...defaultOptions, ...config },
						},
					},
				});
			},
		},
	};
}
