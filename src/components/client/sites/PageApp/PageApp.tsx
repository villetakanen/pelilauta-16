/**
 * A solid-js app for viewing wiki/game pages
 */

import { PageBackgroundPoster } from '@client/PageBackgroundPoster';
import { useStore } from '@nanostores/solid';
import { createPage, parsePage } from '@schemas/PageSchema';
import { $site } from '@stores/SitesApp';
import { type Component, createMemo, createResource } from 'solid-js';
import { PageArticle } from '../../SitesApp/PageArticle';
import { PageFabs } from './PageFabs';
import { PageSidebar } from './PageSidebar';

export const PageApp: Component<{ pageKey: string; siteKey: string }> = (
  props,
) => {
  const site = useStore($site);

  const fetchPage = async () => {
    const origin = document.location.origin;

    const response = await fetch(
      `${origin}/api/sites/${props.siteKey}/pages/${props.pageKey}.json`,
    );
    return response.json();
  };

  const [pageData] = createResource(fetchPage);
  const page = createMemo(() =>
    parsePage(pageData(), props.pageKey, props.siteKey),
  );

  return (
    <>
      {site().backgroundURL && (
        <PageBackgroundPoster url={`${site().backgroundURL}`} />
      )}
      {page()?.name && (
        <div class="content-columns">
          {page() && (
            <PageArticle
              page={page() || createPage(props.pageKey, props.siteKey || '')}
              site={site()}
            />
          )}

          <PageSidebar site={site()} />
        </div>
      )}
      <PageFabs pageKey={props.pageKey} />
    </>
  );
};
