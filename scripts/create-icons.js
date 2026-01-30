// Script to create placeholder icon files
// In production, replace these with actual PNG icons

import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { resolve } from 'path';

const iconsDir = resolve(process.cwd(), 'icons');

if (!existsSync(iconsDir)) {
  mkdirSync(iconsDir, { recursive: true });
}

// Create placeholder SVG icons (convert to PNG for production)
const iconSvg = `<svg width="{size}" height="{size}" xmlns="http://www.w3.org/2000/svg">
  <rect width="{size}" height="{size}" fill="#0ea5e9"/>
  <text x="50%" y="50%" font-family="Arial" font-size="{fontSize}" fill="white" text-anchor="middle" dominant-baseline="middle">JC</text>
</svg>`;

[16, 48, 128].forEach(size => {
  const fontSize = size * 0.5;
  const svg = iconSvg.replace(/{size}/g, size.toString()).replace(/{fontSize}/g, fontSize.toString());
  writeFileSync(resolve(iconsDir, `icon${size}.svg`), svg);
  console.log(`Created icon${size}.svg (convert to PNG for production)`);
});

console.log('\nNote: These are placeholder SVG icons. For production:');
console.log('1. Design actual icons (16x16, 48x48, 128x128)');
console.log('2. Export as PNG files');
console.log('3. Replace the SVG files in the icons/ directory');
