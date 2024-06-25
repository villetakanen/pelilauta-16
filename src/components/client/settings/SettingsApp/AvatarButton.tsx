import { MediaSelectDialog } from '@client/media/MediaSelectDialog';
import { useStore } from '@nanostores/solid';
import { t } from '@utils/i18n';
import { type Component, createSignal } from 'solid-js';
import { $profile } from 'src/stores/sessionStore';

export const AvatarButton: Component = () => {
  const [mediaDialogOpen, setMediaDialogOpen] = createSignal(false);
  const profile = useStore($profile);

  function closeOnClick(e: Event) {
    e.preventDefault();
    document.getElementById('avatar-popup')?.togglePopover();
  }

  function onLibrariesClick() {
    // open media dialog
    setMediaDialogOpen(true);
  }

  return (
    <>
      <cn-avatar-button
        popovertarget="avatar-popup"
        src={profile().avatarURL}
      />
      <div id="avatar-popup" popover onclick={closeOnClick}>
        <nav class="menu">
          <p class="menu-item p-1">{t('actions:upload')}</p>
          <p class="menu-item p-1" onclick={onLibrariesClick}>
            {t('actions:selectFromLibrary')}
          </p>
        </nav>
      </div>
      <MediaSelectDialog open={mediaDialogOpen()} />
    </>
  );
};
