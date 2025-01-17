import { WithAuth } from '@client/shared/WithAuth';
import { useStore } from '@nanostores/solid';
import { ProfileCard } from '@shared/ProfileCard';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $profile, $uid } from 'src/stores/sessionStore';
import { AuthzSection } from './AuthzSection';
import { ProfileSection } from './ProfileSection';
import { PublicProfileTool } from './PublicProfileTool';

export const SettingsApp: Component = () => {
  const profile = useStore($profile);
  const uid = useStore($uid);

  return (
    <WithAuth allow={!!uid()}>
      <div class="content-columns">
        <article>
          <ProfileCard profile={profile() || undefined} />
          <PublicProfileTool />
        </article>
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
