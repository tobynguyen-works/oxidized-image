import type { LocalImageService } from 'astro';
import { Config, type Options } from './config';
import { baseService } from 'astro/assets';
import { imageMeta } from 'image-meta';
import { AstroError, AstroErrorData } from 'astro/errors';
import { FastResizeFilter, ResizeFit, Transformer } from '@napi-rs/image';
import { fail, gen, runPromise, tryPromise } from 'effect/Effect';
import { Layer, pipe } from 'effect';
import { provide } from 'effect/Effect';

const DEFAULT_OUTPUT_FORMAT = 'webp';

function toResizeFit(fit?: string): ResizeFit {
	switch (fit) {
		case 'fill':
			return ResizeFit.Fill;
		case 'contain':
			return ResizeFit.Inside;
		case 'cover':
		default:
			return ResizeFit.Cover;
	}
}

const oxidizedImageService: LocalImageService<Options> = {
	...baseService,
	async transform(inputBuffer, transformOptions, imageConfig) {
		const transformer = gen(function* () {
			const config = yield* Config;
			const imageMetadata = imageMeta(inputBuffer);

			if (!imageMetadata.height || !imageMetadata.width || !imageMetadata.type) {
				return yield* fail(
					new AstroError(AstroErrorData.NoImageMetadata.message(transformOptions.src)),
				);
			}

			const tx =
				imageMetadata.type === 'svg'
					? Transformer.fromSvg(inputBuffer).rotate()
					: new Transformer(inputBuffer).rotate();

			const { width, height, fit } = transformOptions;
			const resizeOpts = { fit: toResizeFit(fit), filter: FastResizeFilter.Lanczos3 };

			if (width && height) {
				tx.fastResize({
					...resizeOpts,
					width: Math.round(width),
					height: Math.round(height),
				});
			} else if (height && !width) {
				const ratio = imageMetadata.width / imageMetadata.height;
				tx.fastResize({
					...resizeOpts,
					width: Math.round(height * ratio),
					height: Math.round(height),
				});
			} else if (width) {
				tx.fastResize({ ...resizeOpts, width: Math.round(width) });
			}

			const outputFormat = transformOptions.format ?? DEFAULT_OUTPUT_FORMAT;

			const outputBuffer = yield* tryPromise({
				try: () => {
					switch (outputFormat) {
						case 'png':
							return tx.png(config.png);
						case 'jpeg':
						case 'jpg':
							return tx.jpeg(config.jpeg.quality);
						case 'avif':
							return tx.avif(config.avif);
						case 'webp':
						default:
							return tx.webp(config.webp.quality);
					}
				},
				catch: () =>
					new AstroError(
						AstroErrorData.CouldNotTransformImage.message(transformOptions.src),
					),
			});

			return {
				data: outputBuffer,
				format: outputFormat,
			};
		});

		const ConfigLive = Layer.succeed(Config, imageConfig.service.config);

		const program = pipe(transformer, provide(ConfigLive));

		return runPromise(program);
	},
};

export default oxidizedImageService;
