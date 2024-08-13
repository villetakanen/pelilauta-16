import { THREADS_COLLECTION_NAME, type Thread } from '@schemas/ThreadSchema';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { doc, updateDoc } from 'firebase/firestore';
import { db } from 'src/firebase/client';

export async function updateThread(
  key: string,
  data: Partial<Thread>,
  options = { silent: false },
) {
  const thread = toFirestoreEntry(data, options);
  await updateDoc(doc(db, THREADS_COLLECTION_NAME, key), thread);
}
