import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $active, $isAnonymous, $profile } from 'src/stores/sessionStore';

export const ProfileButton: Component = () => {
  const active = useStore($active);
  const profile = useStore($profile);
  const isAnonymous = useStore($isAnonymous);

  return (
    <>
      {!active() && (
        <div>
          <cn-loader for="navigation" />
        </div>
      )}
      {active() && !isAnonymous() && (
        <a href="/settings">
          <cn-navigation-icon noun="avatar" label={profile().nick || '...'} />
        </a>
      )}
      {active() && isAnonymous() && (
        <a href="/login">
          <cn-navigation-icon noun="login" label={t('navigation:login')} />
        </a>
      )}
    </>
  );
};
