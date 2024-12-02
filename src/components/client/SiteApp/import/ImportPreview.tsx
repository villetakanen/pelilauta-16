/**
 * A Solid JS component for previewing the import results.
 *
 * Shows the list of site.pageRefs that will be created or overwritten.
 */

import type { PageRef, Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
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
      <h4>{t('site:import.preview.title')}</h4>
      <p class="downscaled">
        {t('site:import.preview.description', { count: props.pageRefs.length })}
      </p>
      {props.pageRefs.length > 0 && (
        <table class="full-width">
          <thead>
            <tr>
              <th>{t('entries:site.key')}</th>
              <th>{t('entries:site.name')}</th>
              <th>{t('site:import.preview.action')}</th>
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
                  <td>
                    {exists(pageRef) ? (
                      <span class="notify">
                        {t('site:import.preview.overwrite')}
                      </span>
                    ) : (
                      t('site:import.preview.create')
                    )}
                  </td>
                </tr>
              )}
            </For>
          </tbody>
        </table>
      )}
    </section>
  );
};
