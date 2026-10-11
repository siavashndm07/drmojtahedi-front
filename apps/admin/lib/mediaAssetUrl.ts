/** Resolve media URLs for admin previews. */
export function mediaAssetUrl(path: string) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) {
    return path;
  }
  const mediaBase = process.env.NEXT_PUBLIC_MEDIA_BASE_URL?.replace(/\/$/, "");
  if (mediaBase && path.startsWith("/")) {
    return `${mediaBase}${path}`;
  }
  if (path.startsWith("/media/")) {
    return `http://127.0.0.1:8000${path}`;
  }
  return path;
}
