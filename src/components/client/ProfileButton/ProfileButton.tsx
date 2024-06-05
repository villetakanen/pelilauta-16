import { makePersisted } from '@solid-primitives/storage';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { createSignal, type Component } from 'solid-js';
import { auth } from 'src/firebase/client';

export const ProfileButton: Component = (props) => {
  const [uid, setUid] = makePersisted(
    createSignal(''), 
    {
      name: "uid"
    });

  auth.onAuthStateChanged((user) => {
    if (user) {
      setUid(user.uid);
      logDebug('User', user.uid, ' logged in');
    } else {
      logDebug('User state changed to anonymous');
      setUid('');
    }
  })

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
