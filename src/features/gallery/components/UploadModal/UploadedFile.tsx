import { FileArchive, XIcon } from 'lucide-react';
import {
  Attachment,
  AttachmentAction,
  AttachmentActions,
  AttachmentContent,
  AttachmentMedia,
  AttachmentTitle,
  AttachmentDescription,
} from '@/shared/components/ui/attachment';

export type UploadState = 'idle' | 'uploading' | 'done' | 'error';

interface UploadedFileProps {
  file: File;
  formats: string[];
  state: UploadState;
  progress?: number;
  errors?: string[];
  onRemove: () => void;
}

const formatFileSize = (bytes: number): string => {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(0) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
};

export function UploadedFile({
  file,
  formats,
  state,
  progress = 0,
  errors,
  onRemove,
}: UploadedFileProps) {
  const isUploading = state === 'uploading';
  const hasError = state === 'error';

  // Build description
  const descriptionParts = [
    formatFileSize(file.size),
    formats.length > 0 &&
      `${formats.length} ${formats.length > 1 ? 'formats' : 'format'}`,
  ].filter(Boolean);

  const description = descriptionParts.join(' • ');

  return (
    <div className="flex flex-col justify-center gap-2 rounded-lg border-2 border-dashed border-dz-border bg-muted p-4 transition-colors">
      <Attachment
        state={hasError ? 'error' : isUploading ? 'uploading' : 'done'}
        className="w-full p-3"
      >
        {/* File icon */}
        <AttachmentMedia>
          <FileArchive className="size-5" />
        </AttachmentMedia>

        {/* File info */}
        <AttachmentContent className="flex-1">
          <AttachmentTitle>{file.name}</AttachmentTitle>

          {/* Description */}
          <AttachmentDescription>
            {description}
            {isUploading && ' • Uploading...'}
          </AttachmentDescription>

          {/* Errors */}
          {hasError && errors && errors.length > 0 && (
            <div className="mt-1 space-y-0.5">
              {errors.map((msg, index) => (
                <p key={index} className="text-xs text-destructive">
                  • {msg}
                </p>
              ))}
            </div>
          )}

          {/* Progress bar */}
          {isUploading && (
            <div className="mt-2 h-1.5 w-full max-w-[200px] overflow-hidden rounded-full bg-muted">
              <div
                className="h-full bg-primary transition-all duration-300 ease-out"
                style={{ width: `${Math.min(progress, 100)}%` }}
              />
            </div>
          )}
        </AttachmentContent>

        {/* Actions */}
        <AttachmentActions>
          <AttachmentAction
            type="button"
            aria-label={`Remove ${file.name}`}
            onClick={onRemove}
            disabled={isUploading}
          >
            <XIcon className="h-4 w-4" />
          </AttachmentAction>
        </AttachmentActions>
      </Attachment>
    </div>
  );
}
