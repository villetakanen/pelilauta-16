import { SiteCard } from '@client/sites/SiteCard';
import { useStore } from '@nanostores/solid';
import { $topSites } from '@stores/FrontPage/TopSitesStore';
import { type Component, For } from 'solid-js';

export const TopSitesSection: Component = () => {
  const sites = useStore($topSites);

  return (
    <div class="flex flex-column">
      <For each={sites()}>
        {(site) => <>{site && <SiteCard {...site} />}</>}
      </For>
    </div>
  );
};
