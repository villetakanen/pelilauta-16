import { ReplyBubble } from '@client/threads/ThreadApp/ReplyBubble';
import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
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

  function handleQuote(e: Event) {
    logDebug('Quote', 'handleQuote 2', e);
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
    <div class="content-columns">
      <div class="column-l">
        <h3>{t('threads:discussion.title')}</h3>
        <div class="flex flex-col downscaled" on:Quote={handleQuote}>
          <For each={discussion()} fallback={<p>No replies yet.</p>}>
            {(reply) => (
              <ReplyBubble
                reply={reply}
                onQuote={handleQuote}
                quotedReply={getQuote(reply)}
              />
            )}
          </For>
        </div>
        <div class="flex flex-row border-t mt-2 justify-center">
          <ReplyButton
            quoteRef={quoteRef()}
            threadKey={props.threadKey}
            discussion={discussionRef}
            onQuote={handleQuote}
          />
        </div>
      </div>
    </div>
  );
};
