import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

interface TagsPreviewProps {
  tags: string[];
}

export const TagsPreview: Component<TagsPreviewProps> = (props) => {
  return (
    <p class="cursive p-1 m-0">
      <span>{t('entries:thread.tags')}: </span>
      <For each={props.tags}>{(tag) => <span class="pill">{tag}</span>}</For>
    </p>
  );
};
