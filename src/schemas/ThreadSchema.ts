import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';
import { ContentEntrySchema } from './ContentEntry';

export const THREADS_COLLECTION_NAME = 'stream';

export const ThreadSchema = ContentEntrySchema.extend({
  title: z.string(),
  topic: z.string().optional(),
  siteKey: z.string().optional(),
  youtubeId: z.string().optional(),
  topicKey: z.string().optional(), // key of the topic this thread belongs to, defaults to 'Yleinen'
  poster: z.string().optional(), // URL for the poster image
  images: z.array(z.string()).optional(), // URLs for the images shared as attachments
  replyCount: z.number().optional(),
  lovedCount: z.number().optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type Thread = z.infer<typeof ThreadSchema>;

export function ParseThread(
  data: Record<string, unknown>,
  key?: string,
): Thread {
  return ThreadSchema.parse({
    ...data,
    createdAt: toDate(data.createdAt),
    updatedAt: toDate(data.updatedAt),
    flowTime: toDate(data.flowTime).getTime(),
    key,
  });
}
