<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/sessionStore';
import WithAuth from '@svelte/app/WithAuth.svelte';
import SiteOwnersTool from './SiteOwnersTool.svelte';
import SitePlayersTool from './SitePlayersTool.svelte';
import { site } from './siteStore';
/**
 * A Wrapper for the SiteMembersApp component,
 * Inits the site-store and subscribes to the Site Entry in the Firestore
 */

interface Props {
  site: Site;
}
const { site: initialSite }: Props = $props();
$site = initialSite;
</script>

<WithAuth allow={$site?.owners.includes($uid)}>
  <div class="content-columns">
    <SiteOwnersTool />
    <SitePlayersTool />
  </div>
</WithAuth>

