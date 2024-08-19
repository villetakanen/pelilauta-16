import { ProfileAvatar } from '@client/shared/ProfileAvatar';
import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { $account } from '@stores/sessionStore';
import { type Component, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

export const ReplyBubble: Component<{ reply: Reply }> = (props) => {
  const account = useStore($account);
  const fromCurrentUser = createMemo(() =>
    props.reply.owners.includes(account()?.uid),
  );

  return (
    <section class="flex-no-wrap" style="display:flex">
      {!fromCurrentUser() && <ProfileAvatar uid={props.reply.owners[0]} />}
      <cn-bubble reply={fromCurrentUser()} class="grow">
        <div class="toolbar" style="margin-top: -16px">
          <p class="grow">
            <ProfileLink uid={props.reply.owners[0]} />
          </p>
          <cn-reaction-button
            noun="love"
            small
            count={props.reply.lovesCount}
          />
          <button type="button">
            <cn-icon xsmall noun="send" />
          </button>
        </div>
        <MarkdownSection content={`${props.reply.markdownContent}`} />
      </cn-bubble>
      {fromCurrentUser() && <ProfileAvatar uid={props.reply.owners[0]} />}
    </section>
  );
};
