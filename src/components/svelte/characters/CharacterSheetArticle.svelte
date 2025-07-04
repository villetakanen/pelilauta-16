<script lang="ts">
import {
  compiledCharacterSheet,
  featuresList,
} from '@stores/characters/sheetStore';

// Reactive character data from the store
const compiledSheet = $derived($compiledCharacterSheet);
const features = $derived($featuresList);

// Helper to group stats by category or display order
const statsDisplay = $derived.by(() => {
  if (!compiledSheet?.stats) return [];
  return compiledSheet.stats.map((stat) => ({
    ...stat,
    displayValue: stat.displayValue || stat.value?.toString() || '0',
  }));
});
</script>

<article class="column-l">
  {#if compiledSheet}
    <section class="surface p-2 mb-2">
      <h2 class="downscaled">
        <cn-icon noun="sheet"></cn-icon>
        {compiledSheet.name || 'Character Sheet'}
      </h2>
      
      {#if compiledSheet.system}
        <p class="text-caption mb-2">
          <cn-icon noun="game" xsmall></cn-icon>
          {compiledSheet.system}
        </p>
      {/if}
    </section>

    <!-- Character Stats -->
    {#if statsDisplay.length > 0}
      <section class="surface p-2 mb-2">
        <h3 class="downscaled">Statistics</h3>
        <div class="stats-grid">
          {#each statsDisplay as stat}
            <div class="stat-item">
              <div class="stat-value">{stat.displayValue}</div>
              <div class="stat-label">{stat.description || stat.key}</div>
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Selected Features -->
    {#if features.length > 0}
      <section class="surface p-2 mb-2">
        <h3 class="downscaled">Features & Abilities</h3>
        <div class="features-list">
          {#each features as feature}
            <div class="feature-item">
              <h4 class="text-small font-medium">{feature.name}</h4>
              {#if feature.description}
                <p class="text-caption">{feature.description}</p>
              {/if}
              {#if feature.modifiers && feature.modifiers.length > 0}
                <div class="modifiers-list">
                  {#each feature.modifiers as modifier}
                    <div class="modifier-item text-caption">
                      {#if modifier.type === 'STAT_BONUS' && modifier.target && modifier.value}
                        <cn-icon noun="plus" xsmall></cn-icon>
                        +{modifier.value} to {modifier.target}
                      {:else if modifier.type === 'FEATURE' && modifier.title}
                        <cn-icon noun="feature" xsmall></cn-icon>
                        {modifier.title}
                      {:else if modifier.description}
                        {modifier.description}
                      {/if}
                    </div>
                  {/each}
                </div>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}

    <!-- Additional Character Features -->
    {#if compiledSheet.extras && compiledSheet.extras.length > 0}
      <section class="surface p-2">
        <h3 class="downscaled">Additional Features</h3>
        <div class="features-list">
          {#each compiledSheet.extras as extra}
            <div class="feature-item">
              <h4 class="text-small font-medium">{extra.name}</h4>
              {#if extra.description}
                <p class="text-caption">{extra.description}</p>
              {/if}
            </div>
          {/each}
        </div>
      </section>
    {/if}
  {:else}
    <section class="surface p-2">
      <h2 class="downscaled">Character Sheet</h2>
      <p class="text-small">Start building your character to see the sheet preview here.</p>
    </section>
  {/if}
</article>

<style>
  .stats-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
    gap: 1rem;
    margin-top: 1rem;
  }

  .stat-item {
    text-align: center;
    padding: 0.5rem;
    background: var(--color-surface-2);
    border-radius: var(--border-radius);
  }

  .stat-value {
    font-size: 1.5rem;
    font-weight: bold;
    color: var(--color-primary);
  }

  .stat-label {
    font-size: 0.75rem;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    margin-top: 0.25rem;
  }

  .features-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
    margin-top: 1rem;
  }

  .feature-item {
    padding: 1rem;
    background: var(--color-surface-2);
    border-radius: var(--border-radius);
  }

  .modifiers-list {
    display: flex;
    flex-direction: column;
    gap: 0.5rem;
    margin-top: 0.5rem;
  }

  .modifier-item {
    display: flex;
    align-items: center;
    gap: 0.5rem;
    padding: 0.25rem 0.5rem;
    background: var(--color-surface-3);
    border-radius: calc(var(--border-radius) / 2);
  }
</style>