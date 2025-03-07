<script lang="ts">
import { type Channel, parseChannel } from '@schemas/ChannelSchema';
import { onMount } from 'svelte';
import ChannelSettings from './ChannelSettings.svelte';
let channels: Channel[] = $state([]);
const topics = $derived.by(() => {
  const t = new Set<string>();
  for (const channel of channels) {
    t.add(channel.category ?? '-');
  }
  return Array.from(t);
});

onMount(async () => {
  const { db } = await import('@firebase/client');
  const { doc, onSnapshot } = await import('firebase/firestore');
  const channelsRef = doc(db, 'meta', 'threads');
  onSnapshot(channelsRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      if (data) {
        channels = data.topics.map(parseChannel);
      }
    } else {
      channels = [];
    }
  });
});

function filterChannels(topic: string) {
  return channels.filter((channel) => channel.category === topic);
}
</script>

<div class="content-columns">
  <section class="column-l">
    <h1>Channels</h1>
    {#if channels.length === 0}
      <p>No channels found</p>
    {:else}
      {#each topics as topic}
        <h2>{topic}</h2>
        {#each filterChannels(topic) as channel}
          <ChannelSettings {channel} />
        {/each}
      {/each}
    {/if}
  </section>
</div>