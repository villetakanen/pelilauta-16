import { ReplyDropdown } from '@client/ThreadsApp/ReplyDropdown';
import { ProfileAvatar } from '@client/shared/ProfileAvatar';
import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { createEventDispatcher } from '@solid-primitives/event-dispatcher';
import { loveReply, unloveReply } from '@stores/ThreadsApp/reactions';
import { $uid } from '@stores/session';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

interface Props {
  onQuote: (evt: CustomEvent<string>) => void;
  reply: Reply;
  quotedReply?: Reply;
}

export const ReplyBubble: Component<Props> = (props) => {
  const dispatch = createEventDispatcher(props);

  const uid = useStore($uid);

  const fromCurrentUser = createMemo(() => props.reply.owners.includes(uid()));

  const loves = createMemo(() => props.reply.lovers?.includes(uid()) || false);

  function handleLoveToggle(e: Event) {
    e.preventDefault();
    e.stopPropagation();
    const loves = props.reply.lovers || [];
    const index = loves.indexOf(uid());
    if (index > -1) {
      unloveReply(uid(), props.reply.threadKey, props.reply.key);
    } else {
      loveReply(uid(), props.reply.threadKey, props.reply.key);
    }
  }

  function handleQuote(e: Event) {
    e.preventDefault();
    dispatch('quote', props.reply.key);
  }

  return (
    <section class="flex-no-wrap" style="display:flex">
      {!fromCurrentUser() && (
        <div class="sm-hidden">
          <ProfileAvatar uid={props.reply.owners[0]} />
        </div>
      )}
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
            disabled={!uid() || fromCurrentUser()}
            count={props.reply.lovesCount}
          />
          <button
            type="button"
            onClick={handleQuote}
            onKeyUp={(e: KeyboardEvent) => e.key === 'Enter' && handleQuote(e)}
          >
            <cn-icon xsmall noun="quote" />
          </button>
          <ReplyDropdown reply={props.reply} />
        </div>
        {props.quotedReply && (
          <div class="border-radius p-1 mt-1 mb-1 secondary">
            <p class="m-0">
              <ProfileLink uid={props.quotedReply.owners[0]} />
            </p>
            <p class="downscaled">
              <MarkdownSection content={props.quotedReply.markdownContent} />
            </p>
          </div>
        )}
        <MarkdownSection
          content={`${props.reply.markdownContent || props.reply.content}`}
        />
      </cn-bubble>
      {fromCurrentUser() && (
        <div class="sm-hidden">
          <ProfileAvatar uid={props.reply.owners[0]} />
        </div>
      )}
    </section>
  );
};
