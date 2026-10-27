// Builds one 1200x630 Open Graph PNG per page at build time: /og/{slug}.png
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import type { APIRoute, GetStaticPaths } from 'astro';
import satori from 'satori';
import sharp from 'sharp';
import { getCases } from '../../lib/content';
import { pageOgTitles } from '../../lib/pages';

// Satori needs .woff/.ttf files, so these come from the static @fontsource packages.
const fontDir = join(process.cwd(), 'node_modules/@fontsource');
const fraunces = readFileSync(join(fontDir, 'fraunces/files/fraunces-latin-400-normal.woff'));
const geist = readFileSync(join(fontDir, 'geist-sans/files/geist-sans-latin-500-normal.woff'));

export const getStaticPaths = (async () => {
  const pages = Object.entries(pageOgTitles).map(([slug, title]) => ({ params: { slug }, props: { title } }));
  const cases = (await getCases()).map((entry) => ({
    params: { slug: entry.data.slug },
    props: { title: entry.data.title },
  }));
  return [...pages, ...cases];
}) satisfies GetStaticPaths;

// Tiny element helper so we don't need JSX in a .ts file.
type Node = { type: string; props: Record<string, unknown> };
const el = (type: string, style: Record<string, unknown>, children?: unknown): Node => ({
  type,
  props: { style, children },
});

export const GET: APIRoute = async ({ props }) => {
  const title = String(props.title);
  const fontSize = title.length > 60 ? 60 : 72;

  const tree = el(
    'div',
    {
      width: '100%',
      height: '100%',
      boxSizing: 'border-box',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      padding: '80px',
      backgroundColor: '#F5F3EE',
      color: '#16150F',
    },
    [
      el(
        'div',
        {
          display: 'flex',
          fontFamily: 'Fraunces',
          fontSize,
          lineHeight: 1.1,
          letterSpacing: '-0.02em',
          maxWidth: '980px',
        },
        title,
      ),
      el('div', { display: 'flex', flexDirection: 'column' }, [
        el('div', { width: '96px', height: '4px', backgroundColor: '#C8431B', marginBottom: '28px' }),
        el(
          'div',
          { display: 'flex', fontFamily: 'Geist', fontSize: 26, color: 'rgba(22, 21, 15, 0.65)' },
          'sophiepaulussen.com',
        ),
      ]),
    ],
  );

  const svg = await satori(tree as unknown as Parameters<typeof satori>[0], {
    width: 1200,
    height: 630,
    fonts: [
      { name: 'Fraunces', data: fraunces, weight: 400, style: 'normal' },
      { name: 'Geist', data: geist, weight: 500, style: 'normal' },
    ],
  });

  const png = await sharp(Buffer.from(svg)).png().toBuffer();
  return new Response(new Uint8Array(png), { headers: { 'Content-Type': 'image/png' } });
};
