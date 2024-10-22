import { type CnListItem, CnSortableList } from '@11thdeg/cyan-next';
import { type Component, For, createSignal, onMount } from 'solid-js';

interface Props {
  items: CnListItem[];
  onItemsChanged?: (items: CnListItem[]) => void;
  delete?: boolean;
}

export const SortableList: Component<Props> = (props) => {
  const [items, setItems] = createSignal(props.items);

  function onItemsChanged(items: CnListItem[]) {
    setItems(items);
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

  return (
    <cn-sortable-list items={items()}>
      {props.delete && (
        <For each={items()}>
          {(item) => (
            <button
              slot={item.key}
              type="button"
              onClick={() =>
                onItemsChanged(items().filter((i) => i.key !== item.key))
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
