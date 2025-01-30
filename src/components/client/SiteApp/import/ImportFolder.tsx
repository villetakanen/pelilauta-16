/**
 * A solid-js component for importing wiki pages from a folder, or from a set of markdown files.
 *
 */

import { WithAuth } from '@client/shared/WithAuth';
import { useStore } from '@nanostores/solid';
import type { PageRef, Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/session';
import { type Component, createSignal } from 'solid-js';
import { ImportForm } from './ImportForm';
import { ImportPreview } from './ImportPreview';

interface ImportFolderProps {
  site: Site;
}

export const ImportFolder: Component<ImportFolderProps> = (props) => {
  const { site } = props;
  const uid = useStore($uid);
  const [pageRefs, setPageRefs] = createSignal<PageRef[]>([]);

  const visible = () => site.owners.includes(uid());

  return (
    <WithAuth allow={visible()}>
      <div class="content-columns">
        <ImportPreview site={site} pageRefs={pageRefs()} />
        <ImportForm
          site={site}
          pageRefs={pageRefs()}
          setPageRefs={setPageRefs}
        />
      </div>
    </WithAuth>
  );
};
