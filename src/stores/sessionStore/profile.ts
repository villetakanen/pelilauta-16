import {
  type FieldValue,
  doc,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';
import { db } from 'src/firebase/client';
import {
  PROFILES_COLLECTION_NAME,
  type Profile,
} from 'src/schemas/ProfileSchema';
import { $account, $profile } from '.';

type ProfileType = Partial<Profile> & {
  updatedAt?: FieldValue;
};

/**
 * Update the profile of the current user, merging the new data with the existing data in the store.
 *
 * @param profile Partial<Profile> & { updatedAt: FieldValue }
 * @param silent boolean, optional, default false - will omit updating the updatedAt field if true
 */
export async function updateProfile(profile: ProfileType, silent = false) {
  if (!silent) {
    profile.updatedAt = serverTimestamp();
  }

  const profileRef = doc(
    db,
    `${PROFILES_COLLECTION_NAME}/${$account.get().uid}`,
  );

  await updateDoc(profileRef, profile);

  // Merge with the current profile
  $profile.set({
    ...$profile.get(),
    ...profile,
  });
}
