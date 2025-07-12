<script lang="ts">
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import {
  characterSheet,
  resetFeatures,
  stepsArray,
} from '@stores/characters/sheetStore';
import { logDebug } from '@utils/logHelpers';
import { onMount } from 'svelte';
import CharacterSheetArticle from '../CharacterSheetArticle.svelte';
import BuilderHistoryStep from './BuilderHistoryStep.svelte';
import BuilderStep from './BuilderStep.svelte';
import CharacterBuilderMetaForm from './CharacterBuilderMetaForm.svelte';
import ChararterSheetDebug from './ChararterSheetDebug.svelte';
import LlssStatArrayStep from './LlssStatArrayStep.svelte';

interface Props {
  builder: CharacterBuilder;
  characterSheet: CharacterSheet | null;
}

const { builder, characterSheet: initialSheet }: Props = $props();

// Current step index in the builder
let currentStep = $state(0);

// Track selected features for each step
let stepSelections = $state<Map<string, string[]>>(new Map());

// Initialize the character sheet store when component mounts
onMount(() => {
  logDebug('CharacterBuilderApp', 'Initializing with builder:', builder.name);

  // Reset any existing features
  resetFeatures();

  // Set the character sheet in the store
  characterSheet.set(initialSheet);
});

const steptType = $derived.by(() => {
  const steps = builder.steps || [];
  return steps[currentStep]?.type || 'SELECT';
});

// Step navigation
function nextStep() {
  currentStep++;
  logDebug('CharacterBuilderApp', 'Advanced to step:', currentStep);
}

function previousStep() {
  currentStep--;
  logDebug('CharacterBuilderApp', 'Went back to step:', currentStep);
}

const historySteps = $derived.by(() => {
  if (currentStep < 1) return [];
  const steps = stepsArray.get() || [];
  return steps.slice(0, currentStep);
});
</script>

<div class="content-columns">
  <!-- Character Name Input -->
  <section class="builder-state column flex flex-col">
    <CharacterBuilderMetaForm />
    
      {#each historySteps as _historyStep, index}
        <BuilderHistoryStep 
          {builder}
          step={index} />
      {/each}
    

    <!-- Step type selector -->
    {#if steptType === 'SELECT'}
      <!-- Use default step -->
      <BuilderStep
        builder={builder}
        step={currentStep}
        onNext={nextStep}
        onPrevious={previousStep}
    />
    {:else if steptType === 'LLSS_ARRAY'}
      <LlssStatArrayStep
        builder={builder}
        step={currentStep}
        onNext={nextStep}
        onPrevious={previousStep} />
    {:else}
      <p class="caption">Erroneous step type: {steptType}</p>
    {/if}
    
  </section>
  <CharacterSheetArticle />
  <ChararterSheetDebug />
</div>

