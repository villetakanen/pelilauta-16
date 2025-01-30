import { useStore } from '@nanostores/solid';
import { $profile, $uid } from '@stores/session';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

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
