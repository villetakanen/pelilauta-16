import { ProfileCard } from '@client/ProfileCard/ProfileCard';
import { WithLogin } from '@client/WithLogin/WithLogin';
import { DebugSection } from '@client/debug';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';
import { $profile } from 'src/stores/sessionStore';
import { ProfileSection } from './ProfileSection';

export const SettingsApp: Component = (props) => {
  const profile = useStore($profile);

  return (
    <WithLogin>
      <div class="content-columns">
        <article>
          <ProfileCard {...profile()} />
        </article>
        <article>
          <h2>{t('settings:personal.title')}</h2>
          <ProfileSection />
        </article>
        <article>
          <DebugSection />
        </article>
      </div>
    </WithLogin>
  );
};
