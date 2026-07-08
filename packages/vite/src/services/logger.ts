import { Context } from 'effect';
import type { PluginContext } from 'vite/rolldown';
import { name as packageName } from '../../package.json';

interface LoggerService {
	info: (msg: string) => void;
	warn: (msg: string) => void;
	error: (msg: string) => void;
}

export class Logger extends Context.Tag(`${packageName}/Logger`)<Logger, LoggerService>() {}

export const createLogger = ({ info, warn, error }: PluginContext): LoggerService => ({
	info,
	warn,
	error,
});
