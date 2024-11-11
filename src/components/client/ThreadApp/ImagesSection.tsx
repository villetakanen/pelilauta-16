import { type Component, For, createMemo } from 'solid-js';

type figure = {
  caption: string;
  src: string;
};

interface ImagesSectionProps {
  figures: figure[];
}

export const ImagesSection: Component<ImagesSectionProps> = (props) => {
  const figures = createMemo(() => props.figures);
  return (
    <div class="images-section flex flex-no-wrap items-start justify-center elevation-1 mb-1 p-1">
      <For each={figures()}>
        {(figure) => (
          <figure class="shrink p-1 elevation-2 m-0">
            <img src={figure.src} alt={figure.caption} />
            <figcaption>{figure.caption}</figcaption>
          </figure>
        )}
      </For>
    </div>
  );
};
