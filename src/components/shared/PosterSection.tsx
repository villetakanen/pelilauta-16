import { type Component, createMemo } from 'solid-js';

export const PosterSection: Component<{ title: string; poster?: string }> = (
  props,
) => {
  const title = createMemo(() => props.title);
  const poster = createMemo(() => props.poster);

  return (
    <section
      style="position: relative;"
      class="elevation-1 flex p-1 page-poster-section"
    >
      <div class="grow" />
      {!poster() && (
        <h2 style="position: absolute; bottom: 8px; right: 8px">{title()}</h2>
      )}
      {poster() && <img src={poster()} alt={title()} class="poster" />}
      <div class="grow" />
    </section>
  );
};
