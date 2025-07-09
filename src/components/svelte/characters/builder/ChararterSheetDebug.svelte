<script lang="ts">
import { compiledCharacterSheet } from '@stores/characters/sheetStore';
</script>

<div class="debug">
    <h1>Character Sheet (Debug)</h1>
    <pre>{JSON.stringify($compiledCharacterSheet, null, 2)}</pre>
</div>