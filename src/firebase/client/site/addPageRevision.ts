import { PAGES_COLLECTION_NAME, type Page } from '@schemas/PageSchema';
import { SITES_COLLECTION_NAME } from '@schemas/SiteSchema';

/**
 * Takes in an update to a page, and the current markdown content of the page and creates a
 * new page revision entry in the database.
 *
 * The page revision entries contain reverse patches from the current version of the
 * page to the previous version. This enables traversing the history of the page, starting
 * from the current version and going back to previous versions.
 *
 * @param update the update to the page
 */
export async function addPageRevision(
  siteKey: string,
  pageKey: string,
  incomingMarkdown: string,
): Promise<string> {
  const { db } = await import('@firebase/client');
  const { doc, getDoc, addDoc, collection, serverTimestamp } = await import(
    'firebase/firestore'
  );

  // Lets get the current page from the database
  const pageRef = doc(
    db,
    SITES_COLLECTION_NAME,
    siteKey,
    PAGES_COLLECTION_NAME,
    pageKey,
  );
  // We need to get the current markdown content of the page - if the page does not exist
  // the markdown content will be empty
  const data = (await getDoc(pageRef)).data();

  const markdownContent = data?.markdownContent || '';
  const author = data?.owners[0] || data?.author || '';
  const createdAt = data?.updatedAt || data?.createdAt || serverTimestamp();

  const previousRevisionKey = data?.previousRevisionKey || '';

  const { makePatches, stringifyPatches } = await import(
    '@sanity/diff-match-patch'
  );
  // Note: we are using the diff-match-patch library to create reverse patches
  // from the current version of the page to the previous version. This means that
  // we only save the current version of the page and the patches to reconstruct the previous
  // versions. This is a space efficient way to store the history of the page.
  const patches = makePatches(incomingMarkdown || '', markdownContent);
  const patch_to_reconstruct = stringifyPatches(patches);

  const revision = await addDoc(
    collection(
      db,
      SITES_COLLECTION_NAME,
      siteKey,
      PAGES_COLLECTION_NAME,
      pageKey,
      'revisions',
    ),
    {
      patch_to_reconstruct,
      author,
      createdAt,
      previousRevisionKey,
    },
  );

  return revision.id;
}
