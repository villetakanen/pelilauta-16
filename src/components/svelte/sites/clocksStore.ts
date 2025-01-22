import {
  CLOCKS_COLLECTION_NAME,
  type Clock,
  parseClock,
} from '@schemas/ClockSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import { atom, onMount } from 'nanostores';
import { site } from './siteStore';

export const clocks = atom<Clock[]>([]);

// This is a simple store that holds a list of a site's clocks.

onMount(clocks, () => {
  logDebug('clocksStore mounted', site.get());
  const key = site.get()?.key;
  if (!key) {
    return;
  }
  subscribe(key);
});

async function subscribe(key: string) {
  logDebug('subscribing to clocks', key);
  const { getFirestore, collection, onSnapshot } = await import(
    'firebase/firestore'
  );

  onSnapshot(
    collection(
      getFirestore(),
      SITES_COLLECTION_NAME,
      key,
      CLOCKS_COLLECTION_NAME,
    ),
    (snapshot) => {
      if (snapshot.empty) {
        clocks.set([]);
        return;
      }
      const newClocks = new Array<Clock>();

      for (const change of snapshot.docChanges()) {
        logDebug('clock change', change.type, change.doc.id);
        if (change.type === 'removed') {
          clocks.set([
            ...clocks.get().filter((clock) => clock.key !== change.doc.id),
          ]);
          continue;
        }
        newClocks.push(
          parseClock(toClientEntry(change.doc.data()), change.doc.id),
        );
      }

      logDebug('got new clocks', newClocks.length);

      clocks.set(mergeClocks(clocks.get(), newClocks));

      logDebug('clocks updated', clocks.get().length);
    },
  );
}

function mergeClocks(c: Array<Clock>, newClocks: Array<Clock>) {
  const merged = new Map<string, Clock>();
  for (const clock of c) {
    merged.set(clock.key, clock);
  }
  for (const clock of newClocks) {
    merged.set(clock.key, clock);
  }
  return Array.from(merged.values());
}
