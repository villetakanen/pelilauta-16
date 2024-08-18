import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { $account } from '@stores/sessionStore';
import { type Component, For, createMemo } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';

export const ReplyBubble: Component<{ reply: Reply }> = (props) => {
  const account = useStore($account);
  const fromCurrentUser = createMemo(() =>
    props.reply.owners.includes(account()?.uid),
  );

  return (
    <cn-bubble reply={fromCurrentUser()}>
      <MarkdownSection content={`${props.reply.markdownContent}`} />
      <div class="toolbar">
        <p>
          <ProfileLink uid={props.reply.owners[0]} />
        </p>
        <cn-reaction-button noun="love" small count={props.reply.lovesCount} />
      </div>
    </cn-bubble>
  );
};
