/**
 * This is a solid-js powered form for creating a new wikipage.
 */
import { WithAuth } from '@client/shared/WithAuth';
import { addPage } from '@firebase/client/site/addPage';
import { useStore } from '@nanostores/solid';
import { createPage } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/session';
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
    newPage.markdownContent = `# ${name}\n\n`;
    newPage.owners = [uid()];
    // If customPageKeys is enabled, we need to check if the slug is already in use
    // Otherwise, we can just generate a slug at creation time
    const proposedSlug = props.site.customPageKeys
      ? toMekanismiURI(name)
      : undefined;
    const slug = await addPage(props.site.key, newPage, proposedSlug);

    window.location.href = `/sites/${props.site.key}/${slug}`;
  };

  function isMissing() {
    return (props.name?.length || 0) > 0;
  }

  return (
    <div class="content-columns">
      <WithAuth allow={allow()}>
        <form onSubmit={handleSubmit}>
          <h2>{t('site:create.page.title')}</h2>
          {isMissing() && (
            <p>
              <i>{t('site:create.page.missing', { name: `${props.name}` })}</i>
            </p>
          )}
          <label>
            {t('entries:page.name')}
            <input type="text" name="name" value={`${props.name}`} />
          </label>
          <div class="toolbar justify-end">
            <button type="button" class="text" onClick={cancel}>
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
