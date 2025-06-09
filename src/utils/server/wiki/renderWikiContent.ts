import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { renderAssetMarkup } from '../renderAssetMarkup';
import { renderDice } from '../renderDice';
import { renderProfileTags } from '../renderProfileTags';
import { renderTags } from '../renderTags';

export async function renderWikiContent(page: Page, site: Site, url: URL) {
  const { getMarkedInstance } = await import('@utils/shared/getMarked');
  const marked = await getMarkedInstance(url.origin, { site });

  // Legacy pages might not have markdown content, so we'll fall back to
  // contents saved by earlier versions of the App.
  if (!page.markdownContent) return page.htmlContent || page.content || '';

  const profileLinks = renderProfileTags(
    renderTags(page.markdownContent, url.origin),
    url.origin,
  );
  const assetLinks = renderAssetMarkup(profileLinks, site, url.origin);
  const diceLinks = renderDice(assetLinks);
  const htmlContent = await marked.parse(diceLinks || '');

  return htmlContent;
}
