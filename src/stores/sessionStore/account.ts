import { db } from '@firebase/client';
import { persistentAtom } from '@nanostores/persistent';
import {
  ACCOUNTS_COLLECTION_NAME,
  type Account,
  parseAccount,
} from '@schemas/AccountSchema';
import { doc, onSnapshot } from 'firebase/firestore';
import { atom, computed } from 'nanostores';

/**
 * The nanostores atom that holds the current user Account data.
 *
 */
export const $account = persistentAtom<Account | null>(
  'session-account',
  null,
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return object;
    },
  },
);
const accountNotFound = atom(false);

export const $requiresEula = computed($account, (account) => {
  if (accountNotFound.get()) return true;
  if (!account) return false;
  return !account.eulaAccepted;
});

let unsubscribe: () => void;

export function subscribeToAccount(uid: string) {
  const accountRef = doc(db, ACCOUNTS_COLLECTION_NAME, uid);
  unsubscribe = onSnapshot(accountRef, (snapshot) => {
    if (snapshot.exists()) {
      $account.set(parseAccount(snapshot.data()));
      accountNotFound.set(false);
    } else {
      accountNotFound.set(true);
    }
  });
}

export const unsubscribeFromAccount = () => {
  $account.set(null);
  unsubscribe();
};