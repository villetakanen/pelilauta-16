import { REPLIES_COLLECTION } from '@schemas/ReplySchema';
import { THREADS_COLLECTION_NAME } from '@schemas/ThreadSchema';
import { deleteDoc, doc } from 'firebase/firestore';
import { db } from 'src/firebase/client';

export async function deleteReply(threadKey: string, replyKey: string) {
  // Delete the reply of the given thread, with the given key.
  await deleteDoc(
    doc(db, THREADS_COLLECTION_NAME, threadKey, REPLIES_COLLECTION, replyKey),
  );

  //The Cache updated based on Firestore subscription, no need to update programatically
}
