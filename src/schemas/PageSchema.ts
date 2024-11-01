import { logError } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';
import { ContentEntrySchema } from './ContentEntry';

export const PAGES_COLLECTION_NAME = 'pages';

export const PageSchema = ContentEntrySchema.extend({
  name: z.string(),
  siteKey: z.string(),
  content: z.string().optional(),
  category: z.string().optional(),
  revisionHistory: z
    .array(
      z.object({
        author: z.string(),
        createdAt: z.date(),
        markdownContent: z.string(),
      }),
    )
    .optional(),
});

export type Page = z.infer<typeof PageSchema>;

export const parsePage = (
  data: Partial<Page>,
  key: string,
  siteKey: string,
): Page => {
  const revisionHistory = [];
  if (data.revisionHistory && Array.isArray(data.revisionHistory)) {
    for (const revision of data.revisionHistory) {
      const { author, createdAt, markdownContent } = revision;
      revisionHistory.push({
        author,
        markdownContent,
        createdAt: toDate(createdAt),
      });
    }
  }

  try {
    return PageSchema.parse({
      ...data,
      siteKey:
        data.siteKey && typeof data.siteKey === 'string'
          ? data.siteKey
          : siteKey,
      owners:
        typeof data.owners === 'string'
          ? [data.owners]
          : data.owners
            ? data.owners
            : [],
      flowTime: toDate(data.flowTime).getTime(),
      key,
      revisionHistory,
      markdownContent: data.markdownContent || '',
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      logError(err.issues);
    }
    throw err;
  }
};

export function createPage(key: string, siteKey: string) {
  return parsePage(
    {
      key,
      siteKey,
      name: '',
      flowTime: new Date().getTime(),
      owners: [],
    },
    key,
    siteKey,
  );
}
