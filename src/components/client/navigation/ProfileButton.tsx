import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $profile, $uid } from 'src/stores/sessionStore';

export const ProfileButton: Component = () => {
  const uid = useStore($uid);
  const profile = useStore($profile);

  return uid() ? (
    <a href="/settings">
      <cn-navigation-icon noun="avatar" label={profile()?.nick || '...'} />
    </a>
  ) : (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  );
};
