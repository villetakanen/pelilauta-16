import type { Component } from 'solid-js';
import { t } from '@utils/i18n';

export const ProfileButton: Component = (props) => {
  return (
    <a href="/login">
      <cn-navigation-icon noun="login" label={t('navigation:login')} />
    </a>
  )
}