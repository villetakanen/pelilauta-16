// A nanostore for managing the state of the builder component
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import { CharacterBuilderSchema } from '@schemas/CharacterBuilderSchema';
import { logDebug, logError } from '@utils/logHelpers';
import { type WritableAtom, atom } from 'nanostores';

export const builder: WritableAtom<undefined | CharacterBuilder> =
  atom(undefined);
export const builderLoading: WritableAtom<boolean> = atom(false);

let unsubscribe: (() => void) | null = null;
let currentBuilderKey: string | null = null;

/**
 * Updates the steps array in the database.
 * The store will be updated automatically via Firestore subscription.
 */
export async function setSteps(steps: CharacterBuilder['steps']) {
  const currentBuilder = builder.get();
  if (!currentBuilder) {
    logError('builderStore', 'Cannot update steps: no builder loaded');
    return;
  }

  try {
    const { updateBuilder } = await import('@firebase/client/builders');
    await updateBuilder({
      key: currentBuilder.key,
      steps,
    });
    logDebug('builderStore', 'Successfully updated steps in database');
  } catch (error) {
    logError('builderStore', 'Failed to update steps:', error);
  }
}

export async function subscribeToBuilder(builderKey: string) {
  if (builderKey === currentBuilderKey) {
    logDebug('builderStore', 'Already subscribed to builder', builderKey);
    return;
  }

  // Unsubscribe from the previous builder and clear the state
  unsubscribeFromBuilder();

  logDebug('builderStore', 'Subscribing to builder', builderKey);
  builderLoading.set(true);
  currentBuilderKey = builderKey;

  try {
    // Dynamic import for code splitting
    const { doc, onSnapshot } = await import('firebase/firestore');
    const { db } = await import('@firebase/client');

    const builderDoc = doc(db, 'builders', builderKey);

    unsubscribe = onSnapshot(
      builderDoc,
      (docSnapshot) => {
        try {
          if (docSnapshot.exists()) {
            const data = docSnapshot.data();
            const validatedBuilder = CharacterBuilderSchema.parse(data);
            builder.set(validatedBuilder);
            logDebug(
              'builderStore',
              'Builder updated from Firestore',
              validatedBuilder,
            );
          } else {
            logDebug(
              'builderStore',
              'Builder document does not exist',
              builderKey,
            );
            builder.set(undefined);
          }
        } catch (error) {
          logError('builderStore', 'Failed to parse builder data:', error);
          builder.set(undefined);
        } finally {
          builderLoading.set(false);
        }
      },
      (error) => {
        logError('builderStore', 'Firestore subscription error:', error);
        clearBuilder();
      },
    );
  } catch (error) {
    logError('builderStore', 'Failed to subscribe to builder:', error);
    clearBuilder();
  }
}

export function unsubscribeFromBuilder() {
  if (unsubscribe) {
    logDebug('builderStore', 'Unsubscribing from builder', currentBuilderKey);
    unsubscribe();
    unsubscribe = null;
  }
  currentBuilderKey = null;
  clearBuilder();
}

export function clearBuilder() {
  builder.set(undefined);
  builderLoading.set(false);
}
