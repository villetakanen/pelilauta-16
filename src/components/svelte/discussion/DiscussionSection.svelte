<script lang="ts">
import type { Reply } from '@schemas/ReplySchema';
import ReplyArticle from './ReplyArticle.svelte';

interface Props {
  discussion: Reply[];
}
const { discussion: initDiscussion }: Props = $props();
</script>
<div class="content-columns">
  <section class="flex flex-col column-l" style="gap:var(--cn-grid)">
    {#each initDiscussion as reply}
      <ReplyArticle {reply} />
    {/each}
  </section>
</div>