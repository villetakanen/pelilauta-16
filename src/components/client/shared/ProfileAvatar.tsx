import { useStore } from '@nanostores/solid';
import { $profiles, getProfile } from '@stores/profilesStore';
import { type Component, createEffect, createSignal } from 'solid-js';

/**
 * A simple Solid-js component, that displays a nickname, and link to the profile page
 * for a given uid.
 */
export const ProfileAvatar: Component<{ uid: string }> = (props) => {
  const [nick, setNick] = createSignal<string | null>(null);
  const [avatarURL, setAvatarURL] = createSignal<string | null>(null);
  const profiles = useStore($profiles);

  createEffect(() => {
    if (profiles()[props.uid]) {
      const p = profiles()[props.uid];
      setNick(p.nick);
      p.avatarURL && setAvatarURL(p.avatarURL);
    } else {
      getProfile(props.uid);
    }
  });

  return (
    <>
      {nick() ? (
        <cn-avatar src={avatarURL()} nick={nick()} class="no-grow no-shrink" />
      ) : (
        <span class="no-grow">...</span>
      )}
    </>
  );
};
