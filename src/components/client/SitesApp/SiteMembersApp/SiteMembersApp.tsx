import { ProfileLink } from '@client/shared/ProfileLink';
import { useStore } from '@nanostores/solid';
import { $site, load, updateSite } from '@stores/SitesApp';
import { $account } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import { type Component, For, createEffect } from 'solid-js';
import { AddSiteMemberForm } from './AddSiteMemberForm';

export const SiteMembersApp: Component<{ siteKey: string }> = (props) => {
  const site = useStore($site);
  const account = useStore($account);

  createEffect(() => {
    load(props.siteKey);
  });

  function dropMember(uid: string) {
    const owners = site().owners.filter((owner) => owner !== uid);
    updateSite({ owners });
  }

  return (
    <div class="content-columns">
      <article>
        <h2>{t('site:members.title')}</h2>
        <For each={site().owners} fallback={<p>{t('site:members.empty')}</p>}>
          {(owner) => (
            <div class="toolbar">
              <ProfileLink uid={owner} />
              <button
                type="button"
                disabled={account().uid === owner}
                onclick={() => dropMember(owner)}
              >
                <cn-icon noun="delete" />
              </button>
            </div>
          )}
        </For>
        <hr />
        <h3>{t('site:members.add')}</h3>
        <AddSiteMemberForm />
      </article>
    </div>
  );
};
