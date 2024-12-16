/**
 * This is a command line/node script that will initialize the test database with the necessary data.
 *
 * We use the Firestore settings in the .env.development file to connect to the Firestore database
 * of the end-to-end test project.
 */

import { config } from 'dotenv';
import { type ServiceAccount, cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import { PAGES_COLLECTION_NAME, type Page } from '../src/schemas/PageSchema';
import { SITES_COLLECTION_NAME, type Site } from '../src/schemas/SiteSchema';
import { toFirestoreEntry } from '../src/utils/client/toFirestoreEntry';

config({
  path: '.env.development',
});
const serviceAccount = {
  type: 'service_account',
  project_id: process.env.PUBLIC_projectId,
  private_key_id: process.env.SECRET_private_key_id,
  private_key: process.env.SECRET_private_key,
  client_email: process.env.SECRET_client_email,
  client_id: process.env.SECRET_client_id,
  auth_uri: process.env.SECRET_auth_uri,
  token_uri: process.env.SECRET_token_uri,
  auth_provider_x509_cert_url: process.env.SECRET_auth_provider_x509_cert_url,
  client_x509_cert_url: process.env.SECRET_client_x509_cert_url,
  universe_domain: process.env.SECRET_universe_domain,
};

const serverApp = initializeApp({
  credential: cert(serviceAccount as ServiceAccount),
  databaseURL: process.env.PUBLIC_databaseURL,
});

export const serverDB = getFirestore(serverApp);

// Create a test site
const testSite: Site = {
  key: 'e2e-test-site',
  name: 'The E2E Test Site',
  createdAt: new Date(),
  updatedAt: new Date(),
  flowTime: new Date().getTime(),
  owners: ['e2e-test-owner'],
  hidden: true,
  sortOrder: 'name',
};
serverDB
  .collection(SITES_COLLECTION_NAME)
  .doc(testSite.key)
  .set(toFirestoreEntry(testSite));
console.log('Test site created:', testSite.key);

// Create a test site front page
const testSiteFrontPage: Page = {
  key: 'front-page',
  siteKey: testSite.key,
  name: 'Front Page',
  flowTime: new Date().getTime(),
  owners: ['e2e-test-owner'],
};
serverDB
  .collection(SITES_COLLECTION_NAME)
  .doc(testSite.key)
  .collection(PAGES_COLLECTION_NAME)
  .doc(testSiteFrontPage.key)
  .set(toFirestoreEntry(testSiteFrontPage));
console.log('Test site front page created:', testSiteFrontPage.key);

console.log('Database initialization complete, fire away!');
