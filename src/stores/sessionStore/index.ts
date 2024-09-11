import { persistentAtom } from '@nanostores/persistent';
import { logDebug, logWarn } from '@utils/logHelpers';
import type { User } from 'firebase/auth';
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
import { loadUserAssets } from '../assetStore';
import { initSubscriberStore } from './subscriber';

// The active user's UID - stored in localStorage for session persistence
export const $uid = persistentAtom<string>('session-uid', '');

// Session loading state - used to determine if the session is active
type LoadingStateValue = 'initial' | 'loading' | 'active';
const $loadingState = persistentAtom<LoadingStateValue>(
  'session_loadingState',
  'initial',
);

// Computed helper for the loading state
export const $active = computed($loadingState, (state) => state === 'active');

// Computed helper for the anonymous session state
export const $isAnonymous = computed([$active, $uid], (active, uid) => {
  // We do not know if the user is anonymous while loading, assuming no
  if (!active) return false;

  // An anonymous user has no uid
  return !uid;
});

const defaultAccount: Account = {
  uid: '',
  eulaAccepted: false,
};

const defaultProfile: Profile = {
  nick: '',
  avatarURL: '',
  bio: '',
};

// *** Session user Account state ********************************************

export const $account = persistentAtom<Account>(
  'account',
  {
    ...defaultAccount,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

/**
 * Returns true, if the user requires to accept the EULA.
 */
export const $requiresEula = computed(
  [$active, $account],
  (active, account) => {
    // We do not know if the user requires EULA while loading, assuming no
    if (!active) return false;

    // An anonymous user does not require EULA
    if (!account.uid) return false;

    // If the EULA has been accepted, we do not require EULA
    return !account.eulaAccepted;
  },
);

// *** Session user Profile state ********************************************
export const $profile = persistentAtom<Profile>(
  'profile',
  {
    ...defaultProfile,
  },
  {
    encode: JSON.stringify,
    decode: JSON.parse,
  },
);

// *** State management ******************************************************

onMount($account, () => {
  auth.onAuthStateChanged(handleFirebaseAuthChange);
  logDebug('sessionStore mounted, subscribing to Firebase auth state changes');
});

/**
 * This function is called whenever the firebase auth state changes.
 *
 * @param user
 */
async function handleFirebaseAuthChange(user: User | null) {
  // Lets see if Firebase has a user for us
  if (user) {
    // Lets see if we have an active session, with same UID, if so, we are done
    if ($loadingState.get() === 'active' && user.uid === $account.get().uid) {
      logDebug(
        'sessionStore',
        'handleFirebaseAuthChange',
        'Session data found for the firebase uid, skipping state change',
      );
    } else {
      // We have a new user, lets login
      await login(user.uid);
    }
  } else {
    await logout();
  }
}

async function login(uid: string) {
  if (!uid) {
    logWarn('sessionStore', 'login', 'No uid provided');
    return;
  }
  $uid.set(uid);
  // As we are logging in, we need to set the loading state
  $loadingState.set('loading');

  // Fetch account and profile data
  const account = await fetchAccount(uid);
  $account.set(account || { ...defaultAccount, uid });

  const profile = await fetchProfile(uid);
  $profile.set(profile || { ...defaultProfile });

  // Prefetch user assets
  loadUserAssets(uid);

  // subscribe to user subscriptions data
  initSubscriberStore(uid);
}

async function clear() {
  window?.localStorage.clear();
  $account.set({ ...defaultAccount });
  $profile.set({ ...defaultProfile });
  $uid.set('');
}

export async function logout() {
  // As we are logging out, we need to set the loading state
  $loadingState.set('loading');

  // Clear the session
  await clear();

  // Sign out from Firebase
  auth.signOut();
}

async function fetchAccount(uid: string) {
  // Fetch account data from Firestore
  const accountDoc = await getDoc(doc(db, ACCOUNTS_COLLECTION_NAME, uid));

  if (!accountDoc.exists()) {
    logWarn(`Account not found for uid: ${uid}`);
    return;
  }

  return parseAccount(accountDoc.data(), uid);
}

async function fetchProfile(uid: string) {
  const profileDoc = await getDoc(doc(db, PROFILES_COLLECTION_NAME, uid));

  if (!profileDoc.exists()) {
    logWarn(`Profile not found for uid: ${uid}`);
    return;
  }

  return parseProfile(profileDoc.data(), uid);
}

export * from './subscriber';
