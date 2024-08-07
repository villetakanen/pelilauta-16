import { logError } from '@utils/logHelpers';
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

export function parseThread(
  data: Record<string, unknown>,
  key?: string,
): Thread {
  let images = data.images || [];
  // Handle legacy image-data, these are of form { url: 'https://example.com/image.jpg' }
  if (
    data.images &&
    Array.isArray(data.images) &&
    typeof data.images[0] === 'object'
  ) {
    images = data.images.map((image: Record<string, unknown>) => image.url);
  }

  try {
    return ThreadSchema.parse({
      ...data,
      images,
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

export function createThread(): Thread {
  return {
    key: '',
    title: '',
    topic: '',
    siteKey: '',
    youtubeId: '',
    topicKey: '',
    poster: '',
    images: [],
    owners: [],
    replyCount: 0,
    lovedCount: 0,
    createdAt: new Date(),
    updatedAt: new Date(),
    flowTime: new Date().getTime(),
  };
}
