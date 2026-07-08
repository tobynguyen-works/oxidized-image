import { Config, defaultOptions, type Options } from '@/services/config';
import { Effect, Layer } from 'effect';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'mlly';
import { describe, expect, it } from 'vite-plus/test';
import { avifCompressor } from '@/compressors/avif';

const __dirname = dirname(fileURLToPath(import.meta.url));
const avifBuffer = readFileSync(resolve(__dirname, '../fixtures/img_3.avif'));

const runWith = (options: Options) =>
	Effect.runPromise(
		avifCompressor(avifBuffer).pipe(Effect.provide(Layer.succeed(Config, options))),
	);

describe('Compressor / AVIF', () => {
	it('lossy compress', async () => {
		const result = await runWith({
			...defaultOptions,
			avif: { quality: 75 },
		});

		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.byteLength).toBeLessThanOrEqual(avifBuffer.byteLength);
	});
});
