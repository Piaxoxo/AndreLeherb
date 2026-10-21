export type Photo = {
  /** full-size (lightbox) image */
  src: string;
  /** grid thumbnail */
  thumb: string;
  w: number;
  h: number;
  alt: string;
  caption: string;
  set: string;
};

/** Filled by scripts/gallery.mjs from public/gallery/*.webp; keep in sync. */
export const gallery: Photo[] = [];
