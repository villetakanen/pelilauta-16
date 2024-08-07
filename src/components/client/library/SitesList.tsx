import { WithLoader } from '@client/shared/WithLoader';
import { WithLogin } from '@client/shared/WithLogin';
import { SiteCard } from '@client/sites/SiteCard';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { $loadingState, $sites } from 'src/stores/sitesStore';

export const SitesList: Component = () => {
  const sites = useStore($sites);
  const loadingState = useStore($loadingState);

  const loading = createMemo(() => loadingState() !== 'active');

  return (
    <WithLogin>
      <div class="content-columns">
        <article class="column-l">
          <h4>{t('library:sites.title')}</h4>
        </article>
      </div>
      <WithLoader loading={loading()}>
        <div class="content-cards">
          <For each={sites()}>
            {(site) => <SiteCard {...site} key={site.key} />}
          </For>
        </div>
      </WithLoader>
    </WithLogin>
  );
};
