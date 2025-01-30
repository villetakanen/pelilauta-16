/**
 * A Solid-js component providing the drop-down menu for a reply (by the cut)
 */

import { useStore } from '@nanostores/solid';
import type { Reply } from '@schemas/ReplySchema';
import { $uid } from '@stores/session';
import { t } from '@utils/i18n';

import { type Component, createMemo } from 'solid-js';

interface Props {
  reply: Reply;
}

export const ReplyDropdown: Component<Props> = (props) => {
  const uid = useStore($uid);
  const fromCurrentUser = createMemo(() => props.reply.owners.includes(uid()));

  let menu: HTMLElement | undefined;

  return (
    <>
      {uid() && (
        <cn-menu rel={menu}>
          <ul>
            <li>
              <a
                href={`/threads/${props.reply.threadKey}/replies/${props.reply.key}/fork`}
              >
                <cn-icon noun="fork" small />
                <span>{t('actions:fork')}</span>
              </a>
            </li>
            {fromCurrentUser() && (
              <li>
                <a
                  href={`/threads/${props.reply.threadKey}/replies/${props.reply.key}/delete`}
                >
                  <cn-icon noun="delete" small />
                  <span>{t('actions:delete')}</span>
                </a>
              </li>
            )}
          </ul>
        </cn-menu>
      )}
    </>
  );
};
