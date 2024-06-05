import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

export const ProfileButton: Component = (props) => {
  return (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  );
};
