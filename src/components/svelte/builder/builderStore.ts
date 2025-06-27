// A nanostore for managing the state of the builder component
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import { CharacterBuilderSchema } from '@schemas/CharacterBuilderSchema';
import { logDebug, logError } from '@utils/logHelpers';
import { type WritableAtom, atom } from 'nanostores';

export const builder: WritableAtom<undefined | CharacterBuilder> =
  atom(undefined);
export const builderLoading: WritableAtom<boolean> = atom(false);

let unsubscribe: (() => void) | null = null;

export async function subscribeToBuilder(builderKey: string) {
  logDebug('builderStore', 'Subscribing to builder', builderKey);
  builderLoading.set(true);

  // Clear any existing subscription
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }

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
        builder.set(undefined);
        builderLoading.set(false);
      },
    );
  } catch (error) {
    logError('builderStore', 'Failed to subscribe to builder:', error);
    builder.set(undefined);
    builderLoading.set(false);
  }
}

export function unsubscribeFromBuilder() {
  if (unsubscribe) {
    unsubscribe();
    unsubscribe = null;
  }
  clearBuilder();
}

export async function loadBuilder(builderKey: string) {
  logDebug('builderStore', 'Loading builder', builderKey);
  builderLoading.set(true);

  try {
    // TODO: Replace with actual Firestore subscription
    // For now, using mock data
    const mockBuilder = CharacterBuilderSchema.parse({
      key: builderKey,
      name: 'Löllöpulautin',
      description: 'Tämä on testipulautin, joka ei vielä tee mitään.',
      system: 'll',
      steps: [
        {
          key: 'step1',
          name: 'Character Origin',
          description: "Choose your character's background and origin.",
          min: 1,
          max: 1,
          features: [
            {
              key: 'noble',
              characterBuilderKey: builderKey,
              name: 'Noble',
              modifiers: [
                {
                  type: 'FEATURE',
                  title: 'Noble Heritage',
                  description: 'You come from a wealthy family.',
                },
              ],
            },
            {
              key: 'commoner',
              characterBuilderKey: builderKey,
              name: 'Commoner',
              modifiers: [
                {
                  type: 'FEATURE',
                  title: 'Street Smart',
                  description: 'You know how to survive on the streets.',
                },
              ],
            },
          ],
        },
      ],
    });

    builder.set(mockBuilder);
    logDebug('builderStore', 'Builder loaded successfully', mockBuilder);
  } catch (error) {
    logError('builderStore', 'Failed to load builder:', error);
    builder.set(undefined);
  } finally {
    builderLoading.set(false);
  }
}

export function clearBuilder() {
  builder.set(undefined);
  builderLoading.set(false);
}
