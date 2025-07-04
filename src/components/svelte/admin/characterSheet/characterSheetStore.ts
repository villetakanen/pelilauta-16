import {
  CHARACTER_SHEETS_COLLECTION_NAME,
  CharacterSheetSchema,
} from '@schemas/CharacterSheetSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { logDebug, logError } from '@utils/logHelpers';
import { atom } from 'nanostores';

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

/**
 * Updates an existing character sheet in the database
 */
export async function updateCharacterSheet(
  sheetKey: string,
  updates: Partial<CharacterSheet>,
): Promise<void> {
  try {
    const { doc, updateDoc } = await import('firebase/firestore');
    const { db } = await import('@firebase/client');

    const docRef = doc(db, CHARACTER_SHEETS_COLLECTION_NAME, sheetKey);

    await updateDoc(docRef, {
      ...updates,
      updatedAt: new Date(),
    });

    logDebug(
      'characterSheetStore',
      'Character sheet updated successfully:',
      sheetKey,
    );
  } catch (error) {
    logError('characterSheetStore', 'Failed to update character sheet:', error);
    throw error;
  }
}

/**
 * Loads a character sheet from the database
 */
export async function loadCharacterSheet(
  sheetKey: string,
): Promise<CharacterSheet | null> {
  try {
    const { doc, getDoc } = await import('firebase/firestore');
    const { db } = await import('@firebase/client');

    const docRef = doc(db, CHARACTER_SHEETS_COLLECTION_NAME, sheetKey);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      const data = docSnap.data();
      return CharacterSheetSchema.parse({
        key: docSnap.id,
        ...data,
      });
    }

    return null;
  } catch (error) {
    logError('characterSheetStore', 'Failed to load character sheet:', error);
    throw error;
  }
}

/**
 * Deletes a character sheet from the database
 */
export async function deleteCharacterSheet(sheetKey: string): Promise<void> {
  try {
    const { doc, deleteDoc } = await import('firebase/firestore');
    const { db } = await import('@firebase/client');

    const docRef = doc(db, CHARACTER_SHEETS_COLLECTION_NAME, sheetKey);
    await deleteDoc(docRef);

    logDebug(
      'characterSheetStore',
      'Character sheet deleted successfully:',
      sheetKey,
    );
  } catch (error) {
    logError('characterSheetStore', 'Failed to delete character sheet:', error);
    throw error;
  }
}

// *** Reactive stores for current character sheet ******************************************

// Current character sheet being edited
export const currentSheet = atom<CharacterSheet | null>(null);

// Loading state for the current sheet
export const isLoadingSheet = atom<boolean>(false);

// Current sheet key
export const currentSheetKey = atom<string>('');

/**
 * Loads a character sheet and sets it as the current sheet
 */
export async function loadCurrentSheet(sheetKey: string): Promise<void> {
  if (!sheetKey) {
    logError('characterSheetStore', 'Cannot load sheet: sheetKey is required');
    return;
  }

  isLoadingSheet.set(true);
  currentSheetKey.set(sheetKey);

  try {
    const sheet = await loadCharacterSheet(sheetKey);
    currentSheet.set(sheet);
    logDebug('characterSheetStore', 'Current sheet loaded:', sheet);
  } catch (error) {
    logError('characterSheetStore', 'Failed to load current sheet:', error);
    currentSheet.set(null);
  } finally {
    isLoadingSheet.set(false);
  }
}

/**
 * Saves the current character sheet
 */
export async function saveCurrentSheet(): Promise<void> {
  const sheet = currentSheet.get();
  const sheetKey = currentSheetKey.get();

  if (!sheet || !sheetKey) {
    logError(
      'characterSheetStore',
      'Cannot save: no current sheet or sheetKey',
    );
    return;
  }

  try {
    await updateCharacterSheet(sheetKey, sheet);
    logDebug('characterSheetStore', 'Current sheet saved successfully');
  } catch (error) {
    logError('characterSheetStore', 'Failed to save current sheet:', error);
    throw error;
  }
}

/**
 * Updates a field in the current character sheet
 */
export function updateCurrentSheetField<K extends keyof CharacterSheet>(
  field: K,
  value: CharacterSheet[K],
): void {
  const sheet = currentSheet.get();
  if (!sheet) {
    logError('characterSheetStore', 'Cannot update field: no current sheet');
    return;
  }

  currentSheet.set({
    ...sheet,
    [field]: value,
  });
}

/**
 * Clears the current character sheet
 */
export function clearCurrentSheet(): void {
  currentSheet.set(null);
  currentSheetKey.set('');
  isLoadingSheet.set(false);
}

// *** Character sheet CRUD operations ******************************************

/**
 * Fetches all character sheets from the database
 */
export async function getAllCharacterSheets(): Promise<CharacterSheet[]> {
  try {
    const { collection, getDocs } = await import('firebase/firestore');
    const { db } = await import('@firebase/client');

    const querySnapshot = await getDocs(
      collection(db, CHARACTER_SHEETS_COLLECTION_NAME),
    );
    const sheets: CharacterSheet[] = [];

    for (const doc of querySnapshot.docs) {
      try {
        const data = doc.data();
        const sheet = CharacterSheetSchema.parse({
          ...data,
          key: doc.id,
        });
        sheets.push(sheet);
      } catch (parseError) {
        logError(
          'characterSheetStore',
          'Failed to parse character sheet:',
          parseError,
        );
      }
    }

    logDebug('characterSheetStore', `Loaded ${sheets.length} character sheets`);
    return sheets;
  } catch (error) {
    logError('characterSheetStore', 'Failed to load character sheets:', error);
    throw error;
  }
}
