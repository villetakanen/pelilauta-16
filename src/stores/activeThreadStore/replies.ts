import { persistentAtom } from '@nanostores/persistent';
import {
  REPLIES_COLLECTION,
  type Reply,
  parseReply,
} from '@schemas/ReplySchema';
import { THREADS_COLLECTION_NAME } from '@schemas/ThreadSchema';
import { toClientEntry } from '@utils/client/entryUtils';
import { collection, onSnapshot } from 'firebase/firestore';
import { atom, computed } from 'nanostores';
import { db } from 'src/firebase/client';

const threadKey = atom<string | null>(null);
export const loadingState = atom<'initial' | 'loading' | 'active'>('initial');
const _replies = persistentAtom<Reply[]>('active-thread-replies', [], {
  encode: JSON.stringify,
  decode: (data) => {
    return JSON.parse(data).map((entry: Record<string, unknown>) => {
      return parseReply(
        toClientEntry(entry),
        entry.key as string,
        entry.threadKey as string,
      );
    });
  },
});

/**
 * Returns the list of replies for the active thread.
 *
 * Doing this at the store level is likely the best way to ensure that the replies are
 * available to all components that need them, and that they are only loaded once.
 */
export const $replies = computed([_replies, loadingState], (replies, state) =>
  state === 'active' ? replies : [],
);

let unsubscribe: (() => void) | null = null;

export function init(key: string) {
  if (!key || threadKey.get() === key) return;

  loadingState.set('loading');
  threadKey.set(key);
  _replies.set([]);
  unsubscribe?.();

  const path = `${THREADS_COLLECTION_NAME}/${key}/${REPLIES_COLLECTION}`;

  unsubscribe = onSnapshot(collection(db, path), (snapshot) => {
    for (const reply of snapshot.docChanges()) {
      if (reply.type === 'removed') {
        removeReply(reply.doc.id);
      } else {
        patchReply(
          parseReply(toClientEntry(reply.doc.data()), reply.doc.id, key),
        );
      }
    }
  });

  loadingState.set('active');
}

function patchReply(reply: Reply) {
  const r = _replies.get().filter((r) => r.key !== reply.key);
  r.push(reply);
  r.sort((a, b) => a.flowTime - b.flowTime);
  _replies.set(r);
}

function removeReply(key: string) {
  const r = _replies.get().filter((r) => r.key !== key);
  _replies.set(r);
}
