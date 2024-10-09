/**
 * A solid-js wrapper component for <select>, providing a list of
 * available forum icons (hardcoded here for now).
 */

import { type Component, For } from 'solid-js';

export const ForumIconSelect: Component<{
  value: string;
  onChange: (value: string) => void;
}> = (props) => {
  const icons = [
    'fox',
    'discussion',
    'd20',
    'adventurer',
    'edit',
    'monsters',
    'youtube',
  ];

  return (
    <select
      value={props.value}
      onChange={(e) => props.onChange(e.currentTarget.value)}
    >
      <For each={icons}>{(icon) => <option value={icon}>{icon}</option>}</For>
    </select>
  );
};
