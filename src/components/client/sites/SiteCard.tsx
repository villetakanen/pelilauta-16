import type { Site } from '@schemas/SiteSchema';
import { systemToNoun } from '@utils/schemaHelpers';
import type { Component } from 'solid-js';

export const SiteCard: Component<Site> = (props) => {
  return (
    <cn-card
      href={`/sites/${props.key}`}
      noun={systemToNoun(props.system)}
      title={props.name}
      cover={props.posterURL}
    >
      <p>{props.description}</p>
      <div slot="actions">...</div>
    </cn-card>
  );
};
