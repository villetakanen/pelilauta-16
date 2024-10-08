import { z } from 'zod';

export const ChannelSchema = z.object({
  description: z.string(),
  icon: z.string(),
  name: z.string(),
  slug: z.string(),
  threadCount: z.number().default(0),
  category: z.string().optional(),
});

export type Channel = z.infer<typeof ChannelSchema>;

export function parseChannel(c: Partial<Channel>) {
  return ChannelSchema.parse({
    ...c,
    description: c.description || '',
    icon: c.icon || 'discussion',
    category: c.category || 'Pelilauta',
  });
}
