import { persistentAtom } from '@nanostores/persistent';
import {
  REPLIES_COLLECTION,
  type Reply,
  parseReply,
} from '@schemas/ReplySchema';
import { THREADS_COLLECTION_NAME } from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { toFirestoreEntry } from '@utils/client/toFirestoreEntry';
import {
  collection,
  doc,
  onSnapshot,
  orderBy,
  query,
  updateDoc,
} from 'firebase/firestore';
import { type WritableAtom, atom } from 'nanostores';
import { db } from 'src/firebase/client';

/**
 * This is a local storage cache for the latest threads, either by flowTime or by recently read by the user.
 */
export const $discussions = persistentAtom<Reply[][]>('discussions-cache', [], {
  encode: JSON.stringify,
  decode: (data) => {
    const raw = JSON.parse(data);
    const discussions: Reply[][] = [];
    for (const discussion of raw) {
      discussions.push(
        discussion.map((entry: Record<string, unknown>) => {
          return parseReply(
            toClientEntry(entry),
            entry.key as string,
            entry.threadKey as string,
          );
        }),
      );
    }
    return discussions;
  },
});

const LOCAL_CACHE_SIZE = 11;

/**
 * Adds a discussion to the cache, updating it if it already exists, or removing the
 * "oldest" (FIFO) discussion if the cache is full.
 *
 * @param threadKey the key of the tread owning the discussion
 */
export function cacheDiscussion(threadKey: string, discussion: Reply[]) {
  const discussions = [...$discussions.get()];

  // Check if the discussion is already in the cache
  const index = discussions.findIndex((d) => d[0].threadKey === threadKey);

  // If the discussion is already in the cache, update it, and break
  if (index > -1) {
    discussions[index] = discussion;
  } else {
    // If the cache is full, remove the oldest discussion
    if (discussions.length >= LOCAL_CACHE_SIZE) {
      discussions.pop();
    }

    // Add the new discussion to the cache
    discussions.push(discussion);
  }

  // Save the updated cache
  $discussions.set(discussions);
}

let unsubscribe = () => {};

/**
 * Subscribe to a discussion, this will load the discussion from the local store to a nanostore
 *
 * @param threadKey the key of the thread owning the discussion
 */
export function subscribeToDiscussion(threadKey: string) {
  const discussion = atom<Reply[]>([]);

  // Lets see if we have the discussion in the cache, if
  // so, we'll load it to the store and return the store.
  // If not, we'll return empty store.
  const cachedDiscussion = $discussions
    .get()
    .find((discussion) => discussion[0].threadKey === threadKey);
  if (cachedDiscussion) {
    discussion.set(cachedDiscussion);
  }

  subscribeToDiscussionFirestore(threadKey, discussion);

  return discussion;
}

/**
 * Subscriber to a firestore query for a discussion, update the local cache and the given store
 * with the latest data when the data changes.
 */
export function subscribeToDiscussionFirestore(
  threadKey: string,
  store: WritableAtom<Reply[]>,
) {
  unsubscribe();

  const q = query(
    collection(db, THREADS_COLLECTION_NAME, threadKey, REPLIES_COLLECTION),
    orderBy('flowTime', 'asc'),
  );

  unsubscribe = onSnapshot(q, (snapshot) => {
    let currentDiscussion: Reply[] = [];
    for (const change of snapshot.docChanges()) {
      if (change.type === 'removed') {
        currentDiscussion = currentDiscussion.filter(
          (r) => r.key !== change.doc.id,
        );
      } else {
        const reply = parseReply(
          toClientEntry(change.doc.data()),
          change.doc.id,
          threadKey,
        );
        const index = currentDiscussion.findIndex((r) => r.key === reply.key);
        if (index > -1) {
          currentDiscussion[index] = reply;
        } else {
          currentDiscussion.push(reply);
        }
      }
      store.set([...currentDiscussion]);
      cacheDiscussion(threadKey, [...currentDiscussion]);
    }
  });
}

export async function updateReply(
  data: Partial<Reply>,
  key: string,
  threadKey: string,
) {
  const replyRef = doc(
    db,
    THREADS_COLLECTION_NAME,
    threadKey,
    REPLIES_COLLECTION,
    key,
  );
  const payload = toFirestoreEntry(data, { silent: true });
  await updateDoc(replyRef, payload);
}
