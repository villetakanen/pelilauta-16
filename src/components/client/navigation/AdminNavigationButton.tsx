/**
 * A solid-js wrapper component for <cn-navigation-icon> web component.
 *
 * Hidden unless the user has the admin role.
 */

import { useStore } from '@nanostores/solid';
import { isAdmin } from '@stores/metaStore/metaStore';
import { $uid } from '@stores/sessionStore';

export const AdminNavigationButton = () => {
  const uid = useStore($uid);
  const visible = () => isAdmin(uid());

  return visible() ? (
    <a href="/admin">
      <cn-navigation-icon noun="admin" label="Admin" />
    </a>
  ) : null;
};
