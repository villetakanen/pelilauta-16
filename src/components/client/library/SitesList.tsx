import { WithLoader } from '@client/shared/WithLoader';
import { SiteCard } from '@client/sites/SiteCard';
import { db } from '@firebase/client';
import { persistentAtom } from '@nanostores/persistent';
import { useStore } from '@nanostores/solid';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { $sitesCache } from '@stores/sitesStore/userSitesCache';
import { toClientEntry } from '@utils/client/entryUtils';
import { t } from '@utils/i18n';
import { collection, getDocs, query, where } from 'firebase/firestore';
import {
  type Component,
  For,
  createEffect,
  createMemo,
  createResource,
} from 'solid-js';

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
