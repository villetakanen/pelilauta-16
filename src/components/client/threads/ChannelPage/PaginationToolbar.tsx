/**
 * A simple <div class="toolbar"> with links to first, previous, next and last page
 *
 * The links are presented as numbers, starting from 1 and ending at the last page number.
 *
 * The links are generated using the <a> tag with the href attribute set to `/channels/${props.channelKey}?offSet=${pageNumber}`.
 *
 * Some examples: if we are on the first page:
 * 1, [2], |3], ... [n] (where n is the last page number)
 * [1], ... , [11], 12, [13], ... [n]
 * [1], ... , [n-2], [n-1], [n]
 */

import { t } from '@utils/i18n';
import { type Component, createMemo } from 'solid-js';

export const PaginationToolbar: Component<{
  channel: string;
  page?: number;
  pageCount?: number;
}> = (props) => {
  const currentPage = createMemo(() => {
    return props.page || 1;
  });

  const pageCount = createMemo(() => {
    return props.pageCount || 1;
  });

  /**
   * If the current page is larger than 3, we show "[1] ... " at the beginning of the list.
   */
  const showFirstPage = currentPage() > 2 && (
    <>
      <a href={`/channels/${props.channel}/1`}>1</a>, ...
    </>
  );

  /**
   * If the current page is more than 3 away from the last page, we show "... [n]" at the end of the list.
   */
  const showLastPage = currentPage() < pageCount() - 2 && (
    <>
      , ...{' '}
      <a href={`/channels/${props.channel}/${pageCount() - 1}`}>
        {pageCount() - 1}
      </a>
    </>
  );

  /**
   * if we are not the first page, we show the link to the previous page.
   */
  const showPreviousPage = currentPage() > 1 && (
    <>
      <a href={`/channels/${props.channel}/${currentPage() - 1}`}>
        {currentPage() - 1}
      </a>
      ,{' '}
    </>
  );

  /**
   * if we are not the last page, we show the link to the next page.
   */
  const showNextPage = currentPage() < pageCount() - 1 && (
    <>
      ,{' '}
      <a href={`/channels/${props.channel}/${currentPage() + 1}`}>
        {currentPage() + 1}
      </a>
    </>
  );

  return (
    <nav class="toolbar">
      <p>
        {t('threads:channel.page')}:{showFirstPage}&nbsp;
        {showPreviousPage}
        <span>{currentPage()}</span>
        {showNextPage}
        {showLastPage}
      </p>
      <p>{`${pageCount() - 1} ${t('threads:channel.pageCount')}`}</p>
    </nav>
  );
};
