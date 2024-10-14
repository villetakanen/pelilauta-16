/**
 * A Solid-js component that renders a site tray actions, requiring a site ownership check.
 */

import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';

export const SiteAdminActions: Component<{ site: Site }> = (props) => {
  const uid = useStore($uid);
  const visible = createMemo(() => props.site.owners.includes(uid()));

  return visible() ? (
    <nav>
      <ul>
        <li>
          <a href={`/sites/${props.site.key}/members`} class="tray-button">
            <cn-icon noun="adventurer" xsmall />
            <span>{t('site:members.title')}</span>
          </a>
        </li>
        <li>
          <a href={`/sites/${props.site.key}/settings`} class="tray-button">
            <cn-icon noun="tools" xsmall />
            <span>{t('site:settings.title')}</span>
          </a>
        </li>
      </ul>
    </nav>
  ) : null;
};
