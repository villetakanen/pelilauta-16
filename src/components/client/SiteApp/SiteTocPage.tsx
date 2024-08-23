import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $site } from '@stores/SitesApp';
import { SiteTocMigrateButton } from './SiteTocMigrateSection';
import { SiteTocSection } from './SiteTocSection';

export const SiteTocPage: Component = () => {
  const site = useStore($site);

  return (
    <div class="content-columns">
      <div>
        <h2>{t('site:toc.title')}</h2>
        <SiteTocSection />
      </div>

      <SiteTocMigrateButton site={site()} />
    </div>
  );
};
