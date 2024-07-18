import { logError } from '@utils/logHelpers';
import { z } from 'zod';
import { ContentEntrySchema } from './ContentEntry';

export const REPLIES_COLLECTION = 'comments';

export const ReplySchema = ContentEntrySchema.extend({
  // -- extended from EntrySchema
  // key: z.string(),
  // flowTime: z.number(),
  // owners: z.array(z.string()),
  // createdAt: z.date().optional(),
  // updatedAt: z.date().optional(),

  // -- extended from ContentEntrySchema
  // public: z.boolean().optional(),
  // sticky: z.boolean().optional(),
  // tags: z.array(z.string()).optional(),
  // markdownContent: z.string().optional(),
  // htmlContent: z.string().optional(),
  // owners: z.array(z.string()),

  quoteref: z.string().optional(), // The key of the reply that this reply is quoting.
  threadKey: z.string(), // The key of the thread that this reply is in.
  lovesCount: z.number().default(0), // The number of loves this reply has received.
});

export type Reply = z.infer<typeof ReplySchema>;

export function parseReply(
  data: Record<string, unknown>,
  key: string,
  threadKey: string,
): Reply {
  try {
    return ReplySchema.parse({
      ...data,
      key,
      threadKey,
    });
  } catch (e) {
    logError('parseReply', e);
    throw e;
  }
}

export function createReply() {
  return {
    key: '',
    flowTime: 0,
    owners: [],
    createdAt: new Date(),
    updatedAt: new Date(),
    public: true,
    sticky: false,
    tags: [],
    markdownContent: '',
    htmlContent: '',
    quoteref: '',
    threadKey: '',
    lovesCount: 0,
  };
}
