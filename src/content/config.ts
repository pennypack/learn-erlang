import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  type: 'content',
  schema: z.object({
    title: z.string(),
    description: z.string(),
    postNumber: z.number(),
    publishDate: z.date(),
    tags: z.array(z.string()),
    difficulty: z.enum(['beginner', 'intermediate', 'advanced']),
    estimatedReadingTime: z.number().optional(),
    prerequisites: z.array(z.number()).optional(),
  }),
});

export const collections = { posts };