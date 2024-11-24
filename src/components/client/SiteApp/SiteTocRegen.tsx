// import { useStore } from '@nanostores/solid';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import { PAGES_COLLECTION_NAME } from '@schemas/PageSchema';
import {
  type PageRef,
  SITES_COLLECTION_NAME,
  type Site,
} from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import { logWarn } from '@utils/logHelpers';
import { toDate } from '@utils/schemaHelpers';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  updateDoc,
} from 'firebase/firestore';
import type { Component } from 'solid-js';

export const SiteTocRegenSection: Component<{ site: Site }> = (props) => {
  const uid = useStore($uid);
  const visible = () => props.site.owners.includes(uid());

  /**
   * Regenerates page references for a site. The site store is subscribed to site doc changes, so this will
   * trigger a site store update, when completed at the server.
   *
   * @param siteKey - The key of the site to recreate page references for.
   */
  async function regenPageRefs() {
    logWarn('Forcibly recreating page references for a site');

    const siteDoc = await getDoc(
      doc(db, SITES_COLLECTION_NAME, props.site.key),
    );

    if (!siteDoc.exists())
      throw new Error(
        `Site with a key ${props.site.key} does not exist, aborting pageRefs recreation.`,
      );

    const refs = new Array<PageRef>();

    const pages = await getDocs(
      collection(
        db,
        SITES_COLLECTION_NAME,
        props.site.key,
        PAGES_COLLECTION_NAME,
      ),
    );

    for (const pageDoc of pages.docs) {
      const ref = {
        key: pageDoc.id,
        name: pageDoc.data().name,
        author: pageDoc.data().owners?.[0] || siteDoc.data().owners[0],
        category: pageDoc.data().category || '',
        flowTime: toDate(pageDoc.data().flowTime).getTime(),
      };
      refs.push(ref);
      //logDebug(`Page reference for ${pageDoc.id} added to the list.`, ref);
    }

    if (!refs.length)
      throw new Error(
        'No pages found for the site, aborting pageRefs recreation.',
      );

    await updateDoc(doc(db, SITES_COLLECTION_NAME, props.site.key), {
      pageRefs: refs,
    });

    logWarn(
      `Page references for the site ${props.site.key} have been recreated. We found ${refs.length + 1} pages.`,
    );

    pushSessionSnack(t('site:toc.recreated', { count: refs.length + 1 }));
  }

  return visible() ? (
    <section class="border p-2 border-radius mt-2">
      <p>{t('site:toc.regenerate.info')}</p>
      <div class="flex justify-center">
        <button type="button" class="button" onClick={regenPageRefs}>
          <cn-icon noun="tools" />
          <span>{t('site:toc.repair')}</span>
        </button>
      </div>
    </section>
  ) : null;
};
