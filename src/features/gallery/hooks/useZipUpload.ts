import { useCallback, useEffect, useMemo, useState } from 'react';
import { useDropzone, type FileRejection } from 'react-dropzone';

import { ERROR_MESSAGES, MAX_FILE_SIZE } from '@/features/gallery/constants';
import type { ZipThumbnailInfo } from '@/features/gallery/types';
import { analyzeZip, cleanupZip, getMissingItemsMessage } from '@/lib/zip';
import type { UploadState } from '@/features/gallery/components/UploadModal/UploadedFile';

const emptyThumbnailInfo: ZipThumbnailInfo = {
  format: null,
  size: null,
  fileName: null,
  tooLarge: false,
};

const isZipFile = (file: File) =>
  file.type.includes('zip') || file.name.toLowerCase().endsWith('.zip');

const getRejectedFileMessage = (fileRejections: FileRejection[]) => {
  const firstError = fileRejections[0]?.errors[0];

  if (firstError?.code === 'file-too-large') {
    return ERROR_MESSAGES.FILE_TOO_LARGE;
  }

  if (firstError?.code === 'file-invalid-type') {
    return ERROR_MESSAGES.FILE_TYPE_INVALID;
  }

  return firstError?.message || ERROR_MESSAGES.FILE_TYPE_INVALID;
};

interface UseZipUploadOptions {
  disabled?: boolean;
  onFileAccepted?: () => void;
}

export const useZipUpload = ({
  disabled = false,
  onFileAccepted,
}: UseZipUploadOptions = {}) => {
  const [file, setFile] = useState<File | null>(null);
  const [detectedFormats, setDetectedFormats] = useState<string[]>([]);
  const [detectedThumbnail, setDetectedThumbnail] = useState<string | null>(null);
  const [thumbnailInfo, setThumbnailInfo] =
    useState<ZipThumbnailInfo>(emptyThumbnailInfo);
  const [isAnalyzingZip, setIsAnalyzingZip] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);

  const cleanupThumbnail = useCallback((thumbnail: string | null) => {
    if (thumbnail) {
      cleanupZip({ formats: [], thumbnail });
    }
  }, []);

  const resetAnalysis = useCallback(() => {
    setDetectedFormats([]);
    setDetectedThumbnail(null);
    setThumbnailInfo(emptyThumbnailInfo);
    setAnalysisError(null);
  }, []);

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      const selectedFile = acceptedFiles[0];
      if (!selectedFile) return;

      cleanupThumbnail(detectedThumbnail);
      setFile(selectedFile);
      resetAnalysis();
      onFileAccepted?.();

      if (!isZipFile(selectedFile)) {
        setAnalysisError(ERROR_MESSAGES.FILE_TYPE_INVALID);
        return;
      }

      try {
        setIsAnalyzingZip(true);
        const result = await analyzeZip(selectedFile);

        setDetectedFormats(result.formats);
        setDetectedThumbnail(result.thumbnail);
        setThumbnailInfo({
          format: result.thumbnailFormat || null,
          size: result.thumbnailSize || null,
          fileName: result.thumbnailFileName || null,
          tooLarge: result.thumbnailTooLarge || false,
        });

        setAnalysisError(getMissingItemsMessage(result));
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : 'Failed to analyze ZIP';
        setAnalysisError(errorMessage);
      } finally {
        setIsAnalyzingZip(false);
      }
    },
    [cleanupThumbnail, detectedThumbnail, onFileAccepted, resetAnalysis],
  );

  const onDropRejected = useCallback(
    (fileRejections: FileRejection[]) => {
      resetAnalysis();
      const errorMessage = getRejectedFileMessage(fileRejections);
      setAnalysisError(errorMessage);
    },
    [resetAnalysis],
  );

  const removeFile = useCallback(() => {
    cleanupThumbnail(detectedThumbnail);
    setFile(null);
    resetAnalysis();
  }, [cleanupThumbnail, detectedThumbnail, resetAnalysis]);

  const dropzone = useDropzone({
    onDrop,
    onDropRejected,
    onFileDialogCancel: () => {
      resetAnalysis();
    },
    accept: {
      'application/zip': ['.zip'],
    },
    maxSize: MAX_FILE_SIZE,
    multiple: false,
    disabled: disabled || isAnalyzingZip,
  });

  // ✅ Single source of truth for errors - all errors come from analysisError
  const uploadErrors = useMemo(() => {
    if (!analysisError) return undefined;
    return [analysisError];
  }, [analysisError]);

  // Upload state
  const uploadState = useMemo((): UploadState => {
    if (analysisError) return 'error';
    if (isAnalyzingZip) return 'uploading';
    if (file) return 'done';
    return 'idle';
  }, [analysisError, isAnalyzingZip, file]);

  useEffect(() => {
    return () => cleanupThumbnail(detectedThumbnail);
  }, [cleanupThumbnail, detectedThumbnail]);

  return {
    analysisError,
    detectedFormats,
    detectedThumbnail,
    dropzone,
    file,
    isAnalyzingZip,
    removeFile,
    thumbnailInfo,
    uploadErrors,
    uploadState,
  };
};
