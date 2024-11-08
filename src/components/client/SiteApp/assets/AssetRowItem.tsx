/**
 * A Solid-js comoonent for rendering a single asset as a row item.
 */

import type { Asset } from '@schemas/AssetSchema';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

interface AssetRowItemProps {
  asset: Asset;
  onDelete?: (asset: Asset) => void;
  onEdit?: () => void;
}

export const AssetRowItem: Component<AssetRowItemProps> = (props) => {
  const isImage = props.asset.mimetype?.startsWith('image/');
  const isPDF = props.asset.mimetype === 'application/pdf';

  function onDelete() {
    if (props.onDelete) {
      props.onDelete(props.asset);
    }
  }

  return (
    <div class="flex flex-row items-center">
      {isImage && (
        <img src={props.asset.url} alt={props.asset.name} class="icon" />
      )}
      {isPDF && <cn-icon noun="file-pdf" class="icon" large />}
      {!isImage && !isPDF && <cn-icon noun="file" class="media" large />}
      <p class="grow">
        <a href={props.asset.url} target="_blank" rel="noopener noreferrer">
          {props.asset.name}
        </a>
      </p>

      {props.onDelete && (
        <button onClick={onDelete} type="button">
          <cn-icon noun="delete" />
          <span class="sm-hidden">{t('actions:delete')}</span>
        </button>
      )}
    </div>
  );
};
