/**
 * This is a nanostore used by the import app, to manage the pre-processing of imported pages
 * to a site.
 *
 * It handles the import preview and lists each page as
 * - New page
 * - Overwrite existing page
 */

import type { Page } from '@schemas/PageSchema';
import { logDebug } from '@utils/logHelpers';
import { atom } from 'nanostores';

export interface ImportedPage extends Partial<Page> {
  fileName: string;
  action: 'create' | 'overwrite';
  existingPageKey?: string;
}

export const importedPages = atom<ImportedPage[]>([]);
export const isImporting = atom<boolean>(false);

export const importStore = {
  addPages: (pages: Array<Partial<Page> & { fileName: string }>) => {
    logDebug('importStore', 'Adding pages:', pages.length);
    const newPages: ImportedPage[] = pages.map((page) => ({
      ...page,
      action: 'create' as const,
      fileName: page.fileName,
    }));
    importedPages.set([...importedPages.get(), ...newPages]);
  },

  removePages: (indices: number[]) => {
    const current = importedPages.get();
    const filtered = current.filter((_, index) => !indices.includes(index));
    importedPages.set(filtered);
  },

  updatePageAction: (
    index: number,
    action: 'create' | 'overwrite',
    existingPageKey?: string,
  ) => {
    const current = importedPages.get();
    if (current[index]) {
      const updated = [...current];
      updated[index] = {
        ...updated[index],
        action,
        existingPageKey,
      };
      importedPages.set(updated);
    }
  },

  clear: () => {
    importedPages.set([]);
  },

  getPages: () => importedPages.get(),
  setImporting: (importing: boolean) => isImporting.set(importing),
};
