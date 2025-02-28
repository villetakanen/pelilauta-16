<script lang="ts">
import type { Reply } from '@schemas/ReplySchema';
import { uid } from '@stores/session';
import AvatarLink from '@svelte/app/AvatarLink.svelte';
import ProfileLink from '@svelte/app/ProfileLink.svelte';

interface Props {
  reply: Reply;
}
const { reply }: Props = $props();
const fromUser = $derived.by(() => {
  return reply.owners[0] === $uid;
});
</script>
<article  class="flex flex-no-wrap">
  {#if !fromUser}
    <div class="sm-hidden">
      <AvatarLink uid={reply.owners[0]} />
    </div>
  {/if}

  <cn-bubble reply={fromUser || undefined} class="grow">
    <div class="toolbar downscaled" style="margin-top: -16px; gap: var(--cn-grid)">
      <p class="grow">
        <ProfileLink uid={reply.owners[0]} />
      </p>
      <cn-reaction-button
        noun="love"
        small
        count={reply.lovesCount}
      ></cn-reaction-button>
      <button
            type="button"
    
          >
            <cn-icon xsmall noun="quote" />
          </button>
          <button
          type="button"
  
        >
          <cn-icon xsmall noun="fork" />
        </button>
    </div>


    {reply.markdownContent}
  </cn-bubble>
    
  {#if fromUser}
    <div class="sm-hidden">
      <AvatarLink uid={reply.owners[0]} />
    </div>
  {/if}
</article>