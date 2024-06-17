import { handleLogout } from '@client/ProfileButton/handleLogout';
import { useStore } from '@nanostores/solid';
import { toDisplayString } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $account, $profile } from 'src/stores/sessionStore';
import { RemoveAccountSection } from './RemoveAccountSection';

export const ProfileSection: Component = () => {
  const account = useStore($account);

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
        <p>{account().uid}</p>
        <p>{t('entries:profile.nick')}</p>
        <p>{$profile.get().nick}</p>
        <p>{t('entries:profile.avatar')}</p>
        <p>
          <a href={$profile.get().avatarURL}>{$profile.get().avatarURL}</a>
        </p>
        <p>{t('entries:profile.bio')}</p>
        <p>{$profile.get().bio}</p>
        <p>{t('entries:account.lastLogin')}</p>
        <p>{toDisplayString($account.get().lastLogin)}</p>
        <p>{t('entries:account.lightMode')}</p>
        <p>{$account.get().lightMode ? 'true' : 'false'}</p>
        <p>{t('entries:account.language')}</p>
        <p>{$account.get().language}</p>
      </div>

      <button type="submit" onclick={logoutAction}>
        {t('actions:logout')}
      </button>

      <RemoveAccountSection />
    </section>
  );
};
