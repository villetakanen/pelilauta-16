import type { Component } from 'solid-js';
import { ThreadList } from './ThreadList';

export const ChannelPage: Component<{ channelKey: string; offSet?: number }> = (
  props,
) => {
  return (
    <div class="content-columns">
      <ThreadList channelKey={props.channelKey} offSet={props.offSet} />
      <article class="column-s debug">
        [ChannelPage]
        <br />
        Key {props.channelKey}
        <br />
        offSet: {props.offSet || 0}
      </article>
    </div>
  );
};
