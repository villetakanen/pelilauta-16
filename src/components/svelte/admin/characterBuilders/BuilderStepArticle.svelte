<script lang="ts">
import {
  type CharacterBuilderStep,
  PrerequisiteSchema,
  STEP_TYPES,
} from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';
import { v4 as uuidv4 } from 'uuid';
import BuilderFeaturesList from '../../builder/BuilderFeaturesList.svelte';
import { builder, setSteps } from '../../builder/builderStore';

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

if (!step.key) {
  step.key = uuidv4();
}

const isLast = $derived(index === ($builder?.steps.length ?? 0) - 1);
const isFirst = $derived(index === 0);

const precedingSteps = $derived(
  $builder?.steps
    .slice(0, index)
    .filter((s) => s.key && s.features.length > 0) ?? [],
);

const prerequisiteStep = $derived(
  precedingSteps.find((s) => s.key === step.prerequisite?.stepKey),
);

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

function handlePrerequisiteStepChange(e: Event) {
  const target = e.target as HTMLSelectElement;
  const stepKey = target.value;
  if (stepKey) {
    step.prerequisite = { stepKey, featureKey: '' };
  } else {
    step.prerequisite = undefined;
  }
}
</script>
{#if $builder}
<article class="elevation-1 p-2 border-radius full-width">
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

    {#if step.prerequisite}
      <p class="text-caption text-low">
        Prerequisite: step
        {$builder.steps.findIndex((s) => s.key === step.prerequisite?.stepKey) +
          1}
        -
        {$builder.steps
          .find((s) => s.key === step.prerequisite?.stepKey)
          ?.features.find((f) => f.key === step.prerequisite?.featureKey)?.name}
      </p>
    {/if}

    <div class="toolbar">
    <p class="text-caption text-low">
      Min: {step.min} | Max: {step.max} | Type: {step.type || 'select'} | Count: {step.features.length}
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
    <fieldset>
    <label>
      {t('characters:builder.fields.name')}
      <input type="text" bind:value={step.name} placeholder={t('characters:builder.fields.namePlaceholder')} required />
    </label>
    <label>
      {t('characters:builder.fields.description')}
      <textarea bind:value={step.description} placeholder={t('characters:builder.fields.descriptionPlaceholder')}></textarea>
    </label>

    <label>
      {t('characters:builder.fields.type')}
      <select bind:value={step.type} class="full-width">
        {#each STEP_TYPES as type}
          <option value={type}>{t(`characters:builder.step.types.${type}`)}</option>
        {/each}
      </select>
    </label>

    <h4 class="downscaled mb-0 border-b">
      {t('characters:builder.editor.prerequisites.title')}
    </h4>
    <p class="text-caption text-low">
      {t('characters:builder.editor.prerequisites.description')}
    </p>
    <div class="flex flex-no-wrap">
      <label class="full-width">
        {t('characters:builder.editor.prerequisites.step')}
        <select
          class="full-width"
          onchange={handlePrerequisiteStepChange}
          value={step.prerequisite?.stepKey || ''}
        >
          <option value="">{t('characters:builder.editor.prerequisites.none')}</option>
          {#each precedingSteps as precedingStep}
            <option value={precedingStep.key}>
              {$builder.steps.findIndex((s) => s.key === precedingStep.key) + 1}. {precedingStep.name}
            </option>
          {/each}
        </select>
      </label>
      {#if step.prerequisite?.stepKey && prerequisiteStep}
        <label class="full-width">
          {t('characters:builder.editor.prerequisites.feature')}
          <select bind:value={step.prerequisite.featureKey} class="full-width">
            <option value=""
              >{t('characters:builder.editor.prerequisites.selectFeature')}</option
            >
            {#each prerequisiteStep.features as feature}
              <option value={feature.key}>{feature.name}</option>
            {/each}
          </select>
        </label>
      {/if}
    </div>

    {#if step.type === 'SELECT'}
      
    <h4 class="downscaled mb-0 border-b">
      {t('characters:builder.step.types.SELECT')}
    </h4>
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

    {/if}

    <div class="toolbar justify-end">
      <button class="text" onclick={() => handleSave()} aria-label={t('characters:builder.editor.steps.save')}>
        <cn-icon noun='save'></cn-icon>
        <span>{t('actions:save')}</span>
      </button>
    </div>
    </fieldset>
  {/if}
</article>
{/if}