import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { SiteHomePageSelect } from './SiteHomePageSelect';

export const SiteMetaDataSection: Component<{ site: Site }> = (props) => {
  return (
    <section>
      <h2>{t('site:settings.meta.title')}</h2>

      <h3>{t('site:settings.meta.configuration')}</h3>
      <fieldset>
        <SiteHomePageSelect site={props.site} />
      </fieldset>
    </section>
  );
};
