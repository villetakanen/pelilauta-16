import { serverDB } from '@firebase/server';
import { PAGES_COLLECTION_NAME, parsePage } from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME, parseSite } from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { rewriteWikiLinks } from '@utils/server/contentHelpers';
import { renderAssetMarkup } from '@utils/server/renderAssetMarkup';
import { renderDice } from '@utils/server/renderDice';
import { renderProfileTags } from '@utils/server/renderProfileTags';
import { renderTags } from '@utils/server/renderTags';
import type { APIContext } from 'astro';
import { marked } from 'marked';

export async function GET({ params, url }: APIContext): Promise<Response> {
  const { siteKey, pageKey } = params;

  if (!siteKey || !pageKey) {
    return new Response('Invalid request', { status: 400 });
  }

  const siteDoc = await serverDB
    .collection(SITES_COLLECTION_NAME)
    .doc(siteKey)
    .get();
  const site = parseSite(toClientEntry(siteDoc.data() || {}), siteKey);

  const pagesCollection = serverDB
    .collection(SITES_COLLECTION_NAME)
    .doc(siteKey)
    .collection(PAGES_COLLECTION_NAME);
  const pageDoc = await pagesCollection.doc(pageKey).get();

  const data = pageDoc.data();

  if (!pageDoc.exists || !data) {
    return new Response('Page not found', { status: 404 });
  }

  try {
    const page = parsePage(toClientEntry(data), pageKey, siteKey);

    // If the page has markdown content, convert it to HTML
    // Legacy pages might have HTML content, that we want to convert to
    // markdown if they are edited - thus we only convert if the ma
    // rkdown content is present
    //
    // @TODO: this should be moved to a utility function, as there are
    // multiple places where we convert markdown to HTML, and more extensions
    // in addition to wikilinks might be added in the future
    //
    // F.ex. support for attach:file.jpg style asset links, or other
    // custom markdown extensions
    if (page.markdownContent)
      page.htmlContent = await marked(
        renderProfileTags(
          renderTags(page.markdownContent, url.origin),
          url.origin,
        ) || '',
      );

    page.htmlContent = rewriteWikiLinks(
      page.htmlContent || '',
      siteKey,
      url.origin,
    );

    page.htmlContent = renderDice(
      renderAssetMarkup(page.htmlContent || '', site, url.origin),
    );

    return new Response(JSON.stringify(page), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
        // No cache, as pages can be edited
      },
    });
  } catch (err: unknown) {
    return new Response('Invalid page data', { status: 500 });
  }
}
