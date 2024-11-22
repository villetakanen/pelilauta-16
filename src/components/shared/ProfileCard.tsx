import type { Component } from 'solid-js';
import { MarkdownSection } from 'src/components/shared/MarkdownSection';
import type { Profile } from 'src/schemas/ProfileSchema';

interface ProfileCardProps {
  profile?: Profile;
}

export const ProfileCard: Component<ProfileCardProps> = (props) => {
  return props.profile ? (
    <cn-card>
      <div class="flex">
        <cn-avatar src={props.profile.avatarURL} alt={props.profile.nick} />
        <section>
          <h3>{props.profile.nick}</h3>
          <p>
            <a href={`/profiles/${props.profile.key}`}>
              {props.profile.username}
            </a>
          </p>
          {props.profile.bio && (
            <MarkdownSection content={`${props.profile.bio}`} />
          )}
        </section>
      </div>
    </cn-card>
  ) : null;
};
