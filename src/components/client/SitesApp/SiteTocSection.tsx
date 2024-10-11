import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';

export const SiteTocSection: Component<{ site: Site }> = (props) => {
  const index = createMemo(() => {
    const arr = Array.from(props.site.pageRefs || []);
    if (props.site.sortOrder === 'name') {
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (props.site.sortOrder === 'manual') {
      return arr;
    }
    return arr.sort((a, b) => b.flowTime - a.flowTime);
  });

  return (
    <section>
      <ul>
        <For each={index()} fallback={<p>{t('site:toc.empty')}</p>}>
          {(page) => (
            <li>
              <a href={`/sites/${props.site.key}/${page.key}`}>
                {page.name || t('entries:page.defaults.name')}
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
};
