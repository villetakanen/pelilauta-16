/**
 * This is the tray used by the wiki sites and game sites.
 *
 * SiteTray is responsible for loading both: the Site and Pages stores.
 *
 * It's a part of the SiteApp "microfrontend".
 */

import { useStore } from '@nanostores/solid';
import { $site, load } from '@stores/SitesApp';
import { $account } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { systemToNoun } from '@utils/schemaHelpers';
import { type Component, For, createEffect } from 'solid-js';

type SiteTrayAction = {
  label: string;
  href: string;
  noun: string;
  break?: boolean;
};

export const SiteTray: Component<{ siteKey: string }> = (props) => {
  const site = useStore($site);
  const account = useStore($account);

  createEffect(() => {
    load(props.siteKey);
  });

  const siteTrayActions = (): SiteTrayAction[] => {
    const base: SiteTrayAction[] = [
      {
        label: t('site:tray.actions.homepage'),
        href: `/sites/${props.siteKey}`,
        noun: systemToNoun(site()?.system),
      },
      {
        label: t('site:tray.actions.toc'),
        href: `/sites/${props.siteKey}/toc`,
        noun: 'books',
      },
    ];

    if (site()?.owners.includes(account()?.uid)) {
      base.push({
        label: t('site:members.title'),
        href: `/sites/${props.siteKey}/members`,
        noun: 'adventurer',
        break: true,
      });
      base.push({
        label: t('site:settings.title'),
        href: `/sites/${props.siteKey}/settings`,
        noun: 'tools',
      });
    }

    return base;
  };

  return (
    <>
      {site() ? (
        <>
          <h3>{site().name}</h3>
          <ul>
            <For each={siteTrayActions()}>
              {(action) => (
                <li class={`${action.break && 'border-t'}`}>
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
