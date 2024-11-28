import { useStore } from '@nanostores/solid';
import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';
import { $uid } from 'src/stores/sessionStore';

interface PageFabsProps {
  page?: Page;
  site: Site;
}

/**
 * Fabs available for the site owners and players
 */
export const PageFabs: Component<PageFabsProps> = (props) => {
  const uid = useStore($uid);

  function editor() {
    return props.site.owners.includes(uid());
  }

  return (
    <>
      {editor() && (
        <Portal mount={document.querySelector('#fab-tray') || document.body}>
          <a
            href={`/sites/${props.site.key}/create/page`}
            class="fab secondary small"
          >
            <cn-icon noun="add" small />
            <span class="sm-hidden">{t('actions:create.page')}</span>
          </a>
          <a
            href={`/sites/${props.site.key}/${props.page?.key}/edit`}
            class="fab"
          >
            <cn-icon noun="edit" small />
            <span class="sm-hidden">{t('actions:edit')}</span>
          </a>
        </Portal>
      )}
    </>
  );
};
