<script lang="ts">
import { fetchCharacterSheet } from '@stores/characters/characterSheetStore';
import { appMeta } from '@stores/metaStore/metaStore';
import { uid } from '@stores/session';
import WithAuth from '@svelte/app/WithAuth.svelte';
import { pushSnack } from '@utils/client/snackUtils';

export interface Props {
  sheetKey: string;
}
const { sheetKey }: Props = $props();
const allow = $derived.by(() => $appMeta.admins.includes($uid));

/**
 * Load the character sheet data when the component is mounted, the sheet strore is used
 * by the children components to display and edit the sheet.
 */
$effect(() => {
  if (allow) {
    try {
      fetchCharacterSheet(sheetKey);
    } catch (error) {
      pushSnack({
        message: `Failed to fetch sheet: ${error instanceof Error ? error.message : 'Unknown error'}`,
      });
    }
  }
});
</script>

<WithAuth {allow}>
  <div class="content-columns">
    <h1>Sheet Editor</h1>
  </div>
</WithAuth>

