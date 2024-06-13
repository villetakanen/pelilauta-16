import { logDebug, logError } from '@utils/logHelpers';
import { doc, getDoc } from 'firebase/firestore';
import { db } from 'src/firebase/client';
import { parseAccount } from 'src/schemas/AccountSchema';
import { parseProfile } from 'src/schemas/ProfileSchema';
import { $account, $profile } from 'src/stores/sessionStore';

export async function handleLogin(uid: string) {
  if (!uid) {
    throw new Error(
      'handleLogin: Trying to fetch user data for anonymous user, aborting',
    );
  }

  logDebug('handleLogin', 'Fetching user data', uid);

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

  $account.set(account);

  logDebug('handleLogin: User data fetched and stored', account);

  fetchProfile(uid);
}

async function fetchProfile(uid: string) {
  const profileDoc = await getDoc(doc(db, 'profiles', uid));

  if (!profileDoc.exists()) {
    logDebug(
      'fetchProfile: Profile not found, perhaps it`s not created yer?',
      uid,
    );
    return;
  }

  const profile = parseProfile(profileDoc.data(), uid);

  $profile.set(profile);

  logDebug('fetchProfile: Profile data fetched and stored', profile);
}
