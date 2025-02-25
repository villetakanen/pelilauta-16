import { NOTIFICATION_FIRESTORE_COLLECTION } from '@schemas/NotificationSchema';

export async function markRead(key: string, read: boolean) {
  const { getFirestore, doc, updateDoc } = await import('firebase/firestore');
  const db = getFirestore();
  const notificationDoc = doc(db, NOTIFICATION_FIRESTORE_COLLECTION, key);
  await updateDoc(notificationDoc, { read });
}
