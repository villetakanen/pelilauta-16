import { persistentAtom } from '@nanostores/persistent';
import {
  ParseThread,
  THREADS_COLLECTION_NAME,
  type Thread,
  createThread,
} from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { logDebug } from '@utils/logHelpers';
import { doc, onSnapshot } from 'firebase/firestore';
import { db } from 'src/firebase/client';
import { init } from './replies';

export const $key = persistentAtom<string>('active-thread-key', '');
export const loadingState = persistentAtom<'initial' | 'loading' | 'active'>(
  'initial',
);
export const $thread = persistentAtom<Thread>('active-thread', createThread(), {
  encode: JSON.stringify,
  decode: (data) => {
    const entry = JSON.parse(data);
    return ParseThread(entry, entry.key);
  },
});

let unsubscribe: CallableFunction | null = null;

export async function load(key: string) {
  // Check if we are already subscribed to the thread
  if (!key) {
    logDebug('activeThreadStore', 'load', 'no key');
    $thread.set(createThread());
    loadingState.set('active');
    return;
  }
  if ($key.get() === key) {
    logDebug('activeThreadStore', 'load', key, 'already subscribed');
    loadingState.set('active');
    return;
  }

  // Load the thread from the server
  logDebug('activeThreadStore', { state: 'loading', key: $key.get() });
  loadingState.set('loading');

  // Unsubscribe from the previous thread
  unsubscribe?.();

  // Initialize the store
  $key.set(key);

  // Load the thread
  const docRef = doc(db, THREADS_COLLECTION_NAME, key);
  unsubscribe = onSnapshot(docRef, (doc) => {
    if (doc.exists()) {
      $thread.set(ParseThread(toClientEntry(doc.data()), doc.id));
      loadingState.set('active');
    } else {
      $thread.set(createThread());
      loadingState.set('active');
    }
  });

  // Load the discussion
  init(key);
}
