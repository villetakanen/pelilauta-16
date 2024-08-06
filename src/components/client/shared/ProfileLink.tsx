import { useStore } from '@nanostores/solid';
import { type Component, createEffect, createSignal } from 'solid-js';
import { $profiles, getProfile } from 'src/stores/profilesStore';

/**
 * A simple Solid-js component, that displays a nickname, and link to the profile page
 * for a given uid.
 */
export const ProfileLink: Component<{ uid: string }> = (props) => {
  const [nick, setNick] = createSignal<string | null>(null);
  const profiles = useStore($profiles);

  createEffect(() => {
    if (profiles()[props.uid]) {
      setNick(profiles()[props.uid].nick);
    } else {
      getProfile(props.uid);
    }
  });

  return (
    <>
      {nick() ? (
        <a href={`/profiles/${props.uid}`}>{nick()}</a>
      ) : (
        <span>...</span>
      )}
    </>
  );
};
