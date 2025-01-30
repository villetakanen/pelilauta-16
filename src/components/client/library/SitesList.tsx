import { SiteCard } from '@client/sites/SiteCard';
import { useStore } from '@nanostores/solid';
import { $uid } from '@stores/session';
import { $sitesCache } from '@stores/sitesStore/userSitesCache';
import { t } from '@utils/i18n';
import { type Component, For, createEffect } from 'solid-js';

export const SitesList: Component = () => {
  const uid = useStore($uid);
  const sites = useStore($sitesCache);

  createEffect(() => {
    if (!uid()) {
      window.location.href = '/sites';
    }
  });

  return (
    <>
      <div class="content-columns">
        <article class="column-l flex justify-space-between">
          <h4>{t('library:sites.title')}</h4>
          <a href="/sites" class="button">
            <cn-icon noun="mekanismi" small />
            <span class="sm-hidden">{t('site:siteList.title')}</span>
          </a>
        </article>
      </div>
      <div class="content-cards">
        <For each={sites()}>
          {(site) => <SiteCard {...site} key={site.key} />}
        </For>
      </div>
    </>
  );
};
