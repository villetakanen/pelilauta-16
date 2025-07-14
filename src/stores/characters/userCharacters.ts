import { persistentAtom } from '@nanostores/persistent';
import { type Character, CharacterSchema } from '@schemas/CharacterSchema';
import { CHARACTER_SHEETS_COLLECTION_NAME } from '@schemas/CharacterSheetSchema';
import { uid } from '@stores/session';
import { logError } from '@utils/logHelpers';
import { type WritableAtom, effect } from 'nanostores';

/**
 * A nanostore for caching the user's sites.
 */
export const userCharacters: WritableAtom<Character[]> = persistentAtom(
  'user-character-cache',
  [],
  {
    encode: JSON.stringify,
    decode: (data) => {
      const object = JSON.parse(data);
      return object;
    },
  },
);
let unsubscribe: CallableFunction = () => {};

/**
 * Adds or updates the character data in the user characters store.
 *
 * @param character the Character data to patch
 */
function patchCharacterData(character: Character) {
  const currentCharacters = userCharacters.get();
  const existingIndex = currentCharacters.findIndex(
    (c) => c.key === character.key,
  );
  if (existingIndex !== -1) {
    // Update existing character
    currentCharacters[existingIndex] = character;
  } else {
    // Add new character
    currentCharacters.push(character);
  }
  userCharacters.set(currentCharacters);
}

async function subscribeToUserCharacters(uid: string) {
  unsubscribe();
  try {
    const { db } = await import('@firebase/client');
    const { onSnapshot, collection, query, where } = await import(
      'firebase/firestore'
    );

    const q = query(
      collection(db, CHARACTER_SHEETS_COLLECTION_NAME),
      where('owners', 'array-contains', uid),
    );

    unsubscribe = onSnapshot(q, (snapshot) => {
      for (const change of snapshot.docChanges()) {
        if (change.type === 'added' || change.type === 'modified') {
          const characterData = change.doc.data();
          const character = CharacterSchema.parse({
            ...characterData,
            key: change.doc.id,
          });
          patchCharacterData(character);
        } else if (change.type === 'removed') {
          const currentCharacters = userCharacters.get();
          const index = currentCharacters.findIndex(
            (c) => c.key === change.doc.id,
          );
          if (index !== -1) {
            currentCharacters.splice(index, 1);
            userCharacters.set(currentCharacters);
          }
        }
      }
    });
  } catch (error) {
    logError(
      'userCharacters',
      'subscribeToUserCharacters',
      `Failed to subscribe to user characters for ${uid}:`,
      error,
    );
    return;
  }
}
effect(uid, (u) => {
  unsubscribe();
  if (!u) {
    userCharacters.set([]);
  } else {
    subscribeToUserCharacters(u);
  }
});
