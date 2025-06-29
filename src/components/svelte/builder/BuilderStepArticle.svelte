<script lang="ts">
import type { CharacterBuilderStep } from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';
import BuilderFeaturesList from './BuilderFeaturesList.svelte';
import { builder, setSteps } from './builderStore';

interface Props {
  index: number;
  step: CharacterBuilderStep;
  onAscend?: (index: number) => void;
  onDescend?: (index: number) => void;
  onDelete: (index: number) => void;
}

const { index, step, onDelete, onAscend, onDescend }: Props = $props();
let mode = $state('view');
let showSteps = $state(false);

const isLast = $derived(index === ($builder?.steps.length ?? 0) - 1);
const isFirst = $derived(index === 0);

function setMode(m: 'view' | 'edit') {
  mode = m;
}

function toggleSteps() {
  showSteps = !showSteps;
}

function handleSave() {
  if (mode === 'edit') {
    setMode('view');
  }
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  // Update the step in the builder
  const updatedSteps = [...currentBuilder.steps];
  updatedSteps[index] = step;
  setSteps(updatedSteps);
}
</script>

<article class="builder-step elevation-1 p-2 border-radius full-width">
  <!-- top toolbar: index, (ascend), (descend), (edit), (remove)-->
  <div class="toolbar px-0 mx-0 border-b">
    <h4>{index + 1}. {step.name}</h4>
    <div class="grow"></div>
    <button class="text" 
      disabled={isFirst}
    onclick={() => onAscend?.(index)} aria-label={t('characters:builder.editor.steps.ascend')}>
      <cn-icon noun="arrow-up"></cn-icon>
    </button>
    <button class="text" 
      disabled={isLast}
    onclick={() => onDescend?.(index)} aria-label={t('characters:builder.editor.steps.descend')}>
      <cn-icon noun="arrow-down"></cn-icon>
    </button>
    {#if mode === 'view'}
      <button class="text" onclick={() => setMode('edit')} aria-label={t('characters:builder.editor.steps.edit')}>
        <cn-icon noun='edit'></cn-icon>
      </button>
    {/if}
    <button class="text" onclick={() => onDelete(index)} aria-label={t('characters:builder.editor.steps.remove')}>
      <cn-icon noun="delete"></cn-icon>
    </button>
  </div>

  <!-- View mode -->
  {#if mode === 'view'}
    <p class="downscaled">{step.description}</p>

    <div class="toolbar">
    <p class="text-caption text-low">
      Min: {step.min} | Max: {step.max} | Type: {step.key}
    </p>
    <button class="text" onclick={() => toggleSteps()} aria-label={t('characters:builder.editor.steps.toggleFeatures')}>
      <cn-icon noun="chevron-left" class:rotate-90={showSteps} class:rotate-270={!showSteps}></cn-icon>
    </button>
    </div>
    <div class:hidden={!showSteps} class="features-list">
      <!-- Features List -->
      <BuilderFeaturesList stepIndex={index} features={step.features} />
    </div>
  {/if}


  <!-- Edit mode -->
  {#if mode === 'edit'}
    <label>
      {t('characters:builder.fields.name')}
      <input type="text" bind:value={step.name} placeholder={t('characters:builder.fields.namePlaceholder')} required />
    </label>
    <label>
      {t('characters:builder.fields.description')}
      <textarea bind:value={step.description} placeholder={t('characters:builder.fields.descriptionPlaceholder')}></textarea>
    </label>

    <div class="flex flex-no-wrap">
      <label>
        Min
        <input type="number" bind:value={step.min} min="0" required />
      </label>
      <label>
        Max
        <input type="number" bind:value={step.max} min="0" required />
      </label>
    </div>

    <div class="toolbar">
      <button class="text" onclick={() => handleSave()} aria-label={t('characters:builder.editor.steps.save')}>
        <cn-icon noun='save'></cn-icon>
      </button>
    </div>
  {/if}
</article>
