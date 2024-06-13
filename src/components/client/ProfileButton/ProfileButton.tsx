import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, onMount } from 'solid-js';
import { auth } from 'src/firebase/client';
import { $profile, $uid } from 'src/stores/sessionStore';
import { handleLogin } from './handleLogin';

export const ProfileButton: Component = () => {
  const uid = useStore($uid);
  const profile = useStore($profile);

  onMount(() => {
    auth.onAuthStateChanged((user) => {
      if (user) {
        logDebug('User', user.uid, ' logged in');
        handleLogin(user.uid);
        $uid.set(user.uid);
      } else {
        logDebug('User state changed to anonymous');
      }
    });
  });

  return uid() ? (
    <a href="/settings">
      <cn-navigation-icon noun="avatar" label={profile().nick} />
    </a>
  ) : (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  );
};
