import { WithAuth } from '@client/shared/WithAuth';
import { useStore } from '@nanostores/solid';
import { $uid } from '@stores/session';
import type { Component } from 'solid-js';
import { ProfileSection } from './ProfileSection';

export const SettingsApp: Component = () => {
  const uid = useStore($uid);

  return (
    <WithAuth allow={!!uid()}>
      <div class="content-columns">
        <article>
          <ProfileSection />
        </article>
      </div>
    </WithAuth>
  );
};
