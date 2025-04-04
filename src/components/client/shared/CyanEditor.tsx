import { type Component, onCleanup, onMount } from 'solid-js';
import { CnEditor } from '../../../../cn-editor/src/cn-editor';

interface CnEditorProps {
  value: string;
  onInput: (content: string) => void;
}

/**
 * This is a solid-js wrapper for <cn-editor> custom (Lit) element
 */
export const CyanEditor: Component<CnEditorProps> = (props) => {
  let editorRef: CnEditor | null = null;

  onCleanup(() => {
    if (editorRef instanceof CnEditor) {
      editorRef.removeEventListener('input', handleEditorInput);
    }
  });

  onMount(() => {
    const r = document.querySelector('cn-editor');
    if (r instanceof CnEditor) {
      editorRef = r;
      editorRef.addEventListener('input', handleEditorInput);
    }
  });

  function handleEditorInput(e: Event) {
    const content = (e as CustomEvent<{ value: string }>).detail.value;
    props.onInput(content);
  }

  return (
    <div class="grow">
      <cn-editor value={props.value} ref={editorRef} />
    </div>
  );
};
