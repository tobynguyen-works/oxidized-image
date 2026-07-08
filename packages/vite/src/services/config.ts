import type {
	AvifConfig,
	JpegCompressOptions,
	PNGLosslessOptions,
	PngQuantOptions,
} from '@napi-rs/image';
import { Context } from 'effect';
import { name as packageName } from '../../package.json';

type LosslessPngOptions = { algorithm: 'lossless' } & PNGLosslessOptions;
type LossyPngOptions = { algorithm: 'lossy' } & PngQuantOptions;
type PngOptions = LosslessPngOptions | LossyPngOptions;

type JpegOptions = JpegCompressOptions;

type LossyWebpOptions = { algorithm: 'lossy'; quality: number };
type LosslessWebpOptions = { algorithm: 'lossless' };
type WebpOptions = LosslessWebpOptions | LossyWebpOptions;

type AvifOptions = AvifConfig;

export type Options = {
	concurrency: number;
	png: PngOptions;
	jpeg: JpegOptions;
	webp: WebpOptions;
	avif: AvifOptions;
};

export const defaultOptions: Options = {
	concurrency: 5,
	png: {
		algorithm: 'lossless',
		strip: true,
	},
	jpeg: {
		quality: 80,
	},
	webp: {
		algorithm: 'lossy',
		quality: 80,
	},
	avif: {
		quality: 75,
	},
};

export class Config extends Context.Tag(`${packageName}/Config`)<Config, Options>() {}
