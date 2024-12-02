/**
 * A solid-js component for importing wiki pages from a folder, or from a set of markdown files.
 *
 * Child of import/ImportFolder.tsx
 */

import { addPage } from '@firebase/client/site/addPage';
import { updateSite } from '@firebase/client/site/updateSite';
import { useStore } from '@nanostores/solid';
import { type Page, parsePage } from '@schemas/PageSchema';
import type { PageRef, Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { toMekanismiURI } from '@utils/mekanismiUtils';
import { toDate } from '@utils/schemaHelpers';
import { type Component, createSignal } from 'solid-js';

interface ImportFolderProps {
  site: Site;
  pageRefs: PageRef[];
  setPageRefs: (pageRefs: PageRef[]) => void;
}

export const ImportForm: Component<ImportFolderProps> = (props) => {
  const [newPages, setNewPages] = createSignal<Page[]>([]);
  const hasPages = () => newPages().length > 0;
  const uid = useStore($uid);

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const pages = newPages();
    const pageRefs = props.pageRefs;

    // Add the pages to the site.
    for (const page of pages) {
      await addPage(props.site.key, page, page.key);
    }

    // Merge the new pageRefs with the existing pageRefs.
    const newPageRefs: PageRef[] = props.site.pageRefs
      ? [...props.site.pageRefs]
      : [];
    for (const pageRef of pageRefs) {
      const index = newPageRefs.findIndex((pr) => pr.key === pageRef.key);
      if (index === -1) {
        newPageRefs.push(pageRef);
      } else {
        newPageRefs[index] = pageRef;
      }
    }
    await updateSite({ key: props.site.key, pageRefs: newPageRefs });

    pushSessionSnack(t('site:import.importedPages', { count: pages.length }));

    // Navigate to ToC
    window.location.href = `/sites/${props.site.key}/toc`;
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
      const page = parsePage(
        {
          siteKey: props.site.key || '',
          name: pageAttrs.name || '',
          markdownContent: body,
          tags: pageAttrs.tags || [],
          createdAt: pageAttrs.createdAt
            ? new Date(pageAttrs.createdAt)
            : new Date(),
          updatedAt: pageAttrs.updatedAt
            ? new Date(pageAttrs.updatedAt)
            : new Date(),
          owners: [uid()],
          category: pageAttrs.category || '',
        },
        toMekanismiURI(pageAttrs.name || ''),
      );
      setNewPages([...newPages(), page]);
      const pageRef: PageRef = {
        key: page.key,
        name: page.name,
        flowTime: toDate(page.updatedAt).getTime(),
        author: uid(),
        category: page.category || '',
      };
      props.setPageRefs([...props.pageRefs, pageRef]);
    };
    reader.readAsText(file);
  }

  function handleFilesChanged(event: Event) {
    const target = event.target as HTMLInputElement;
    const files = target.files;
    // logDebug('ImportForm.handleFilesChanged', files);

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
      <label>
        Select markdown files to import: {props.pageRefs.length}
        <input
          type="file"
          id="fileInput"
          name="files[]"
          multiple
          onChange={handleFilesChanged}
        />
      </label>
      <button class="button" type="submit" disabled={!hasPages()}>
        Import
      </button>
    </form>
  );
};
