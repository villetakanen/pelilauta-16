/**
 * A solid-js app for viewing wiki/game pages
 */

import { PageBackgroundPoster } from '@client/PageBackgroundPoster';
import { useStore } from '@nanostores/solid';
import { createPage } from '@schemas/PageSchema';
import { type Component, createMemo, onMount } from 'solid-js';
import { $site, load } from 'src/stores/activeSiteStore';
import { $pages } from 'src/stores/activeSiteStore/pagesStore';
import { PageArticle } from './PageArticle';
import { PageFabs } from './PageFabs';

export const PageApp: Component<{ pageKey: string; siteKey?: string }> = (
  props,
) => {
  const site = useStore($site);
  const pages = useStore($pages);

  const page = createMemo(
    () => pages().find((p) => p.key === props.pageKey) || createPage('', ''),
  );

  onMount(() => {
    load(props.siteKey || '');
  });

  return (
    <>
      {site().backgroundURL && (
        <PageBackgroundPoster url={`${site().backgroundURL}`} />
      )}
      {page()?.name && (
        <div class="content-columns">
          <PageArticle page={page()} site={site()} />
        </div>
      )}
      <PageFabs pageKey={props.pageKey} />
    </>
  );
};
