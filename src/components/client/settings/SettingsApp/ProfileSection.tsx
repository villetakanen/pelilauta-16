import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import {
  $locale,
  $profile,
  $theme,
  $uid,
  logout,
} from 'src/stores/sessionStore';
import { RemoveAccountSection } from './RemoveAccountSection';

export const ProfileSection: Component = () => {
  const uid = useStore($uid);
  const theme = useStore($theme);
  const locale = useStore($locale);

  async function logoutAction() {
    await logout();
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
        <p>{$profile.get().nick}</p>
        <p>{t('entries:profile.avatar')}</p>
        <p>
          <a href={$profile.get().avatarURL}>{$profile.get().avatarURL}</a>
        </p>
        <p>{t('entries:profile.bio')}</p>
        <p>{$profile.get().bio}</p>
        <p>{t('entries:account.lightMode')}</p>
        <p>{theme()}</p>
        <p>{t('entries:account.language')}</p>
        <p>{locale()}</p>
      </div>

      <button type="submit" onclick={logoutAction}>
        {t('actions:logout')}
      </button>

      <RemoveAccountSection />
    </section>
  );
};
