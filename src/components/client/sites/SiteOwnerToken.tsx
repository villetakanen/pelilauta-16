/**
 * A Solid-JS client side icon for site owner token
 *
 * Visible if the $uid is part of the props.site.owners array
 */
import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import type { Component } from 'solid-js';

export const SiteOwnerToken: Component<Site> = (props) => {
  const uid = useStore($uid);

  function visible() {
    return props.owners.includes(uid());
  }

  return <>{visible() && <cn-icon noun="avatar" small />}</>;
};
