import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, For, createMemo } from 'solid-js';
import { $site } from 'src/stores/SiteApp';
import { SiteTocMigrateButton } from './SiteTocMigrateSection';

export const SiteTocPage: Component = () => {
  const site = useStore($site);

  const index = createMemo(() => {
    const arr = Array.from(site().pageRefs || []);
    if (site().sortOrder === 'name') {
      return arr.sort((a, b) => a.name.localeCompare(b.name));
    }
    if (site().sortOrder === 'manual') {
      return arr;
    }
    return arr.sort((a, b) => a.flowTime - b.flowTime);
  });

  return (
    <div class="content-columns">
      <div>
        <h2>{t('site:toc.title')}</h2>
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
      </div>

      <SiteTocMigrateButton site={site()} />
    </div>
  );
};
