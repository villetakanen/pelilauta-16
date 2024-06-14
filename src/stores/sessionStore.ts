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

export const $uid = persistentAtom<string>('uid', '');

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

export const requiresEula = computed($account, (account) => {
  if ($loadingState.get() === 'empty' || $loadingState.get() === 'loading')
    return false;
  // If we do not have a user, we do not require EULA
  if (!$uid.get()) return false;
  // If we have a user and the EULA has been accepted, we do not require EULA
  if (account.eulaAccepted) return false;
  // If we have a user and the EULA has not been accepted, we require EULA
  return true;
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

onMount($uid, () => {
  logDebug('sessionStore', 'onMount', $uid.get());
  auth.onAuthStateChanged((user) => {
    logDebug('sessionStore', 'onAuthStateChanged', user);
    if (user) {
      login(user.uid);
    } else {
      logout();
      $loadingState.set('loaded');
    }
  });
});

async function login(uid: string) {
  logDebug('sessionStore', 'login', uid);
  $loadingState.set('loading');
  $uid.set(uid);
  logDebug('sessionStore', 'login', 'fetching account and profile data');
  await fetchAccount(uid);
  logDebug('sessionStore', 'login', 'fetching profile data');
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
