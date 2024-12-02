/**
 * A Solid JS component for previewing the import results.
 *
 * Shows the list of site.pageRefs that will be created or overwritten.
 */

import type { PageRef, Site } from '@schemas/SiteSchema';
import { type Component, For } from 'solid-js';

interface ImportPreviewProps {
  site: Site;
  pageRefs: PageRef[];
}

export const ImportPreview: Component<ImportPreviewProps> = (props) => {
  function exists(pageRef: PageRef) {
    return (
      props.site.pageRefs?.find((ref) => ref.key === pageRef.key) !== undefined
    );
  }

  return (
    <section class="surface p-2 column-l">
      <h4>Import Preview</h4>
      <p class="downscaled">
        The following {props.pageRefs.length} pages will be created or updated
        in the site.
      </p>
      <table class="full-width">
        <thead>
          <tr>
            <th>Path</th>
            <th>Title</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          <For each={props.pageRefs}>
            {(pageRef) => (
              <tr>
                <td>
                  <code>{`/sites/${props.site.key}/${pageRef.key}`}</code>
                </td>
                <td>{pageRef.name}</td>
                <td>{exists(pageRef) ? 'update' : 'create'}</td>
              </tr>
            )}
          </For>
        </tbody>
      </table>
    </section>
  );
};
