import { logError } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { z } from 'zod';
import { EntrySchema } from './ContentEntry';

export const ASSETS_COLLECTION_NAME = 'assets';

export const ASSET_LICENSES = z
  .enum([
    '0',
    'cc-by',
    'cc-by-sa',
    'cc-by-nc',
    'cc-by-nc-sa',
    'cc0',
    'public-domain',
    'OGL',
  ])
  .default('0');

export const AssetSchema = EntrySchema.extend({
  url: z.string(),
  description: z.string().default(''),
  license: z.string().default('0'),
  name: z.string().default(''),
  mimetype: z.string().optional(),
  storagePath: z.string().optional(),
});

export type Asset = z.infer<typeof AssetSchema>;

export function parseAsset(data: Record<string, unknown>, key?: string): Asset {
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
