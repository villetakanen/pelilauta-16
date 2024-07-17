import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { toDisplayString } from '@utils/contentHelpers';
import { type Component, createMemo } from 'solid-js';

export const PageArticleHeader: Component<{ page: Page; site: Site }> = (
  props,
) => {
  const page = createMemo(() => props.page);
  const site = createMemo(() => props.site);

  return (
    <header class="downscaled flex justify-space-between border-b">
      <p class="m-0 p-0">
        <a href={`/sites/${site().key}`}>{site().name}</a> /
        <a href={`/sites/${site().key}/${page().key}`}>{page().name}</a>
      </p>
      <p class="m-0 p-0">{toDisplayString(page().flowTime)}</p>
    </header>
  );
};
