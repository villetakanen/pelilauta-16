import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { rewriteWikiLinks } from '../contentHelpers';
import { renderAssetMarkup } from '../renderAssetMarkup';
import { renderDice } from '../renderDice';
import { renderProfileTags } from '../renderProfileTags';
import { renderTags } from '../renderTags';

export async function renderWikiContent(page: Page, site: Site, url: URL) {
  const { marked } = await import('marked');

  // Legacy pages might not have markdown content, so we'll fall back to
  // contents saved by earlier versions of the App.
  if (!page.markdownContent) return page.htmlContent || page.content || '';

  // We have markdown content, so lets convert it to HTML
  const wikilinks = rewriteWikiLinks(
    page.markdownContent,
    site.key,
    url.origin,
  );
  const profileLinks = renderProfileTags(
    renderTags(wikilinks, url.origin),
    url.origin,
  );
  const assetLinks = renderAssetMarkup(profileLinks, site, url.origin);
  const diceLinks = renderDice(assetLinks);
  const htmlContent = await marked(diceLinks || '');

  return htmlContent;
}
