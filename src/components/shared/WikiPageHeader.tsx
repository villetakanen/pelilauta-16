import type { Page } from '@schemas/PageSchema';
import type { Site } from '@schemas/SiteSchema';
import { toDisplayString } from '@utils/contentHelpers';
import type { Component } from 'solid-js';

export const WikiPageHeader: Component<{ page?: Page; site?: Site }> = (
  props,
) => {
  return (
    <nav class="flex space-between border-b p-0 mb-2">
      <p class="downscaled p-0 m-0">
        <a href={`/sites/${props.site?.key}`}>{props.site?.name}</a> /{' '}
        {props.page?.name}
      </p>
      <div style="flex-grow: 1" />
      <p class="downscaled p-0 m-0">{toDisplayString(props.page?.flowTime)}</p>
    </nav>
  );
};
