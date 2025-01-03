import { type Channel, parseChannel } from '@schemas/ChannelSchema';
import {
  THREADS_COLLECTION_NAME,
  type Thread,
  createThread,
} from '@schemas/ThreadSchema';
import { markEntrySeen } from '@stores/sessionStore';
import { toClientEntry } from '@utils/client/entryUtils';
import { logError, logWarn } from '@utils/logHelpers';
import { addAssetToThread } from './addAssetToThread';

async function increaseThreadCount(channel: string) {
  const { doc, getFirestore, getDoc, updateDoc } = await import(
    'firebase/firestore'
  );
  const channelsRef = doc(getFirestore(), 'meta', 'threads');
  const channelsDoc = await getDoc(channelsRef);

  if (!channelsDoc.exists()) {
    logWarn('No channels found in DB, cannot increase thread count');
    return;
  }

  const channels = new Array<Channel>();
  const channelsArray = channelsDoc.data()?.topics;

  for (const channel of channelsArray) {
    channels.push(parseChannel(toClientEntry(channel)));
  }

  const channelIndex = channels.findIndex((c) => c.slug === channel);
  if (channelIndex === -1) {
    logWarn('Channel not found in DB, cannot increase thread count');
    return;
  }

  const channelEntry = channels[channelIndex];
  channelEntry.threadCount += 1;

  channelsArray[channelIndex] = channelEntry;

  await updateDoc(channelsRef, {
    topics: channelsArray,
  });
}

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
  const { updateDoc, addDoc, collection, getFirestore, doc } = await import(
    'firebase/firestore'
  );
  const { toFirestoreEntry } = await import('@utils/client/toFirestoreEntry');

  // Create a new thread object from the partial thread data
  const threadEntry = createThread(thread);

  // Add the current user as the owner of the thread
  thread.owners = [uid];

  // Convert to firestore entry
  const entry = toFirestoreEntry(threadEntry);

  // Add the thread to the firestore database
  const docRef = await addDoc(
    collection(getFirestore(), THREADS_COLLECTION_NAME),
    entry,
  );

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
  await updateDoc(doc(getFirestore(), THREADS_COLLECTION_NAME, docRef.id), {
    images,
  });

  thread.channel && (await increaseThreadCount(thread.channel));

  await markEntrySeen(docRef.id, Date.now());

  return docRef.id;
}
