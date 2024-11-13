import type { Asset } from '@schemas/AssetSchema';
import type { Site } from '@schemas/SiteSchema';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, createSignal } from 'solid-js';
import { createStore } from 'solid-js/store';
import { LicenseSelect } from './LicenseSelect';

interface AssetEdiorFormProps {
  asset: Asset;
  site: Site;
}

const AssetEditorForm: Component<AssetEdiorFormProps> = (props) => {
  const [name, setName] = createSignal(props.asset.name);
  const [description, setDescription] = createSignal(props.asset.description);
  const [license, setLicense] = createSignal(props.asset.license);

  const handleSubmit = async (e: Event) => {
    e.preventDefault();
    // TODO: Implement Firebase submit logic
    logDebug('Form submitted', {
      name: name(),
      description: description(),
      license: license(),
    });
  };

  const hasFormChanged = () =>
    name() !== props.asset.name ||
    description() !== props.asset.description ||
    license() !== props.asset.license;

  return (
    <form onSubmit={handleSubmit} class="flex flex-col gap-4">
      <h4>{t('assets:edit.title')}</h4>
      <div class="flex flex-col">
        <label>
          {t('entries:assets.name')}
          <input
            type="text"
            value={name()}
            onInput={(e) => setName(e.currentTarget.value)}
          />
        </label>
        <label>
          {t('entries:assets.description')}
          <textarea
            value={description()}
            onInput={(e) => setDescription(e.currentTarget.value)}
          />
        </label>

        <LicenseSelect value={license()} onChange={setLicense} />
      </div>
      <button
        type="submit"
        disabled={!hasFormChanged()}
        class="bg-blue-500 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        Save Changes
      </button>
    </form>
  );
};

export default AssetEditorForm;
