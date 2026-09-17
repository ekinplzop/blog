import { defineCollection, z } from 'astro:content';

const docs = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string().optional(),
    publishedDate: z.string(),
    tags: z.array(z.string()).default([]),
    lifecycle: z.object({
      status: z.enum(['seedling', 'in-progress', 'evergreen', 'superseded']),
      confidence: z.number().min(0).max(1).default(0.8),
      last_verified: z.string(),
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
