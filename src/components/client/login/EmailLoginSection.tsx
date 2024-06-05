import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

export const EmailLoginSection: Component = (props) => {
  return (
    <section class="elevation-1 border-radius p-2" style="position: relative">
      <h2>{t('login:withEmail.title')}</h2>
      <p>{t('login:withEmail.info')}</p>
    </section>
  );
};
