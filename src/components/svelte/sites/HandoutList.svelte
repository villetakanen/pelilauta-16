<script lang="ts">
import { handouts } from '@stores/site/handouts';
import { toDisplayString } from '@utils/contentHelpers';
</script>

<section class="surface p-1">

  {#if $handouts.length === 0}
    <p>No handouts available.</p>
  {:else}
    <ul>
      {#each $handouts as handout}
        <li>
          <a href={handout.key}>{handout.title}</a> - {toDisplayString(handout.flowTime)}
        </li>
        {/each}
    </ul>
    {/if}


  <p>{JSON.stringify($handouts)}</p>
</section>

