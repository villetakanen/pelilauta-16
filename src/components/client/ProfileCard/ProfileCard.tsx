import { toFid } from '@utils/toFid';
import type { Component } from 'solid-js';
import type { Profile } from 'src/schemas/ProfileSchema';

export const ProfileCard: Component<Profile> = (props) => {
  return (
    <cn-card>
      <div class="flex">
        <cn-avatar src={props.avatarURL} alt={props.nick} />
        <section>
          <h3>{props.nick}</h3>
          <p>
            <a href={`/profiles/${toFid(props.nick)}`}>{toFid(props.nick)}</a>
          </p>
          <p>{props.bio}</p>
        </section>
      </div>
    </cn-card>
  );
};
