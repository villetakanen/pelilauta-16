/**
 * A Solid-js component that renders a button that opens a dialog to reply to a thread.
 * 
 * This component is used in the ThreadsApp component, it injects the ReplyDialog component
 * to the #base-tail div at the end of each astro-layout component.
 */

import type { Thread } from "@schemas/ThreadSchema";
import { createSignal, type Component } from "solid-js";
import { Portal } from "solid-js/web";
import { ReplyDialog } from "./ReplyDialog";

interface Props {
    thread?: Thread;
    onClose?: () => void ;
  };

export const ReplyButton: Component<Props> = (props) => {

    const [showModal, setShowModal] = createSignal(false);

    return (
      <>
        <button type="button" onClick={() => setShowModal(true)}>Reply</button>
        <Portal mount={document.querySelector('#base-tail') as Node}>
          <ReplyDialog {...props} open={showModal()} />
        </Portal>
      </>    
    );
}