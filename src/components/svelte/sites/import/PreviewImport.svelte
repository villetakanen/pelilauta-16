<script lang="ts">
import { site } from '@stores/site';
import { importStore, importedPages } from '@stores/site/importsStore';

const pages = $derived($importedPages);
const currentSite = $derived($site);

function removeFile(index: number) {
  importStore.removePages([index]);
}

function updateAction(index: number, action: 'create' | 'overwrite') {
  importStore.updatePageAction(index, action);
}

function clearAll() {
  importStore.clear();
}

// Check if a page with the same name already exists in the current site
function pageExists(pageName: string): boolean {
  if (!currentSite?.pageRefs) return false;
  return currentSite.pageRefs.some(
    (ref) => ref.name.toLowerCase() === pageName.toLowerCase(),
  );
}

const hasPages = $derived(pages.length > 0);
</script>

{#if hasPages}
<section class="column-l surface p-2">
  <h2>Import Preview</h2>
  <p class="text-low">Review the files to be imported. Choose whether to create new pages or overwrite existing ones.</p>
  
  <div class="toolbar mb-2">
    <span class="text-small text-low">{pages.length} file{pages.length === 1 ? '' : 's'} ready</span>
    <button class="button outlined small" onclick={clearAll}>Clear All</button>
  </div>
  
  <div class="flex-col gap-2">
    {#each pages as page, index}
      {@const exists = pageExists(page.name || '')}
      <article class="surface border p-2">
        <div class="flex justify-between items-start">
          <div class="flex-1">
            <h4 class="mb-1">
              {page.name || page.fileName}
              {#if page.category}
                <span class="badge text-small ml-1">{page.category}</span>
              {/if}
            </h4>
            <p class="text-small text-low mb-1">
              Source: <code>{page.fileName}</code>
            </p>
            {#if page.content}
              <p class="text-small text-low">
                Content preview: {page.content.slice(0, 100)}{page.content.length > 100 ? '...' : ''}
              </p>
            {/if}
            
            {#if exists}
              <div class="flex items-center gap-2 mt-2">
                <span class="text-warning text-small">⚠️ Page exists</span>
                <label class="flex items-center gap-1">
                  <input 
                    type="radio" 
                    name="action-{index}" 
                    value="overwrite"
                    checked={page.action === 'overwrite'}
                    onchange={() => updateAction(index, 'overwrite')}
                  />
                  <span class="text-small">Overwrite</span>
                </label>
                <label class="flex items-center gap-1">
                  <input 
                    type="radio" 
                    name="action-{index}" 
                    value="create"
                    checked={page.action === 'create'}
                    onchange={() => updateAction(index, 'create')}
                  />
                  <span class="text-small">Create new</span>
                </label>
              </div>
            {:else}
              <p class="text-success text-small mt-2">✅ Will create new page</p>
            {/if}
          </div>
          
          <button 
            class="button outlined small"
            onclick={() => removeFile(index)}
          >
            Remove
          </button>
        </div>
      </article>
    {/each}
  </div>
  
  <div class="toolbar mt-4">
    <button class="button primary">
      Import {pages.length} Page{pages.length === 1 ? '' : 's'}
    </button>
    <button class="button outlined" onclick={clearAll}>
      Cancel
    </button>
  </div>
</section>
{/if}
