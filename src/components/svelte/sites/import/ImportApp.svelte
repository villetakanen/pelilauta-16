<script lang="ts">
import type { Site } from '@schemas/SiteSchema';
import { site /* importStore */ } from '@stores/site';

interface Props {
  site: Site;
}

const { site: initialSite }: Props = $props();

$effect(() => {
  // Ensure the site store is set with the initial site data
  // when the component is mounted
  site.set(initialSite);
});
</script>
<div class="content-columns">
  <h1>Import App</h1>
  <!-- <UploadFilesForm /> -->
  <!--<PreviewImport /> -->
</div>