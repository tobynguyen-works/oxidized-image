import {
	ChromaSubsampling,
	CompressionType,
	FilterType,
	type AvifConfig,
	type PngEncodeOptions,
} from '@napi-rs/image';
import { Context } from 'effect';
import { name as packageName } from '../package.json';

export interface Options {
	jpeg: {
		quality: number;
	};
	png: PngEncodeOptions;
	webp: {
		quality: number;
	};
	avif: AvifConfig;
}

export const defaultOptions: Options = {
	jpeg: {
		quality: 80,
	},
	png: {
		compressionType: CompressionType.Best,
		filterType: FilterType.Adaptive,
	},
	webp: {
		quality: 80,
	},
	avif: {
		quality: 100,
		alphaQuality: 100,
		speed: 4,
		threads: 0,
		chromaSubsampling: ChromaSubsampling.Yuv444,
	},
};

export class Config extends Context.Tag(`${packageName}/Config`)<Config, Options>() {}
