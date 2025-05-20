import { type Page, pageFrom } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';

export function generateFrontPage(site: Site, uid: string): Page {
  return pageFrom({
    key: site.key,
    siteKey: site.key,
    name: site.name,
    markdownContent: `# ${site.name} \n\n*${site.description}*`,
    owners: [uid],
  });
}
