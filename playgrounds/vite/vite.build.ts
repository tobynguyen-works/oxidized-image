import { defineConfig, type UserConfig } from 'vite-plus';
import OxidizedImage from '@oxidized-image/vite';

const config: UserConfig = defineConfig({
	plugins: [OxidizedImage()],
});

export default config;
