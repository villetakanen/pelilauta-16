import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { ThemeImageForm } from '../../SitesApp/SiteSettingsApp/ThemeImageForm';

export const ThemingSection: Component<{ site: Site }> = (props) => {
  return (
    <section>
      <h2>{t('site:settings.theming.title')}</h2>
      <div class="flex flex-col">
        <ThemeImageForm imageFieldName="avatarURL" site={props.site} />
        <ThemeImageForm imageFieldName="posterURL" site={props.site} />
        <ThemeImageForm imageFieldName="backgroundURL" site={props.site} />
      </div>
    </section>
  );
};
