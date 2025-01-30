import { updateSite } from '@firebase/client/site/updateSite';
import {
  SITES_COLLECTION_NAME,
  type Site,
  parseSite,
} from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { atom, onMount } from 'nanostores';

export const site = atom<Site | null>(null);

onMount(site, () => {
  const key = site.get()?.key;
  if (!key) {
    return;
  }
  subscribe(key);
});

async function subscribe(key: string) {
  const { getFirestore, doc, onSnapshot } = await import('firebase/firestore');
  onSnapshot(doc(getFirestore(), SITES_COLLECTION_NAME, key), (doc) => {
    if (doc.exists()) {
      site.set(parseSite(toClientEntry(doc.data()), key));
    } else {
      site.set(null);
    }
  });
}

export async function update(data: Partial<Site>) {
  const key = site.get()?.key;
  if (!key) {
    return;
  }
  // Merge the updates with the current site data
  // updateSite will handle the actual update. Note: site Key
  // is required for the update to work. It also can't be updated
  // for obvious reasons.
  const updated = { ...site.get(), ...data, key };
  // Silent update of the Site Data
  updateSite(updated, true);
}
