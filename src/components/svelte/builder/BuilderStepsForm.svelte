<script lang="ts">
import type { CharacterBuilder } from '../../../schemas/CharacterBuilderSchema';

interface Props {
  builder: CharacterBuilder;
}
const { builder }: Props = $props();
</script>