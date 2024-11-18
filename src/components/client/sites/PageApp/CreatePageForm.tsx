/**
 * This is a solid-js powered form for creating a new wikipage.
 */
import { WithAuth } from '@client/shared/WithAuth';
import { useStore } from '@nanostores/solid';
import { createPage } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { addPage } from '@stores/SitesApp/pagesStore';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { toMekanismiURI } from '@utils/mekanismiUtils';
import type { Component } from 'solid-js';

interface CreatePageFormProps {
  site: Site;
  name?: string;
}

export const CreatePageForm: Component<CreatePageFormProps> = (props) => {
  const uid = useStore($uid);

  const allow = () => props.site.owners.includes(uid());

  function cancel() {
    history.back();
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const name = formData.get('name') as string;

    const newPage = createPage(toMekanismiURI(name), props.site.key);
    newPage.name = name;
    newPage.markdownContent = '\n';
    // If customPageKeys is enabled, we need to check if the slug is already in use
    // Otherwise, we can just generate a slug at creation time
    const proposedSlug = props.site.customPageKeys
      ? toMekanismiURI(name)
      : undefined;
    const slug = await addPage(props.site.key, newPage, proposedSlug);

    window.location.href = `/sites/${props.site.key}/${slug}`;
  };

  return (
    <div class="content-columns">
      <WithAuth allow={allow()}>
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
      </WithAuth>
    </div>
  );
};
