import {
  CHARACTER_SHEETS_COLLECTION_NAME,
  type CharacterSheet,
  CharacterSheetSchema,
} from '@schemas/CharacterSheetSchema';
import { logDebug, logError } from '@utils/logHelpers';
import { type WritableAtom, atom } from 'nanostores';

export const sheet: WritableAtom<CharacterSheet | null> = atom(null);
export const loading: WritableAtom<boolean> = atom(false);

/**
 * Fetches a character sheet from the database by its key to populate the store.
 * This function is used to retrieve the character sheet data when the editor is opened.
 *
 * @param sheetKey - The unique key of the character sheet to fetch.
 * @returns A promise that resolves to the character sheet data or null if not found.
 */
export async function fetchCharacterSheet(
  sheetKey: string,
): Promise<CharacterSheet | null> {
  try {
    const { getDoc, doc } = await import('firebase/firestore');
    const { db } = await import('@firebase/client');

    logDebug('characterSheetStore', 'Fetching character sheet:', sheetKey);

    const docRef = doc(db, CHARACTER_SHEETS_COLLECTION_NAME, sheetKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      const characterSheet = CharacterSheetSchema.parse(data);
      logDebug(
        'characterSheetStore',
        'Character sheet fetched successfully:',
        characterSheet,
      );
      sheet.set(characterSheet);
      return characterSheet;
    }

    logError(
      'characterSheetStore',
      'No character sheet found for key:',
      sheetKey,
    );
    return null;
  } catch (error) {
    logError('characterSheetStore', 'Failed to fetch character sheet:', error);
    throw error;
  }
}

/**
 * Creates a new character sheet in the database
 */
export async function createCharacterSheet(
  sheetData: Partial<CharacterSheet>,
): Promise<string> {
  try {
    const { addDoc, collection } = await import('firebase/firestore');
    const { db } = await import('@firebase/client');

    // Parse and validate the sheet data
    const characterSheet = CharacterSheetSchema.parse(sheetData);

    logDebug(
      'characterSheetStore',
      'Creating character sheet:',
      characterSheet,
    );

    const docRef = await addDoc(
      collection(db, CHARACTER_SHEETS_COLLECTION_NAME),
      {
        ...characterSheet,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    );

    logDebug(
      'characterSheetStore',
      'Character sheet created successfully:',
      docRef.id,
    );
    return docRef.id;
  } catch (error) {
    logError('characterSheetStore', 'Failed to create character sheet:', error);
    throw error;
  }
}
