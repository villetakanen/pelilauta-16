<script lang="ts">
import type { Reply } from '@schemas/ReplySchema';
import type { Thread } from '@schemas/ThreadSchema';
import ReplyArticle from './ReplyArticle.svelte';
import ReplyDialog from './ReplyDialog.svelte';

interface Props {
  thread: Thread;
  discussion: Reply[];
}
const { discussion: initDiscussion, thread }: Props = $props();
</script>
<div class="content-columns">
  <section class="flex flex-col column-l" style="gap:var(--cn-grid)">
    {#each initDiscussion as reply}
      <ReplyArticle {reply} />
    {/each}
    <ReplyDialog {thread}/>
  </section>
</div>