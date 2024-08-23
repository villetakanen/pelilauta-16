import { THREADS_COLLECTION_NAME } from '@schemas/ThreadSchema';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/firebase/client';
import { removeThreadFromCache } from '.';

export async function deleteThread(threadKey: string) {
  // Delete the thread with the given key.
  await deleteDoc(doc(db, THREADS_COLLECTION_NAME, threadKey));

  removeThreadFromCache(threadKey);
}
