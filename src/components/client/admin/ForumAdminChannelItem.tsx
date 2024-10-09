/**
 * A Solid-js line-item-form for managing a forum channel.
 */

import type { Channel } from '@schemas/ChannelSchema';
import type { Component } from 'solid-js';
import { ForumIconSelect } from './ForumIconSelect';

interface ForumAdminChannelItemProps {
  channel: Channel;
}

export const ForumAdminChannelItem: Component<ForumAdminChannelItemProps> = (
  props,
) => {
  const { channel } = props;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Submit', e);
  };

  return (
    <div class="flex flex-row mb-2 border p-1">
      <div class="flex flex-col">
        <button type="button" class="btn btn-primary">
          <cn-icon noun="arrow-up" />
        </button>
        <button type="button" class="btn btn-primary">
          <cn-icon noun="arrow-down" />
        </button>
      </div>
      <form onSubmit={handleSubmit} class="grow">
        <div class="toolbar">
          <label class="grow">
            Name:
            <input type="text" value={channel.name} />
          </label>
          <cn-icon noun={channel.icon} />
          <ForumIconSelect
            value={channel.icon}
            onChange={(icon) => console.log('Icon', icon)}
          />
        </div>
        <label>
          Description:
          <textarea>{channel.description}</textarea>
        </label>
      </form>
    </div>
  );
};
