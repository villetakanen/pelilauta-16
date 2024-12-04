<script lang="ts">
import type { Account } from '@schemas/AccountSchema';
import { appMeta } from '@stores/metaStore/metaStore';
import ProfileLink from '@svelte/app/ProfileLink.svelte';
import { toDisplayString } from '@utils/contentHelpers';

interface Props {
  account: Account;
}
const { account }: Props = $props();
const adminStatus = $derived(() => $appMeta.admins.includes(account.uid));
const frozenStatus = $derived(() => account.frozen);
</script>

<ProfileLink uid={account.uid} />
<p class="m-0">{toDisplayString(account.lastLogin)}</p>

  {#if adminStatus()}
    <cn-icon noun="admin"></cn-icon>
  {:else}
    <p></p>
  {/if}
  <cn-toggle-button
    value={frozenStatus()}
  ></cn-toggle-button>

