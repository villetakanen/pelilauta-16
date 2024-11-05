/**
 * A Solid-js auth-view component that allows users to delete a page.
 */

import { deletePage } from '@firebase/client/site/deletePage';
import { useStore } from '@nanostores/solid';
import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

interface PageDeleteViewProps {
  site: Site;
  page: Page;
}

export const PageDeleteView: Component<PageDeleteViewProps> = (props) => {
  const uid = useStore($uid);
  const visible = () => props.site.owners.includes(uid());

  async function handleSubmit(event: Event) {
    event.preventDefault();

    await deletePage(props.site.key, props.page.key);

    pushSessionSnack(t('snacks.pageDeleted', { name: props.page.name }));
    window.location.href = `/sites/${props.site.key}`;
  }

  return visible() ? (
    <div class="content-columns">
      <div>
        <h1 class="downscaled">{t('actions:confirm.delete')}</h1>
        <p>{t('site:deletePage.info', { name: props.page.name })}</p>
        <form onSubmit={handleSubmit}>
          <div class="toolbar justify-end">
            <button
              type="button"
              class="text"
              onClick={() => window.history.back()}
            >
              {t('actions:cancel')}
            </button>
            <button type="submit">{t('actions:delete')}</button>
          </div>
        </form>
      </div>
    </div>
  ) : null;
};
