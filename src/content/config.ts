import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string().optional(),
    description: z.string().optional(),
    publishedDate: z.string().default(() => new Date().toISOString().split('T')[0]),
    tags: z.array(z.string()).default([]),
    lifecycle: z.object({
      status: z.enum(['seedling', 'in-progress', 'evergreen', 'superseded']).default('evergreen'),
      confidence: z.number().min(0).max(1).default(0.95),
      last_verified: z.string().default(() => new Date().toISOString().split('T')[0]),
    }).default({
      status: 'evergreen',
      confidence: 0.95,
      last_verified: new Date().toISOString().split('T')[0],
    }),
    revisions: z.array(
      z.object({
        date: z.string(),
        commit: z.string().optional(),
        summary: z.string(),
      })
    ).default([]),
    superseded_by: z.string().nullable().optional(),
  }),
});

export const collections = { docs };
