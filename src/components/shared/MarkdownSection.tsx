import { marked } from 'marked';
import { type Component, createEffect, createSignal } from 'solid-js';

export const MarkdownSection: Component<{ content: string }> = (props) => {
  const [content, setContent] = createSignal(props.content);

  createEffect(async () => {
    const markdown = await marked(props.content);
    setContent(markdown);
  });

  return <section class="markdown-section" innerHTML={content()} />;
};
