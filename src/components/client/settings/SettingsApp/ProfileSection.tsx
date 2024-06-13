import { handleLogout } from '@client/ProfileButton/handleLogout';
import { makePersisted } from '@solid-primitives/storage';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { logWarn } from '@utils/logHelpers';
import { type Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import type { Account } from 'src/schemas/AccountSchema';
import type { Profile } from 'src/schemas/ProfileSchema';
import { RemoveAccountSection } from './RemoveAccountSection';

export const ProfileSection: Component = (props) => {
  const [uid, setUid] = makePersisted(createSignal(''), { name: 'uid' });
  const [account, setAccount] = makePersisted(createStore({} as Account), {
    name: 'account',
  });
  const [profile, setProfile] = makePersisted(createStore({} as Profile), {
    name: 'profile',
  });

  async function logoutAction() {
    handleLogout();
    // Logout user
    window.location.href = '/';
  }

  return (
    <section>
      <h3>{t('settings:profile.title')}</h3>
      <p class="text-low-emphasis">{t('settings:profile.info')}</p>

      <div class="field-grid">
        <p>{t('entries:profile.key')}</p>
        <p>{uid()}</p>
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

      <div class="debug field-grid">
        <p>showAdminTools:</p>
        <p> {account.showAdminTools ? 'true' : 'false'}</p>
        <p>eulaAccepted:</p>
        <p> {account.eulaAccepted ? 'true' : 'false'}</p>
      </div>

      <button type="submit" onclick={logoutAction}>
        {t('actions:logout')}
      </button>

      <RemoveAccountSection />
    </section>
  );
};
