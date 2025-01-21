<script lang="ts">
import { parseClock } from '@schemas/ClockSchema';
import { t } from '@utils/i18n';
import { uid } from '@stores/sessionStore';
/**
 * A Simple form to create a new clock
 * 
 * Clock labels are unique per site, so we'll need to mekanismiURI the label
 * and then check if it's unique before submitting the form
 */

function handleSubmit(event: Event) {
  event.preventDefault();
}
function addTick() {
  clock.ticks.push(1);
}
function increaseTick(i: number) {
  clock.ticks[i] += 1;
}
function decreaseTick(i: number) {
  if (clock.ticks[i] > 1) clock.ticks[i] -= 1;
}
const clock = $state(parseClock({
  ticks: [1, 1],
  owners: [$uid],
}));
</script>

<div class="content-columns">
    <cn-story-clock name={clock.label} value={0}>
      {#each clock.ticks as tick}
        <cn-tick size={tick}></cn-tick>
      {/each}
    </cn-story-clock>

  <form onsubmit={handleSubmit}>
    <h4>TICKS</h4>

    {#each clock.ticks as tick, i}
      <p>{tick}, {i} 
        <button type="button" class="text" onclick={() => increaseTick(i)}
            aria-label={t('actions:increase.tick')}>
          <cn-icon noun="add" small></cn-icon>
        </button>
        <button type="button" class="text" onclick={() => decreaseTick(i)}
            aria-label={t('actions:decrease.tick')}>
          <cn-icon noun="subtract" small></cn-icon>
        </button>
      </p>
    {/each}

    <hr>
    <button onclick={addTick}>
        <cn-icon noun="add" small></cn-icon>
        <span>{t('actions:create.tick')}</span>
    </button>
  </form>
</div>