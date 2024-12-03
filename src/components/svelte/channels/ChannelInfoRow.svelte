<script lang="ts">
import type { Channel } from '@schemas/ChannelSchema';
import { toDisplayString } from '@utils/contentHelpers';

interface Props {
  channel: Channel;
}

const { channel }: Props = $props();
</script>

<div class="flex flex-no-wrap hoverable p-2 mx--2">
  <cn-icon class="no-shrink" noun={channel.icon} ></cn-icon>

<div class="grow">
  <h4 class="downscaled mb-1">
    <a href={`/channels/${channel.slug}/1`}>{channel.name}</a>
  </h4>
  <p class="m-0">{channel.description}</p>
</div>

<div class="downscaled no-shrink" style="width: 20%">
  <p class="m-0 mb-0">
    {channel.threadCount}&nbsp;
    <cn-icon xsmall noun="discussion" ></cn-icon>
    <br />
    {toDisplayString(channel.flowTime)}
  </p>
</div>
</div>