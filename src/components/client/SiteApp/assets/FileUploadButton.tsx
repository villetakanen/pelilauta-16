import { t } from '@utils/i18n';
import type { Component } from 'solid-js';

interface FileUploadButtonProps {
  filesUploaded: (files: FileList) => void;
  class?: string;
}

const FileUploadButton: Component<FileUploadButtonProps> = (props) => {
  let fileInputRef: undefined | HTMLInputElement;

  const handleButtonClick = () => {
    fileInputRef?.click();
  };

  const handleFileChange = (event: Event) => {
    const files = (event.target as HTMLInputElement)?.files;
    if (files) {
      props.filesUploaded(files);
    }
  };

  return (
    <div>
      <input
        type="file"
        onChange={handleFileChange}
        ref={fileInputRef}
        style={{ display: 'none' }}
      />
      <button class={props.class} onClick={handleButtonClick} type="button">
        <cn-icon noun="assets" />
        <span>{t('actions:upload')}</span>
      </button>
    </div>
  );
};

export default FileUploadButton;
