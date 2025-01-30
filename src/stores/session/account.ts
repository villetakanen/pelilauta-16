import { persistentAtom } from '@nanostores/persistent';
import {
  ACCOUNTS_COLLECTION_NAME,
  type Account,
  parseAccount,
} from '@schemas/AccountSchema';
import { logDebug, logWarn } from '@utils/logHelpers';
import { atom, computed } from 'nanostores';

// *** Primary session stores ******************************************

// The nanostores persisten atom that holds the current user Account data.
export const account = persistentAtom<Account | null>('session-account', null, {
  encode: JSON.stringify,
  decode: (data) => {
    if (!data || data === 'null') return null;
    logDebug('AccountStore', 'decode', 'Decoding account data', data);
    const object = parseAccount(JSON.parse(data));
    return object;
  },
});
// Legacy support for solid components
export const $account = account;

// *** Computed stores *************************************************

// Helper for the EULA acceptance state
export const requiresEula = computed(account, (account) => {
  if (accountNotFound.get()) return true;
  if (!account) return false;
  return !account.eulaAccepted;
});

// *** REFACTORED UP TO HERE *******************************************

const accountNotFound = atom(false);

export const $requiresEula = computed($account, (account) => {
  if (accountNotFound.get()) return true;
  if (!account) return false;
  return !account.eulaAccepted;
});

let unsubscribe: () => void;

export async function subscribeToAccount(uid: string) {
  const { doc, onSnapshot, getFirestore } = await import('firebase/firestore');

  const accountRef = doc(getFirestore(), ACCOUNTS_COLLECTION_NAME, uid);
  unsubscribe = onSnapshot(accountRef, (snapshot) => {
    if (snapshot.exists()) {
      $account.set(parseAccount(snapshot.data()));

      // Lets check if the lastLogin is within 24 hours, if not we will update it
      const lastLoginTime = $account.get()?.lastLogin?.getTime() || 0;
      console.log('lastLogin', lastLoginTime);
      const now = new Date();
      const diff = now.getTime() - lastLoginTime;
      const hours = diff / 1000 / 60 / 60;
      if (hours > 24) {
        stampLoginTime(uid);
      }
      accountNotFound.set(false);
    } else {
      accountNotFound.set(true);
    }
  });
}

async function stampLoginTime(uid: string) {
  const { doc, updateDoc, getFirestore, serverTimestamp } = await import(
    'firebase/firestore'
  );
  updateDoc(doc(getFirestore(), ACCOUNTS_COLLECTION_NAME, uid), {
    lastLogin: serverTimestamp(),
  });
  logWarn('AccountStore', 'stampLoginTime', 'Updated lastLogin time');
}

export const unsubscribeFromAccount = () => {
  $account.set(null);
  unsubscribe?.();
};
