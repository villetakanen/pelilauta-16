import { ProfileCard } from '@client/ProfileCard/ProfileCard';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, onMount } from 'solid-js';
import { $profile, $uid } from 'src/stores/sessionStore';
import { ProfileSection } from './ProfileSection';

export const SettingsApp: Component = (props) => {
  const profile = useStore($profile);

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
      <article>
        <ProfileCard {...profile()} />
      </article>
      <h1>Settings</h1>
      <p>Settings content</p>
      <article>
        <h2>{t('settings:personal.title')}</h2>
        <ProfileSection />
      </article>
    </div>
  );
};
