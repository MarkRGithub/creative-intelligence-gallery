export interface ZipAnalysisResult {
  formats: string[];
  thumbnail: string | null;
  thumbnailFormat?: string | null;
  thumbnailSize?: number;
  thumbnailFileName?: string | null;
  thumbnailTooLarge?: boolean;
  missingItems?: string[];
}

export interface ZipFileEntry {
  name: string;
  path: string;
  isDirectory: boolean;
  size: number;
}
