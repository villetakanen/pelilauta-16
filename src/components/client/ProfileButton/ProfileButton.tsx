import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $profile } from 'src/stores/sessionStore';

export const ProfileButton: Component = () => {
  const profile = useStore($profile);

  return profile().nick ? (
    <a href="/settings">
      <cn-navigation-icon noun="avatar" label={profile().nick} />
    </a>
  ) : (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  );
};
