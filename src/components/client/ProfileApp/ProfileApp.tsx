import { ProfileCard } from '@client/ProfileCard/ProfileCard';
import { WithLoader } from '@client/shared/WithLoader';
import { useStore } from '@nanostores/solid';
import { getProfileAtom } from '@stores/profilesStore';
import type { Component } from 'solid-js';

export const ProfileApp: Component<{ uid: string }> = (props) => {
  const profile = useStore(getProfileAtom(props.uid));

  return (
    <WithLoader loading={!profile()}>
      <div class="content-columns">
        {profile() && (
          <ProfileCard
            key={profile().key}
            nick={profile().nick}
            avatarURL={profile().avatarURL}
          />
        )}
      </div>
    </WithLoader>
  );
};
