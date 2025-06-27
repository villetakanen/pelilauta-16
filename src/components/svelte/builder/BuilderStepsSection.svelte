<script lang="ts">
import { CharacterBuilderStepSchema } from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';
import BuilderStepArticle from './BuilderStepArticle.svelte';
import { builder, setSteps } from './builderStore';



function addStep() {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const emptyStep = CharacterBuilderStepSchema.parse({
    name: `STEP ${currentBuilder.steps.length + 1}`, // Auto-increment step name
    description: '...',
  });

  setSteps([...currentBuilder.steps, emptyStep]);
}

function ascendStep(index: number) {
  const currentBuilder = $builder;
  if (!currentBuilder || index <= 0) return;

  const updatedSteps = [...currentBuilder.steps];
  const [movedStep] = updatedSteps.splice(index, 1);
  updatedSteps.splice(index - 1, 0, movedStep);

  setSteps(updatedSteps);
}

function descendStep(index: number) {
  const currentBuilder = $builder;
  if (!currentBuilder || index >= currentBuilder.steps.length - 1) return;

  const updatedSteps = [...currentBuilder.steps];
  const [movedStep] = updatedSteps.splice(index, 1);
  updatedSteps.splice(index + 1, 0, movedStep);

  setSteps(updatedSteps);
}

function removeStep(index: number) {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const updatedSteps = [...currentBuilder.steps];
  updatedSteps.splice(index, 1);

  setSteps(updatedSteps);
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