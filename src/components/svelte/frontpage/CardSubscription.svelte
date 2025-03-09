<script lang="ts">
import type { CnCard } from '@11thdeg/cyan-next';
import type { Thread } from '@schemas/ThreadSchema';
import { hasSeen } from '@stores/subscription';

interface Props {
  thread: Thread;
}
const { thread }: Props = $props();

$effect(() => {
  const element = document.getElementById(
    `thread-card-${thread.key}`,
  ) as CnCard;
  if ($hasSeen(thread.key, thread.flowTime)) {
    element.notify = false;
    return;
  }
  element.notify = true;
});
</script>