import { logDebug } from '@utils/logHelpers';
import type { ServiceAccount } from 'firebase-admin';
import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';

const activeApps = getApps();
const serviceAccount = {
  type: 'service_account',
  project_id: import.meta.env.PUBLIC_projectId,
  private_key_id: import.meta.env.SECRET_private_key_id,
  private_key: import.meta.env.SECRET_private_key,
  client_email: import.meta.env.SECRET_client_email,
  client_id: import.meta.env.SECRET_client_id,
  auth_uri: import.meta.env.SECRET_auth_uri,
  token_uri: import.meta.env.SECRET_token_uri,
  auth_provider_x509_cert_url: import.meta.env
    .SECRET_auth_provider_x509_cert_url,
  client_x509_cert_url: import.meta.env.SECRET_client_x509_cert_url,
  universe_domain: import.meta.env.SECRET_universe_domain,
};

const initApp = () => {
  logDebug('Initializing server app');
  return initializeApp({
    credential: cert(serviceAccount as ServiceAccount),
    databaseURL: import.meta.env.PUBLIC_databaseURL,
  });
};

export const serverApp = activeApps.length === 0 ? initApp() : activeApps[0];
export const serverDB = getFirestore(serverApp);
logDebug('serverDB', serverDB);

/*import type { ServiceAccount } from 'firebase-admin';
import admin from 'firebase-admin';
import { cert, initializeApp } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import serverPrincipal from 'server_principal.json';

const serviceAccount = {
 
}


if (!admin.apps.length) {
  initializeApp({
    credential: cert(serverPrincipal as ServiceAccount),
    databaseURL: import.meta.env.PUBLIC_databaseURL,
  });
}

export const serverApp = admin.app(); // Reuse existing instance
export const serverDB = getFirestore(serverApp);*/
