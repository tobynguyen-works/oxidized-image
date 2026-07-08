export const convertMillisecondsToSeconds = (ms: number, fixed: number = 2) =>
	(ms / 1000).toFixed(fixed);
