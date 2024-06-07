import { makePersisted } from '@solid-primitives/storage';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, createSignal } from 'solid-js';
import { auth } from 'src/firebase/client';
import { handleLogin } from './handleLogin';

export const ProfileButton: Component = (props) => {
  const [uid, setUid] = makePersisted(createSignal(''), {
    name: 'uid',
  });

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUid(user.uid);
      logDebug('User', user.uid, ' logged in');
      handleLogin(user.uid);
    } else {
      logDebug('User state changed to anonymous');
      setUid('');
    }
  });

  return uid() ? (
    <a href="/settings">
      <cn-navigation-icon noun="avatar" label={t('navigation:settings')} />
    </a>
  ) : (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  );
};
