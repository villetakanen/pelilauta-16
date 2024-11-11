import {
  THREADS_COLLECTION_NAME,
  type Thread,
  createThread,
} from '@schemas/ThreadSchema';
import { markEntrySeen } from '@stores/sessionStore';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import { logError } from '@utils/logHelpers';
import { addDoc, collection, doc, updateDoc } from 'firebase/firestore';
import { db } from '..';
import { addAssetToThread } from './addAssetToThread';

/**
 * Adds a new thread to the firestore database.
 *
 * @param thread
 * @param files
 * @param uid
 */
export async function addThread(
  thread: Partial<Thread>,
  files: File[],
  uid: string,
): Promise<string> {
  // Create a new thread object from the partial thread data
  const threadEntry = createThread(thread);

  // Add the current user as the owner of the thread
  thread.owners = [uid];

  // Convert to firestore entry
  const entry = toFirestoreEntry(threadEntry);

  // Add the thread to the firestore database
  const docRef = await addDoc(collection(db, THREADS_COLLECTION_NAME), entry);

  const images = new Array<{ url: string; alt: string }>();
  // Check if there are any files to upload
  if (files.length > 0) {
    // Upload the files to the storage
    for (const file of files) {
      try {
        const { downloadURL } = await addAssetToThread(docRef.id, file);
        images.push({ url: downloadURL, alt: file.name });
      } catch (error) {
        logError(
          'Error uploading asset to storage (non fatal, continuing)',
          error,
        );
      }
    }
  }

  // Update the thread with the uploaded images
  await updateDoc(doc(db, THREADS_COLLECTION_NAME, docRef.id), {
    images,
  });

  await markEntrySeen(docRef.id, Date.now());

  return docRef.id;
}
