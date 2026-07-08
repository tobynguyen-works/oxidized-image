import { extname } from 'pathe';

export const getFileExtension = (fileName: string) => extname(fileName).slice(1);
