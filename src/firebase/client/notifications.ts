import {
  NOTIFICATION_FIRESTORE_COLLECTION,
  type Notification,
} from '@schemas/NotificationSchema';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';

export async function addNotification(notification: Notification) {
  const { addDoc, getFirestore, collection } = await import(
    'firebase/firestore'
  );
  const data = toFirestoreEntry(notification);
  const doc = await addDoc(
    collection(getFirestore(), NOTIFICATION_FIRESTORE_COLLECTION),
    data,
  );
  return doc.id;
}
