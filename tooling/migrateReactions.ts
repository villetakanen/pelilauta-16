import { program } from 'commander';
import { initializeApp, cert } from 'firebase-admin/app';

import serviceAccount from '../server_principal.json' with { type: 'json' };

async function migrateReactions() {
  // Lets first work with threads
  
}