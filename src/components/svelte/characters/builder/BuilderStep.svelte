<script lang="ts">
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import { updateStep } from '@stores/characters/sheetStore';
import { t } from '@utils/i18n';

export interface Props {
  builder: CharacterBuilder;
  step: number;
}

const { builder, step: stepKey }: Props = $props();

// The keys of the features selected in this step
let chosenFeatures = $state<string[]>([]);

const step = $derived.by(() => {
  const step = builder.steps[stepKey];
  if (!step) {
    throw new Error(`Step "${stepKey}" not found in builder.`);
  }
  return step;
});

// Currently only supports selecting a feature
function selectFeature(featureKey: string) {
  if (!step) {
    console.warn('No step selected to add features to.');
    return;
  }

  // @todo: implement logic to handle cases where user can select
  // multiple features or selection has a minimum/maximum set of
  // features.
  chosenFeatures = [featureKey];

  const feature = step.features.find((f) => f.key === featureKey);
  if (feature) {
    updateStep(stepKey, [feature]);
  }
}
</script>
{#if step}
<div class="surface p-2">
  <h2>{step.name}</h2>
  <p>{step.description}</p>
  <p class="downscaled text-low">
    {#if step.min !== step.max}
      {t("characters:builder.step.choose.minMax", {
        min: step.min,
        max: step.max
      })}
    {:else}
      {t("characters:builder.step.choose", { count: step.max })}
    {/if}
  </p>

  <div class="flex flex-col">
    {#each step.features as feature}
      <div 
        role="button"
        tabindex="0"
        onclick="{() => selectFeature(feature.key)}"
        onkeydown="{(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            selectFeature(feature.key);
          }
        }}"
        class:elevation-1="{chosenFeatures.includes(feature.key)}"
        class:border="{!chosenFeatures.includes(feature.key)}"
        class="border-radius p-1">
        <h4 class="downscaled">{feature.name}</h4>
        <p class="text-caption">{feature.description}</p>
      </div>
    {/each}
  </div>
</div>
{/if}

