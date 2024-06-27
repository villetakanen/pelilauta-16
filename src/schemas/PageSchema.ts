import { logError } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';
import { ContentEntrySchema } from './ContentEntry';

export const PAGES_COLLECTION_NAME = 'pages';

export const PageSchema = ContentEntrySchema.extend({
  name: z.string(),
  siteKey: z.string(),
});

export type Page = z.infer<typeof PageSchema>;

export const parsePage = (
  data: Record<string, unknown>,
  key: string,
  siteKey: string,
): Page => {
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
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      logError(err.issues);
    }
    throw err;
  }
};
