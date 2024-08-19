import {
  NOTIFICATION_FIRESTORE_COLLECTION,
  type Notification,
} from '@schemas/NotificationSchema';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from 'src/firebase/client';

export async function addReaction(r: Notification) {
  const payload = {
    ...r,
    createdAt: serverTimestamp(),
  };
  addDoc(collection(db, NOTIFICATION_FIRESTORE_COLLECTION), payload);
}
