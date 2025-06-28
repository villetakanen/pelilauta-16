<script lang="ts">
import {
  CharacterBuilderSchema,
  type CharacterBuilderStep,
  type CharacterFeature,
} from '@schemas/CharacterBuilderSchema';
import { appMeta } from '@stores/metaStore/metaStore';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { logDebug, logError } from '@utils/logHelpers';
import { onDestroy } from 'svelte';
import BuilderInfoForm from './BuilderInfoForm.svelte';
import BuilderStepsSection from './BuilderStepsSection.svelte';
import {
  builder,
  builderLoading,
  subscribeToBuilder,
  unsubscribeFromBuilder,
} from './builderStore';

interface Props {
  builderKey: string;
}
const { builderKey = 'test-builder' }: Props = $props();

const allow = $derived.by(() => $appMeta.admins.includes($uid));

let editingStep: CharacterBuilderStep | null = $state(null);
let showAddStepForm = $state(false);

$effect(() => {
  // Builder key changed, re-subscribe
  unsubscribeFromBuilder();
  subscribeToBuilder(builderKey);
});

onDestroy(() => {
  // Clean up subscription when component is destroyed
  unsubscribeFromBuilder();
});

// New step form data
let newStepForm = $state({
  key: '',
  name: '',
  description: '',
  min: 1,
  max: 1,
});

function addNewStep() {
  logDebug('BuilderEditor', 'Adding new step', newStepForm);

  const newStep: CharacterBuilderStep = {
    key: newStepForm.key || `step-${Date.now()}`,
    name: newStepForm.name,
    description: newStepForm.description,
    min: newStepForm.min,
    max: newStepForm.max,
    features: [],
  };

  const currentBuilder = $builder;
  if (currentBuilder) {
    builder.set({
      ...currentBuilder,
      steps: [...currentBuilder.steps, newStep],
    });
  }

  // Reset form
  newStepForm = { key: '', name: '', description: '', min: 1, max: 1 };
  showAddStepForm = false;
}

function removeStep(stepKey: string) {
  logDebug('BuilderEditor', 'Removing step', stepKey);
  const currentBuilder = $builder;
  if (currentBuilder) {
    builder.set({
      ...currentBuilder,
      steps: currentBuilder.steps.filter((step) => step.key !== stepKey),
    });
  }
}

