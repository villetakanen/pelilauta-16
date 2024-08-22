import { ProfileAvatar } from '@client/shared/ProfileAvatar';
import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { createEventDispatcher } from '@solid-primitives/event-dispatcher';
import { loveReply, unloveReply } from '@stores/ThreadsApp/reactions';
import { $account } from '@stores/sessionStore';
import { logDebug } from '@utils/logHelpers';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

interface Props {
  onQuote: (evt: CustomEvent<string>) => void;
  reply: Reply;
}

export const ReplyBubble: Component<Props> = (props) => {
  const dispatch = createEventDispatcher(props);

  const account = useStore($account);
  const fromCurrentUser = createMemo(() =>
    props.reply.owners.includes(account()?.uid),
  );

  const loves = createMemo(
    () => props.reply.lovers?.includes(account()?.uid) || false,
  );

  function handleLoveToggle(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const loves = props.reply.lovers || [];
    const index = loves.indexOf(account()?.uid);
    if (index > -1) {
      unloveReply(account().uid, props.reply.threadKey, props.reply.key);
    } else {
      loveReply(account().uid, props.reply.threadKey, props.reply.key);
    }
  }

  function handleQuote(e: Event) {
    logDebug('ReplyBubble', 'handleQuote', e);
    dispatch('quote', props.reply.key);
  }

  return (
    <section class="flex-no-wrap" style="display:flex">
      {!fromCurrentUser() && <ProfileAvatar uid={props.reply.owners[0]} />}
      <cn-bubble reply={fromCurrentUser()} class="grow">
        <div class="toolbar" style="margin-top: -16px">
          <p class="grow">
            <ProfileLink uid={props.reply.owners[0]} />
          </p>
          <cn-reaction-button
            onClick={handleLoveToggle}
            onKeyUp={(e: KeyboardEvent) =>
              e.key === 'Enter' && handleLoveToggle(e)
            }
            checked={loves()}
            noun="love"
            small
            disabled={!account()?.uid || fromCurrentUser()}
            count={props.reply.lovesCount}
          />
          <button
            type="button"
            onClick={handleQuote}
            onKeyUp={(e: KeyboardEvent) => e.key === 'Enter' && handleQuote(e)}
          >
            <cn-icon xsmall noun="quote" />
          </button>
        </div>
        <MarkdownSection content={`${props.reply.markdownContent}`} />
      </cn-bubble>
      {fromCurrentUser() && <ProfileAvatar uid={props.reply.owners[0]} />}
    </section>
  );
};