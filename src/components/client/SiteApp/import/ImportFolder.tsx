/**
 * A solid-js component for importing wiki pages from a folder, or from a set of markdown files.
 *
 */

import { WithAuth } from '@client/shared/WithAuth';
import { useStore } from '@nanostores/solid';
import type { PageRef, Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { type Component, createSignal } from 'solid-js';
import { ImportForm } from './ImportForm';
import { ImportPreview } from './ImportPreview';

interface ImportFolderProps {
  site: Site;
}

export const ImportFolder: Component<ImportFolderProps> = (props) => {
  const { site } = props;
  const uid = useStore($uid);
  const [newPages, setNewPages] = createSignal<PageRef[]>([]);

  const visible = () => site.owners.includes(uid());

  return (
    <WithAuth allow={visible()}>
      <div class="content-columns">
        <ImportPreview site={site} pageRefs={newPages()} />
        <ImportForm
          site={site}
          newPageRefs={newPages()}
          setPageRefs={setNewPages}
        />
      </div>
    </WithAuth>
  );
};
