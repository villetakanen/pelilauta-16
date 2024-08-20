import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { subscribeToDiscussion } from '@stores/ThreadsApp/discussion';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, For, createSignal } from 'solid-js';
import { ReplyBubble } from './ReplyBubble';
import { ReplyForm } from './ReplyForm';

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

export const ThreadDiscussion: Component<{ thread?: Thread }> = (props) => {
  const discussionRef = subscribeToDiscussion(props.thread?.key || '');
  const discussion = useStore(discussionRef);

  const [quoteRef, setQuoteRef] = createSignal<string | undefined>(undefined);

  function handleQuote(e: Event) {
    logDebug('Quote', 'handleQuote 2', e);
    e.preventDefault();
    e.stopPropagation();

    const quoteRef = (e as CustomEvent).detail;

    setQuoteRef(quoteRef);
  }

  return (
    <div class="column-l">
      <h3>{t('threads:discussion.title')}</h3>
      <div class="flex flex-col downscaled" on:Quote={handleQuote}>
        <For each={discussion()} fallback={<p>No replies yet.</p>}>
          {(reply) => <ReplyBubble reply={reply} onQuote={handleQuote} />}
        </For>
      </div>
      <ReplyForm
        quoteRef={quoteRef()}
        thread={props.thread}
        discussion={discussionRef}
        onQuote={handleQuote}
      />
    </div>
  );
};
