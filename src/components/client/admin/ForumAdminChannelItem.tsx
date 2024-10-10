/**
 * A Solid-js line-item-form for managing a forum channel.
 */

import type { Channel } from '@schemas/ChannelSchema';
import type { Component } from 'solid-js';
import { ForumIconSelect } from './ForumIconSelect';
import { RepairThreadCountButton } from './RepairThreadCountButton';

interface ForumAdminChannelItemProps {
  channel: Channel;
  onChange: (channel: Channel) => void;
}

export const ForumAdminChannelItem: Component<ForumAdminChannelItemProps> = (
  props,
) => {
  const { channel } = props;

  const handleSubmit = (e: Event) => {
    e.preventDefault();
    console.log('Submit', e);
  };

  const updateChannel = (field: string, value: string | number) => {
    console.log('Update', props.channel.slug, field, value);
    props.onChange({ ...channel, [field]: value });
  };

  return (
    <div class="flex flex-col mb-2">
      <h4 class="downscaled m-0">
        <code>{channel.slug}</code>
      </h4>
      <div class="toolbar mb-0">
        <label class="grow">
          Name:
          <input
            type="text"
            value={channel.name}
            onChange={(name) => updateChannel('name', name.target.value)}
          />
        </label>
        <cn-icon noun={channel.icon} />
        <ForumIconSelect
          value={channel.icon}
          onChange={(icon) => updateChannel('icon', icon)}
        />
      </div>
      <div class="flex flex-row">
        <div class="flex flex-col">
          <button type="button" class="btn btn-primary">
            <cn-icon noun="arrow-up" />
          </button>
          <button type="button" class="btn btn-primary">
            <cn-icon noun="arrow-down" />
          </button>
        </div>

        <label class="grow">
          Description:
          <textarea
            onChange={(desc) => updateChannel('description', desc.target.value)}
          >
            {channel.description}
          </textarea>
        </label>

        <div class="toolbar elevation-1 border-radius">
          <p>
            {' '}
            Threads: {channel.threadCount}
            <RepairThreadCountButton
              slug={channel.slug}
              onRepairRequest={(count) => updateChannel('threadCount', count)}
            />
          </p>
        </div>
      </div>
    </div>
  );
};
