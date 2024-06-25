import { useStore } from '@nanostores/solid';
import { type Component, For } from 'solid-js';
import { Portal } from 'solid-js/web';
import { $assets } from 'src/stores/assetStore';

type MediaSelectDialogProps = {
  open: boolean;
};

export const MediaSelectDialog: Component<MediaSelectDialogProps> = (props) => {
  const assets = useStore($assets);

  return (
    <Portal mount={document.body}>
      <cn-dialog open={props.open}>
        Media select! {assets().length}
        <div class="flex">
          <For each={assets()}>
            {(asset) => (
              <img
                src={asset.url}
                alt={asset.name}
                style="height: 128px; width: 128px"
              />
            )}
          </For>
        </div>
      </cn-dialog>
    </Portal>
  );
};
