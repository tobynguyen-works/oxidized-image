import { Context } from 'effect';
import type { UnknownException } from 'effect/Cause';
import { sync, tryPromise, type Effect } from 'effect/Effect';
import { createStorage } from 'unstorage';
import fsDriver from 'unstorage/drivers/fs-lite';
import { name as packageName } from '../../package.json';

interface CacheStorageService {
	get: (key: string) => Effect<string | null, UnknownException, never>;
	set: (key: string, value: string) => Effect<void, UnknownException, never>;
}

export class CacheStorage extends Context.Tag(`${packageName}/CacheStorage`)<
	CacheStorage,
	CacheStorageService
>() {}

export const createCacheStorage = sync(
	(cacheFolderPath: string = './node_modules/.cache/oxidizedimage') => {
		const storage = createStorage({
			driver: fsDriver({ base: cacheFolderPath }),
		});

		return {
			get: (key: string) => tryPromise(() => storage.get<string>(key)),
			set: (key: string, value: string) => tryPromise(() => storage.set(key, value)),
		} satisfies CacheStorageService;
	},
);
