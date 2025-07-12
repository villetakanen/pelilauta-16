import {
  CHARACTER_SHEETS_COLLECTION_NAME,
  type CharacterSheet,
  CharacterSheetSchema,
} from '@schemas/CharacterSheetSchema';
import { logDebug, logError } from '@utils/logHelpers';

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
