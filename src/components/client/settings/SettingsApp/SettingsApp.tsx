import { WithAuth } from '@client/shared/WithAuth';
import { useStore } from '@nanostores/solid';
import { $uid } from '@stores/session';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { AuthzSection } from './AuthzSection';
import { ProfileSection } from './ProfileSection';

export const SettingsApp: Component = () => {
  const uid = useStore($uid);

  return (
    <WithAuth allow={!!uid()}>
      <div class="content-columns">
        <article>
          <h2>{t('settings:personal.title')}</h2>
          <ProfileSection />
        </article>
        <article>
          <AuthzSection />
        </article>
      </div>
    </WithAuth>
  );
};
