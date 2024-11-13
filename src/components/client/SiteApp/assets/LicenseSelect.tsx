/**
 * A Solid-js wrapper for select, with pre-populated values for Asset.license.
 */

import { ASSET_LICENSES_KEYS } from '@schemas/AssetSchema';
import { t } from '@utils/i18n';
import { type Component, For } from 'solid-js';

interface LicenseSelectProps {
  value: string;
  onChange: (value: string) => void;
}

export const LicenseSelect: Component<LicenseSelectProps> = (props) => {
  return (
    <label>
      {t('entries:assets.license')}
      <select
        value={props.value}
        onChange={(e) => props.onChange(e.currentTarget.value)}
      >
        <For each={ASSET_LICENSES_KEYS}>
          {(license) => (
            <option value={license}>{t(`assets:license.${license}`)}</option>
          )}
        </For>
      </select>
    </label>
  );
};
