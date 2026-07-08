import { Config } from '@/services/config';
import { Transformer } from '@napi-rs/image';
import { gen, tryPromise } from 'effect/Effect';

export const webpCompressor = (buffer: Uint8Array) =>
	gen(function* () {
		const { webp } = yield* Config;

		if (webp.algorithm === 'lossless')
			return yield* tryPromise(() => new Transformer(buffer).webpLossless());

		return yield* tryPromise(() => new Transformer(buffer).webp(webp.quality));
	});
