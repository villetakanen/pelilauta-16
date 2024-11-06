import { ProfileCard } from '@client/ProfileCard/ProfileCard';
import { WithLogin } from '@client/shared/WithLogin';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $profile } from 'src/stores/sessionStore';
import { AuthzSection } from './AuthzSection';
import { ProfileSection } from './ProfileSection';
import { PublicProfileTool } from './PublicProfileTool';

export const SettingsApp: Component = () => {
  const profile = useStore($profile);

  return (
    <WithLogin>
      <div class="content-columns">
        <article>
          <ProfileCard {...profile()} />
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
    </WithLogin>
  );
};
