import { logError } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';
import { EntrySchema } from './ContentEntry';

export const SITES_COLLECTION_NAME = 'sites';

export const SiteSchema = EntrySchema.extend({
  name: z.string(),
  system: z.string().optional(),
  posterURL: z.string().optional(),
  hidden: z.boolean(),
  avatarURL: z.string().optional(),
  homepage: z.string().optional(),
  description: z.string().optional(),
  players: z.array(z.string()).optional(),
});

export type Site = z.infer<typeof SiteSchema>;

export function parseSite(data: Record<string, unknown>, key: string): Site {
  try {
    const flowTime = data.flowTime
      ? toDate(data.flowTime).getTime()
      : data.createdAt
        ? toDate(data.createdAt).getTime()
        : 0;

    const site = SiteSchema.parse({
      ...data,
      owners: typeof data.owners === 'string' ? [data.owners] : data.owners,
      system: data.system ? data.system : 'homebrew',
      flowTime,
      hidden: !!data.hidden,
      homepage: data.homepage ? data.homepage : key,
      key,
    });
    return site;
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      logError(err.issues);
    }
    throw err;
  }
}
