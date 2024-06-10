import { defineCollection, z } from 'astro:content';

export const fi = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    noun: z.string().optional(),
    description: z.string().optional(),
  }),
});
