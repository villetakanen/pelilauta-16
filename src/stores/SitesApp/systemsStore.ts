import { persistentAtom } from '@nanostores/persistent';
import {
  type GameSystem,
  type GameSystems,
  parseGameSystem,
} from '@schemas/GameSystemSchema';
import { doc, getDoc } from 'firebase/firestore';
import { onMount } from 'nanostores';
import { db } from 'src/firebase/client';

export const $gamesystems = persistentAtom<GameSystems>(
  'site-gamesystems',
  [],
  {
    encode: JSON.stringify,
    decode: (data) => {
      return JSON.parse(data).map((entry: Partial<GameSystem>) => {
        return parseGameSystem(entry);
      });
    },
  },
);

onMount($gamesystems, () => {
  fetchGameSystemsFromDB();
});

async function fetchGameSystemsFromDB() {
  const siteAppMetaDocRef = doc(db, 'meta', 'sites');
  const docSnap = await getDoc(siteAppMetaDocRef);
  if (docSnap.exists() && docSnap.data()) {
    const newData: GameSystems = [];
    const data = docSnap.data();
    for (const system of data.gamesystems) {
      newData.push(parseGameSystem(system));
    }
    $gamesystems.set(newData);
  }
}
