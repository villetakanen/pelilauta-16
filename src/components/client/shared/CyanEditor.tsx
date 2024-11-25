import { CnEditor } from "@11thdeg/cyan-next";
import { onCleanup, onMount, type Component } from "solid-js";

interface CnEditorProps {
  content: string;
  onInput: (content: string) => void;
}

/**
 * This is a solid-js wrapper for <cn-editor> custom (Lit) element
 */
export const CyanEditor: Component<CnEditorProps> = (props) => {
  let editorRef:CnEditor|null = null;

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
    }});

  function handleEditorInput(e: Event) {
    const content = (e as CustomEvent<{ value: string }>).detail.value;
    props.onInput(content);
  }

  return (
    <div class="grow">
      <cn-editor content={props.content} ref={editorRef}/>
    </div>
  );
};