function moveStepUp(index: number) {
  if (index > 0) {
    const currentBuilder = $builder;
    if (currentBuilder) {
      const steps = [...currentBuilder.steps];
      [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
      builder.set({
        ...currentBuilder,
        steps,
      });
    }
  }
}

function moveStepDown(index: number) {
  const currentBuilder = $builder;
  if (currentBuilder && index < currentBuilder.steps.length - 1) {
    const steps = [...currentBuilder.steps];
    [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
    builder.set({
      ...currentBuilder,
      steps,
    });
  }
}

function editStep(step: CharacterBuilderStep) {
  editingStep = { ...step };
}

function saveStep() {
  if (!editingStep) return;

  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const currentEditingStep = editingStep;
  const stepIndex = currentBuilder.steps.findIndex(
    (s) => s.key === currentEditingStep.key,
  );
  if (stepIndex !== -1) {
    const updatedSteps = [...currentBuilder.steps];
    updatedSteps[stepIndex] = { ...currentEditingStep };
    builder.set({
      ...currentBuilder,
      steps: updatedSteps,
    });
  }
  editingStep = null;
}

function cancelEditStep() {
  editingStep = null;
}

function addFeatureToStep(stepKey: string) {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const stepIndex = currentBuilder.steps.findIndex((s) => s.key === stepKey);
  if (stepIndex === -1) return;

  const newFeature: CharacterFeature = {
    key: `feature-${Date.now()}`,
    characterBuilderKey: currentBuilder.key,
    name: 'New Feature',
    modifiers: [],
  };

  const updatedSteps = [...currentBuilder.steps];
  updatedSteps[stepIndex] = {
    ...updatedSteps[stepIndex],
    features: [...updatedSteps[stepIndex].features, newFeature],
  };

  builder.set({
    ...currentBuilder,
    steps: updatedSteps,
  });
}

function removeFeatureFromStep(stepKey: string, featureKey: string) {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  const stepIndex = currentBuilder.steps.findIndex((s) => s.key === stepKey);
  if (stepIndex === -1) return;

  const updatedSteps = [...currentBuilder.steps];
  updatedSteps[stepIndex] = {
    ...updatedSteps[stepIndex],
    features: updatedSteps[stepIndex].features.filter(
      (f) => f.key !== featureKey,
    ),
  };

  builder.set({
    ...currentBuilder,
    steps: updatedSteps,
  });
}

function editFeature(stepKey: string, featureKey: string) {
  // TODO: Implement full feature editor modal
  logDebug('BuilderEditor', 'Edit feature clicked', { stepKey, featureKey });
}

function saveBuilder() {
  const currentBuilder = $builder;
  if (!currentBuilder) return;

  try {
    // Validate the builder before saving
    const validatedBuilder = CharacterBuilderSchema.parse(currentBuilder);
    logDebug('BuilderEditor', 'Saving builder', validatedBuilder);
    // TODO: Implement actual save functionality
    alert('Builder saved successfully!');
  } catch (error) {
    logError('BuilderEditor', 'Failed to save builder:', error);
    alert('Failed to save builder. Please check the console for errors.');
  }
}
</script>

<WithAuth {allow}>
  {#if $builderLoading}
    <div class="content-columns">
      <section class="column-l">
        <p>Loading builder...</p>
      </section>
    </div>
  {:else if $builder}
    <div class="content-columns">
    <section>
      <!-- Builder Meta Information -->
      <BuilderInfoForm />
    </section>

    <BuilderStepsSection />

    <!-- Steps Management -->
    <section class="mb-1">
      <div class="toolbar justify-space-between mb-1">
        <h2>Builder Steps</h2>
        <button class="button text" onclick={() => showAddStepForm = !showAddStepForm}>
          <cn-icon noun="add"></cn-icon>
          <span>Add Step</span>
        </button>
      </div>

      {#if showAddStepForm}
        <div class="surface elevation-1 p-1 mb-1 border-radius">
          <h3>Add New Step</h3>
          <div class="form-grid">
            <label>
              Key:
              <input type="text" bind:value={newStepForm.key} placeholder="unique-step-key" />
            </label>
            <label>
              Name:
              <input type="text" bind:value={newStepForm.name} placeholder="Step Name" />
            </label>
            <label>
              Min Choices:
              <input type="number" bind:value={newStepForm.min} min="0" />
            </label>
            <label>
              Max Choices:
              <input type="number" bind:value={newStepForm.max} min="1" />
            </label>
            <label class="full-width">
              Description:
              <textarea bind:value={newStepForm.description} placeholder="Instructions for this step"></textarea>
            </label>
          </div>
          <div class="toolbar justify-end mt-1">
            <button class="button" onclick={addNewStep}>Add Step</button>
            <button class="button text" onclick={() => showAddStepForm = false}>Cancel</button>
          </div>
        </div>
      {/if}

      <div class="flex flex-col gap-1">
        {#each $builder.steps as step, index}
          <cn-card class="p-1">
            <div class="toolbar justify-space-between mb-1">
              <div class="flex-col items-start">
                <h3 class="mt-0">{step.name}</h3>
                <p class="downscaled mt-0">{step.description}</p>
                <small class="downscaled">Key: {step.key} | Min: {step.min} | Max: {step.max}</small>
              </div>
              <div class="toolbar">
                <button class="button text" onclick={() => moveStepUp(index)} disabled={index === 0} aria-label="Move step up">
                  <cn-icon noun="up"></cn-icon>
                </button>
                <button class="button text" onclick={() => moveStepDown(index)} disabled={index === $builder.steps.length - 1} aria-label="Move step down">
                  <cn-icon noun="down"></cn-icon>
                </button>
                <button class="button text" onclick={() => editStep(step)} aria-label="Edit step">
                  <cn-icon noun="edit"></cn-icon>
                </button>
                <button class="button text" onclick={() => removeStep(step.key)} aria-label="Remove step">
                  <cn-icon noun="delete"></cn-icon>
                </button>
              </div>
            </div>

            <!-- Features in this step -->
            <div class="border-top pt-1">
              <div class="toolbar justify-space-between mb-1">
                <h4 class="mt-0">Features ({step.features.length})</h4>
                <button class="button text" onclick={() => addFeatureToStep(step.key)}>
                  <cn-icon noun="add"></cn-icon>
                  <span>Add Feature</span>
                </button>
              </div>
              
              {#if step.features.length > 0}
                <div class="flex flex-col">
                  {#each step.features as feature}
                    <div class="surface elevation-1 p-1 border-radius mb-1">
                      <div class="toolbar justify-space-between">
                        <div class="flex-col items-start grow">
                          <input 
                            type="text" 
                            bind:value={feature.name} 
                            placeholder="Feature name"
                            class="feature-name-input"
                          />
                          <small class="downscaled">({feature.key})</small>
                          {#if feature.modifiers && feature.modifiers.length > 0}
                            <div class="flex flex-wrap gap-1 mt-1">
                              {#each feature.modifiers as modifier}
                                <span class="pill">{modifier.type}: {modifier.title || modifier.target}</span>
                              {/each}
                            </div>
                          {/if}
                        </div>
                        <div class="toolbar">
                          <button class="button text" onclick={() => editFeature(step.key, feature.key)} aria-label="Edit feature">
                            <cn-icon noun="edit"></cn-icon>
                          </button>
                          <button class="button text" onclick={() => removeFeatureFromStep(step.key, feature.key)} aria-label="Remove feature">
                            <cn-icon noun="delete"></cn-icon>
                          </button>
                        </div>
                      </div>
                    </div>
                  {/each}
                </div>
              {:else}
                <p class="downscaled text-center">No features added yet.</p>
              {/if}
            </div>
          </cn-card>
        {/each}
      </div>
    </section>

    <!-- Step Edit Modal -->
    {#if editingStep}
      <cn-dialog open>
        <h3>Edit Step</h3>
        <div class="form-grid">
          <label>
            Key:
            <input type="text" bind:value={editingStep.key} />
          </label>
          <label>
            Name:
            <input type="text" bind:value={editingStep.name} />
          </label>
          <label>
            Min Choices:
            <input type="number" bind:value={editingStep.min} min="0" />
          </label>
          <label>
            Max Choices:
            <input type="number" bind:value={editingStep.max} min="1" />
          </label>
          <label class="full-width">
            Description:
            <textarea bind:value={editingStep.description} rows="3"></textarea>
          </label>
        </div>
        <div class="toolbar justify-end mt-1">
          <button class="button" onclick={saveStep}>Save Changes</button>
          <button class="button text" onclick={cancelEditStep}>Cancel</button>
        </div>
      </cn-dialog>
    {/if}
    <section class="debug">
      <!-- Debug Information -->
    <details class="mt-2 border-top pt-1">
      <summary class="downscaled">Debug: Current Builder State</summary>
      <pre class="surface elevation-1 p-1 border-radius mt-1 overflow-x-auto downscaled">{JSON.stringify($builder, null, 2)}</pre>
    </details>
    </section>
</div>
  {:else}
    <div class="content-columns">
      <section class="column-l">
        <p>Builder not found.</p>
      </section>
    </div>
  {/if}
</WithAuth>

<style>
.form-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--cn-grid);
}

.form-grid .full-width {
  grid-column: 1 / -1;
}

.feature-name-input {
  background: transparent;
  border: 1px solid transparent;
  font-weight: 500;
  padding: 0.25rem 0.5rem;
  border-radius: var(--cn-border-radius);
  width: 100%;
  max-width: 200px;
}

.feature-name-input:focus {
  background: var(--color-field);
  border-color: var(--color-border-focus);
  outline: none;
}

@media (max-width: 768px) {
  .form-grid {
    grid-template-columns: 1fr;
  }
}
</style>