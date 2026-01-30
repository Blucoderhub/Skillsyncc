import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  build: {
    outDir: 'dist/content',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        content: resolve(__dirname, 'src/content/content.tsx'),
      },
      output: {
        entryFileNames: '[name].js',
        format: 'iife',
      },
    },
  },
});
