<script lang="ts">
import type { CharacterBuilderStep } from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';
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

const isLast = $derived(index === ($builder?.steps.length ?? 0) - 1);
const isFirst = $derived(index === 0);

function setMode(m: 'view' | 'edit') {
  mode = m;
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

<article class="builder-step elevation-1 p-1 border-radius full-width">
  <!-- top toolbar: index, (ascend), (descend), (edit), (remove)-->
  <div class="toolbar">
    <h4>{index + 1}</h4>
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
    <h4 class="m-0">{step.name}</h4>
    <div class="step-description">{step.description}</div>
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
    <div class="toolbar">
      <button class="text" onclick={() => handleSave()} aria-label={t('characters:builder.editor.steps.save')}>
        <cn-icon noun='save'></cn-icon>
      </button>
    </div>
  {/if}

  <div>{mode}</div>
</article>
