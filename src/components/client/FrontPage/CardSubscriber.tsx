import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { $subscriber, $uid } from '@stores/sessionStore';
import { type Component, createEffect } from 'solid-js';

interface CardSubscriberProps {
  thread: Thread;
}

export const CardSubscriber: Component<CardSubscriberProps> = (props) => {
  const uid = useStore($uid);
  const subscriber = useStore($subscriber);

  createEffect(() => {
    if (uid()) {
      if (subscriber().seenEntities[props.thread.key] < props.thread.flowTime) {
        const parentCard = document.querySelector(
          `#thread-card-${props.thread.key}`,
        );
        if (parentCard) parentCard.setAttribute('notify', 'true');
      }
    }
  });

  return null;
};
