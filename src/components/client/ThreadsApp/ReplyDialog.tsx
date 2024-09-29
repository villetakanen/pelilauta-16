/**
 * A cn-dialog component that allows the user to reply to a thread.
 * 
 * Do note: we moved replying to a dialog to match the design of Threads, Linker, 
 * and other social media platforms.
 * 
 * The theory here is that people find it more intuitive to use a similar interface
 * across different platforms.
 */
import type { CnDialog } from '@11thdeg/cyan-next';
import type { Thread } from '@schemas/ThreadSchema';
import { logDebug } from '@utils/logHelpers';
import { createEffect, createSignal, type Component } from 'solid-js';

interface Props {
  thread?: Thread;
  open: boolean;
  onClose?: () => void ;
};

export const ReplyDialog: Component<Props> = (props) => {

  let dialogRef: CnDialog | undefined

  createEffect(() => {
    logDebug('ReplyDialog', 'open', props.open);
    if (props.open) {
      const dialog = dialogRef;
      if (dialog) {
        (dialog as CnDialog).showModal();
      }
    } else {
      const dialog = dialogRef;
      if (dialog) {
        (dialog as CnDialog).close();
      }
    }
  })

  return (
    <cn-dialog
      ref={dialogRef}
      title="Reply to Thread"
      onClose={props.onClose}
      open={props.open}
    >
      <p>[Reply Form goes here]</p>
    </cn-dialog>
  );
}