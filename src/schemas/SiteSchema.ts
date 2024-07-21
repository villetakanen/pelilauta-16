import { toClientEntry } from '@utils/client/entryUtils';
import { logError } from '@utils/logHelpers';
import { parseFlowTime } from '@utils/schemaHelpers';
import { z } from 'zod';
import { EntrySchema } from './ContentEntry';

export const SITES_COLLECTION_NAME = 'sites';
export const SITE_SORT_ORDER_VALUES = [
  'name',
  'createdAt',
  'flowTime',
  'manual',
];

/**
 * Each site has a page index. This is a list of keys that point to pages with
 * some metadata about the page, to help building the different page listings (such as index, last 3 changes, etc)
 *
 * BREAKING CHANGE: This replaces earlier (< 16.x.y) index metadata that was stored in firestore db
 */
export const PageRefSchema = z.object({
  key: z.string(),
  name: z.string(),
  author: z.string(),
  category: z.string().optional(),
  flowTime: z.number(),
});

/**
 * Breaking change: This replaces earlier (< 16.x.y) category metadata that was stored in firestore db
 * as "Categories" array in the site document
 */
export const CategoryRefSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export const SiteSchema = EntrySchema.extend({
  name: z.string(),
  system: z.string().optional(),
  posterURL: z.string().optional(),
  hidden: z.boolean(),
  avatarURL: z.string().optional(),
  homepage: z.string().optional(),
  description: z.string().optional(),
  players: z.array(z.string()).optional(),
  sortOrder: z.enum(['name', 'createdAt', 'flowTime', 'manual']).optional(),
  backgroundURL: z.string().optional(),
  customPageKeys: z.boolean().optional(),
  pageRefs: z.array(PageRefSchema).optional(),
  pageCategories: z.array(CategoryRefSchema).optional(),
});

export type Site = z.infer<typeof SiteSchema>;

export const emptySite: Site = {
  key: '',
  flowTime: 0,
  name: '',
  owners: [],
  hidden: true,
};

export function parseSite(data: Partial<Site>, key: string): Site {
  try {
    const site = SiteSchema.parse({
      ...toClientEntry(data),
      owners: typeof data.owners === 'string' ? [data.owners] : data.owners,
      system: data.system ? data.system : 'homebrew',
      flowTime: parseFlowTime(data),
      hidden: !!data.hidden,
      homepage: data.homepage ? data.homepage : key,
      // We default to sorting by flowTime if no sortOrder is provided
      sortOrder: data.sortOrder ? data.sortOrder : 'flowTime',
      customPageKeys: data.customPageKeys ? data.customPageKeys : false,
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

export function createSite(template?: Partial<Site>): Site {
  return {
    key: template?.key || '',
    flowTime: template?.flowTime || 0,
    name: template?.name || '',
    owners: template?.owners || [],
    hidden: template?.hidden || true,
  };
}
