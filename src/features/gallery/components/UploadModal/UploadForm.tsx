import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/shared/components/ui/select';
import { Field, FieldError, FieldLabel, FieldSet } from '@/shared/components/ui/field';
import { Loader2, SquareCode } from 'lucide-react';
import { ERROR_MESSAGES } from '@/features/gallery/constants';
import type { UploadFormErrors, UploadFormProps } from '@/features/gallery/types';
import { DialogFooter } from '@/shared/components/ui/dialog';
import { DELIVERY_TYPES, type DeliveryType } from '@/shared/types/ad';
import { Dropzone } from './Dropzone';
import { UploadedFile } from './UploadedFile';
import { useZipUpload } from '@/features/gallery/hooks/useZipUpload';

export const UploadForm = ({ onSubmit, isLoading, onCancel }: UploadFormProps) => {
  const [creativeName, setCreativeName] = useState('');
  const [client, setClient] = useState('');
  const [deliveryType, setDeliveryType] = useState<DeliveryType>(DELIVERY_TYPES[0]);
  const [featuresString, setFeaturesString] = useState('');
  const [errors, setErrors] = useState<UploadFormErrors>({});
  const [uploadProgress, setUploadProgress] = useState(0); // TODO: Use for upload progress

  const {
    analysisError,
    detectedFormats,
    detectedThumbnail,
    dropzone,
    file,
    isAnalyzingZip,
    removeFile,
    uploadErrors,
    uploadState,
  } = useZipUpload({
    disabled: isLoading,
    onFileAccepted: () => setErrors((prev) => ({ ...prev, file: undefined })),
  });

  const deliveryTypeItems = DELIVERY_TYPES.map((type) => ({
    label: type,
    value: type,
  }));

  const validate = (): boolean => {
    const newErrors: UploadFormErrors = {};

    if (!file) {
      newErrors.file = ERROR_MESSAGES.FILE_REQUIRED;
    }

    if (!creativeName.trim()) {
      newErrors.creativeName = ERROR_MESSAGES.CREATIVE_NAME_REQUIRED;
    }

    if (!client.trim()) {
      newErrors.client = ERROR_MESSAGES.CLIENT_REQUIRED;
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    // Convert comma-separated string to array
    const featuresArray = featuresString
      .split(',')
      .map((f) => f.trim())
      .filter((f) => f.length > 0);

    await onSubmit({
      file,
      creativeName: creativeName.trim(),
      client: client.trim(),
      deliveryType,
      formats: detectedFormats,
      features: featuresArray,
      thumbnail: detectedThumbnail,
    });
  };

  // Determine if we have any file-related error
  const hasFileError = !!errors.file || !!analysisError;

  return (
    <form onSubmit={handleSubmit}>
      <FieldSet className="p-2">
        {/* File Drop Zone */}
        <Field orientation="vertical" data-invalid={!!errors.file}>
          {file ? (
            <UploadedFile
              file={file}
              formats={detectedFormats}
              state={uploadState}
              progress={uploadProgress}
              errors={uploadErrors}
              onRemove={removeFile}
            />
          ) : (
            <Dropzone
              {...dropzone.getRootProps()}
              getInputProps={dropzone.getInputProps}
              isDragActive={dropzone.isDragActive}
              hasError={hasFileError}
              errorMessage={errors.file || analysisError || undefined}
              disabled={isAnalyzingZip || isLoading}
            />
          )}
          {/* Only show field error if file is required but not present */}
          {errors.file && !file && <FieldError>{errors.file}</FieldError>}
        </Field>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Creative Name */}
          <Field orientation="vertical" data-invalid={!!errors.creativeName}>
            <FieldLabel
              htmlFor="creativeName"
              className="text-xs text-muted-foreground font-bold uppercase tracking-wider"
            >
              Creative Name
            </FieldLabel>
            <Input
              id="creativeName"
              value={creativeName}
              onChange={(e) => {
                setCreativeName(e.target.value);
                setErrors((prev) => ({ ...prev, creativeName: undefined }));
              }}
              placeholder="e.g. Summer Launch 2024"
              disabled={isLoading}
              aria-invalid={!!errors.creativeName}
              data-invalid={!!errors.creativeName}
              className="h-10"
            />
            {errors.creativeName && <FieldError>{errors.creativeName}</FieldError>}
          </Field>

          {/* Client */}
          <Field orientation="vertical" data-invalid={!!errors.client}>
            <FieldLabel
              htmlFor="client"
              className="text-xs text-muted-foreground font-bold uppercase tracking-wider"
            >
              Client / Partner
            </FieldLabel>
            <Input
              id="client"
              value={client}
              onChange={(e) => {
                setClient(e.target.value);
                setErrors((prev) => ({ ...prev, client: undefined }));
              }}
              placeholder="e.g. Adidas"
              disabled={isLoading}
              aria-invalid={!!errors.client}
              data-invalid={!!errors.client}
              className="h-10"
            />
            {errors.client && <FieldError>{errors.client}</FieldError>}
          </Field>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {/* Delivery Type */}
          <Field orientation="vertical">
            <FieldLabel
              htmlFor="deliveryType"
              className="text-xs text-muted-foreground font-bold uppercase tracking-wider"
            >
              Delivery Type
            </FieldLabel>
            <Select
              items={deliveryTypeItems}
              value={deliveryType}
              onValueChange={(value) => setDeliveryType(value as DeliveryType)}
              disabled={isLoading}
            >
              <SelectTrigger
                id="deliveryType"
                className="h-10 [&]:h-10 [&]:min-h-10 w-full"
              >
                <SelectValue placeholder="Select delivery type" />
              </SelectTrigger>
              <SelectContent>
                <SelectGroup>
                  {deliveryTypeItems.map((item) => (
                    <SelectItem key={item.value} value={item.value}>
                      {item.label}
                    </SelectItem>
                  ))}
                </SelectGroup>
              </SelectContent>
            </Select>
          </Field>

          {/* Features - Comma Separated */}
          <Field orientation="vertical">
            <FieldLabel
              htmlFor="features"
              className="text-xs text-muted-foreground font-bold uppercase tracking-wider"
            >
              Features
            </FieldLabel>
            <Input
              id="features"
              value={featuresString}
              onChange={(e) => setFeaturesString(e.target.value)}
              placeholder="e.g. Countdown, Carousel, Parallax"
              disabled={isLoading}
              className="h-10"
            />
          </Field>
        </div>

        {/* Detected Formats Display */}
        <div>
          <p className="text-xs text-muted-foreground font-bold uppercase tracking-wide">
            Format (Size)
          </p>
          {isAnalyzingZip ? (
            <div className="flex items-center gap-2 mt-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span className="text-sm text-muted-foreground">
                Analyzing ZIP contents...
              </span>
            </div>
          ) : detectedFormats.length > 0 ? (
            <div className="flex flex-wrap gap-4 mt-2">
              {detectedFormats.map((format) => (
                <span
                  key={format}
                  className="inline-flex items-center gap-1.5 text-sm text-muted-foreground font-medium tracking-wider"
                >
                  <SquareCode className="size-4" />
                  {format}
                </span>
              ))}
            </div>
          ) : file ? (
            <p className="text-sm text-muted-foreground mt-2">
              {analysisError ||
                'No formats detected. Ensure your ZIP contains folders with format names (e.g., 300x250-CreativeName)'}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground mt-1">
              Upload a ZIP file to auto-detect formats
            </p>
          )}
        </div>
      </FieldSet>

      {/* Buttons */}
      <DialogFooter className="p-6 justify-end flex-row gap-6">
        {onCancel && (
          <Button type="button" variant="ghost" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        )}
        <Button
          type="submit"
          disabled={isLoading || !file || uploadState === 'error'}
          className="px-6"
        >
          {isLoading ? 'Uploading...' : 'Upload Ad'}
        </Button>
      </DialogFooter>
    </form>
  );
};
