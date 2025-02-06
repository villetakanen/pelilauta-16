import { ReplyBubble } from '@client/threads/ThreadApp/ReplyBubble';
import { db } from '@firebase/client';
import {
  REPLIES_COLLECTION,
  type Reply,
  parseReply,
} from '@schemas/ReplySchema';
import { THREADS_COLLECTION_NAME, type Thread } from '@schemas/ThreadSchema';
import { $subscriber, $uid, markEntrySeen } from '@stores/session';
import { toClientEntry } from '@utils/client/entryUtils';
import { t } from '@utils/i18n';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { type Component, For, createSignal, onMount } from 'solid-js';
import { ReplyButton } from './ReplyButton';

declare module 'solid-js' {
  namespace JSX {
    interface CustomEvents {
      Quote: CustomEvent; // Matches `on:Name`
    }
    interface CustomCaptureEvents {
      Name: CustomEvent; // Matches `oncapture:Name`
    }
  }
}

interface DiscussionProps {
  thread: Thread;
}

/**
 * A Solid JS component that displays the discussion of a thread, and allows
 * users to participate in the discussion.
 */
export const Discussion: Component<DiscussionProps> = (props) => {
  const [discussion, setDiscussion] = createSignal<Reply[]>([]);
  const [quoteRef, setQuoteRef] = createSignal<string | undefined>(undefined);

  onMount(() => {
    subscribeToDiscussion();
    markThreadSeen();
  });

  function markThreadSeen() {
    const uid = $uid.get();
    if (!uid) {
      return;
    }

    // check if the thread is already marked as seen
    const subscriber = $subscriber.get();
    if (!subscriber) {
      // no subscriber, no need to mark as seen
      return;
    }
    const seenTime = subscriber.seenEntities[props.thread.key] || 0;
    if (seenTime < props.thread.flowTime) {
      markEntrySeen(props.thread.key, props.thread.flowTime);
    }
  }

  async function subscribeToDiscussion() {
    const discussionRef = query(
      collection(
        db,
        THREADS_COLLECTION_NAME,
        props.thread.key,
        REPLIES_COLLECTION,
      ),
      orderBy('flowTime'),
    );
    onSnapshot(discussionRef, (snapshot) => {
      if (snapshot.empty) {
        return;
      }
      for (const doc of snapshot.docChanges()) {
        if (doc.type === 'removed') {
          deleteReply(doc.doc.id);
        } else {
          const reply = parseReply(
            toClientEntry(doc.doc.data()),
            doc.doc.id,
            props.thread.key,
          );
          patchReply(reply);
        }
      }
    });
  }

  function patchReply(reply: Reply) {
    const patchedDiscussion = [...discussion()];
    const index = patchedDiscussion.findIndex((r) => r.key === reply.key);
    if (index > -1) {
      patchedDiscussion[index] = reply;
    } else {
      patchedDiscussion.push(reply);
    }
    patchedDiscussion.sort((a, b) => a.flowTime - b.flowTime);
    setDiscussion(patchedDiscussion);
  }

  function deleteReply(replyKey: string) {
    const patchedDiscussion = discussion().filter((r) => r.key !== replyKey);
    setDiscussion(patchedDiscussion);
  }

  function handleQuote(e: Event) {
    e.preventDefault();
    e.stopPropagation();

    const quoteRef = (e as CustomEvent).detail;

    setQuoteRef(quoteRef);
  }

  const getQuote = (rep: Reply) => {
    if (rep.quoteref) {
      return discussion().find((r) => r.key === rep.quoteref);
    }
    return undefined;
  };

  return (
    <div class="content-columns" id="discussion">
      <div class="column-l">
        <h3>{t('threads:discussion.title')}</h3>
        <div class="flex flex-col downscaled" on:Quote={handleQuote}>
          <For
            each={discussion()}
            fallback={<p>{t('threads:discussion.empty')}</p>}
          >
            {(reply) => (
              <ReplyBubble
                reply={reply}
                onQuote={handleQuote}
                quotedReply={getQuote(reply)}
              />
            )}
          </For>
        </div>
        <div
          id="discussion_bottom"
          class="flex flex-row border-t mt-2 justify-center"
        >
          <ReplyButton
            quoteRef={quoteRef()}
            threadKey={props.thread.key}
            discussion={discussion()}
            onQuote={handleQuote}
          />
        </div>
      </div>
    </div>
  );
};
