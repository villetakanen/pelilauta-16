import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';

export const PageArticleFooter: Component<{ page: Page; site: Site }> = (
  props,
) => {
  const page = createMemo(() => props.page);
  const site = createMemo(() => props.site);

  return (
    <footer class="downscaled flex justify-space-between border-t">
      <p class="m-0 p-0">
        <a href={`/sites/${site().key}`}>{site().name}</a> /
        <a href={`/sites/${site().key}/${page().key}`}>{page().name}</a>
      </p>
      <p class="m-0 p-0">
        <a href={`/sites/${site().key}/${page().key}/history`}>
          {(page().revisionHistory?.length || 0) + 1}
          {t('sites:pages.revisionCount')}
        </a>
      </p>
    </footer>
  );
};
