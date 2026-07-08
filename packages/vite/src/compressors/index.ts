import { getFileExtension } from '@/utils/file';
import { forEach, gen, succeed, timed } from 'effect/Effect';
import type { OutputAsset, OutputBundle } from 'vite/rolldown';
import { pngCompressor } from './png';
import { jpegCompressor } from './jpeg';
import { webpCompressor } from './webp';
import { avifCompressor } from './avif';
import { Config } from '@/services/config';
import { Logger } from '@/services/logger';
import { Duration, pipe, Ref } from 'effect';
import prettyBytes from 'pretty-bytes';
import { hash } from 'ohash';
import { CacheStorage } from '@/services/cache';

const compress = (ext: string, buffer: Uint8Array) => {
	switch (ext) {
		case 'png':
			return pngCompressor(buffer);
		case 'jpg':
		case 'jpeg':
			return jpegCompressor(buffer);
		case 'webp':
			return webpCompressor(buffer);
		case 'avif':
			return avifCompressor(buffer);
		default:
			return succeed(buffer);
	}
};

export const compressor = (bundles: OutputBundle) =>
	gen(function* () {
		const { concurrency, ...config } = yield* Config;
		const logger = yield* Logger;
		const cacheStorage = yield* CacheStorage;

		const assetBundles = Object.values(bundles).filter(
			(bundle): bundle is OutputAsset & { source: Uint8Array } =>
				bundle.type === 'asset' && typeof bundle.source !== 'string',
		);

		const bundleCounter = yield* Ref.make(1);
		const totalBundles = assetBundles.length;

		yield* forEach(
			assetBundles,
			(bundle) =>
				gen(function* () {
					const fileExtension = getFileExtension(bundle.fileName);
					const buffer = bundle.source;
					const stringBuffer = Buffer.from(buffer).toString('base64');

					const cacheKey = pipe(
						config[fileExtension as keyof typeof config],
						JSON.stringify,
						(str) => str + stringBuffer,
						hash,
					);

					const cache = yield* cacheStorage.get(cacheKey);

					if (cache !== null) {
						bundle.source = Buffer.from(cache, 'base64');

						const currentIndex = yield* Ref.getAndUpdate(bundleCounter, (n) => n + 1);
						logger.info(
							`${bundle.fileName} (reused cache entry) (+0ms) (${currentIndex}/${totalBundles})`,
						);
					} else {
						const [duration, newBuffer] = yield* timed(compress(fileExtension, buffer));
						const resolveTimeMs = pipe(Duration.toMillis(duration), Math.round);

						yield* cacheStorage.set(
							cacheKey,
							Buffer.from(newBuffer).toString('base64'),
						);

						bundle.source = newBuffer;

						const oldBufferSizeBytes = buffer.byteLength;
						const newBufferSizeBytes = newBuffer.byteLength;

						const currentIndex = yield* Ref.getAndUpdate(bundleCounter, (n) => n + 1);
						logger.info(
							`${bundle.fileName} (before: ${prettyBytes(oldBufferSizeBytes)}) (after: ${prettyBytes(newBufferSizeBytes)}) (${resolveTimeMs}ms) (${currentIndex}/${totalBundles})`,
						);
					}
				}),
			{ concurrency },
		);
	});
