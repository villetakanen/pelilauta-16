<script lang="ts">
import type { Clock } from '@schemas/ClockSchema';
import { uid } from '@stores/sessionStore';
import { site } from './siteStore';

interface Props {
  clock: Clock;
}
const { clock }: Props = $props();

const view = $derived.by(() => !$site?.owners.includes($uid) || undefined) ;

</script>

<div class="flex align-center flex-no-wrap">
  <cn-story-clock 
    {view}
    tabindex="0"
    role="button"
    name={clock.label} 
    value={clock.stage} 
    >
    {#each clock.ticks as tick}
      <cn-tick size={tick}></cn-tick>
    {/each}
  </cn-story-clock>
  <p>{clock.label} {view}<br>
  <code>clock:{clock.key}</code></p>
</div>