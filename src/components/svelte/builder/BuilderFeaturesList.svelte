<script lang="ts">
import type { CharacterFeature } from '@schemas/CharacterBuilderSchema';
import { CharacterFeatureSchema } from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';
import BuilderFeatureItem from './BuilderFeatureItem.svelte';
import { builder, setSteps } from './builderStore';

interface Props {
  stepIndex: number;
  features: CharacterFeature[];
}

const { stepIndex, features }: Props = $props();

function addFeature() {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const newFeature = CharacterFeatureSchema.parse({
    key: `feature-${Date.now()}`,
    characterBuilderKey: currentBuilder.key,
    name: t('characters:builder.editor.features.defaultName'),
    modifiers: [],
  });

  const updatedSteps = [...currentBuilder.steps];
  const step = updatedSteps[stepIndex];
  if (step) {
    step.features = [...step.features, newFeature];
    setSteps(updatedSteps);
  }
}

function updateFeature(featureIndex: number, updatedFeature: CharacterFeature) {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const updatedSteps = [...currentBuilder.steps];
  const step = updatedSteps[stepIndex];
  if (step) {
    step.features[featureIndex] = updatedFeature;
    setSteps(updatedSteps);
  }
}

function removeFeature(featureIndex: number) {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const updatedSteps = [...currentBuilder.steps];
  const step = updatedSteps[stepIndex];
  if (step) {
    step.features.splice(featureIndex, 1);
    setSteps(updatedSteps);
  }
}

function moveFeatureUp(featureIndex: number) {
  if (featureIndex <= 0) return;

  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const updatedSteps = [...currentBuilder.steps];
  const step = updatedSteps[stepIndex];
  if (step) {
    const features = [...step.features];
    [features[featureIndex - 1], features[featureIndex]] = [
      features[featureIndex],
      features[featureIndex - 1],
    ];
    step.features = features;
    setSteps(updatedSteps);
  }
}

function moveFeatureDown(featureIndex: number) {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const updatedSteps = [...currentBuilder.steps];
  const step = updatedSteps[stepIndex];
  if (!step || featureIndex >= step.features.length - 1) return;

  const features = [...step.features];
  [features[featureIndex], features[featureIndex + 1]] = [
    features[featureIndex + 1],
    features[featureIndex],
  ];
  step.features = features;
  setSteps(updatedSteps);
}
</script>
{#if $builder}
{#if features.length === 0}
  <div class="flex flex-no-wrap border border-radius p-2">
    <cn-icon noun="fox" class="flex-none"></cn-icon>
    <p class="downscaled low-empasis m-0">
      {t('characters:builder.editor.features.empty')}
    </p>
  </div>
{:else}
<h4 class="downscaled">
  {t('characters:builder.editor.features.title')} 
  {#if $builder.steps[stepIndex].min !== $builder.steps[stepIndex]?.max}
    {$builder.steps[stepIndex].min} ... {$builder.steps[stepIndex].max}
  {:else}
    {$builder.steps[stepIndex].min}
  {/if}
  / {$builder.steps[stepIndex].features.length}
</h4>

<div class="flex flex-column">
  {#each features as feature, index}
    <BuilderFeatureItem
      {feature}
      index={index}
      isFirst={index === 0}
      isLast={index === features.length - 1}
      onUpdate={(updatedFeature) => updateFeature(index, updatedFeature)}
      onRemove={() => removeFeature(index)}
      onMoveUp={() => moveFeatureUp(index)}
      onMoveDown={() => moveFeatureDown(index)}
    />
  {/each}
</div>

{/if}

<div class="toolbar items-center">
  <button class="text" onclick={addFeature}>
    <cn-icon noun="add"></cn-icon>
    <span>{t('actions:add')}</span>
  </button>
</div>

{/if}

