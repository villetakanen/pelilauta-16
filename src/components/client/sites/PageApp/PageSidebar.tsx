import { SiteTocSection } from '@client/SitesApp/SiteTocSection';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

export const PageSidebar: Component<{ site: Site }> = (props) => {
  const site = createMemo(() => props.site);

  return (
    <article class="elevation-1 p-2">
      <h3 class="downscaled">{site().name}</h3>
      {site().posterURL && (
        <img src={site().posterURL} alt={site().name} class="poster" />
      )}

      {site().description && (
        <MarkdownSection content={`${site().description}`} />
      )}

      <nav class="mt-1">
        <h3 class="downscaled">{t('site:contents.title')}</h3>
        <SiteTocSection />
      </nav>
    </article>
  );
};
