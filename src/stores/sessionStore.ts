import { persistentAtom } from '@nanostores/persistent';
import { logDebug } from '@utils/logHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { atom, computed, onMount } from 'nanostores';
import { auth, db } from 'src/firebase/client';
import {
  ACCOUNTS_COLLECTION_NAME,
  type Account,
  parseAccount,
} from 'src/schemas/AccountSchema';
import {
  PROFILES_COLLECTION_NAME,
  type Profile,
  parseProfile,
} from 'src/schemas/ProfileSchema';

export const $uid = persistentAtom<string>('uid', '');

export type LoadingStateValue = 'empty' | 'loading' | 'loaded';
export const $loadingState = atom<LoadingStateValue>('empty');

// Account of the current user
export const $account = persistentAtom<Account>(
  'account',
  {
    uid: '',
    eulaAccepted: false,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

export const requiresEula = computed(
  $loadingState,
  ($state) => $state === 'loaded' && !$account.get().eulaAccepted && $uid.get(),
);

// Profile of the current user
export const $profile = persistentAtom<Profile>(
  'profile',
  {
    nick: '',
    avatarURL: '',
    bio: '',
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

onMount($uid, () => {
  logDebug('sessionStore', 'onMount', $uid.get());
  auth.onAuthStateChanged((user) => {
    logDebug('sessionStore', 'onAuthStateChanged', user);
    if (user) {
      login(user.uid);
    } else {
      logout();
    }
  });
});

async function login(uid: string) {
  logDebug('sessionStore', 'login', uid);
  $loadingState.set('loading');
  $uid.set(uid);
  await fetchAccount(uid);
  await fetchProfile(uid);
  $loadingState.set('loaded');
}

export async function logout() {
  if (!$uid.get()) return;
  logDebug('sessionStore', 'logout');
  $uid.set('');
  $account.set({ uid: '', eulaAccepted: false });
  $profile.set({ nick: '', avatarURL: '', bio: '' });
  window?.localStorage.clear();
}

async function fetchAccount(uid: string) {
  // Fetch account data from Firestore
  logDebug('sessionStore', 'fetchAccount', uid);
  const accountDoc = await getDoc(doc(db, ACCOUNTS_COLLECTION_NAME, uid));

  if (!accountDoc.exists())
    throw new Error(`Account not found for uid: ${uid}`);

  $account.set(parseAccount(accountDoc.data(), uid));
  logDebug('sessionStore', 'fetchAccount', 'loaded account data to store');
}

async function fetchProfile(uid: string) {
  // Fetch profile data from Firestore
  logDebug('sessionStore', 'fetchProfile', uid);
  const profileDoc = await getDoc(doc(db, PROFILES_COLLECTION_NAME, uid));

  if (!profileDoc.exists())
    throw new Error(`Profile not found for uid: ${uid}`);

  $profile.set(parseProfile(profileDoc.data(), uid));
  logDebug('sessionStore', 'fetchProfile', 'loaded profile data to store');
}
