import { fileURLToPath } from 'node:url';
import { defineConfig } from 'vite';

export default defineConfig({
  build: {
    rolldownOptions: {
      input: {
        portfolio: fileURLToPath(new URL('./index.html', import.meta.url)),
        hardSurface: fileURLToPath(new URL('./hard-surface.html', import.meta.url)),
      },
    },
  },
});
