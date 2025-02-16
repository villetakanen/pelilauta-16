import { useStore } from '@nanostores/solid';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/session';
import { toDisplayString } from '@utils/contentHelpers';
import { systemToNoun } from '@utils/schemaHelpers';
import { type Component, createMemo } from 'solid-js';

export const SiteCard: Component<Site> = (props) => {
  const uid = useStore($uid);

  const owns = createMemo(() => props.owners.includes(uid()));
  const plays = createMemo(() => props.players?.includes(uid()));

  return (
    <cn-card
      href={`/sites/${props.key}`}
      noun={systemToNoun(props.system)}
      title={props.name}
      cover={props.posterURL || undefined}
    >
      <p>{props.description}</p>
      <div slot="actions" class="flex toolbar">
        {owns() && <cn-icon noun="avatar" />}
        {plays() && <cn-icon noun="adventurer" />}
        <div class="grow" />
        <p>{toDisplayString(props.flowTime)}</p>
      </div>
    </cn-card>
  );
};
