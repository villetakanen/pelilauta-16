<script lang="ts">
import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { uid } from '@stores/session';
import { site } from '@stores/site';
import WithAuth from '@svelte/app/WithAuth.svelte';
import PageHistoryArticle from './PageHistoryArticle.svelte';

/**
 * A Wrapper for the SiteMembersApp component,
 * Inits the site-store and subscribes to the Site Entry in the Firestore
 */

interface Props {
  site: Site;
  page: Page;
  revision: number;
}
const { site: initialSite, page, revision }: Props = $props();
$site = initialSite;
const allow = $derived.by(() => {
  return $site.owners.includes($uid);
});
</script>

<WithAuth {allow}>
  <div class="content-columns">
    <PageHistoryArticle {page} {revision}/>
  </div>
</WithAuth>