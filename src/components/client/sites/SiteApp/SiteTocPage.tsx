import { useStore } from '@nanostores/solid';
import { type Component, For, createMemo } from 'solid-js';
import { $site } from 'src/stores/SiteApp';
import { $pages } from 'src/stores/SiteApp/pagesStore';

export const SiteTocPage: Component = () => {
  const pages = useStore($pages);
  const site = useStore($site);

  const inAlphabeticalOrder = createMemo(() => {
    const sorted = [...pages()];
    sorted.sort((a, b) => a.name.localeCompare(b.name));
    return sorted;
  });

  return (
    <div class="content-columns">
      <div>
        <h1>Site Table of Contents</h1>
        <p>This is the table of contents for the site.</p>
      </div>

      <div>
        <ul>
          <For each={inAlphabeticalOrder()}>
            {(page) => (
              <li>
                <a href={`/sites/${site().key}/${page.key}`}>{page.name}</a>
              </li>
            )}
          </For>
        </ul>
      </div>
    </div>
  );
};
