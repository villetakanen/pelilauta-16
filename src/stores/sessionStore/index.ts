import { persistentAtom } from '@nanostores/persistent';
import { logDebug, logError, logWarn } from '@utils/logHelpers';
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

const defaultAccount: Account = {
  uid: '',
  eulaAccepted: false,
};
const defaultProfile: Profile = {
  nick: '',
  avatarURL: '',
  bio: '',
};

// *** Session loading state *************************************************
type LoadingStateValue = 'loading' | 'active';
const $loadingState = persistentAtom<LoadingStateValue>('loading');

/**
 * Returns false if the session is initializing, true if it is loaded.
 */
export const $active = computed($loadingState, (state) => state === 'active');

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

export const $uid = computed($account, (account) => {
  return account.uid;
});

/**
 * Returns true if the user is anonymous, false otherwise.
 */

export const $isAnonymous = computed([$active, $account], (active, account) => {
  // We do not know if the user is anonymous while loading, assuming no
  if (!active) return false;

  // An anonymous user has no uid
  return !account.uid;
});

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
  logDebug('sessionStore', 'onMount');
  auth.onAuthStateChanged(async (user) => {
    logDebug('sessionStore', 'onAuthStateChanged', user);

    // If we have a user:
    if (user) {
      // If the session is active, we already have some user data, check if it is the same user
      if ($loadingState.get() === 'active') {
        if (user.uid === $account.get().uid) {
          logDebug(
            'sessionStore',
            'onAuthStateChanged',
            'Session data found, assuming it is the same user',
          );
          return;
        }
        logWarn(
          'sessionStore',
          'onAuthStateChanged',
          'Session data found, but different user',
        );
        await logout();
      }
      await login(user.uid);
    } else {
      logDebug('sessionStore', 'onAuthStateChanged', 'no user');
      await logout();
    }
    $loadingState.set('active');
  });
});

async function login(uid: string) {
  // As we are logging in, we need to set the loading state
  $loadingState.set('loading');

  // Fetch account and profile data
  const account = await fetchAccount(uid);
  $account.set(account || { ...defaultAccount, uid });

  const profile = await fetchProfile(uid);
  $profile.set(profile || { ...defaultProfile });
}

export async function logout() {
  // As we are logging out, we need to set the loading state
  $loadingState.set('loading');

  // Erase the local data
  window?.localStorage.clear();

  // Reset the stores to default values
  $account.set({ ...defaultAccount });
  $profile.set({ ...defaultProfile });
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
