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
  lovers: z.array(z.string()).default([]), // The UIDs of the users who have loved this reply.
});

export type Reply = z.infer<typeof ReplySchema>;

export function parseReply(
  data: Partial<Reply>,
  key?: string,
  threadKey?: string,
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

export function createReply(r?: Partial<Reply>): Reply {
  return parseReply(
    {
      key: r?.key || '',
      flowTime: r?.flowTime || 0,
      owners: r?.owners || [],
      createdAt: r?.createdAt || new Date(),
      updatedAt: r?.updatedAt || new Date(),
      // True, unless explicitly set to false.
      public: r?.public !== false,
      // False, unless explicitly set to true.
      sticky: r?.sticky === true,
      tags: r?.tags || [],
      markdownContent: r?.markdownContent || '',
      // htmlContent is a legacy field that is no longer used.
      htmlContent: '',
      quoteref: r?.quoteref || '',
      threadKey: r?.threadKey || '',
      lovesCount: r?.lovesCount || 0,
    },
    r?.key || '',
    r?.threadKey || '',
  );
}
