/**
 * A Solid-js component that renders a site tray actions, requiring a site ownership check.
 */

import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { systemToNoun } from '@utils/schemaHelpers';
import { type Component, createMemo } from 'solid-js';

export const SiteAdminActions: Component<{ site: Site }> = (props) => {
  const uid = useStore($uid);
  const visible = createMemo(() => props.site.owners.includes(uid()));
  const noun = () => systemToNoun(props.site.system);

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
  ) : (
    <div class="flex items-center justify-center p-2" style="opacity:0.11">
      <cn-icon noun={noun()} large />
    </div>
  );
};
