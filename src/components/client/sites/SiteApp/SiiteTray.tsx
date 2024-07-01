/**
 * This is the tray used by the wiki sites and game sites.
 *
 * SiteTray is responsible for loading both: the Site and Pages stores.
 *
 * It's a part of the SiteApp "microfrontend".
 */

import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { systemToNoun } from '@utils/schemaHelpers';
import { type Component, For, createEffect } from 'solid-js';
import { $site, load } from 'src/stores/activeSiteStore';

type SiteTrayAction = {
  label: string;
  href: string;
  noun: string;
};

export const SiteTray: Component<{ sitekey: string }> = (props) => {
  const site = useStore($site);

  createEffect(() => {
    load(props.sitekey);
  });

  const siteTrayActions: SiteTrayAction[] = [
    {
      label: t('site:tray.actions.homepage'),
      href: `/sites/${props.sitekey}`,
      noun: systemToNoun(site()?.system),
    },
    {
      label: t('site:tray.actions.toc'),
      href: `/sites/${props.sitekey}/toc`,
      noun: 'books',
    },
  ];

  return (
    <>
      {site() ? (
        <>
          <h3>{site().name}</h3>
          <ul>
            <For each={siteTrayActions}>
              {(action) => (
                <li>
                  <a href={action.href} class="tray-button">
                    <cn-icon noun={action.noun} xsmall />
                    <span>{action.label}</span>
                  </a>
                </li>
              )}
            </For>
          </ul>
        </>
      ) : (
        <cn-loader for="tray" />
      )}
    </>
  );
};