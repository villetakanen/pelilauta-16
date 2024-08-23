import { useStore } from '@nanostores/solid';
import { $gamesystems } from '@stores/SitesApp/systemsStore';
import { t } from '@utils/i18n';
import { type Component, For, createSignal } from 'solid-js';

interface Props {
  value: string;
  onChange: (value: string) => void;
}

export const GameSystemSelect: Component<Props> = (props) => {
  const systems = useStore($gamesystems);
  const [value, setValue] = createSignal(props.value);

  const handleChange = (value: string) => {
    setValue(value);
    props.onChange(value);
  };

  function noun() {
    return systems().find((system) => system.key === value())?.icon || 'fox';
  }

  return (
    <section class="toolbar items-center">
      <cn-icon noun={noun()} />
      <label class="grow">
        {t('entries:site.system')}
        <select
          value={props.value}
          onChange={(e) => handleChange(e.currentTarget.value)}
        >
          <For each={systems()}>
            {(system) => <option value={system.key}>{system.title}</option>}
          </For>
        </select>
      </label>
    </section>
  );
};
