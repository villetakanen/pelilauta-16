import { SiteCard } from '@client/sites/SiteCard';
import { useStore } from '@nanostores/solid';
import { $uid } from '@stores/sessionStore';
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
        <article class="column-l">
          <h4>{t('library:sites.title')}</h4>
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
