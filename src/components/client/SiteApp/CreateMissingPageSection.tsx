/**
 * Simple solid-js auth-wrapper component for create missing page section
 */

import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

interface CreateMissingPageSectionProps {
  site: Site;
  pageKey: string;
}

export const CreateMissingPageSection: Component<
  CreateMissingPageSectionProps
> = (props) => {
  const uid = useStore($uid);
  const visible = () => props.site.owners.includes(uid());

  return visible() ? (
    <section>
      <p>{t('site:page.missing')}</p>
      <div class="toolbar justify-end">
        <a
          href={`/sites/${props.site.key}s/create/page?name=${props.pageKey}`}
          class="button"
        >
          {t('actions:create.page')}
        </a>
      </div>
    </section>
  ) : null;
};
