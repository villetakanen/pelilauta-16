import { makePersisted } from '@solid-primitives/storage';
import { toDisplayString } from '@utils/contentHelpers';
import type { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { auth } from 'src/firebase/client';
import type { Account } from 'src/schemas/AccountSchema';

export const ProfileSection: Component = (props) => {
  const [account, setAccount] = makePersisted(createStore({} as Account), {
    name: 'account',
  });

  async function handleLogout() {
    await auth.signOut();
    // Logout user
    window.location.href = '/';
  }

  return (
    <section>
      <h3>Profile</h3>
      <p>uid: {account.uid}</p>
      <p>lightMode: {account.lightMode}</p>
      <p>showAdminTools: {account.showAdminTools ? 'true' : 'false'}</p>
      <p>eulaAccepted: {account.eulaAccepted ? 'true' : 'false'}</p>
      <p>lastLogin {toDisplayString(account.lastLogin)}</p>
      <p>updatedAt {toDisplayString(account.updatedAt)}</p>

      <button type="submit" onclick={handleLogout}>
        Logout
      </button>
    </section>
  );
};
