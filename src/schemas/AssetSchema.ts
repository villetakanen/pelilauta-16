import { logError } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';
import { EntrySchema } from './ContentEntry';

export const ASSETS_COLLECTION_NAME = 'assets';

export const AssetSchema = EntrySchema.extend({
  url: z.string(),
  description: z.string().default(''),
  license: z.string().default('0'),
  site: z.string().optional(),
  name: z.string().default(''),
  mimetype: z.string().optional(),
  storagePath: z.string().optional(),
});

export type Asset = z.infer<typeof AssetSchema>;

export function ParseAsset(data: Record<string, unknown>, key?: string): Asset {
  try {
    return AssetSchema.parse({
      ...data,
      flowTime: toDate(data.flowTime).getTime(),
      key,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      logError(err.issues);
    }
    throw err;
  }
}
