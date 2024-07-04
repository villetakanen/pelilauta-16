import { createPage } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';

export function generateFrontPage(site: Site) {
  const frontPage = createPage(site.key, site.key);
  frontPage.name = site.name;
  frontPage.markdownContent = `# ${site.name} \n\n*${site.description}*`;
  return frontPage;
}
