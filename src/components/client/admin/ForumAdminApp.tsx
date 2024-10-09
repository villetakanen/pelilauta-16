/**
 * A Solid-js micro-frontend for the admin section of the forum.
 */

import { WithAuth } from '@client/shared/WithAuth';
import { db } from '@firebase/client';
import { useStore } from '@nanostores/solid';
import { type Channel, parseChannel } from '@schemas/ChannelSchema';
import { isAdmin } from '@stores/metaStore/metaStore';
import { $uid } from '@stores/sessionStore';
import { logDebug, logWarn } from '@utils/logHelpers';
import { doc, getDoc, onSnapshot } from 'firebase/firestore';
import {
  type Component,
  For,
  createResource,
  createSignal,
  onMount,
} from 'solid-js';
import { ForumAdminChannelItem } from './ForumAdminChannelItem';

export const ForumAdminApp: Component = () => {
  const uid = useStore($uid);
  const visible = () => isAdmin(uid());

  const [channels, setChannels] = createSignal<Channel[]>([]);

  // We want to list each distinct channel.category value once
  const categories = () => {
    const cats = channels().map((channel) => channel.category);
    return [...new Set(cats)];
  };

  const categoryChannels = (category: string) => {
    return channels().filter((channel) => channel.category === category);
  };

  onMount(async () => {
    const channelsRef = doc(db, 'meta', 'threads');
    onSnapshot(channelsRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data();
        logDebug('Channels snapshot', { data });
        if (data) {
          setChannels(data.topics.map(parseChannel));
        }
      }
    });
  });

  return (
    <WithAuth allow={visible()}>
      <div class="content-columns">
        <article class="column-l">
          <h1 class="downscaled">Channels Admin</h1>

          <For each={categories()}>
            {(category) => (
              <>
                <h4>{category}</h4>
                <For each={categoryChannels(`${category}`)}>
                  {(channel) => <ForumAdminChannelItem channel={channel} />}
                </For>
              </>
            )}
          </For>
        </article>
      </div>
    </WithAuth>
  );
};
