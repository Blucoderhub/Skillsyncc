// Copy assets and manifest to dist folder

import { readFileSync, writeFileSync, copyFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const distDir = resolve(process.cwd(), 'dist');
const iconsDir = resolve(distDir, 'icons');

// Create icons directory
if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Copy manifest.json
copyFileSync('manifest.json', resolve(distDir, 'manifest.json'));

// Copy content.css
copyFileSync('content.css', resolve(distDir, 'content', 'content.css'));

// Copy icons (SVG placeholders)
['16', '48', '128'].forEach(size => {
  const src = resolve(process.cwd(), 'icons', `icon${size}.svg`);
  const dest = resolve(iconsDir, `icon${size}.svg`);
  if (existsSync(src)) {
    copyFileSync(src, dest);
  }
});

// Update manifest paths
const manifest = JSON.parse(readFileSync(resolve(distDir, 'manifest.json'), 'utf-8'));
manifest.background.service_worker = 'background/background.js';
manifest.action.default_popup = 'popup/popup.html';
manifest.options_page = 'options/options.html';
manifest.content_scripts[0].js = ['content/content.js'];
manifest.content_scripts[0].css = ['content/content.css'];

writeFileSync(resolve(distDir, 'manifest.json'), JSON.stringify(manifest, null, 2));

console.log('Assets copied. Using SVG placeholder icons (icons/icon16.svg, icon48.svg, icon128.svg).')
