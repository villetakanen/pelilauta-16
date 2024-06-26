import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { toDisplayString } from '@utils/contentHelpers';
import { systemToNoun } from '@utils/schemaHelpers';
import { type Component, createMemo } from 'solid-js';
import { $uid } from 'src/stores/sessionStore';

export const SiteCard: Component<Site> = (props) => {
  const uid = useStore($uid);

  const owns = createMemo(() => props.owners.includes(uid()));
  const plays = createMemo(() => props.players?.includes(uid()));

  return (
    <cn-card
      href={`/sites/${props.key}`}
      noun={systemToNoun(props.system)}
      title={props.name}
      cover={props.posterURL}
    >
      <p>{props.description}</p>
      <div slot="actions" class="toolbar">
        {owns() && <cn-icon noun="avatar" />}
        {plays() && <cn-icon noun="adventurer" />}
        <p>{toDisplayString(props.flowTime)}</p>
      </div>
    </cn-card>
  );
};
