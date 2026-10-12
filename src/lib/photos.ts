import manifest from './photos.manifest.json';

const photos = manifest as Record<string, string>;

/** Photo slots the UI can use. Add `public/photos/<slot>.jpg` and rebuild — otherwise the SVG artwork is used. */
export type PhotoSlot =
  | 'hero' | 'about' | 'cta' | 'auth'
  | 'service-electrical' | 'service-plumbing' | 'service-ac-repair' | 'service-appliance-repair'
  | 'service-carpentry' | 'service-painting' | 'service-cleaning' | 'service-other';

export function photo(slot: PhotoSlot, fallback: string): { src: string; isPhoto: boolean } {
  const src = photos[slot];
  return src ? { src, isPhoto: true } : { src: fallback, isPhoto: false };
}
