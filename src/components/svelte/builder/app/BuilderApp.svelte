<script lang="ts">
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { t } from '@utils/i18n';
import { onDestroy } from 'svelte';
import {
  builder,
  builderLoading,
  subscribeToBuilder,
  unsubscribeFromBuilder,
} from '../builderStore';

interface Props {
  builderKey: string;
}

const { builderKey }: Props = $props();

const visible = $derived.by(() => {
  return !!$uid;
});

// Subscribe to the builder when the component mounts or builderKey changes
$effect(() => {
  if (builderKey) {
    subscribeToBuilder(builderKey);
  }
});

// Clean up subscription when component is destroyed
onDestroy(() => {
  unsubscribeFromBuilder();
});
</script>

<WithAuth allow={visible}>
  <div class="content-columns">
    {#if $builderLoading}
      <!-- Loading State -->
      <section class="column-l">
        <div class="loading-state surface border-radius p-4 text-center">
          <cn-loader></cn-loader>
          <p class="text-low mt-2">{t('characters:builder.loading')}</p>
        </div>
      </section>
    {:else if $builder}
      <!-- Builder Content -->
      <section class="column-l">
        <header class="mb-2">
          <h1>{$builder.name}</h1>
          <p class="text-caption text-low">{t('characters:builder.system')}: {$builder.system}</p>
        </header>
        
        <div class="surface border-radius p-2 mb-2">
          <p>{$builder.description}</p>
        </div>
        
        <!-- Steps Overview -->
        <div class="steps-overview">
          <h2 class="downscaled mb-1">{t('characters:builder.steps.title')}</h2>
          
          {#if $builder.steps && $builder.steps.length > 0}
            <div class="steps-list">
              {#each $builder.steps as step, index}
                <article class="step-card surface border-radius p-2 mb-1">
                  <header class="toolbar mb-1">
                    <div class="step-number">
                      <span class="text-small text-low">{t('characters:builder.step')}</span>
                      <strong>{index + 1}</strong>
                    </div>
                    <div class="grow">
                      <h3 class="m-0">{step.name}</h3>
                    </div>
                  </header>
                  
                  <p class="text-small text-low mb-1">{step.description}</p>
                  
                  <div class="step-meta toolbar">
                    <div class="step-requirements text-caption">
                      {#if step.min === step.max}
                        {t('characters:builder.steps.choose')} {step.min}
                      {:else}
                        {t('characters:builder.steps.chooseRange', { min: step.min, max: step.max })}
                      {/if}
                    </div>
                    
                    <div class="step-features text-caption text-low">
                      {t('characters:builder.steps.featuresAvailable', { count: step.features?.length || 0 })}
                    </div>
                  </div>
                  
                  <!-- Preview of features if there are any -->
                  {#if step.features && step.features.length > 0}
                    <details class="mt-1">
                      <summary class="text-small">{t('characters:builder.steps.showFeatures')}</summary>
                      <ul class="feature-preview list-compact mt-1">
                        {#each step.features as feature}
                          <li class="text-small">
                            <strong>{feature.name}</strong>
                            {#if feature.description}
                              <span class="text-low"> - {feature.description}</span>
                            {/if}
                            {#if feature.modifiers && feature.modifiers.length > 0}
                              <span class="text-caption text-low">
                                ({t('characters:builder.modifiers.count', { count: feature.modifiers.length })})
                              </span>
                            {/if}
                          </li>
                        {/each}
                      </ul>
                    </details>
                  {/if}
                </article>
              {/each}
            </div>
          {:else}
            <div class="empty-state surface border-radius p-2 text-center">
              <cn-icon noun="adventurer" large></cn-icon>
              <p class="text-low">{t('characters:builder.steps.noSteps')}</p>
            </div>
          {/if}
        </div>
      </section>
      
      <!-- Sidebar with actions -->
      <aside class="column-s">
        <div class="surface border-radius p-2">
          <h3 class="downscaled mb-1">{t('characters:builder.actions.title')}</h3>
          
          <div class="toolbar-vertical">
            <button class="button primary full-width" disabled>
              <cn-icon noun="add"></cn-icon>
              <span>{t('characters:builder.actions.startBuilding')}</span>
            </button>
            
            <button class="button text full-width" disabled>
              <cn-icon noun="edit"></cn-icon>
              <span>{t('characters:builder.actions.customize')}</span>
            </button>
          </div>
          
          <p class="text-caption text-low mt-1">
            {t('characters:builder.comingSoon')}
          </p>
        </div>
        
        <!-- Builder Statistics -->
        <div class="surface border-radius p-2 mt-2">
          <h4 class="downscaled mb-1">{t('characters:builder.stats.title')}</h4>
          
          <dl class="stats-list">
            <div class="stat-item">
              <dt class="text-small">{t('characters:builder.stats.steps')}</dt>
              <dd><strong>{$builder.steps?.length || 0}</strong></dd>
            </div>
            
            <div class="stat-item">
              <dt class="text-small">{t('characters:builder.stats.totalFeatures')}</dt>
              <dd><strong>{$builder.steps?.reduce((total, step) => total + (step.features?.length || 0), 0) || 0}</strong></dd>
            </div>
            
            <div class="stat-item">
              <dt class="text-small">{t('characters:builder.stats.system')}</dt>
              <dd><code>{$builder.system}</code></dd>
            </div>
          </dl>
        </div>
      </aside>
    {:else}
      <!-- Builder Not Found State -->
      <section class="column-l">
        <div class="empty-state surface border-radius p-4 text-center">
          <cn-icon noun="adventurer" xlarge></cn-icon>
          <h2>{t('characters:builder.notFound.title')}</h2>
          <p class="text-low">{t('characters:builder.notFound.description')}</p>
          
          <div class="toolbar justify-center mt-2">
            <a href="/builders" class="button">
              {t('characters:builder.actions.browse')}
            </a>
          </div>
        </div>
      </section>
    {/if}
  </div>
</WithAuth>

<style>
.step-card {
  transition: var(--cn-transition-fast);
}

.step-card:hover {
  transform: translateY(-2px);
  box-shadow: var(--cn-elevation-2);
}

.step-number {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  min-width: 3rem;
  padding: 0.5rem;
  background: var(--cn-color-surface-variant);
  border-radius: var(--cn-border-radius);
  margin-right: 1rem;
}

.step-requirements {
  padding: 0.25rem 0.5rem;
  background: var(--cn-color-primary);
  color: var(--cn-color-on-primary);
  border-radius: var(--cn-border-radius);
  font-weight: 500;
}

.toolbar-vertical {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stats-list {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.stat-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem 0;
  border-bottom: 1px solid var(--cn-color-outline-variant);
}

.stat-item:last-child {
  border-bottom: none;
}

.feature-preview {
  max-height: 8rem;
  overflow-y: auto;
  padding-left: 1rem;
}

.empty-state {
  min-height: 12rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 1rem;
}
</style>