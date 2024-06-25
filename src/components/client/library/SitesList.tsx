import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { toDate } from '@utils/schemaHelpers';
import { type Component, For } from 'solid-js';
import { $sites } from 'src/stores/sitesStore';

export const SitesList: Component = () => {
  const sites = useStore($sites);

  return (
    <article>
      <h4>{t('library:sites.title')}</h4>
      <p>
        {t('library:sites.description')} {sites().length}
      </p>
      <div class="content-cards">
        <For each={sites()}>
          {(site) => (
            <cn-card title={site.name} cover={site.posterURL}>
              <p>{site.description}</p>
              {toDate(site.flowTime).toLocaleDateString()}
            </cn-card>
          )}
        </For>
      </div>
    </article>
  );
};
