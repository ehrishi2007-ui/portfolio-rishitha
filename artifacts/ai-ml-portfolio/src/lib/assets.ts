import type { ProjectSlug } from '@/data/content';

/**
 * Eagerly resolves static images in /attached_assets to hashed build URLs.
 * Missing images simply do not appear in the glob map and resolve to null.
 */
const imageAssets = import.meta.glob<string>(
  '@assets/**/*.{png,jpg,jpeg,webp,svg}',
  {
    eager: true,
    query: '?url',
    import: 'default',
  },
);

/**
 * Lazily resolves project preview videos as URLs only when requested,
 * so video files are never eagerly bundled. Missing files resolve to null.
 */
const videoAssetLoaders = import.meta.glob<string>(
  '@assets/projects/*/preview.mp4',
  {
    eager: false,
    query: '?url',
    import: 'default',
  },
);

function findAssetEntry<T>(
  record: Record<string, T>,
  relativeSuffix: string,
): T | null {
  const normalizedTarget = `/attached_assets/${relativeSuffix.replace(/^\/+/, '')}`;
  for (const [key, value] of Object.entries(record)) {
    const normalizedKey = key.replace(/\\/g, '/');
    if (normalizedKey.endsWith(normalizedTarget)) {
      return value;
    }
  }
  return null;
}

export function getAvatarSilhouetteUrl(): string | null {
  return findAssetEntry(imageAssets, 'avatar/silhouette.png');
}

export function getOgImageUrl(): string | null {
  return findAssetEntry(imageAssets, 'og-image.png');
}

export function getProjectCoverUrl(slug: ProjectSlug): string | null {
  return findAssetEntry(imageAssets, `projects/${slug}/cover.png`);
}

export function hasProjectPreviewVideo(slug: ProjectSlug): boolean {
  return findAssetEntry(videoAssetLoaders, `projects/${slug}/preview.mp4`) !== null;
}

export async function loadProjectPreviewVideoUrl(
  slug: ProjectSlug,
): Promise<string | null> {
  const loader = findAssetEntry(
    videoAssetLoaders,
    `projects/${slug}/preview.mp4`,
  );
  if (!loader) {
    return null;
  }
  try {
    return await loader();
  } catch {
    return null;
  }
}

export function getResumeUrl(): string {
  return `${import.meta.env.BASE_URL}resume.pdf`;
}
