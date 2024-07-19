/**
 * This is a solid-js powered form for creating a new wikipage.
 */

import { useStore } from '@nanostores/solid';
import { createPage } from '@schemas/PageSchema';
import { t } from '@utils/i18n';
import { toMekanismiURI } from '@utils/mekanismiUtils';
import { type Component, onMount } from 'solid-js';
import { $site, load } from 'src/stores/activeSiteStore';
import { addPage } from 'src/stores/activeSiteStore/pagesStore';

export const CreatePageForm: Component<{ siteKey: string }> = (props) => {
  const site = useStore($site);

  onMount(() => {
    load(props.siteKey);
  });

  function cancel() {
    history.back();
  }

  async function handleSubmit(event: Event) {
    event.preventDefault();
    const form = event.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    const newPage = createPage(toMekanismiURI(name), site().key);
    // If customPageKeys is enabled, we need to check if the slug is already in use
    // Otherwise, we can just generate a slug at creation time
    const proposedSlug = site().customPageKeys
      ? toMekanismiURI(name)
      : undefined;
    const slug = await addPage(site().key, newPage, proposedSlug);

    window.location.href = `/sites/${site().key}/${slug}`;
  }

  return (
    <div class="content-columns">
      <form onsubmit={handleSubmit}>
        <label>
          {t('entries:page.name')}
          <input type="text" name="name" />
        </label>
        <div class="toolbar justify-end">
          <button type="button" onClick={cancel}>
            {t('actions:cancel')}
          </button>
          <button type="submit">
            <cn-icon noun="add" />
            <span>{t('actions:create.page')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};
