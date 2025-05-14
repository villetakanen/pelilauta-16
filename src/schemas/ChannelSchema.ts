import { z } from 'zod';

export const CHANNEL_NOUNS = ['discussion', 'adventurer'];
export const CHANNEL_DEFAULT_SLUG = 'yleinen';

export const ChannelSchema = z.object({
  description: z.string(),
  icon: z.string(),
  name: z.string(),
  slug: z.string(),
  threadCount: z.number().default(0),
  category: z.string().optional(),
  flowTime: z.number().optional(),
});

export const ChannelsSchema = z.array(ChannelSchema);

export type Channel = z.infer<typeof ChannelSchema>;
export type Channels = z.infer<typeof ChannelsSchema>;

export function parseChannel(c: Partial<Channel>) {
  return ChannelSchema.parse({
    ...c,
    description: c.description || '',
    icon: c.icon || 'discussion',
    category: c.category || 'Pelilauta',
    flowTime: c.flowTime || 0,
  });
}
