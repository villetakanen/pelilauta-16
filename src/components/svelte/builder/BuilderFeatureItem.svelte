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

let dialog: HTMLDialogElement;
let editedFeature = $state({ ...feature });

function openEditDialog() {
  editedFeature = { ...feature };
  dialog.showModal();
}

function closeDialog() {
  dialog.close();
}

function handleSave() {
  onUpdate(editedFeature);
  closeDialog();
}

function handleDelete() {
  onRemove();
  closeDialog();
}

function handleCancel() {
  editedFeature = { ...feature };
  closeDialog();
}
</script>

<div class="border-radius border p-1">
  <div class="toolbar">
    <div class="grow">
      <h4 class="downscaled">{feature.name}</h4>
      {#if feature.description}
        <p class="downscaled text-caption">{feature.description}</p>
      {/if}
    </div>
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
    <button class="text" onclick={openEditDialog} aria-label={t('actions:edit')}>
      <cn-icon noun="edit"></cn-icon>
    </button>
  </div>
</div>

<!-- Edit Dialog -->
<dialog bind:this={dialog} class="border-radius">
  <form method="dialog">
    <header class="toolbar mb-2">
      <h3>{t('characters:builder.editor.features.editFeature')}</h3>
      <button type="button" onclick={closeDialog} aria-label={t('actions:close')}>
        <cn-icon noun="close"></cn-icon>
      </button>
    </header>

    <div class="form-fields">
      <label>
        {t('characters:builder.fields.name')}
        <input 
          type="text" 
          bind:value={editedFeature.name} 
          placeholder={t('characters:builder.fields.namePlaceholder')} 
          required 
        />
      </label>

      <label>
        {t('characters:builder.fields.description')}
        <textarea 
          bind:value={editedFeature.description}
          placeholder={t('characters:builder.fields.descriptionPlaceholder')}
          rows="3"
        ></textarea>
      </label>

      <!-- Simple modifiers info - for now just show count -->
      <div class="modifiers-info">
        <p class="downscaled text-caption">
          {t('characters:builder.editor.features.modifiersCount', { count: editedFeature.modifiers?.length || 0 })}
        </p>
        <!-- TODO: Add full modifier editor when needed -->
      </div>
    </div>

    <footer class="toolbar justify-end mt-2">
      <button type="button" class="text danger" onclick={handleDelete} aria-label={t('actions:delete')}>
        <cn-icon noun="delete"></cn-icon>
        <span>{t('actions:delete')}</span>
      </button>
      <button type="button" class="text" onclick={handleCancel} aria-label={t('actions:cancel')}>
        <cn-icon noun="close"></cn-icon>
        <span>{t('actions:cancel')}</span>
      </button>
      <button type="button" class="primary" onclick={handleSave} aria-label={t('actions:save')}>
        <cn-icon noun="save"></cn-icon>
        <span>{t('actions:save')}</span>
      </button>
    </footer>
  </form>
</dialog>


