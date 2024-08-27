import { persistentAtom } from '@nanostores/persistent';
import { PROFILES_COLLECTION_NAME } from '@schemas/ProfileSchema';
import { t } from '@utils/i18n';
import { logDebug, logWarn } from '@utils/logHelpers';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  query,
  where,
} from 'firebase/firestore';
import { atom } from 'nanostores';
import { db } from 'src/firebase/client';
import { z } from 'zod';

const PublicProfileSchema = z.object({
  key: z.string(),
  nick: z.string(),
  avatarURL: z.string().optional(),
});

export type PublicProfile = z.infer<typeof PublicProfileSchema>;

/**
 * Store for public profiles
 *
 * This store is used to store public profiles of users, instead of directly using the store
 * as a reactive store, we use it in createEffect, so we may update a profile to existing when it
 * is fetched from the server.
 */
export const $profiles = persistentAtom<Record<string, PublicProfile>>(
  'profiles',
  {},
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return object;
    },
  },
);

const $loading = atom<string[]>([]);

export function getProfile(key: string): PublicProfile | undefined {
  if (!key) {
    logDebug('profilesStore', 'getProfile', 'key is undefined');
    return undefined;
  }
  if ($profiles.get()[key]) {
    return $profiles.get()[key];
  }
  // background fetch for the profile
  fetchProfile(key);
}

async function fetchProfile(key: string) {
  logDebug('profilesStore', 'fetchProfile', key);
  if ($loading.get().includes(key)) {
    return;
  }
  $loading.set([...$loading.get(), key]);
  const publicProfileDoc = await getDoc(doc(db, 'profiles', key));
  logDebug('profilesStore', 'fetchProfile', key, publicProfileDoc.exists());
  if (publicProfileDoc.exists()) {
    const publicProfile = PublicProfileSchema.parse({
      ...publicProfileDoc.data(),
      key: publicProfileDoc.id,
    });
    $profiles.set({
      ...$profiles.get(),
      [key]: publicProfile,
    });
  } else {
    logDebug(
      'profilesStore',
      'fetchProfile',
      'no profile found, assuming anonymous user',
    );
    $profiles.set({
      ...$profiles.get(),
      [key]: {
        key,
        nick: t('app:meta.anonymous'),
      },
    });
  }
  $loading.set($loading.get().filter((k) => k !== key));
}

export async function fetchAllProfiles() {
  logWarn('Fetching all active profiles');

  const q = query(
    collection(db, PROFILES_COLLECTION_NAME),
    // where('frozen', '==', false)
  );

  const querySnapshot = await getDocs(q);

  for (const doc of querySnapshot.docs) {
    const profile = PublicProfileSchema.parse({
      ...doc.data(),
      key: doc.id,
    });
    $profiles.set({
      ...$profiles.get(),
      [doc.id]: profile,
    });
  }
}
