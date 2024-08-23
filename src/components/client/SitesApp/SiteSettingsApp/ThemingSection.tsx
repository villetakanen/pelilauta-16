import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { ThemeImageForm } from './ThemeImageForm';

export const ThemingSection: Component = () => {
  return (
    <section>
      <h2>{t('site:settings.theming.title')}</h2>
      <div class="flex flex-col">
        <ThemeImageForm imageFieldName="avatarURL" />
        <ThemeImageForm imageFieldName="posterURL" />
        <ThemeImageForm imageFieldName="backgroundURL" />
      </div>
    </section>
  );
};
