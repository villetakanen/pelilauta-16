import { useStore } from '@nanostores/solid';
import { $isAnonymous } from '@stores/session';
import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { CreateThreadFab } from './CreateThreadFab';

interface FrontPageFabsProps {
  channel?: string;
}

/**
 * Fabs available for the forum/channel pages
 */
export const ForumFabs: Component<FrontPageFabsProps> = (props) => {
  const anonymous = useStore($isAnonymous);

  return !anonymous() ? (
    <Portal mount={document.querySelector('#fab-tray') || document.body}>
      <CreateThreadFab channel={props.channel} />
    </Portal>
  ) : null;
};
