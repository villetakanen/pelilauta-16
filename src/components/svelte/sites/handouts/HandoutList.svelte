<script lang="ts">
import { handouts } from '@stores/site/handouts';
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
        <p> {toDisplayString(handout.flowTime)}
        </p>
      </div>
        {/each}
    {/if}
</section>

