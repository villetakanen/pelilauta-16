import type { Component } from 'solid-js';

export const ChannelPage: Component<{ channelKey: string; offSet?: number }> = (
  props,
) => {
  return (
    <div>
      [ChannelPage]
      <br />
      Key {props.channelKey}
      <br />
      offSet: {props.offSet || 0}
    </div>
  );
};
