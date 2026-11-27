import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        portfolio: fileURLToPath(new URL('./index.html', import.meta.url)),
        hardSurface: fileURLToPath(new URL('./hard-surface.html', import.meta.url)),
        gameDevelopment: fileURLToPath(new URL('./game-development.html', import.meta.url)),
        environmentKits: fileURLToPath(new URL('./environment-kits.html', import.meta.url)),
      },
    },
  },
});
