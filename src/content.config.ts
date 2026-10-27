import { defineCollection } from 'astro:content';
import { file, glob } from 'astro/loaders';
import { z } from 'astro/zod';

const ROLES = ['marketing-ops', 'lifecycle', 'product-marketing', 'growth', 'lead'] as const;

// Case studies: one MDX file per case in src/content/cases.
// Rule: concept cases never show result metrics. Stats describe effort and output only.
const cases = defineCollection({
  loader: glob({ pattern: '**/*.mdx', base: './src/content/cases' }),
  schema: ({ image }) =>
    z.object({
      title: z.string(),
      slug: z.string(),
      order: z.number(),
      type: z.enum(['concept', 'real']),
      status: z.enum(['in-progress', 'live']).default('in-progress'),
      conceptLabel: z.string().default('Concept project · Fictional company · Real market data'),
      summary: z.string().max(160),
      thirtySecond: z.array(z.string()).length(3),
      stats: z.object({
        time: z.string(),
        skills: z.array(z.string()),
        tools: z.array(z.string()),
        output: z.string(),
      }),
      heroImage: image(),
      heroAlt: z.string(),
      // Optional: name of a React demo registered in src/components/HeroDemo.astro.
      // When set, it replaces the hero image.
      heroDemo: z.string().optional(),
      demoUrl: z.url().optional(),
      loomUrl: z.url().optional(),
      repoUrl: z.url().optional(),
      roles: z.array(z.enum(ROLES)),
      publishedAt: z.coerce.date(),
    }),
});

// Tool stack on the home page. Tools and groups show in the order of the file.
const tools = defineCollection({
  loader: file('./src/content/tools.json'),
  schema: z.object({
    name: z.string(),
    group: z.string(),
    level: z.enum(['Shipped with', 'Use daily', 'Learning', 'Certified']),
    note: z.string().optional(),
  }),
});

// Site-wide details: contact links, location, languages.
const site = defineCollection({
  loader: glob({ pattern: 'site.json', base: './src/content' }),
  schema: z.object({
    name: z.string(),
    email: z.email(),
    linkedin: z.url(),
    github: z.url(),
    youtube: z.url(),
    domain: z.string(),
    location: z.string(),
    timezone: z.string(),
    languages: z.array(z.string()),
  }),
});

export const collections = { cases, tools, site };
