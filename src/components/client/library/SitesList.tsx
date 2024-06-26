import { SiteCard } from '@client/sites/SiteCard';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
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
          {(site) => <SiteCard {...site} key={site.key} />}
        </For>
      </div>
    </article>
  );
};
