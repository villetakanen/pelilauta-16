import { type Component, createMemo } from 'solid-js';

export const PosterSection: Component<{ title: string; poster?: string }> = (
  props,
) => {
  const title = createMemo(() => props.title);
  const poster = createMemo(() => props.poster);

  return (
    <section style="position: relative;" class="elevation-1 flex p-1">
      <div style="flex-grow: 1" />
      {!poster() && (
        <h2 style="position: absolute; bottom: 8px; right: 8px">{title()}</h2>
      )}
      {poster() && <img src={poster()} alt={title()} class="poster" />}
      <div style="flex-grow: 1" />
    </section>
  );
};
