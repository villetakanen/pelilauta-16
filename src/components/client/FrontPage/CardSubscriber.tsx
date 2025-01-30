import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { $subscriber, $uid } from '@stores/session';
import { type Component, createEffect } from 'solid-js';

interface CardSubscriberProps {
  thread: Thread;
}

export const CardSubscriber: Component<CardSubscriberProps> = (props) => {
  const uid = useStore($uid);
  const subscriber = useStore($subscriber);

  createEffect(() => {
    if (uid()) {
      const hasSeenAt =
        subscriber().seenEntities[props.thread.key] || subscriber().allSeenAt;

      if (hasSeenAt && props.thread.flowTime > hasSeenAt) {
        const parentCard = document.querySelector(
          `#thread-card-${props.thread.key}`,
        );
        if (parentCard) parentCard.setAttribute('notify', 'true');
      }
    }
  });

  return null;
};
