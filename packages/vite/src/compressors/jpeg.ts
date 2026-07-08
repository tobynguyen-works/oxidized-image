import { Config } from '@/services/config';
import { compressJpeg } from '@napi-rs/image';
import { gen, tryPromise } from 'effect/Effect';

export const jpegCompressor = (buffer: Uint8Array) =>
	gen(function* () {
		const { jpeg } = yield* Config;

		return yield* tryPromise(() => compressJpeg(buffer, jpeg));
	});
