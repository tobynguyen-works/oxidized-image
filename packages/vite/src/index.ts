import type { Plugin } from 'vite';
import { Config, defaultOptions, type Options } from './services/config';
import { provide, runPromise, tap, timed } from 'effect/Effect';
import { Duration, Layer, pipe } from 'effect';
import { compressor } from './compressors';
import { convertMillisecondsToSeconds } from './utils/time';
import pc from 'picocolors';
import { createLogger, Logger } from './services/logger';
import { CacheStorage, createCacheStorage } from './services/cache';
import { provideMerge } from 'effect/Layer';
import { name as packageName } from '../package.json';

export default function oxidizedImage(opts: Partial<Options> = {}): Plugin {
	const options = { ...defaultOptions, ...opts } satisfies Options;

	const ConfigLive = Layer.succeed(Config, options);
	const CacheStorageLive = Layer.effect(CacheStorage, createCacheStorage);

	return {
		name: packageName,
		async generateBundle(_, bundles) {
			const LoggerLive = Layer.succeed(Logger, createLogger(this));

			const AppConfigLive = ConfigLive.pipe(
				provideMerge(CacheStorageLive),
				provideMerge(LoggerLive),
			);

			const program = pipe(
				compressor(bundles),
				provide(AppConfigLive),

				timed,
				tap(([duration]) => {
					pipe(
						`Completed in ${pipe(duration, Duration.toMillis, convertMillisecondsToSeconds)}s.`,
						pc.green,
						this.info,
					);
				}),
			);

			this.info(pipe(' generating optimized images ', pc.bgGreen, pc.black));

			await runPromise(program);
		},
	};
}
