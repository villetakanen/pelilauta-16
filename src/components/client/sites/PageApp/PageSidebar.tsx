import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import { $pages } from 'src/stores/activeSiteStore/pagesStore';

export const PageSidebar: Component<{ site: Site }> = (props) => {
  const site = createMemo(() => props.site);
  const pages = useStore($pages);

  return (
    <article class="elevation-1 column-s p-2">
      <h3 class="downscaled">{site().name}</h3>
      {site().posterURL && (
        <img src={site().posterURL} alt={site().name} class="poster" />
      )}

      {site().description && (
        <MarkdownSection content={`${site().description}`} />
      )}

      <nav class="mt-1">
        <h3 class="downscaled">{t('site:contents.title')}</h3>
        <ul>
          <For each={pages()}>
            {(page) => (
              <li>
                <a href={`/sites/${site().key}/${page.key}`}>{page.name}</a>
              </li>
            )}
          </For>
        </ul>
      </nav>
    </article>
  );
};
