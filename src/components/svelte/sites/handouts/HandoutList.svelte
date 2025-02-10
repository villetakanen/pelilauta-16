<script lang="ts">
import { handouts } from '@stores/site/handouts';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import { toDisplayString } from '@utils/contentHelpers';
</script>

<section class="surface p-2">

  {#if $handouts.length === 0}
    <p>No handouts available.</p>
  {:else}
    
      {#each $handouts as handout}
      <div class="flex justify-between">
        <p class="grow">
          <a href={`/sites/${handout.siteKey}/handouts/${handout.key}`}>{handout.title}</a>
        </p>
        <p>
          {#each handout?.readers || [] as reader}
            <span style="padding-left: var(--cn-grid)"><ProfileLink uid={reader} /></span>
          {/each}
        </p>
        <p> {toDisplayString(handout.flowTime)}
        </p>
      </div>
        {/each}
    {/if}
</section>

