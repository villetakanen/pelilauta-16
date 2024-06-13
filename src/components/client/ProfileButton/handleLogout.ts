import { logDebug } from '@utils/logHelpers';
import { auth } from 'src/firebase/client';

export async function handleLogout() {
  const uid = auth.currentUser?.uid;
  await auth.signOut();
  localStorage.clear();
  logDebug('handleLogout', 'Succesfully logged out', uid);
}
