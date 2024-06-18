import { topicToNoun } from '@utils/schemaHelpers';
import type { Component } from 'solid-js';
import type { Thread } from 'src/schemas/ThreadSchema';

export const ThreadCard: Component<Thread> = (props) => {
  return (
    <cn-card
      href={`/threads/${props.key}`}
      noun={topicToNoun(props.topic)}
      title={props.title}
    />
  );
};
