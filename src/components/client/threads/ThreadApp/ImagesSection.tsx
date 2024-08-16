import type { Thread } from '@schemas/ThreadSchema';
import { type Component, For } from 'solid-js';

export const ImagesSection: Component<{ thread?: Thread }> = (props) => {
  return (
    <section class="elevation-1 p-1 border-radius flex flex-row">
      <For each={props.thread?.images}>
        {(image) => <img src={image.url} alt={image.alt} class="poster" />}
      </For>
    </section>
  );
};
