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

export type PageRef = z.infer<typeof PageRefSchema>;

/**
 * Breaking change: This replaces earlier (< 16.x.y) category metadata that was stored in firestore db
 * as "Categories" array in the site document
 */
export const CategoryRefSchema = z.object({
  slug: z.string(),
  name: z.string(),
});

export type CategoryRef = z.infer<typeof CategoryRefSchema>;

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

export function parseSite(data: Partial<Site>, newKey?: string): Site {
  // Forcing key to be a string, even if it's undefined. Legacy support for key field.
  const key = newKey || data.key || '';
  // Legacy support for system field
  const system = data.system ? data.system : 'homebrew';

  // Legacy support for hidden field
  const hidden = data.hidden ? data.hidden : false;

  // Legacy support for homepage field
  const homepage = data.homepage ? data.homepage : key;

  // Legacy support for sortOrder field
  const sortOrder = data.sortOrder ? data.sortOrder : 'flowTime';

  // Legacy support for customPageKeys field
  const customPageKeys = data.customPageKeys ? data.customPageKeys : false;

  try {
    return SiteSchema.parse({
      ...toClientEntry(data),
      name: data.name || '[...]',
      system,
      flowTime: parseFlowTime(data),
      hidden,
      homepage,
      sortOrder,
      customPageKeys,
      key,
    });
  } catch (err: unknown) {
    if (err instanceof z.ZodError) {
      logError('SiteSchema', err.issues);
    }
    throw err;
  }
}

/**
 * Utility for creating a new site entry. Sets default values for new sites for every field.
 *
 * @param template
 * @returns a Site object (extends Entry)
 */
export function createSite(template?: Partial<Site>): Site {
  return {
    key: template?.key || '',
    flowTime: template?.flowTime || 0,
    createdAt: template?.createdAt || new Date(),
    updatedAt: template?.updatedAt || new Date(),
    name: template?.name || '',
    owners: template?.owners || [],
    hidden: template?.hidden || true,
    // Default values for new sites
    system: template?.system || 'homebrew',
    sortOrder: template?.sortOrder || 'flowTime',
    customPageKeys: template?.customPageKeys || false,
  };
}
