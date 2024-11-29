/**
 * A solid-js component for importing wiki pages from a folder, or from a set of markdown files.
 *
 * Child of import/ImportFolder.tsx
 */

import { type Page, parsePage } from '@schemas/PageSchema';
import type { PageRef, Site } from '@schemas/SiteSchema';
import { logDebug } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import { type Component, createSignal } from 'solid-js';

interface ImportFolderProps {
  site: Site;
  newPageRefs: PageRef[];
  setPageRefs: (pageRefs: PageRef[]) => void;
}

export const ImportForm: Component<ImportFolderProps> = (props) => {
  const { site, newPageRefs, setPageRefs } = props;
  const [newPages, setNewPages] = createSignal<Page[]>([]);
  const hasPages = () => newPages().length > 0;

  function handleSubmit(event: Event) {
    event.preventDefault();
  }

  function parseMarkdownFile(file: File) {
    const reader = new FileReader();
    reader.onload = async (event) => {
      const text = event.target?.result as string;
      // logDebug('ImportForm.parseMarkdownFile', text);
      // Parse the markdown file into a Page object.
      const fm = await import('front-matter');
      const { attributes, body } = fm.default(text);
      const pageAttrs: Partial<Page> = attributes as Partial<Page>;
      const page = parsePage({
        key: pageAttrs.key || '',
        name: pageAttrs.name || '',
        markdownContent: body,
        tags: pageAttrs.tags || [],
        createdAt: pageAttrs.createdAt
          ? new Date(pageAttrs.createdAt)
          : new Date(),
        updatedAt: pageAttrs.updatedAt
          ? new Date(pageAttrs.updatedAt)
          : new Date(),
        owners: pageAttrs.owners || [],
        category: pageAttrs.category || '',
      });
      setNewPages([...newPages(), page]);
      logDebug('ImportForm.parseMarkdownFile', page.name);
      const pageRef: PageRef = {
        key: page.key,
        name: page.name,
        flowTime: toDate(page.updatedAt).getTime(),
        author: page.owners[0],
        category: page.category || '',
      };
      setPageRefs([...newPageRefs, pageRef]);
    };
    reader.readAsText(file);
  }

  function handleFilesChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    logDebug('ImportForm.handleFilesChanged', files);

    // Check if the file is a markdown file, if so handle it as a page.
    if (files) {
      const mds = Array.from(files).filter((file) => file.name.endsWith('.md'));
      for (const file of mds) {
        parseMarkdownFile(file);
      }
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="file"
        id="fileInput"
        name="files[]"
        multiple
        onChange={handleFilesChanged}
      />
      <button class="button" type="submit" disabled={!hasPages()}>
        Import
      </button>
    </form>
  );
};
