/**
 * A solid-js app for viewing wiki/game pages
 */

import { useStore } from '@nanostores/solid';
import { createPage } from '@schemas/PageSchema';
import { type Component, createMemo, onMount } from 'solid-js';
import { $site, load } from 'src/stores/activeSiteStore';
import { $pages } from 'src/stores/activeSiteStore/pagesStore';
import { PageFabs } from './PageFabs';

export const PageApp: Component<{ pageKey: string; siteKey?: string }> = (
  props,
) => {
  const pages = useStore($pages);

  const page = createMemo(
    () => pages().find((p) => p.key === props.pageKey) || createPage('', ''),
  );

  onMount(() => {
    load(props.siteKey || '');
  });

  return (
    <>
      <div>
        <h1>{page().name}</h1>
      </div>
      <PageFabs pageKey={props.pageKey} />
    </>
  );
};
