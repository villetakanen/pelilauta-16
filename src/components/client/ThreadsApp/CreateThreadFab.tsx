import { useStore } from '@nanostores/solid';
import { $isAnonymous } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

interface CreateThreadFabProps {
  channel?: string;
}

/**
 * A Solid-js component to wrap in authz and props for thread
 * creation FAB (Floating Action Button)
 */
export const CreateThreadFab: Component<CreateThreadFabProps> = (props) => {
  const anonymous = useStore($isAnonymous);
  const route = props.channel
    ? `/create/thread?channel=${props.channel}`
    : '/create/thread';

  return !anonymous() ? (
    <a href={route} class="fab">
      <cn-icon noun="send" small />
      <span class="sm-hidden">{t('actions:create.thread')}</span>
    </a>
  ) : null;
};
