import type { Thread } from '@schemas/ThreadSchema';
import { type Component, For } from 'solid-js';

export const ImagesSection: Component<{ thread?: Thread }> = (props) => {
  return (
    <>
      {props.thread?.images && props.thread.images.length > 0 && (
        <section class="elevation-1 p-1 border-radius flex flex-no-wrap">
          <For each={props.thread?.images}>
            {(image) => (
              <div class="shrink">
                <a href={image.url} target="_blank" rel="noreferrer">
                  <img src={image.url} alt={image.alt} class="poster" />
                </a>
              </div>
            )}
          </For>
        </section>
      )}
    </>
  );
};
