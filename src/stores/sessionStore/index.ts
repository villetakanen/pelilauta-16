import { persistentAtom } from '@nanostores/persistent';
import { logDebug, logError } from '@utils/logHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { computed, onMount } from 'nanostores';
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

export type LoadingStateValue = 'empty' | 'loading' | 'loaded';
export const $loadingState = persistentAtom<LoadingStateValue>('empty');

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

export const uid = computed($account, (account) => {
  return account.uid;
});

export const requiresEula = computed($account, (account) => {
  if ($loadingState.get() === 'empty' || $loadingState.get() === 'loading')
    return false;
  // If we do not have a user, we do not require EULA
  if (account.uid) return false;
  // If we have a user and the EULA has been accepted, we do not require EULA
  if (account.eulaAccepted) return false;
  // If we have a user and the EULA has not been accepted, we require EULA
  return true;
});

export const isAnonymous = computed($loadingState, (state) => {
  // return false while loading
  if (state === 'empty' || state === 'loading') return false;
  return !$account.get().uid;
});

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

onMount($account, () => {
  logDebug('sessionStore', 'onMount');
  auth.onAuthStateChanged((user) => {
    logDebug('sessionStore', 'onAuthStateChanged', user);
    if (user) {
      logDebug('sessionStore', 'onAuthStateChanged', 'logged in', user.uid);
      login(user.uid);
    } else {
      logout();
      $loadingState.set('loaded');
    }
  });
});

async function login(userKey: string) {
  logDebug('sessionStore', 'login', userKey, uid.get());

  if ($account.get().uid === userKey) {
    logDebug('sessionStore', 'login', 'already logged in');
    $loadingState.set('loaded');
    return;
  }

  $loadingState.set('loading');
  logDebug('sessionStore', 'login', 'fetching account and profile data');
  await fetchAccount(userKey);
  logDebug('sessionStore', 'login', 'fetching profile data');
  await fetchProfile(userKey);
  $loadingState.set('loaded');
}

export async function logout() {
  if ($account.get().uid) return;
  logDebug('sessionStore', 'logout');
  $account.set({ uid: '', eulaAccepted: false });
  $profile.set({ nick: '', avatarURL: '', bio: '' });
  window?.localStorage.clear();
}

async function fetchAccount(uid: string) {
  // Fetch account data from Firestore
  logDebug('sessionStore', 'fetchAccount', uid);
  const accountDoc = await getDoc(doc(db, ACCOUNTS_COLLECTION_NAME, uid));

  if (!accountDoc.exists()) {
    $loadingState.set('loaded');
    logError(`Account not found for uid: ${uid}`);
    return;
  }

  $account.set(parseAccount(accountDoc.data(), uid));
  logDebug('sessionStore', 'fetchAccount', 'loaded account data to store');
}

async function fetchProfile(uid: string) {
  // Fetch profile data from Firestore
  logDebug('sessionStore', 'fetchProfile', uid);
  const profileDoc = await getDoc(doc(db, PROFILES_COLLECTION_NAME, uid));

  if (!profileDoc.exists()) {
    logError(`Profile not found for uid: ${uid}`);
    return;
  }

  $profile.set(parseProfile(profileDoc.data(), uid));
  logDebug('sessionStore', 'fetchProfile', 'loaded profile data to store');
}
