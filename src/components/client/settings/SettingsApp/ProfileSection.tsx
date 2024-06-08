import { makePersisted } from '@solid-primitives/storage';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { createStore } from 'solid-js/store';
import { auth } from 'src/firebase/client';
import type { Account } from 'src/schemas/AccountSchema';
import type { Profile } from 'src/schemas/ProfileSchema';

export const ProfileSection: Component = (props) => {
  const [account, setAccount] = makePersisted(createStore({} as Account), {
    name: 'account',
  });
  const [profile, setProfile] = makePersisted(createStore({} as Profile), {
    name: 'profile',
  });

  async function handleLogout() {
    await auth.signOut();
    // Logout user
    window.location.href = '/';
  }

  return (
    <section>
      <h3>{t('settings:profile.title')}</h3>
      <p class="text-low-emphasis">{t('settings:profile.info')}</p>

      <div class="field-grid">
        <p>{t('entries:profile.key')}</p>
        <p>{profile.key}</p>
        <p>{t('entries:profile.nick')}</p>
        <p>{profile.nick}</p>
        <p>{t('entries:profile.avatar')}</p>
        <p>
          <a href={profile.avatarURL}>{profile.avatarURL}</a>
        </p>
        <p>{t('entries:profile.bio')}</p>
        <p>{profile.bio}</p>
        <p>{t('entries:account.lastLogin')}</p>
        <p>{toDisplayString(account.lastLogin)}</p>
        <p>{t('entries:account.lightMode')}</p>
        <p>{account.lightMode ? 'true' : 'false'}</p>
        <p>{t('entries:account.language')}</p>
        <p>{account.language}</p>
      </div>

      <button type="submit" onclick={handleLogout}>
        Logout
      </button>

      <div class="debug">
        <p>showAdminTools: {account.showAdminTools ? 'true' : 'false'}</p>
        <p>eulaAccepted: {account.eulaAccepted ? 'true' : 'false'}</p>
      </div>
    </section>
  );
};
