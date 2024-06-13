import { makePersisted } from '@solid-primitives/storage';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, createSignal, onMount } from 'solid-js';
import { createStore } from 'solid-js/store';
import { auth } from 'src/firebase/client';
import type { Profile } from 'src/schemas/ProfileSchema';
import { $uid } from 'src/stores/sessionStore';
import { handleLogin } from './handleLogin';

export const ProfileButton: Component = (props) => {
  const [profile, setProfile] = makePersisted(createStore({} as Profile), {
    name: 'profile',
  });

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

  return $uid.get() ? (
    <a href="/settings">
      <cn-navigation-icon noun="avatar" label={profile.nick} />
    </a>
  ) : (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  );
};
