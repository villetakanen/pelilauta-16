import {
  CHARACTER_BUILDERS_COLLECTION_NAME,
  type CharacterBuilder,
} from '@schemas/CharacterBuilderSchema';

/**
 * Async, dynamic import of firebase/firestore and updateDoc for CharacterBuilder
 * updates.
 *
 * @param builder the CharacterBuilder object to update. Key is required for the update to work. Authz happens at firestore rules level.
 * @returns a Promise that resolves when the update is complete.
 */
export async function updateBuilder(
  builder: Partial<CharacterBuilder>,
  silent = false,
): Promise<void> {
  //  Check for required fields, throw error if not present
  if (!builder.key) {
    throw new Error('updateBuilder: builder.key is required');
  }
  // Dynamic import of firebase/firestore and toFirestoreEntry
  const { getFirestore, doc, setDoc } = await import('firebase/firestore');
  const { toFirestoreEntry } = await import('@utils/client/toFirestoreEntry');

  // Create ref and prep data for update
  const builderDoc = doc(
    getFirestore(),
    CHARACTER_BUILDERS_COLLECTION_NAME,
    builder.key,
  );
  const updateData = toFirestoreEntry(builder, { silent });

  // Update the builder doc
  return setDoc(builderDoc, updateData, { merge: true });
}
