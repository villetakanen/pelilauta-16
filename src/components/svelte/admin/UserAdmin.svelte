<script lang="ts">
import { getAllAccounts } from '@firebase/client/admin/getAllAccounts';
import { appMeta } from '@stores/metaStore/metaStore';
import { uid } from '@stores/sessionStore';
import WithAuth from '@svelte/app/WithAuth.svelte';

$: allow = $appMeta.admins.includes($uid);
</script>

<WithAuth {allow}>
  <div class="content-columns">
    <article class="column-l">
      <h1>Users</h1>
      {#await getAllAccounts()}
        <cn-loader></cn-loader>
      {:then accounts}
        {#each accounts as account}
          <div>
            <p>{account.uid}</p>
          </div>
        {/each}
        {:catch error}
            <p>{error.message}</p>
        {/await}
    </article>
  </div>
</WithAuth>