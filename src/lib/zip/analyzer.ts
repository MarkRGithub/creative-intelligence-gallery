import JSZip from 'jszip';
import { ZIP_CONSTANTS } from './constants';
import type { ZipAnalysisResult } from './types';

/**
 * Helper to get just the filename from a path
 */
const getFileNameFromPath = (path: string): string => {
  return path.split('/').pop() || path;
};

/**
 * Analyze ZIP file to detect formats and extract thumbnail
 */
export const analyzeZip = async (file: File): Promise<ZipAnalysisResult> => {
  try {
    const zip = await JSZip.loadAsync(file);
    const formats: string[] = [];
    let thumbnail: string | null = null;
    let thumbnailBlob: Blob | null = null;
    let thumbnailFormat: string | null = null;
    let thumbnailSize: number = 0;
    let thumbnailFileName: string | null = null;
    let thumbnailTooLarge: boolean = false;

    // 1. Find thumbnail (root OR parent folder only)
    try {
      const thumbnailFiles = zip.file(ZIP_CONSTANTS.THUMBNAIL_PATTERN);
      if (thumbnailFiles.length > 0) {
        const thumbnailFile = thumbnailFiles[0];
        // Extract just the filename from the full path
        thumbnailFileName = getFileNameFromPath(thumbnailFile.name);
        thumbnailBlob = await thumbnailFile.async('blob');
        thumbnailSize = thumbnailBlob.size;

        const extension = thumbnailFileName.split('.').pop()?.toLowerCase() || 'jpeg';
        thumbnailFormat = extension;

        if (thumbnailSize > ZIP_CONSTANTS.MAX_THUMBNAIL_SIZE) {
          thumbnailTooLarge = true;
          console.warn(
            `Thumbnail size (${(thumbnailSize / 1024).toFixed(0)}KB) exceeds ${ZIP_CONSTANTS.MAX_THUMBNAIL_SIZE / 1024}KB limit`,
          );
        }

        thumbnail = URL.createObjectURL(thumbnailBlob);
      }
    } catch (error) {
      console.warn('Could not extract thumbnail:', error);
      thumbnail = null;
    }

    // 2. Find format folders (root OR parent folder only)
    const folderNames = new Set<string>();
    zip.forEach((relativePath) => {
      if (relativePath.endsWith('/')) {
        const match = relativePath.match(ZIP_CONSTANTS.FORMAT_PATTERN);
        if (match) {
          folderNames.add(match[1]);
        }
      }
    });

    formats.push(...Array.from(folderNames).sort());

    // 3. Build missing items list for better error messages
    const missingItems: string[] = [];
    if (formats.length === 0) {
      missingItems.push('formats');
    }
    if (!thumbnail) {
      missingItems.push('thumbnail');
    }

    return {
      formats,
      thumbnail,
      thumbnailFormat,
      thumbnailSize,
      thumbnailFileName,
      thumbnailTooLarge,
      missingItems: missingItems.length > 0 ? missingItems : undefined,
    };
  } catch (error) {
    console.error('Failed to analyze ZIP:', error);
    throw new Error(
      "Failed to analyze ZIP file. Please ensure it's a valid ZIP archive.",
      { cause: error },
    );
  }
};

/**
 * Clean up object URLs created during analysis
 */
export const cleanupZip = (result: ZipAnalysisResult | null) => {
  if (result?.thumbnail) {
    URL.revokeObjectURL(result.thumbnail);
  }
};

/**
 * Get user-friendly error message about what's missing
 */
export const getMissingItemsMessage = (result: ZipAnalysisResult): string | null => {
  const missing: string[] = [];

  if (result.formats.length === 0) {
    missing.push('format folders (e.g., 300x250-CreativeName)');
  }

  if (!result.thumbnail) {
    missing.push('thumbnail image (thumbnail.jpeg/png/webp/gif)');
  }

  if (missing.length === 0) return null;

  if (missing.length === 1) {
    return `Missing ${missing[0]}. Please ensure your ZIP contains a ${missing[0]}.`;
  }

  const last = missing.pop();
  return `Missing ${missing.join(', ')} and ${last}. Please ensure your ZIP contains these items.`;
};
