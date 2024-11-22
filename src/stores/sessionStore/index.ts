import { persistentAtom } from '@nanostores/persistent';
import { logDebug, logWarn } from '@utils/logHelpers';
import type { User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { computed, onMount } from 'nanostores';
import { auth, db } from 'src/firebase/client';
import { ACCOUNTS_COLLECTION_NAME } from 'src/schemas/AccountSchema';
import {
  PROFILES_COLLECTION_NAME,
  type Profile,
  parseProfile,
} from 'src/schemas/ProfileSchema';
import { $requiresEula, handleLogin, handleLogout } from './account';
import { initSubscriberStore } from './subscriber';

// The active user's UID - stored in localStorage for session persistence
export const $uid = persistentAtom<string>('session-uid', '');
export const $locale = persistentAtom<string>('session-locale', 'fi');
export const $theme = persistentAtom<string>('session-theme', 'dark');

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

export { $requiresEula };

const defaultProfile: Profile = {
  key: '',
  nick: '',
  username: '',
  avatarURL: '',
  bio: '',
};

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

// We need to listen to Firebase auth state changes if any of the components
// are interested in the session state
onMount($uid, () => {
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
    // We need to subscribe to the account data
    handleLogin(user.uid);
    // Lets see if we have an active session, with same UID, if so, we are done
    if ($loadingState.get() === 'active' && user.uid === $uid.get()) {
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
    // User is logged out, lets clear the account store
    handleLogout();
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

  // Fetch account data in parallel
  fetchAccount(uid);

  // Fetch profile data (if available)
  const profile = await fetchProfile(uid);
  $profile.set(profile || { ...defaultProfile });

  // Set the loading state to active
  $loadingState.set('active');

  // subscribe to user subscriptions data
  initSubscriberStore(uid);
}

async function clear() {
  window?.localStorage.clear();
  $profile.set({ ...defaultProfile });
  $uid.set('');
  handleLogout();
}

export async function logout() {
  // As we are logging out, we need to set the loading state
  $loadingState.set('loading');

  // Clear the session
  await clear();
  $loadingState.set('active');

  // Sign out from Firebase
  auth.signOut();
}

async function fetchAccount(uid: string) {
  // Fetch account data from Firestore
  const accountDoc = await getDoc(doc(db, ACCOUNTS_COLLECTION_NAME, uid));

  // Note: we do not persist the account data to localStorage for security reasons
  // The only field we need from the account is the eulaAccepted flag
  const data = accountDoc.data();
  $theme.set(data?.theme || 'dark');
  $locale.set(data?.locale || 'fi');
}

async function fetchProfile(uid: string) {
  const profileDoc = await getDoc(doc(db, PROFILES_COLLECTION_NAME, uid));

  if (!profileDoc.exists()) {
    logWarn(`Profile not found for uid: ${uid}`);
    return;
  }

  return parseProfile(
    {
      ...profileDoc.data(),
    },
    uid,
  );
}

export * from './subscriber';
