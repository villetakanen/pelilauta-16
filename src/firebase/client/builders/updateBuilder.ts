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
  // Dynamic import of firebase/firestore
  const { getFirestore, doc, setDoc, serverTimestamp } = await import(
    'firebase/firestore'
  );

  // Create ref and prep data for update
  const builderDoc = doc(
    getFirestore(),
    CHARACTER_BUILDERS_COLLECTION_NAME,
    builder.key,
  );

  const { key, ...updateData } = builder;
  const finalUpdateData = {
    ...updateData,
    updatedAt: serverTimestamp(),
  };

  // Update the builder doc
  return setDoc(builderDoc, finalUpdateData, { merge: true });
}
