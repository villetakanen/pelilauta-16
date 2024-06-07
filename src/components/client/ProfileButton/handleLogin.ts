import { makePersisted } from '@solid-primitives/storage';
import { logDebug, logError } from '@utils/logHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { createStore } from 'solid-js/store';
import { db } from 'src/firebase/client';
import { parseAccount } from 'src/schemas/AccountSchema';

export async function handleLogin(uid: string) {
  if (!uid) {
    throw new Error(
      'handleLogin: Trying to fetch user data for anonymous user, aborting',
    );
  }

  const accountDoc = await getDoc(doc(db, 'account', uid));
  if (!accountDoc.exists()) {
    logError(
      'handleLogin: User data not found - account creation is not implemented yet',
      uid,
    );
    throw new Error(
      'handleLogin: User data not found - account creation is not implemented yet',
    );
  }

  const account = parseAccount(accountDoc.data(), uid);

  const [getStore, setStore] = makePersisted(createStore({ ...account }), {
    name: 'account',
  });
  setStore(account);
  logDebug('handleLogin: User data fetched and stored', account);
}
