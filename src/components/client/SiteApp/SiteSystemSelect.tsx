/**
 * Solid JS wrapper for selecting a game system for a site.
 */

import { systemToNounMapping } from '@schemas/nouns';
import { t } from '@utils/i18n';
import { For } from 'solid-js';

interface SiteSystemSelectProps {
  system: string;
  setSystem: (system: string) => void;
}

export const SiteSystemSelect = (props: SiteSystemSelectProps) => {
  const noun = () => systemToNounMapping[props.system] || 'homebrew';

  return (
    <div class="flex flex-row flex-no-wrap items-center">
      <cn-icon noun={noun()} />
      <label class="grow">
        {t('entries:site.system')}
        <select
          value={props.system}
          onchange={(event) => props.setSystem(event.target.value)}
        >
          <For each={Object.keys(systemToNounMapping)}>
            {(system) => (
              <option value={system}>{t(`meta:systems.${system}`)}</option>
            )}
          </For>
        </select>
      </label>
    </div>
  );
};
