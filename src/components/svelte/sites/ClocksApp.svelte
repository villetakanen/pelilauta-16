<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import StoryClock from './Clock.svelte';
import { clocks } from './clocksStore';
import { site } from './siteStore';

interface Props {
  site: Site;
}
const { site: initialSite }: Props = $props();
$site = initialSite;
</script>

<div class="content-columns">
  <article class="column-l">
    <h2>Clocks</h2>
    <ul>
      {#each $clocks as clock}
        <StoryClock {clock} />
      {/each}
    </ul>
  </article>
</div>