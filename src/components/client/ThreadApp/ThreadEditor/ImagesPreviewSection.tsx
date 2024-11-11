/**
 * A Preview wrapper for ../ImagesSection.tsx  solid-js component, that takes in
 * an array of JS File objects, and renders them as images with captions.
 *
 * As these are File objects, we need to read them as URLs, and then render them
 * as images (64-bit encoded URLs).
 */

import type { Component } from 'solid-js';
import { ImagesSection } from '../ImagesSection';

interface ImagesPreviewSectionProps {
  files: File[];
}

export const ImagesPreviewSection: Component<ImagesPreviewSectionProps> = (
  props,
) => {
  const figures = () =>
    props.files.map((file) => {
      return {
        caption: file.name,
        src: URL.createObjectURL(file),
      };
    });

  return <ImagesSection figures={figures()} />;
};
