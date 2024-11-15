/**
 * A Solid-js comoonent for rendering a single asset as a row item.
 */

import { useStore } from '@nanostores/solid';
import type { Asset } from '@schemas/AssetSchema';
import type { Site } from '@schemas/SiteSchema';
import { $uid } from '@stores/sessionStore';
import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

interface AssetRowItemProps {
  site?: Site;
  asset: Asset;
  onDelete?: (asset: Asset) => void;
  onEdit?: () => void;
}

export const AssetRowItem: Component<AssetRowItemProps> = (props) => {
  const uid = useStore($uid);

  const isImage = props.asset.mimetype?.startsWith('image/');
  const isPDF = props.asset.mimetype === 'application/pdf';
  const showActions = () => props.site?.owners.includes(uid());

  function onDelete() {
    if (props.onDelete) {
      props.onDelete(props.asset);
    }
  }

  const hasLicense = () => props.asset.license !== '0';
  const license = hasLicense()
    ? `${t(`meta:licenses.${props.asset.license}`)} -`
    : '';

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
        <br />
        <span class="small">
          {hasLicense() && license} {props.asset.mimetype}
        </span>
      </p>

      {showActions() && (
        <a
          href={`/sites/${props.site?.key}/assets/${props.asset.name}`}
          class="button"
        >
          <cn-icon noun="edit" />
        </a>
      )}

      {showActions() && props.onDelete && (
        <button onClick={onDelete} type="button">
          <cn-icon noun="delete" />
          <span class="sm-hidden">{t('actions:delete')}</span>
        </button>
      )}
    </div>
  );
};
