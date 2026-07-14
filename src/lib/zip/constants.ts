export const ZIP_CONSTANTS = {
  THUMBNAIL_PATTERN: /^(?:[^/]+\/)?thumbnail\.(jpeg|jpg|png|webp|gif)$/i,
  FORMAT_PATTERN: /^(?:[^/]+\/)?(\d+x\d+)-/,
  MAX_FILE_SIZE: 50 * 1024 * 1024, // 50MB
  MAX_THUMBNAIL_SIZE: 500 * 1024, // 500KB
} as const;

export const DEFAULT_FORMATS: string[] = [];
