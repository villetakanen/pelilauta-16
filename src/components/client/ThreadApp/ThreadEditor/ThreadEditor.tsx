import { WithLoader } from '@client/shared/WithLoader';
import { addThread } from '@firebase/client/threads/addThread';
import { useStore } from '@nanostores/solid';
import { fetchThread } from '@stores/ThreadsApp';
import { updateThread } from '@stores/ThreadsApp/updateThread';
import { $uid } from '@stores/sessionStore';
import { pushSessionSnack } from '@utils/client/snackUtils';
import { extractTags } from '@utils/contentHelpers';
import { t } from '@utils/i18n';
import { logDebug } from '@utils/logHelpers';
import { type Component, createEffect, createSignal, onMount } from 'solid-js';
import { ImagesPreviewSection } from './ImagesPreviewSection';
import { TagsPreview } from './TagsPreviewSection';
import { ThreadEditorTopBar } from './ThreadEditorTopBar';

export const ThreadEditor: Component<{
  threadKey?: string;
  topic?: string;
}> = (props) => {
  const uid = useStore($uid);
  let editorRef: undefined | HTMLElement;

  const [topic, setTopic] = createSignal<string>(props.topic || 'yleinen');
  const [tags, setTags] = createSignal<string[]>([]);
  const [title, setTitle] = createSignal<string>('');
  const [markdownContent, setMarkdownContent] = createSignal<string>('');
  const [suspend, setSuspend] = createSignal<boolean>(false);
  const [files, setFiles] = createSignal<File[]>([]);

  createEffect(() => {
    setTags(extractTags(markdownContent()));
  });

  async function handleEditorInput(e: Event) {
    const content = (e as CustomEvent<{ value: string }>).detail.value;
    setMarkdownContent(content);

    // Extract tags
    setTags(extractTags(content));
  }

  onMount(() => {
    const r = document.querySelector('cn-editor');
    if (r instanceof HTMLElement) {
      editorRef = r;
      editorRef.addEventListener('input', handleEditorInput);
    }

    if (props.threadKey) {
      setSuspend(true);
      // Load the thread
      fetchThread(props.threadKey).then((thread) => {
        if (thread) {
          setTitle(thread.title);
          setTopic(thread.channel || 'yleinen');
          setMarkdownContent(thread.markdownContent || '');
          setTags(thread.tags || []);
          setSuspend(false);
        } else {
          pushSessionSnack({
            message: t('snacks:threadNotFound'),
          });
          // Redirect to the thread
          window.location.href = `/threads/${props.threadKey}`;
        }
      });
    }
  });

  async function send(e: Event) {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const formData = new FormData(form);
    const data = {
      ...Object.fromEntries(formData.entries()),
      tags: tags(),
      topic: topic(),
      markdownContent: markdownContent(),
      owners: [uid()],
      public: true,
    };

    let key = props.threadKey;
    // If we dont have a threadKey, we are creating a new thread
    if (!props.threadKey) {
      key = await addThread(data, files(), uid());
    } else {
      console.log('Updating thread', props.threadKey, data);
      await updateThread(props.threadKey, data);
    }

    // Redirect to the thread
    window.location.href = `/threads/${key}`;
  }

  function filesUploaded(newFiles: File[]) {
    setFiles([...files(), ...newFiles]);
    logDebug(
      'Files uploaded',
      files()
        .map((f) => f.name)
        .join(', '),
    );
  }

  return (
    <WithLoader loading={suspend()}>
      <form onsubmit={send}>
        <div class="content-editor">
          <ThreadEditorTopBar
            title={title()}
            setTitle={setTitle}
            channel={topic()}
            setChannel={setTopic}
            filesUploaded={filesUploaded}
          />
          <div class="grow">
            <cn-editor
              ref={editorRef}
              value={markdownContent()}
              placeholder={t('entries:thread.placeholders.content')}
            />
          </div>
          {tags().length > 0 && <TagsPreview tags={tags()} />}
          {files().length && <ImagesPreviewSection files={files()} />}
          <div class="toolbar">
            <button type="reset" class="text">
              {t('actions:cancel')}
            </button>
            <button type="submit">
              <cn-icon noun="send" />
              <span>{t('actions:send')}</span>
            </button>
          </div>
        </div>
      </form>
    </WithLoader>
  );
};
