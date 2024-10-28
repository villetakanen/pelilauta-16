/**
 * This is a solid-js wrapper component for the thread actions.
 *
 * These actions are visible only for the thread owner.
 */

import { useStore } from '@nanostores/solid';
import type { Thread } from '@schemas/ThreadSchema';
import { $uid } from '@stores/sessionStore';
import type { Component } from 'solid-js';

export const ThreadActions: Component<{ thread?: Thread }> = (props) => {
  const uid = useStore($uid);
  const owns = () => props.thread?.owners.includes(uid());

  return owns() ? (
    <section class="flex flex-col border-t p-2 mt-2">
      <h4 class="downscaled m-0">Toiminnot</h4>
      <a
        href={`/threads/${props.thread?.key}/edit`}
        class="button text-center text"
      >
        Muokkaa
      </a>
      <a
        href={`/threads/${props.thread?.key}/confirmDelete`}
        class="button text-center text"
      >
        Poista
      </a>
    </section>
  ) : null;
};
