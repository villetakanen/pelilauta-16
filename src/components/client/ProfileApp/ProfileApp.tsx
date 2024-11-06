import { WithLoader } from '@client/shared/WithLoader';
import { useStore } from '@nanostores/solid';
import { ProfileCard } from '@shared/ProfileCard';
import { getProfileAtom } from '@stores/profilesStore';
import type { Component } from 'solid-js';

export const ProfileApp: Component<{ uid: string }> = (props) => {
  const profile = useStore(getProfileAtom(props.uid));

  return (
    <WithLoader loading={!profile()}>
      <div class="content-columns">
        {profile() && <ProfileCard profile={profile()} />}
      </div>
    </WithLoader>
  );
};
