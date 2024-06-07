import { makePersisted } from '@solid-primitives/storage';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, createSignal, onMount } from 'solid-js';
import { ProfileSection } from './ProfileSection';

export const SettingsApp: Component = (props) => {
  const [uid, setUid] = makePersisted(createSignal(''), {
    name: 'uid',
  });
  onMount(() => {
    logDebug('SettingsApp mounted');
    if (!uid()) {
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
