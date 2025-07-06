<script lang="ts">
import {
  CHARACTER_MODIFIER_TYPES,
  type CharacterMofdifier,
} from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { currentSheet } from '../admin/characterSheet/characterSheetStore';

interface Props {
  modifier: CharacterMofdifier;
  onUpdate: (modifier: CharacterMofdifier) => void;
  onRemove: () => void;
}

const { modifier, onRemove }: Props = $props();

function onsubmit(event: Event) {
  event.preventDefault();
  const form = event.target as HTMLFormElement;
  const formData = new FormData(form);
}

function statTypeToString(type: string): string {
  const spaces = type.replace('_', ' ').toLowerCase();
  return spaces.charAt(0).toUpperCase() + spaces.slice(1);
}

const stats = $derived.by(() => {
  logDebug(
    'ModifierForm',
    'Fetching stats from current sheet',
    $currentSheet?.stats,
  );
  return $currentSheet?.stats.map((stat) => stat.key) || [];
});
</script>

<form class="flex flex-no-wrap" {onsubmit}>
  <label class="flex-none">
    {t('characters:builder.editor.modifiers.type')}
    <select
      bind:value={modifier.type}
    >
      {#each CHARACTER_MODIFIER_TYPES as type}
        <option value={type}>{statTypeToString(type)}</option>
      {/each}
    </select>
  </label>
  {#if modifier.type === 'BASE_STAT' || modifier.type === 'STAT_BONUS'}
    <label>
      {t('characters:builder.editor.modifiers.target')}
      <!--input
        type="text"
        bind:value={modifier.target}
        placeholder={t('characters:builder.editor.modifiers.targetPlaceholder')}
      /-->
      <select
        bind:value={modifier.target}
        class="full-width"
        >
        <option value="-">{t('characters:builder.editor.modifiers.targetPlaceholder')}</option>
        {#each stats as stat}
          <option value={stat}>{stat}</option>
        {/each}
      </select>
    </label>
    <label>
      {t('characters:builder.editor.modifiers.value')}
      <input
        type="number"
        bind:value={modifier.value}
        placeholder={t('characters:builder.editor.modifiers.valuePlaceholder')}
      />
    </label>
  {:else if modifier.type === 'FEATURE'}
    <label class="grow">
      {t('characters:builder.editor.modifiers.description')}
      <input
        type="text"
        bind:value={modifier.description}
        placeholder={t('characters:builder.editor.modifiers.descriptionPlaceholder')}
      />
    </label>
  {/if}

  <button type="button" class="text flex-none" onclick={onRemove} aria-label={t('actions:remove')}>
    <cn-icon noun="delete"></cn-icon>
  </button>
</form>