import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { SiteTocMigrateButton } from './SiteTocMigrateSection';
import { SiteTocSection } from './SiteTocSection';

export const SiteTocPage: Component<{ site: Site }> = (props) => {
  return (
    <div class="content-columns">
      <div>
        <h2>{t('site:toc.title')}</h2>
        <SiteTocSection site={props.site} />
      </div>

      <SiteTocMigrateButton site={props.site} />
    </div>
  );
};
