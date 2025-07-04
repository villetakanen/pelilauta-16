<script lang="ts">
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import { stepsArray } from '@stores/characters/sheetStore';

export interface Props {
  builder: CharacterBuilder;
  step: number;
}
const { step: stepKey, builder }: Props = $props();

const chosenFeatures = $derived($stepsArray[stepKey] || []);
const stepName = $derived.by(() => {
  const step = builder.steps[stepKey];
  const name = step?.name || '#';
  return `${stepKey + 1}. ${name}`;
});
</script>

<div class="surface border-b p-2">
  <h3 class="text-caption">{stepName}</h3>
  {#each chosenFeatures as feature}
    <h4 class="text-body m-0">
      <strong>
        {feature.name || feature.key || 'Unnamed Feature'}
      </strong>
    </h4>
    <p class="m-0 text-caption text-low">
      {feature.description || 'No description available.'}
    </p>
  {/each}
  </div>

  