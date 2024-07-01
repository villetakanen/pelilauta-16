import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

export const PageBackgroundPoster: Component<{ url: string }> = (props) => {
  const mount = document.querySelector('main');

  return (
    <>
      {mount !== null && (
        <Portal mount={mount}>
          <div class="pageBackgroundPoster" aria-hidden="true">
            <img
              src={props.url}
              alt="Poster"
              class="pageBackgroundPoster__image"
            />
          </div>
        </Portal>
      )}
    </>
  );
};
