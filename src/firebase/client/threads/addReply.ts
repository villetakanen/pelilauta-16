import {
  REACTIONS_COLLECTION_NAME,
  type Reactions,
} from '@schemas/ReactionsSchema';
import { REPLIES_COLLECTION, type Reply } from '@schemas/ReplySchema';
import { THREADS_COLLECTION_NAME, type Thread, type ImageArraySchema } from '@schemas/ThreadSchema';
import type { z } from 'astro/zod';
import { addAssetToThread } from './addAssetToThread';

export async function addReply(
  thread: Thread,
  author: string,
  markdonwContent: string,
  quoteref?: string,
  files: File[] = [],
) {
  const {
    serverTimestamp,
    addDoc,
    collection,
    getFirestore,
    increment,
    doc,
    updateDoc,
    setDoc,
  } = await import('firebase/firestore');
  const { toFirestoreEntry } = await import('@utils/client/toFirestoreEntry');
  const { addNotification } = await import('../notifications');

  const db = getFirestore();

  // Add a new reply to the thread
  const replyData: Partial<Reply> = {
    threadKey: thread.key,
    markdownContent: markdonwContent,
    owners: [author],
  };
  if (quoteref) replyData.quoteref = quoteref;

  if (files.length > 0) {
    const uploadedImages:z.infer<typeof ImageArraySchema> = [];
    for (const file of files) {
      const { downloadURL: url } = await addAssetToThread(thread.key, file);
      const alt = file.name;
      uploadedImages.push({ url, alt });
    }
    replyData.images = uploadedImages;
  }

  const data = toFirestoreEntry(replyData);

  const reply = await addDoc(
    collection(db, THREADS_COLLECTION_NAME, thread.key, REPLIES_COLLECTION),
    data,
  );

  // Update the thread with the new reply count and flow time (last reply/update/change time)
  await updateDoc(doc(db, THREADS_COLLECTION_NAME, thread.key), {
    replyCount: increment(1),
    flowTime: serverTimestamp(),
  });

  // Add a notification to the thread creator (the first owner of the thread)
  const targetTitle =
    markdonwContent.length > 50
      ? `${markdonwContent.substring(0, 50)}...`
      : markdonwContent;

  const reactions: Reactions = {
    subscribers: thread.owners,
    love: [],
  };
  // Add the reactions to the reply
  await setDoc(doc(db, REACTIONS_COLLECTION_NAME, reply.id), reactions);

  // If the author of the reply is the same as the thread creator,
  // we don't need to add a notification to the thread creator
  if (thread.owners[0] === author) return;

  await addNotification({
    key: `${reply.id}-${thread.owners[0]}`,
    targetType: 'thread.reply',
    createdAt: new Date(),
    targetKey: thread.key,
    to: thread.owners[0],
    from: author,
    targetTitle,
    read: false,
  });
}
