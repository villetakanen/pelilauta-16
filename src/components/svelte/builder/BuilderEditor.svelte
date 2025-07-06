<script lang="ts">
import { appMeta } from '@stores/metaStore/metaStore';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { logDebug } from '@utils/logHelpers';
import { onDestroy } from 'svelte';
import {
  currentSheet,
  loadCurrentSheet,
} from '../admin/characterSheet/characterSheetStore';
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

$effect(() => {
  // Builder key changed, re-subscribe
  subscribeToBuilder(builderKey);
});
$effect(() => {
  // If builder is loaded, load the character sheet
  const key = $builder?.characterSheetKey;
  if (key) {
    logDebug('BuilderEditor', 'Loading character sheet for builder:', key);
    loadCurrentSheet(key);
  } else {
    currentSheet.set(null); // Reset if no sheet key
  }
});

onDestroy(() => {
  // Clean up subscription when component is destroyed
  unsubscribeFromBuilder();
});
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
