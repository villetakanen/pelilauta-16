/**
 * This is a solid-js powered form for creating a new wikipage.
 */

import { useStore } from '@nanostores/solid';
import { createPage } from '@schemas/PageSchema';
import { $site, load } from '@stores/SitesApp';
import { addPage } from '@stores/SitesApp/pagesStore';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { toMekanismiURI } from '@utils/mekanismiUtils';
import { type Component, onMount } from 'solid-js';

export const CreatePageForm: Component<{ siteKey: string; name?: string }> = (
  props,
) => {
  const site = useStore($site);

  onMount(() => {
    load(props.siteKey);
  });

  function cancel() {
    logDebug('CreatePageForm', 'cancel');
    history.back();
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    const newPage = createPage(toMekanismiURI(name), site().key);
    newPage.name = name;
    newPage.markdownContent = '\n';
    // If customPageKeys is enabled, we need to check if the slug is already in use
    // Otherwise, we can just generate a slug at creation time
    const proposedSlug = site().customPageKeys
      ? toMekanismiURI(name)
      : undefined;
    const slug = await addPage(site().key, newPage, proposedSlug);

    window.location.href = `/sites/${site().key}/${slug}`;
  };

  return (
    <div class="content-columns">
      <form onSubmit={handleSubmit}>
        <label>
          {t('entries:page.name')}
          <input type="text" name="name" value={`${props.name}`} />
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
