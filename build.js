// Build script to compile all extension components

import { build } from 'vite';
import { resolve } from 'path';
import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';

async function buildExtension() {
  console.log('Building extension...');

  // Create dist directory structure
  const distDirs = ['dist/popup', 'dist/options', 'dist/content', 'dist/background', 'dist/icons'];
  distDirs.forEach(dir => {
    if (!existsSync(dir)) {
      mkdirSync(dir, { recursive: true });
    }
  });

  // Copy manifest
  copyFileSync('manifest.json', 'dist/manifest.json');

  // Copy HTML files
  copyFileSync('popup.html', 'dist/popup/popup.html');
  copyFileSync('options.html', 'dist/options/options.html');

  // Copy CSS
  copyFileSync('content.css', 'dist/content/content.css');

  // Copy icons (placeholder)
  const iconSizes = [16, 48, 128];
  iconSizes.forEach(size => {
    // Create placeholder icon files
    writeFileSync(`dist/icons/icon${size}.png`, '');
  });

  // Build popup
  console.log('Building popup...');
  await build({
    build: {
      outDir: 'dist/popup',
      rollupOptions: {
        input: resolve(__dirname, 'popup.html'),
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
  });

  // Build options
  console.log('Building options...');
  await build({
    build: {
      outDir: 'dist/options',
      rollupOptions: {
        input: resolve(__dirname, 'options.html'),
        output: {
          entryFileNames: '[name].js',
          chunkFileNames: '[name].js',
          assetFileNames: '[name].[ext]',
        },
      },
    },
  });

  // Build content script
  console.log('Building content script...');
  await build({
    build: {
      outDir: 'dist/content',
      rollupOptions: {
        input: resolve(__dirname, 'src/content/content.tsx'),
        output: {
          entryFileNames: '[name].js',
          format: 'iife',
        },
      },
    },
  });

  // Build background
  console.log('Building background script...');
  await build({
    build: {
      outDir: 'dist/background',
      rollupOptions: {
        input: resolve(__dirname, 'src/background/background.ts'),
        output: {
          entryFileNames: '[name].js',
          format: 'es',
        },
      },
    },
  });

  console.log('Build complete!');
}

buildExtension().catch(console.error);
