/**
 * Adds a absolute url to in-wiki wikilinks: <a href="peliv">dasfa</a>
 * -> <a href="https://example.com/sites/test-site/peliv">dasfa</a>
 *
 * Will not touch links that already have a protocol (http:// or https://) or a / at in the
 * link url.
 */
export function addSiteToWikilinks(
  content: string,
  currentSite: string,
  baseUrl: string,
) {
  if (!currentSite || !baseUrl) {
    throw new Error('currentSite and baseUrl are required');
  }

  // Match any <a> tags where href does not contain / or : (protocol)
  return content.replace(/<a href="([^\/].*?)"/g, (match, link) => {
    const newLink = `<a href="${baseUrl}/sites/${currentSite}/${link}"`;
    return newLink;
  });
}
