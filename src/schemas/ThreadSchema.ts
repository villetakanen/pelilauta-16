import { logError } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';
import { ContentEntrySchema } from './ContentEntry';

export const THREADS_COLLECTION_NAME = 'stream';

export const ThreadSchema = ContentEntrySchema.extend({
  title: z.string(),
  channel: z.string().optional(),
  siteKey: z.string().optional(),
  youtubeId: z.string().optional(),
  topicKey: z.string().optional(), // key of the topic this thread belongs to, defaults to 'Yleinen'
  poster: z.string().optional(), // URL for the poster image
  images: z
    .array(
      z.object({
        url: z.string(),
        alt: z.string(),
      }),
    )
    .optional(), // URLs for the images shared as attachments
  replyCount: z.number().optional(),
  lovedCount: z.number().optional(),
  createdAt: z.any().optional(),
  updatedAt: z.any().optional(),
});

export type Thread = z.infer<typeof ThreadSchema>;

export function parseThread(
  data: Record<string, unknown>,
  key?: string,
): Thread {
  let images = data.images || undefined;
  // Handle legacy image-data, these are of form { url: 'https://example.com/image.jpg' }
  if (
    data.images &&
    Array.isArray(data.images) &&
    typeof data.images[0] === 'string'
  ) {
    images = data.images.map((url: string) => ({ url, alt: `Image [${url}]` }));
  }

  try {
    return ThreadSchema.parse({
      ...data,
      images,
      title: data.title || '',
      channel: data.channel || data.topic || '',
      createdAt: toDate(data.createdAt),
      updatedAt: toDate(data.updatedAt),
      flowTime: toDate(data.flowTime).getTime(),
      key,
    });
  } catch (e) {
    logError('parseThread', e);
    throw e;
  }
}

export function createThread(source?: Partial<Thread>): Thread {
  return {
    key: source?.key || '',
    title: source?.title || '',
    channel: source?.channel || '',
    siteKey: source?.siteKey || '',
    youtubeId: source?.youtubeId || '',
    topicKey: source?.topicKey || 'Yleinen',
    poster: source?.poster || '',
    images: source?.images || [],
    owners: source?.owners || [],
    replyCount: 0,
    lovedCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    flowTime: new Date().getTime(),
    markdownContent: source?.markdownContent || '',
  };
}
