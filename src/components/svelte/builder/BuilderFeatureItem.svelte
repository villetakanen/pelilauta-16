<script lang="ts">
import type { CharacterFeature } from '@schemas/CharacterBuilderSchema';
import { t } from '@utils/i18n';

interface Props {
  feature: CharacterFeature;
  index: number;
  isFirst: boolean;
  isLast: boolean;
  onUpdate: (feature: CharacterFeature) => void;
  onRemove: () => void;
  onMoveUp: () => void;
  onMoveDown: () => void;
}

const {
  feature,
  index,
  isFirst,
  isLast,
  onUpdate,
  onRemove,
  onMoveUp,
  onMoveDown,
}: Props = $props();

let mode = $state('view');
let editedFeature = $state({ ...feature });

function setMode(m: 'view' | 'edit') {
  if (m === 'edit') {
    editedFeature = { ...feature };
  }
  mode = m;
}

function handleSave() {
  onUpdate(editedFeature);
  setMode('view');
}

function handleCancel() {
  editedFeature = { ...feature };
  setMode('view');
}
</script>

<div class="border-radius border p-1">
  <div class="toolbar">
    <h4 class="downscaled grow">
      {feature.name}
    </h4>
    <button class="text" 
      disabled={isFirst}
      onclick={onMoveUp} 
      aria-label={t('characters:builder.editor.features.moveUp')}>
      <cn-icon noun="arrow-up"></cn-icon>
    </button>
    <button class="text" 
      disabled={isLast}
      onclick={onMoveDown} 
      aria-label={t('characters:builder.editor.features.moveDown')}>
      <cn-icon noun="arrow-down"></cn-icon>
    </button>
    <button class="text" onclick={onRemove} aria-label={t('characters:builder.editor.features.remove')}>
      <cn-icon noun="delete"></cn-icon>
    </button>
  </div>

  <!-- Edit mode -->
  {#if mode === 'edit'}
    <label>
      {t('characters:builder.fields.name')}
      <input type="text" bind:value={editedFeature.name} placeholder={t('characters:builder.fields.namePlaceholder')} required />
    </label>
    
    <!-- Simple modifiers editing - for now just show count -->
    <div class="modifiers-editor">
      <p class="downscaled">
        {t('characters:builder.editor.features.modifiersCount', { count: editedFeature.modifiers?.length || 0 })}
      </p>
      <!-- TODO: Add full modifier editor when needed -->
    </div>

    <div class="toolbar justify-end mt-1">
      <button class="text" onclick={handleSave} aria-label={t('characters:builder.editor.features.save')}>
        <cn-icon noun="save"></cn-icon>
        <span>{t('actions:save')}</span>
      </button>
      <button class="text" onclick={handleCancel} aria-label={t('actions:cancel')}>
        <cn-icon noun="close"></cn-icon>
        <span>{t('actions:cancel')}</span>
      </button>
    </div>
  {/if}
</div>


