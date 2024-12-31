import { THREADS_COLLECTION_NAME, type Thread } from '@schemas/ThreadSchema';

export async function submitThreadUpdate(data: Partial<Thread>, uid: string) {
  const { serverTimestamp, addDoc, collection, getFirestore, getDoc, doc } =
    await import('firebase/firestore');

  const update = {
    ...data,
    owners: [uid],
    author: uid,
    updatedAt: serverTimestamp(),
    createdAt: serverTimestamp(),
  };

  if (data.key) {
    throw new Error('Thread update functionality not implemented yet');
  }

  const { id } = await addDoc(
    collection(getFirestore(), THREADS_COLLECTION_NAME),
    update,
  );

  return id;
}
