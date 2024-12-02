/**
 * A Solid JS top bar for the thread editor.
 *
 * Contains
 * 1. A title input field
 * 2. A channel select field
 * 3. Add image button (dialog, image upload to form, later
 *    uploaded to server, attached to thread)
 * 4. Images-to-be-uploaded section, with delete buttons for each image
 */

import FileUploadButton from '@client/SiteApp/assets/FileUploadButton';
import { useStore } from '@nanostores/solid';
import { $channels } from '@stores/ThreadsApp/topics';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

interface ThreadEditorTopBarProps {
  title: string;
  setTitle: (title: string) => void;
  channel: string;
  setChannel: (channel: string) => void;
  filesUploaded?: (files: File[]) => void;
}

export const ThreadEditorTopBar: Component<ThreadEditorTopBarProps> = (
  props,
) => {
  const channels = useStore($channels);

  function filesUploaded(files: FileList) {
    if (props.filesUploaded) {
      props.filesUploaded(Array.from(files));
    }
  }

  return (
    <div>
      <div class="toolbar m-0">
        <label class="grow">
          {t('entries:thread.title')}
          <input
            required
            name="title"
            type="text"
            value={props.title}
            onInput={(e) => props.setTitle(e.currentTarget.value)}
            placeholder={t('entries:thread.placeholders.title')}
          />
        </label>
        <label>
          {t('entries:thread.channel')}
          <select
            name="channel"
            value={props.channel}
            onChange={(e) => props.setChannel(e.currentTarget.value)}
          >
            <For each={channels()}>
              {(channel) => (
                <option value={channel.slug}>{channel.name}</option>
              )}
            </For>
          </select>
        </label>
        {props.filesUploaded && (
          <FileUploadButton filesUploaded={filesUploaded} />
        )}
      </div>
    </div>
  );
};
