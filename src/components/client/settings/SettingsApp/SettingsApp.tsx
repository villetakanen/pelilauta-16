import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, createSignal, onMount } from 'solid-js';
import { $uid } from 'src/stores/sessionStore';
import { ProfileSection } from './ProfileSection';

export const SettingsApp: Component = (props) => {
  onMount(() => {
    logDebug('SettingsApp mounted');
    if (!$uid.get()) {
      logDebug('User not logged in');
      // Redirect to login page
      window.location.href = '/login';
    }
  });

  return (
    <div class="content-columns">
      <h1>Settings</h1>
      <p>Settings content</p>
      <article>
        <h2>{t('settings:personal.title')}</h2>
        <ProfileSection />
      </article>
    </div>
  );
};
