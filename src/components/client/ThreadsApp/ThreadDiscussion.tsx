import { ReplyBubble } from '@client/threads/ThreadApp/ReplyBubble';
import { ReplyForm } from '@client/threads/ThreadApp/ReplyForm';
import { useStore } from '@nanostores/solid';
import { subscribeThread } from '@stores/ThreadsApp';
import { subscribeToDiscussion } from '@stores/ThreadsApp/discussion';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, For, createSignal } from 'solid-js';
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

/**
 * A Solid JS component that displays the discussion of a thread, and allows
 * users to participate in the discussion.
 */
export const ThreadDiscussion: Component<{
  threadKey: string;
}> = (props) => {
  const discussionRef = subscribeToDiscussion(props.threadKey);
  const discussion = useStore(discussionRef);
  const [quoteRef, setQuoteRef] = createSignal<string | undefined>(undefined);
  const thread = useStore(subscribeThread(props.threadKey));

  function handleQuote(e: Event) {
    logDebug('Quote', 'handleQuote 2', e);
    e.preventDefault();
    e.stopPropagation();

    const quoteRef = (e as CustomEvent).detail;

    setQuoteRef(quoteRef);
  }

  return (
    <div class="content-columns">
      <div class="column-l">
        {thread() && <ReplyButton thread={thread() || undefined} />}

        <h3>{t('threads:discussion.title')}</h3>
        <div class="flex flex-col downscaled" on:Quote={handleQuote}>
          <For each={discussion()} fallback={<p>No replies yet.</p>}>
            {(reply) => <ReplyBubble reply={reply} onQuote={handleQuote} />}
          </For>
        </div>
        <ReplyForm
          quoteRef={quoteRef()}
          threadKey={props.threadKey}
          discussion={discussionRef}
          onQuote={handleQuote}
        />
      </div>
    </div>
  );
};
