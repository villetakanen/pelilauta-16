/**
 * A Solid-js view component for listing and managing the Site Assets.
 *
 * Please note: asset listing is only visible to a logged-in user
 * (even for sites that are public).
 */

import { WithAuth } from '@client/shared/WithAuth';
import { db } from '@firebase/client';
import { deleteSiteAsset } from '@firebase/client/site/deleteSiteFromAssets';
import { useStore } from '@nanostores/solid';
import type { Asset } from '@schemas/AssetSchema';
import {
  SITES_COLLECTION_NAME,
  type Site,
  createSite,
  parseSite,
} from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { t } from '@utils/i18n';
import { doc, onSnapshot } from 'firebase/firestore';
import {
  type Component,
  For,
  createResource,
  createSignal,
  onCleanup,
} from 'solid-js';
import { Portal } from 'solid-js/web';
import { AssetRowItem } from './AssetRowItem';
import { UploadAssetToSiteFab } from './UploadAssetToSiteFab';

interface SiteAssetsViewProps {
  siteKey: string;
}

export const SiteAssetsView: Component<SiteAssetsViewProps> = (props) => {
  const uid = useStore($uid);
  const allow = () => !!uid();

  // Use a signal to hold the site data
  const [site, setSite] = createSignal<Site | undefined>();

  // Create a resource (mainly for the initial fetch)
  createResource(props.siteKey, (key) => {
    const docRef = doc(db, SITES_COLLECTION_NAME, key);
    const unsubscribe = onSnapshot(docRef, (doc) => {
      if (doc.exists()) {
        setSite(parseSite(toClientEntry(doc.data()), doc.id));
      } else {
        // Handle the case where the document doesn't exist
        setSite(undefined);
      }
    });
    onCleanup(unsubscribe);
  });

  async function deleteAsset(asset: Asset) {
    deleteSiteAsset(site() || createSite(), `${asset.storagePath}`);
  }

  return (
    <WithAuth allow={allow()} message={t('site:assets.forbidden')}>
      <div class="content-columns">
        <article class="column-l surface p-2">
          <h1>{t('site:assets.title')}</h1>
          <p>{t('site:assets.description')}</p>
          {site()?.assets?.length && (
            <div class="flex flex-col">
              <For each={site()?.assets}>
                {(asset) => (
                  <AssetRowItem
                    asset={asset}
                    onDelete={deleteAsset}
                    site={site()}
                  />
                )}
              </For>
            </div>
          )}
        </article>
      </div>
      {site() && (
        <Portal mount={document.querySelector('#fab-tray') || document.body}>
          <UploadAssetToSiteFab site={site() || createSite()} />
        </Portal>
      )}
    </WithAuth>
  );
};
