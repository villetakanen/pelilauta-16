<script lang="ts">
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import {
  characterSheet,
  compiledCharacterSheet,
  featuresList,
  resetFeatures,
} from '@stores/characters/sheetStore';
import { logDebug } from '@utils/logHelpers';
import { onMount } from 'svelte';
import CharacterSheetArticle from '../CharacterSheetArticle.svelte';
import BuilderStep from './BuilderStep.svelte';
import CharacterBuilderMetaForm from './CharacterBuilderMetaForm.svelte';

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

// Computed properties
const currentStepData = $derived.by(() => {
  if (!builder.steps || currentStep >= builder.steps.length) return null;
  return builder.steps[currentStep];
});

const isFirstStep = $derived(currentStep === 0);
const isLastStep = $derived(currentStep >= (builder.steps?.length || 0) - 1);
const canProceed = $derived.by(() => {
  if (!currentStepData) return false;

  const stepKey = currentStepData.key;
  const selections = stepSelections.get(stepKey) || [];
  const minRequired = currentStepData.min || 1;

  return selections.length >= minRequired;
});

// Step navigation
function nextStep() {
  if (!canProceed || isLastStep) return;

  currentStep++;
  logDebug('CharacterBuilderApp', 'Advanced to step:', currentStep);
}

function previousStep() {
  if (isFirstStep) return;
  currentStep--;
  logDebug('CharacterBuilderApp', 'Went back to step:', currentStep);
}

// Feature selection handling
function toggleFeatureSelection(featureKey: string) {
  if (!currentStepData) return;

  const stepKey = currentStepData.key;
  const currentSelections = stepSelections.get(stepKey) || [];
  const maxSelections = currentStepData.max || 1;

  if (currentSelections.includes(featureKey)) {
    // Remove selection
    const newSelections = currentSelections.filter((key) => key !== featureKey);
    stepSelections.set(stepKey, newSelections);
  } else {
    // Add selection (respect max limit)
    if (currentSelections.length >= maxSelections) {
      // If at max, replace the last selection (for max=1) or don't add (for max>1)
      if (maxSelections === 1) {
        stepSelections.set(stepKey, [featureKey]);
      }
    } else {
      stepSelections.set(stepKey, [...currentSelections, featureKey]);
    }
  }

  // Trigger reactivity
  stepSelections = new Map(stepSelections);
}

function isFeatureSelected(featureKey: string): boolean {
  if (!currentStepData) return false;
  const stepKey = currentStepData.key;
  const selections = stepSelections.get(stepKey) || [];
  return selections.includes(featureKey);
}
</script>

<div class="content-columns">
  <!-- Character Name Input -->
  <section class="builder-state column flex flex-col">
    <CharacterBuilderMetaForm />
    <BuilderStep
      builder={builder}
      step={currentStep}
    />
  </section>
  <CharacterSheetArticle />
  
  {#if currentStepData}
    <div class="surface p-2 mb-2">
      <div class="flex items-center justify-between mb-2">
        <h2 class="downscaled">
          {currentStepData.name}
          <span class="text-caption ml-2">
            Step {currentStep + 1} of {builder.steps?.length || 0}
          </span>
        </h2>
        
        <div class="flex items-center gap-1">
          {#each Array(builder.steps?.length || 0) as _, index}
            <div 
              class="w-2 h-2 rounded-full {index <= currentStep ? 'bg-primary' : 'bg-surface-3'}"
            ></div>
          {/each}
        </div>
      </div>
      
      {#if currentStepData.description}
        <p class="text-small mb-2">{currentStepData.description}</p>
      {/if}
      
      <div class="flex items-center gap-2 text-caption">
        <span>Select {currentStepData.min || 1}</span>
        {#if (currentStepData.max || 1) > (currentStepData.min || 1)}
          <span>to {currentStepData.max} features</span>
        {:else}
          <span>feature{(currentStepData.min || 1) !== 1 ? 's' : ''}</span>
        {/if}
      </div>
    </div>

    <!-- Feature Selection -->
    {#if currentStepData.features && currentStepData.features.length > 0}
      <div class="features-grid mb-4">
        {#each currentStepData.features as feature}
          <button
            class="feature-card surface p-2 text-left {isFeatureSelected(feature.key) ? 'selected' : ''}"
            onclick={() => toggleFeatureSelection(feature.key)}
          >
            <h3 class="text-small font-medium mb-1">{feature.name}</h3>
            {#if feature.description}
              <p class="text-caption">{feature.description}</p>
            {/if}
            {#if feature.modifiers && feature.modifiers.length > 0}
              <div class="mt-1">
                {#each feature.modifiers as modifier}
                  <div class="text-caption">
                    {#if modifier.type === 'STAT_BONUS' && modifier.target && modifier.value}
                      +{modifier.value} to {modifier.target}
                    {:else if modifier.title}
                      {modifier.title}
                    {/if}
                  </div>
                {/each}
              </div>
            {/if}
          </button>
        {/each}
      </div>
    {:else}
      <div class="surface p-2 mb-4">
        <p class="text-small">No features available for this step.</p>
      </div>
    {/if}

    <!-- Navigation -->
    <div class="toolbar">
      <button 
        class="button" 
        onclick={previousStep}
        disabled={isFirstStep}
      >
        Previous
      </button>
      
      <div class="flex-1"></div>
      
      {#if isLastStep}
        <button 
          class="button primary" 
          disabled={!canProceed}
        >
          Complete Character
        </button>
      {:else}
        <button 
          class="button primary" 
          onclick={nextStep}
          disabled={!canProceed}
        >
          Next Step
        </button>
      {/if}
    </div>
  {:else}
    <div class="surface p-2 error">
      <h2>No Steps Available</h2>
      <p>This character builder doesn't have any steps configured.</p>
    </div>
  {/if}
</div>

