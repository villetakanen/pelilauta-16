<script lang="ts">
import type { CharacterBuilder } from '@schemas/CharacterBuilderSchema';
import type { CharacterSheet } from '@schemas/CharacterSheetSchema';
import { t } from '@utils/i18n';

interface Props {
  builder: CharacterBuilder;
  characterSheet: CharacterSheet | null;
}

const { builder, characterSheet }: Props = $props();

// Helper to calculate total features across all steps
const totalFeatures = $derived.by(() => {
  if (!builder.steps) return 0;
  return builder.steps.reduce(
    (total, step) => total + (step.features?.length || 0),
    0,
  );
});
</script>

<section class="column-s">
  <!-- Builder Information -->
  <section class="surface p-2 mb-2">
    <h2 class="downscaled">
      <cn-icon noun="builder"></cn-icon>
      {builder.name}
    </h2>
    {#if builder.description}
      <p class="text-small mb-2">{builder.description}</p>
    {/if}
  </section>

  <!-- Builder Steps Overview -->
  {#if builder.steps && builder.steps.length > 0}
    <section class="surface p-2 mb-2">
      <h3 class="downscaled">{t('characters:builder.steps.title')}</h3>
      <ol class="list-none">
        {#each builder.steps as step, index}
          <li class="mb-1">
            <div class="flex items-start gap-2">
              <span class="text-caption bg-surface-2 rounded-full w-6 h-6 flex items-center justify-center">
                {index + 1}
              </span>
              <div>
                <p class="text-small font-medium">{step.name}</p>
                {#if step.description}
                  <p class="text-caption">{step.description}</p>
                {/if}
                {#if step.features && step.features.length > 0}
                  <p class="text-caption">
                    {t('characters:builder.steps.featuresAvailable', { count: step.features.length })}
                  </p>
                {/if}
              </div>
            </div>
          </li>
        {/each}
      </ol>
    </section>
  {/if}

  <!-- Builder Statistics -->
  <section class="surface p-2 mb-2">
    <h3 class="downscaled">{t('characters:builder.stats.title')}</h3>
    <div class="flex flex-col gap-2">
      {#if builder.system}
        <div>
          <p class="text-caption">{t('characters:builder.stats.system')}</p>
          <p class="flex items-center gap-1">
            <cn-icon noun="game" xsmall></cn-icon>
            {builder.system}
          </p>
        </div>
      {/if}
      
      {#if builder.steps}
        <div>
          <p class="text-caption">{t('characters:builder.stats.steps')}</p>
          <p class="flex items-center gap-1">
            <cn-icon noun="steps" xsmall></cn-icon>
            {builder.steps.length}
          </p>
        </div>
      {/if}

      {#if totalFeatures > 0}
        <div>
          <p class="text-caption">{t('characters:builder.stats.totalFeatures')}</p>
          <p class="flex items-center gap-1">
            <cn-icon noun="feature" xsmall></cn-icon>
            {totalFeatures}
          </p>
        </div>
      {/if}
    </div>
  </section>

  <!-- Character Sheet Information -->
  {#if characterSheet}
    <section class="surface p-2 mb-2">
      <h3 class="downscaled">{t('characters:builder.fields.characterSheet')}</h3>
      <div class="flex items-center gap-2">
        <cn-icon noun="sheet" small></cn-icon>
        <div>
          <p class="font-medium">{characterSheet.name || t('characters:sheet.defaultName')}</p>
          {#if characterSheet.system}
            <p class="text-caption">{characterSheet.system}</p>
          {/if}
        </div>
      </div>
    </section>
  {/if}

  <!-- Help Information -->
  <section class="surface p-2">
    <h3 class="downscaled">
      <cn-icon noun="info"></cn-icon>
      {t('characters:info.title')}
    </h3>
    <p class="text-small">{t('characters:info.description')}</p>
  </section>
</section>