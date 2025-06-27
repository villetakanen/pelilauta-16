<script lang="ts">
import { updateBuilder } from '@firebase/client/builders';
import { CharacterBuilderStepSchema } from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';
import BuilderStepArticle from './BuilderStepArticle.svelte';
import { builder } from './builderStore';

function addStep() {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const emptyStep = CharacterBuilderStepSchema.parse({
    name: `STEP ${$builder.steps.length + 1}`, // Auto-increment step name
    description: '...',
  });

  builder.set({
    ...currentBuilder,
    steps: [...currentBuilder.steps, emptyStep],
  });

  updateBuilder(
    {
      key: currentBuilder.key,
      steps: [...currentBuilder.steps, emptyStep],
    },
    false,
  ); // Not silent - this is a user action
}

function ascendStep(index: number) {
  const currentBuilder = $builder;
  if (!currentBuilder || index <= 0) return;

  const updatedSteps = [...currentBuilder.steps];
  const [movedStep] = updatedSteps.splice(index, 1);
  updatedSteps.splice(index - 1, 0, movedStep);

  builder.set({
    ...currentBuilder,
    steps: updatedSteps,
  });
}

function descendStep(index: number) {
  const currentBuilder = $builder;
  if (!currentBuilder || index >= currentBuilder.steps.length - 1) return;

  const updatedSteps = [...currentBuilder.steps];
  const [movedStep] = updatedSteps.splice(index, 1);
  updatedSteps.splice(index + 1, 0, movedStep);

  builder.set({
    ...currentBuilder,
    steps: updatedSteps,
  });
}

function removeStep(index: number) {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const updatedSteps = [...currentBuilder.steps];
  updatedSteps.splice(index, 1);

  builder.set({
    ...currentBuilder,
    steps: updatedSteps,
  });
}
</script>
{#if $builder}
<section>
  <h2 class="m-0">
    {t('characters:builder.editor.steps.title')}
  </h2>
  <div class="flex flex-column">
    {#each $builder.steps as step, index}
      <BuilderStepArticle
        index={index}
        step={step}
        onAscend={() => ascendStep(index)}
        onDescend={() => descendStep(index)}
        onDelete={() => removeStep(index)}
      />
    {/each}
    <div class="toolbar items-center">
      <button class="text" onclick={addStep}>
        <cn-icon noun="add"></cn-icon>
        <span>{t('characters:builder.editor.steps.add')}</span>
      </button>
    </div>
  </div>
</section>
{/if}