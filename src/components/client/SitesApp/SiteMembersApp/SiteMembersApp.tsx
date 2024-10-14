import { ProfileLink } from '@client/shared/ProfileLink';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { updateSite } from '@stores/SitesApp';
import { $uid } from '@stores/sessionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { t } from '@utils/i18n';
import { doc, onSnapshot } from 'firebase/firestore';
import { type Component, For, createSignal, onMount } from 'solid-js';
import { AddSiteMemberForm } from './AddSiteMemberForm';

export const SiteMembersApp: Component<{ siteKey: string }> = (props) => {
  const uid = useStore($uid);

  // Signal undefined|Site
  const [site, setSite] = createSignal<Site | undefined>(undefined);

  onMount(async () => {
    // Subscribe to the site data from Firestore
    const siteRef = doc(db, SITES_COLLECTION_NAME, props.siteKey);
    onSnapshot(siteRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        const newSite = parseSite(toClientEntry(data), props.siteKey);
        setSite(newSite);
      }
    });
  });

  function dropMember(uid: string) {
    const s = site();
    if (!s) return;
    const owners = s.owners.filter((owner) => owner !== uid);
    updateSite({ owners }, s.key);
  }

  return (
    <div class="content-columns">
      {site() && (
        <article>
          <h2>{t('site:members.title')}</h2>
          <For
            each={site()?.owners}
            fallback={<p>{t('site:members.empty')}</p>}
          >
            {(owner) => (
              <div class="toolbar">
                <ProfileLink uid={owner} />
                <button
                  type="button"
                  disabled={uid() === owner}
                  onclick={() => dropMember(owner)}
                >
                  <cn-icon noun="delete" />
                </button>
              </div>
            )}
          </For>
          <hr />
          <h3>{t('site:members.add')}</h3>
          <AddSiteMemberForm site={site() as Site} />
        </article>
      )}
    </div>
  );
};
