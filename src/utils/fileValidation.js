const MAX_IMAGE_BYTES = 8 * 1024 * 1024;
const SAFE_IMAGE_TYPES = new Set([
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/heic",
  "image/heif",
]);

export function validateImageFile(file, { maxBytes = MAX_IMAGE_BYTES } = {}) {
  if (!file) return "Choose an image first.";
  if (!SAFE_IMAGE_TYPES.has(String(file.type || "").toLowerCase())) {
    return "Use a JPG, PNG, WebP, HEIC or HEIF image.";
  }
  if (!file.size || file.size > maxBytes) {
    return `Image must be smaller than ${Math.round(maxBytes / 1024 / 1024)} MB.`;
  }
  return "";
}
