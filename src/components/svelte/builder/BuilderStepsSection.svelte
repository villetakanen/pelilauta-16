<script lang="ts">
import { t } from '@utils/i18n';
import type { CharacterBuilder } from '../../../schemas/CharacterBuilderSchema';

interface Props {
  builder: CharacterBuilder;
}
const { builder }: Props = $props();
</script>

<section>
  <h2>
    {t('characters:builder.editor.steps.title')}
  </h2>
  <div class="flex flex-column">
    <div class="toolbar items-center">
      <button class="text">
        <cn-icon noun="add"></cn-icon>
        <span>{t('characters:builder.editor.steps.add')}</span>
      </button>
    </div>
  </div>
</section>