<script lang="ts">
import type { Thread } from '@schemas/ThreadSchema';
import { uid } from '@stores/session';
import { profile } from '@stores/session/profile';
import { loveThread, unloveThread } from '@stores/threadsStore/reactions';

interface Props {
  thread: Thread;
}
const { thread }: Props = $props();
const loves = $derived.by(
  () => $profile?.lovedThreads?.includes(thread.key) ?? false,
);
const count = $derived.by(() => thread?.lovedCount ?? 0);

function toggleLove() {
  if (loves) {
    loveThread($uid, thread.key);
  } else {
    unloveThread($uid, thread.key);
  }
}
</script>

<cn-reaction-button
  onClick={toggleLove}
  onKeyUp={(e: Event) => (e as KeyboardEvent).key === 'Enter' && toggleLove()}
  disabled={!$uid || undefined}
  {count}
  checked={loves}
  noun="love"
></cn-reaction-button>