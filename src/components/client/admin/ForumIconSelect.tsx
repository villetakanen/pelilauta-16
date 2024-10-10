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
    'adventurer',
    'assets',
    'books',
    'card',
    'check',
    'd8',
    'd20',
    'dd5',
    'discussion',
    'edit',
    'fox',
    'monsters',
    'youtube',
  ];

  return (
    <label>
      icon:
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      >
        <For each={icons}>{(icon) => <option value={icon}>{icon}</option>}</For>
      </select>
    </label>
  );
};
