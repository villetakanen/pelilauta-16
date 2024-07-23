import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { $site } from 'src/stores/SiteApp';

export const SiteTocSection: Component = () => {
  const site = useStore($site);

  const index = createMemo(() => {
    const arr = Array.from(site().pageRefs || []);
    if (site().sortOrder === 'name') {
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (site().sortOrder === 'manual') {
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
              <a href={`/sites/${site().key}/${page.key}`}>
                {page.name || t('entries:page.defaults.name')}
              </a>
            </li>
          )}
        </For>
      </ul>
    </section>
  );
};
