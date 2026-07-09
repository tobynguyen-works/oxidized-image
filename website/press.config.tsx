import { defineConfig } from 'fumapress';
import { fumadocsMdx } from 'fumapress/adapters/mdx';
import { flexsearchPlugin } from 'fumapress/plugins/flexsearch';
import { llmsPlugin } from 'fumapress/plugins/llms.txt';
import { takumiPlugin } from 'fumapress/plugins/takumi';
import { docs } from './.source/server';
import { lucideIconsPlugin } from 'fumadocs-core/source/plugins/lucide-icons';
import { sitemapPlugin } from 'fumapress/plugins/sitemap';
import { linkValidationPlugin } from 'fumapress/plugins/link-validation';
import { Image } from 'fumapress/image';
import { createNotebookLayoutPage } from 'fumapress/layouts/notebook';
import { imagePlugin } from 'fumapress/plugins/image/vercel';

export default defineConfig({
	content: docs.toFumadocsSource(),
	site: {
		name: 'Oxidized Image',
		baseUrl: import.meta.env.DEV
			? 'http://localhost:3000'
			: 'https://oxidized-image.tobynguyen.net',
		git: {
			user: 'tobynguyen-works',
			branch: 'main',
			repo: 'oxidized-image',
		},
	},
	meta: {
		root() {
			return (
				<>
					<link
						rel="preconnect"
						href="https://api.fonts.coollabs.io"
						crossOrigin={'anonymous'}
					/>
					<link
						href="https://api.fonts.coollabs.io/css2?family=Geist+Mono:wght@100..900&family=Geist:wght@100..900&display=swap"
						rel="stylesheet"
					/>
					<link rel="icon" href="/favicon.ico" type="image/x-icon" />
				</>
			);
		},
	},
	loaderOptions: {
		plugins: [lucideIconsPlugin()],
	},
})
	.plugins(
		flexsearchPlugin(),
		llmsPlugin(),
		takumiPlugin(),
		sitemapPlugin(),
		linkValidationPlugin(),
		imagePlugin({
			formats: ['image/webp', 'image/png'],
		}),
	)
	.adapters(fumadocsMdx())
	.layouts({
		page: createNotebookLayoutPage(),
		defaultProps() {
			return {
				nav: {
					title: (
						<>
							<Image
								src="/icon.png"
								width={64}
								height={64}
								className="size-8 rounded-md "
							/>
							<span className="font-mono uppercase">Oxidized Image</span>
						</>
					),
				},
			};
		},
	});
