import { pngCompressor } from '@/compressors/png';
import { Config, defaultOptions, type Options } from '@/services/config';
import { Effect, Layer } from 'effect';
import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'pathe';
import { fileURLToPath } from 'mlly';
import { describe, expect, it } from 'vite-plus/test';

const __dirname = dirname(fileURLToPath(import.meta.url));
const pngBuffers = [
	{ name: 'img_0.png', buffer: readFileSync(resolve(__dirname, '../fixtures/img_0.png')) },
	{ name: 'img_2.png', buffer: readFileSync(resolve(__dirname, '../fixtures/img_2.png')) },
];

const runWith = (buffer: Buffer, options: Options) =>
	Effect.runPromise(pngCompressor(buffer).pipe(Effect.provide(Layer.succeed(Config, options))));

describe('Compressor / PNG', () => {
	it.each(pngBuffers)('compress with lossless algorithm [$name]', async ({ buffer }) => {
		const result = await runWith(buffer, {
			...defaultOptions,
			png: { algorithm: 'lossless', strip: true },
		});

		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.byteLength).toBeLessThanOrEqual(buffer.byteLength);
	});

	it.each(pngBuffers)('compress with lossy algorithm [$name]', async ({ buffer }) => {
		const result = await runWith(buffer, {
			...defaultOptions,
			png: { algorithm: 'lossy', minQuality: 60, maxQuality: 80 },
		});

		expect(result).toBeInstanceOf(Uint8Array);
		expect(result.byteLength).toBeLessThanOrEqual(buffer.byteLength);
	});
});
