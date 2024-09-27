import { SiteCard } from '@client/sites/SiteCard';
import { useStore } from '@nanostores/solid';
import { $topSites } from '@stores/FrontPage/TopSitesStore';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

export const TopSitesSection: Component = () => {
  const sites = useStore($topSites);

  return (
    <div class="flex flex-col">
      <For each={sites()}>
        {(site) => <>{site && <SiteCard {...site} />}</>}
      </For>
      <div class="flex justify-center mt-2">
        <a href="/sites" class="button">
          {t('actions:showMore')}
        </a>
      </div>
    </div>
  );
};
