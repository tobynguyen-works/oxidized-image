import { Config } from '@/services/config';
import { losslessCompressPng, pngQuantize } from '@napi-rs/image';
import { gen, tryPromise } from 'effect/Effect';

export const pngCompressor = (buffer: Uint8Array) =>
	gen(function* () {
		const { png } = yield* Config;

		if (png.algorithm === 'lossless')
			return yield* tryPromise(() => losslessCompressPng(buffer, png));

		return yield* tryPromise(() => pngQuantize(buffer, png));
	});
