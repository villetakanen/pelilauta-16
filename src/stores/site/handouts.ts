import {
  HANDOUTS_COLLECTION_NAME,
  type Handout,
  handoutFrom,
} from '@schemas/HandoutSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { toClientEntry } from '@utils/client/entryUtils';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { logDebug, logWarn } from '@utils/logHelpers';
import { atom, onMount } from 'nanostores';
import { site } from '.';

export const handouts = atom(new Array<Handout>());

// This is a simple store that holds a list of a site's clocks.

onMount(handouts, () => {
  const key = site.get()?.key;
  if (!key) {
    return;
  }
  subscribe(key);
});

async function subscribe(key: string) {
  /*handouts.set([
    handoutFrom({
      title: 'Esimerkkijuttu',
      key: '1',
      siteKey: key,
    }),
  ]);*/

  const { getFirestore, collection, onSnapshot } = await import(
    'firebase/firestore'
  );

  if (site.get()?.owners.includes(uid.get())) {
    // The user is an owner of the site, so they can see all handouts
    onSnapshot(
      collection(
        getFirestore(),
        SITES_COLLECTION_NAME,
        key,
        HANDOUTS_COLLECTION_NAME,
      ),
      (snapshot) => {
        const newHandouts = new Array<Handout>();

        for (const change of snapshot.docChanges()) {
          if (change.type === 'removed') {
            handouts.set([
              ...handouts
                .get()
                .filter((handout) => handout.key !== change.doc.id),
            ]);
            continue;
          }
          newHandouts.push(
            handoutFrom(toClientEntry(change.doc.data()), change.doc.id, key),
          );
        }

        handouts.set(mergeHandouts(handouts.get(), newHandouts));
      },
    );
  } else {
    // We need to get the handouts that the user is in the readers ACL of the handout
    logDebug('User specific handouts not implemented yet');
  }
}

function mergeHandouts(
  oldHandouts: Handout[],
  newHandouts: Handout[],
): Handout[] {
  const merged = new Array<Handout>();

  for (const handout of oldHandouts) {
    const newHandout = newHandouts.find((h) => h.key === handout.key);
    if (newHandout) {
      merged.push(newHandout);
    } else {
      merged.push(handout);
    }
  }

  for (const handout of newHandouts) {
    if (!oldHandouts.find((h) => h.key === handout.key)) {
      merged.push(handout);
    }
  }

  return merged;
}

export async function update(handout: Partial<Handout>) {
  if (!handout.siteKey || !handout.key) {
    logWarn('Tried to update a handout without a siteKey or a key');
    return;
  }

  const entry = toFirestoreEntry(handout);

  const { updateDoc, getFirestore, doc } = await import('firebase/firestore');
  await updateDoc(
    doc(
      getFirestore(),
      SITES_COLLECTION_NAME,
      handout.siteKey,
      HANDOUTS_COLLECTION_NAME,
      handout.key,
    ),
    entry,
  );
}
