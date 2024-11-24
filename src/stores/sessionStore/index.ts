import { persistentAtom } from '@nanostores/persistent';
import { logWarn } from '@utils/logHelpers';
import type { User } from 'firebase/auth';
import { computed, onMount } from 'nanostores';
import { auth } from 'src/firebase/client';
import {
  $account,
  $requiresEula,
  subscribeToAccount,
  unsubscribeFromAccount,
} from './account';
import { subscribeToProfile, unsubscribeFromProfile } from './profile';
import { initSubscriberStore } from './subscriber';

// The active user's UID - stored in localStorage for session persistence
export const $uid = persistentAtom<string>('session-uid', '');
export const $locale = computed(
  $account,
  (account) => account?.language || 'fi',
);
export const $theme = computed(
  $account,
  (account) => account?.lightMode || 'dark',
);

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
export { $profile, $profileMissing } from './profile';

// We need to listen to Firebase auth state changes if any of the components
// are interested in the session state
onMount($uid, () => {
  auth.onAuthStateChanged(handleFirebaseAuthChange);
  //logDebug('sessionStore mounted, subscribing to Firebase auth state changes');
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
    subscribeToAccount(user.uid);
    subscribeToProfile(user.uid);
    // Lets see if we have an active session, with same UID, if so, we are done
    if ($loadingState.get() === 'active' && user.uid === $uid.get()) {
      // no-op
    } else {
      // We have a new user, lets login
      await login(user.uid);
    }
  } else {
    // User is logged out, lets clear the account store
    unsubscribeFromAccount();
    unsubscribeFromProfile();
    await logout();
  }
}

async function login(uid: string) {
  if (!uid) {
    logWarn('sessionStore', 'login', 'No uid provided');
    return;
  }
  $uid.set(uid);

  // subscribe to user subscriptions data
  initSubscriberStore(uid);
}

async function clear() {
  window?.localStorage.clear();
  $uid.set('');
  unsubscribeFromAccount();
  unsubscribeFromProfile();
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

export * from './subscriber';
