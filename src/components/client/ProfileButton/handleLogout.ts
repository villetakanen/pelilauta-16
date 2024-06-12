import { auth } from 'src/firebase/client';

export async function handleLogout() {
  auth.signOut();
  localStorage.clear();
}
