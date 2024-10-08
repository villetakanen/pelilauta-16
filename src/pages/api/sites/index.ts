import { getAstroQueryParams } from '@utils/server/astroApiHelpers';
import type { APIContext } from 'astro';
import { serverDB } from 'src/firebase/server';
import { type Site, parseSite } from 'src/schemas/SiteSchema';

export async function GET({ request }: APIContext) {
  const publicSites = new Array<Site>();

  const searchParams = getAstroQueryParams(request);

  const sitesCollection = searchParams.limit
    ? serverDB
        .collection('sites')
        .where('hidden', '==', false)
        .limit(Number.parseInt(searchParams.limit))
        .orderBy('flowTime', 'desc')
    : serverDB.collection('sites').where('hidden', '==', false);

  const sites = await sitesCollection.get();

  for (const siteDoc of sites.docs) {
    // logDebug('Sitedata', siteDoc.data().name, siteDoc.data().owners);
    const site = parseSite(siteDoc.data(), siteDoc.id);
    publicSites.push(site);
  }

  publicSites.sort((a, b) => {
    return b.flowTime - a.flowTime;
  });

  return new Response(JSON.stringify(publicSites), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
