import type { Component } from 'solid-js';
import { Portal } from 'solid-js/web';

type MediaSelectDialogProps = {
  open: boolean;
};

export const MediaSelectDialog: Component<MediaSelectDialogProps> = (props) => {
  return (
    <Portal mount={document.body}>
      <cn-dialog open={props.open}>
        <div class="flex">
          <p>[Missing funcionality]</p>
        </div>
      </cn-dialog>
    </Portal>
  );
};
