import { WithLoader } from '@client/shared/WithLoader';
import { SiteCard } from '@client/sites/SiteCard';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
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

  createEffect(() => {
    if (!uid()) {
      window.location.href = '/sites';
    }
  });

  const fetchSites = async (uid: string) => {
    if (!uid) return new Array<Site>();

    const siteDocs = await getDocs(
      query(
        collection(db, SITES_COLLECTION_NAME),
        where('owners', 'array-contains', uid),
      ),
    );

    const sitesArray = siteDocs.docs.map((doc) => {
      return parseSite(toClientEntry(doc.data()), doc.id);
    });

    logDebug('SitesList', 'fetchSites', sitesArray);

    return sitesArray;
  };

  const [sitesData] = createResource(uid, fetchSites);
  const sitesArray = createMemo(() =>
    sitesData.loading
      ? new Array<Site>()
      : sitesData()?.sort((a, b) => b.flowTime - a.flowTime),
  );
  const loading = () => sitesData.loading;

  return (
    <>
      <div class="content-columns">
        <article class="column-l">
          <h4>{t('library:sites.title')}</h4>
        </article>
      </div>
      <WithLoader loading={loading()}>
        <div class="content-cards">
          <For each={sitesArray()}>
            {(site) => <SiteCard {...site} key={site.key} />}
          </For>
        </div>
      </WithLoader>
    </>
  );
};
