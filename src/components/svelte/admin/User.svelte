<script lang="ts">
import type { Account } from '@schemas/AccountSchema';
import { appMeta } from '@stores/metaStore/metaStore';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import { toDisplayString } from '@utils/contentHelpers';
  import { logDebug } from '@utils/logHelpers';

interface Props {
  account: Account;
}
const { account }: Props = $props();
const adminStatus = $derived(() => $appMeta.admins.includes(account.uid));
const frozenStatus = $derived(() => account.frozen);
</script>

<p class="m-0 p-2">
  <ProfileLink uid={account.uid} /><br>
  <span class="text-caption">{account.uid}</span>
</p>
<p class="m-0 p-2">{toDisplayString(account.lastLogin)}</p>

  {#if adminStatus()}
  <div style="justify-content: center; display: flex;">
    <cn-icon noun="admin"></cn-icon>
    </div>
  {:else}
    <p></p>
  {/if}
  <cn-toggle-button
    disabled={adminStatus()}
    value={frozenStatus()}
    onChange={() => {
      account.frozen = !account.frozen;
      logDebug('UserAdmin', 'frozenStatus', account.frozen);
    }}
  ></cn-toggle-button>

