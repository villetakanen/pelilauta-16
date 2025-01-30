import { useStore } from '@nanostores/solid';
import { $profile } from '@stores/session';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

export const AvatarButton: Component = () => {
  const profile = useStore($profile);

  function closeOnClick(e: Event) {
    e.preventDefault();
    document.getElementById('avatar-popup')?.togglePopover();
  }

  function onLibrariesClick() {
    // open media dialog
  }

  return (
    <>
      <cn-avatar-button
        popovertarget="avatar-popup"
        src={profile()?.avatarURL}
      />
      <div id="avatar-popup" popover onclick={closeOnClick}>
        <nav class="menu">
          <p class="menu-item p-1">{t('actions:upload')}</p>
          <p class="menu-item p-1" onclick={onLibrariesClick}>
            {t('actions:selectFromLibrary')}
          </p>
        </nav>
      </div>
    </>
  );
};
