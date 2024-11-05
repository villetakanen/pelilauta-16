import { serverDB } from '@firebase/server';
import { PAGES_COLLECTION_NAME, parsePage } from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import { rewriteWikiLinks } from '@utils/server/contentHelpers';
import type { APIContext } from 'astro';
import { marked } from 'marked';

export async function GET({ params, url }: APIContext): Promise<Response> {
  const { siteKey, pageKey } = params;

  if (!siteKey || !pageKey) {
    return new Response('Invalid request', { status: 400 });
  }

  const pagesCollection = serverDB
    .collection(SITES_COLLECTION_NAME)
    .doc(siteKey)
    .collection(PAGES_COLLECTION_NAME);
  const pageDoc = await pagesCollection.doc(pageKey).get();

  const data = pageDoc.data();

  if (!pageDoc.exists || !data) {
    return new Response('Page not found', { status: 404 });
  }

  logDebug('Page data found', pageKey);

  try {
    const page = parsePage(toClientEntry(data), pageKey, siteKey);

    page.htmlContent = rewriteWikiLinks(
      await marked(page.markdownContent || ''),
      page.siteKey,
      url.origin,
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
