<script lang="ts">
import type { Character } from '@schemas/CharacterSchema';
import { t } from '@utils/i18n';

export interface CharacterCardProps {
  character: Character;
}
const { character }: CharacterCardProps = $props();
</script>

<cn-card
  href={`/characters/${character.key}`}
  title={character.name}
  description={character.description || t('characters:create.noDescription')}
>

</cn-card>