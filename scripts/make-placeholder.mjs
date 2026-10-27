// Generates a neutral placeholder hero image for a case.
// Usage: node scripts/make-placeholder.mjs <slug> [<slug> ...]
// Writes src/assets/cases/<slug>-hero.png (1600x1000). Replace it with the real image, same filename.
import { mkdirSync } from 'node:fs';
import sharp from 'sharp';

const slugs = process.argv.slice(2);
if (slugs.length === 0) {
  console.error('Usage: node scripts/make-placeholder.mjs <slug> [<slug> ...]');
  process.exit(1);
}

mkdirSync('src/assets/cases', { recursive: true });

for (const slug of slugs) {
  const filename = `${slug}-hero.png`;
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="1600" height="1000">
      <rect width="1600" height="1000" fill="#E9E6DF"/>
      <rect x="0.5" y="0.5" width="1599" height="999" fill="none" stroke="#16150F" stroke-opacity="0.12"/>
      <line x1="0" y1="0" x2="1600" y2="1000" stroke="#16150F" stroke-opacity="0.08"/>
      <line x1="1600" y1="0" x2="0" y2="1000" stroke="#16150F" stroke-opacity="0.08"/>
      <rect x="560" y="430" width="480" height="140" fill="#E9E6DF"/>
      <text x="800" y="490" text-anchor="middle" font-family="Helvetica, Arial, sans-serif" font-size="30" fill="#16150F" fill-opacity="0.65" letter-spacing="2">PLACEHOLDER IMAGE</text>
      <text x="800" y="540" text-anchor="middle" font-family="Menlo, monospace" font-size="24" fill="#16150F" fill-opacity="0.65">${filename}</text>
    </svg>`;
  await sharp(Buffer.from(svg)).png().toFile(`src/assets/cases/${filename}`);
  console.log(`Wrote src/assets/cases/${filename}`);
}
