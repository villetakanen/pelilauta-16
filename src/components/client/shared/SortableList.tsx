import { type CnListItem, CnSortableList } from '@11thdeg/cyan-next';
import { logDebug } from '@utils/logHelpers';
import { type Component, For, createEffect, onMount } from 'solid-js';

interface Props {
  items: CnListItem[];
  onItemsChanged?: (items: CnListItem[]) => void;
  delete?: boolean;
}

export const SortableList: Component<Props> = (props) => {
  function onItemsChanged(items: CnListItem[]) {
    props.onItemsChanged?.(items);
  }

  onMount(() => {
    const sortableList = document.querySelector('cn-sortable-list');
    if (sortableList instanceof CnSortableList) {
      sortableList.addEventListener('items-changed', (event) => {
        onItemsChanged(
          (event as CustomEvent<{ items: CnListItem[] }>).detail.items,
        );
      });
    }
  });

  createEffect(() => {
    logDebug('SortableList items changed', props.items);
  });

  return (
    <cn-sortable-list items={props.items}>
      {props.delete && (
        <For each={props.items}>
          {(item) => (
            <button
              slot={item.key}
              type="button"
              onClick={() =>
                onItemsChanged(props.items.filter((i) => i.key !== item.key))
              }
            >
              <cn-icon noun="delete" />
            </button>
          )}
        </For>
      )}
    </cn-sortable-list>
  );
};
