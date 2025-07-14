<script lang="ts">
import { userCharacters } from '@stores/characters/userCharacters';
import { t } from '@utils/i18n';

/**
 * A "Standalone" Svelte app displaying the players character library.
 */
</script>

<div class="content-cards">
  <header>
    <h2 class="downscaled m-0">{t('library:characters.title')}</h2>
    <p class="downscaled low-emphasis">{t('library:characters.description')}</p>
  </header>
    {#if $userCharacters.length > 0}
      <p class="downscaled low-emphasis">
        {t('library:characters.count', { count: $userCharacters.length })}
      </p>
    {:else}
      <section class="secondary border-radius p-2 flex flex-column">
        <cn-icon noun="monsters" xlarge></cn-icon>
        <p class="downscaled">
          {t('library:characters.empty')}
        </p>
      </section>
    {/if}
  </div>
   <!--div class="full-width">
      <div class="toolbar">
        <h4 class="grow">{t('library:sites.title')}</h4>
        <button class="text" aria-label={directionNoun} onclick={toggleOrder}>
          <cn-icon noun={directionNoun}></cn-icon>
        </button>
        <button
          class={filters.orderBy === 'name' ? '' : 'text'}
          onclick={() => filters.orderBy = 'name'}
        >
        {t('entries:site.name')}
        </button>
        <button
          class={filters.orderBy === 'flowTime' ? '' : 'text'}
          onclick={() => filters.orderBy = 'flowTime'}
        >
          {t('entries:site.flowTime')}
        </button>
      </div>
   </div>
   <FilteredSites />
   <div class="full-width mb-2">
      <p>{t('library:sites.count', { count: $userSites.length })}</p>
   </div-->
