import { marked } from 'marked';
import { type Component, createEffect, createSignal, onMount } from 'solid-js';

export const MarkdownSnippetSection: Component<{
  content: string;
  length?: number;
}> = (props) => {
  const [content, setContent] = createSignal(props.content);

  createEffect(async () => {
    const l = props.length || 220;

    // We want to stop at the first newline after the length
    const newlineIndex = props.content.indexOf('\n', l) || props.content.length;

    const markdown = await marked(props.content.slice(0, newlineIndex));
    setContent(markdown);
  });

  return <section class="markdown-section" innerHTML={content()} />;
};
