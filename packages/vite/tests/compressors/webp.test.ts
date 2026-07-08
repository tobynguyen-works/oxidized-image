import { Config, defaultOptions, type Options } from '@/services/config';
import { Effect, Layer } from 'effect';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'mlly';
import { describe, expect, it } from 'vite-plus/test';
import { webpCompressor } from '@/compressors/webp';

const __dirname = dirname(fileURLToPath(import.meta.url));
const webpBuffer = readFileSync(resolve(__dirname, '../fixtures/img_4.webp'));

const runWith = (options: Options) =>
	Effect.runPromise(
		webpCompressor(webpBuffer).pipe(Effect.provide(Layer.succeed(Config, options))),
	);

describe('Compressor / WEBP', () => {
	it('compress with lossless algorithm', async () => {
		const result = await runWith({
			...defaultOptions,
			webp: { algorithm: 'lossless' },
		});

		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.byteLength).toBeLessThanOrEqual(webpBuffer.byteLength);
	});

	it('compress with lossy algorithm', async () => {
		const result = await runWith({
			...defaultOptions,
			webp: { algorithm: 'lossy', quality: 80 },
		});

		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.byteLength).toBeLessThanOrEqual(webpBuffer.byteLength);
	});
});
