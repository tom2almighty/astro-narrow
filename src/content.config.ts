import { defineCollection } from 'astro:content';
import { z } from 'astro/zod';
import { glob } from 'astro/loaders';

const taxonomyTerm = z.string().trim().min(1);

const baseSchema = z.object({
  title: z.string(),
  description: z.string().optional(),
  date: z.coerce.date().optional(),
  updatedDate: z.coerce.date().optional(),
  draft: z.boolean().default(false),
  cover: z.string().optional(),
  lang: z.enum(['en', 'zh-cn']).optional(),
  toc: z.union([z.boolean(), z.enum(['center', 'side'])]).optional(),
  comments: z.boolean().optional(),
  math: z.boolean().optional(),
  mermaid: z.boolean().optional(),
  gallery: z.boolean().optional(),
  lightbox: z.boolean().optional()
});

const posts = defineCollection({
  loader: glob({ base: './src/content/posts', pattern: '**/*.{md,mdx}' }),
  schema: baseSchema.extend({
    date: z.coerce.date(),
    tags: z.array(taxonomyTerm).default([]),
    // Subposts within a series folder are ordered by `order`, then date, then id.
    order: z.number().optional()
  })
});

// Projects are frontmatter-only link cards: the Markdown body is never rendered
// and no detail routes are generated.
const projects = defineCollection({
  loader: glob({ base: './src/content/projects', pattern: '**/*.{md,mdx}' }),
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    links: z.record(z.string(), z.string().url()).default({}),
    tags: z.array(taxonomyTerm).default([]),
    order: z.number().optional(),
    draft: z.boolean().default(false),
    lang: z.enum(['en', 'zh-cn']).optional()
  })
});

const pages = defineCollection({
  loader: glob({ base: './src/content/pages', pattern: '**/*.{md,mdx}' }),
  schema: baseSchema.extend({
    layout: z.enum(['page', 'timeline']).default('page')
  })
});

export const collections = {
  posts,
  projects,
  pages
};
