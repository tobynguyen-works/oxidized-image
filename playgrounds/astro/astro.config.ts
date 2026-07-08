import { defineConfig } from 'astro/config';
import oxidizedImage from '@oxidized-image/astro';

export default defineConfig({
	integrations: [oxidizedImage()],
});
