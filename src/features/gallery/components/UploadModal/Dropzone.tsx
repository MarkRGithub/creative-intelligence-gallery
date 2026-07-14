import * as React from 'react';
import { FileUp } from 'lucide-react';
import type { DropzoneInputProps } from 'react-dropzone';

import { MAX_FILE_SIZE } from '@/features/gallery/constants';
import { cn } from '@/lib/utils';

export interface DropzoneProps extends React.HTMLAttributes<HTMLDivElement> {
  getInputProps: <T extends DropzoneInputProps>(props?: T) => T & DropzoneInputProps;
  isDragActive?: boolean;
  hasError?: boolean;
  errorMessage?: string;
  disabled?: boolean;
}

export function Dropzone({
  getInputProps,
  isDragActive = false,
  hasError = false,
  errorMessage,
  disabled = false,
  className,
  ...props
}: DropzoneProps) {
  return (
    <div
      className={cn(
        'group relative rounded-lg p-4 text-center',
        'cursor-pointer transition-all duration-300 bg-muted hover:bg-dz',
        isDragActive && 'bg-dz scale-[0.99]',
        hasError && 'border-destructive',
        disabled && 'pointer-events-none opacity-60',
        className,
      )}
      {...props}
    >
      <svg
        className={cn(
          'pointer-events-none absolute inset-0 h-full w-full',
          'transition-colors',
          hasError
            ? 'text-destructive/50'
            : isDragActive
              ? 'text-primary/50'
              : 'text-dz-border group-hover:text-primary/50',
        )}
        aria-hidden
      >
        <rect
          className={cn(isDragActive && 'dropzone-border')}
          x="1"
          y="1"
          width="calc(100% - 2px)"
          height="calc(100% - 2px)"
          rx="7"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeDasharray="6 4"
          strokeLinecap="round"
          vectorEffect="non-scaling-stroke"
        />
      </svg>

      <input {...getInputProps()} />

      <div className="relative flex h-32 flex-col items-center justify-center overflow-hidden">
        <FileUp
          className={cn(
            'h-8 w-8 text-chips-foreground opacity-50 transition-all duration-300 ease-out group-hover:opacity-100',
            isDragActive && 'translate-y-4 animate-bounce opacity-100',
          )}
        />

        <div
          className={cn(
            'transition-all duration-300 ease-out text-muted-foreground group-hover:text-foreground',
            isDragActive && 'translate-y-4 text-foreground',
          )}
        >
          <p className="mt-2 text-sm font-bold">
            {isDragActive ? 'Release to upload' : 'Drop your ZIP file here'}
          </p>

          <p className="mt-1 text-xs text-muted-foreground">
            Maximum file size: {MAX_FILE_SIZE / 1024 / 1024}MB
          </p>

          {hasError && errorMessage && (
            <p className="mt-2 text-sm font-medium text-destructive">{errorMessage}</p>
          )}
        </div>
      </div>
    </div>
  );
}
