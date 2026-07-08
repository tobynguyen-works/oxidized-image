import { Config, defaultOptions, type Options } from '@/services/config';
import { Effect, Layer } from 'effect';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'mlly';
import { describe, expect, it } from 'vite-plus/test';
import { jpegCompressor } from '@/compressors/jpeg';

const __dirname = dirname(fileURLToPath(import.meta.url));
const jpegBuffer = readFileSync(resolve(__dirname, '../fixtures/img_1.jpg'));

const runWith = (options: Options) =>
	Effect.runPromise(
		jpegCompressor(jpegBuffer).pipe(Effect.provide(Layer.succeed(Config, options))),
	);

describe('Compressor / JPEG', () => {
	it('lossy compress', async () => {
		const result = await runWith({
			...defaultOptions,
			jpeg: { quality: 80 },
		});

		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.byteLength).toBeLessThanOrEqual(jpegBuffer.byteLength);
	});
});
