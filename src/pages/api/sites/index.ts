import { serverDB } from 'src/firebase/server';
import { type Site, parseSite } from 'src/schemas/SiteSchema';

export async function GET() {
  const publicSites = new Array<Site>();

  const sitesCollection = serverDB.collection('sites');
  const sites = await sitesCollection.where('hidden', '==', false).get();

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
