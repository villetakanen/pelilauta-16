import { useStore } from '@nanostores/solid';
import { type Component, For } from 'solid-js';
import { $pages } from 'src/stores/activeSiteStore/pagesStore';

export const SiteTocPage: Component = () => {
  const pages = useStore($pages);

  return (
    <div>
      <h1>Site Table of Contents</h1>
      <p>This is the table of contents for the site.</p>
      <For each={pages()}>
        {(page) => (
          <div>
            <h4>{page.name}</h4>
          </div>
        )}
      </For>
    </div>
  );
};
