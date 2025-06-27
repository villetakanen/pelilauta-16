<script lang="ts">
import {
  type CharacterBuilder,
  CharacterBuilderSchema,
  type CharacterBuilderStep,
  type CharacterFeature,
} from '@schemas/CharacterBuilderSchema';
import { appMeta } from '@stores/metaStore/metaStore';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { logDebug, logError } from '@utils/logHelpers';
import BuilderInfoForm from './BuilderInfoForm.svelte';

const allow = $derived.by(() => $appMeta.admins.includes($uid));

let editingStep: CharacterBuilderStep | null = $state(null);
let showAddStepForm = $state(false);

// Initialize with mock data
const builder = $state<CharacterBuilder>(
  CharacterBuilderSchema.parse({
    key: 'test-builder',
    name: 'Löllöpulautin',
    description: 'Tämä on testipulautin, joka ei vielä tee mitään.',
    system: 'll',
    steps: [
      {
        key: 'step1',
        name: 'Character Origin',
        description: "Choose your character's background and origin.",
        min: 1,
        max: 1,
        features: [
          {
            key: 'noble',
            characterBuilderKey: 'test-builder',
            name: 'Noble',
            modifiers: [
              {
                type: 'FEATURE',
                title: 'Noble Heritage',
                description: 'You come from a wealthy family.',
              },
            ],
          },
          {
            key: 'commoner',
            characterBuilderKey: 'test-builder',
            name: 'Commoner',
            modifiers: [
              {
                type: 'FEATURE',
                title: 'Street Smart',
                description: 'You know how to survive on the streets.',
              },
            ],
          },
        ],
      },
    ],
  }),
);

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

  builder.steps = [...builder.steps, newStep];

  // Reset form
  newStepForm = { key: '', name: '', description: '', min: 1, max: 1 };
  showAddStepForm = false;
}

function removeStep(stepKey: string) {
  logDebug('BuilderEditor', 'Removing step', stepKey);
  builder.steps = builder.steps.filter((step) => step.key !== stepKey);
}

function moveStepUp(index: number) {
  if (index > 0) {
    const steps = [...builder.steps];
    [steps[index - 1], steps[index]] = [steps[index], steps[index - 1]];
    builder.steps = steps;
  }
}

function moveStepDown(index: number) {
  if (index < builder.steps.length - 1) {
    const steps = [...builder.steps];
    [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
    builder.steps = steps;
  }
}

function editStep(step: CharacterBuilderStep) {
  editingStep = { ...step };
}

function saveStep() {
  if (!editingStep) return;

  const currentEditingStep = editingStep;
  const stepIndex = builder.steps.findIndex(
    (s) => s.key === currentEditingStep.key,
  );
  if (stepIndex !== -1) {
    builder.steps[stepIndex] = { ...currentEditingStep };
  }
  editingStep = null;
}

function cancelEditStep() {
  editingStep = null;
}

function addFeatureToStep(stepKey: string) {
  const step = builder.steps.find((s) => s.key === stepKey);
  if (!step) return;

  const newFeature: CharacterFeature = {
    key: `feature-${Date.now()}`,
    characterBuilderKey: builder.key,
    name: 'New Feature',
    modifiers: [],
  };

  step.features = [...step.features, newFeature];
}

function removeFeatureFromStep(stepKey: string, featureKey: string) {
  const step = builder.steps.find((s) => s.key === stepKey);
  if (!step) return;

  step.features = step.features.filter((f) => f.key !== featureKey);
}

function editFeature(stepKey: string, featureKey: string) {
  // TODO: Implement full feature editor modal
  logDebug('BuilderEditor', 'Edit feature clicked', { stepKey, featureKey });
}

function saveBuilder() {
  try {
    // Validate the builder before saving
    const validatedBuilder = CharacterBuilderSchema.parse(builder);
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
  <div class="content-columns">
  <section class="column-l">
  <div class="p-1">
    <header class="toolbar justify-space-between mb-1">
      <h1>Character Builder Editor</h1>
      <button class="button cta" onclick={() => saveBuilder()}>
        <cn-icon noun="save"></cn-icon>
        <span>Save Builder</span>
      </button>
    </header>

    <!-- Builder Meta Information -->
    <BuilderInfoForm {builder} />

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
        {#each builder.steps as step, index}
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
                <button class="button text" onclick={() => moveStepDown(index)} disabled={index === builder.steps.length - 1} aria-label="Move step down">
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
  </div>
    </section>
    <section class="debug">
      <!-- Debug Information -->
    <details class="mt-2 border-top pt-1">
      <summary class="downscaled">Debug: Current Builder State</summary>
      <pre class="surface elevation-1 p-1 border-radius mt-1 overflow-x-auto downscaled">{JSON.stringify(builder, null, 2)}</pre>
    </details>
    </section>
</div>
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