import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { validateUploadedPhoto } from '../services/imageValidation';
import { UploadCloud, CheckCircle2, AlertTriangle, Trash2, RefreshCw } from 'lucide-react';

interface PhotoUploaderProps {
  hasPhoto: boolean;
  onPhotoLoaded: (image: HTMLImageElement, url: string) => void;
  onPhotoRemoved: () => void;
}

export const PhotoUploader: React.FC<PhotoUploaderProps> = ({
  hasPhoto,
  onPhotoLoaded,
  onPhotoRemoved,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [isValidating, setIsValidating] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successInfo, setSuccessInfo] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const processFile = async (file: File) => {
    setErrorMessage(null);
    setSuccessInfo(null);
    setIsValidating(true);

    try {
      const result = await validateUploadedPhoto(file);

      if (!result.isValid || !result.image) {
        setErrorMessage(result.errorMessage || 'Invalid image file.');
        return;
      }

      const objectUrl = URL.createObjectURL(file);
      onPhotoLoaded(result.image, objectUrl);
      setSuccessInfo(
        `Photo loaded (${result.dimensions?.width}×${result.dimensions?.height}px)`
      );
    } catch {
      setErrorMessage('An unexpected error occurred while validating the image.');
    } finally {
      setIsValidating(false);
    }
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFile(e.target.files[0]);
    }
  };

  const handleRemove = () => {
    onPhotoRemoved();
    setSuccessInfo(null);
    setErrorMessage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="control-section photo-uploader-section">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/png,image/webp"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      {hasPhoto ? (
        /* Sleek compact bar when photo is already loaded */
        <div className="photo-compact-ready-bar">
          <div className="photo-ready-left">
            <span className="photo-ready-badge">
              <CheckCircle2 size={15} />
            </span>
            <div className="photo-ready-text">
              <span className="photo-ready-title">Portrait Photo Added</span>
              <span className="photo-ready-hint">Drag card above to frame</span>
            </div>
          </div>
          <div className="photo-ready-actions">
            <button
              type="button"
              className="btn-change-photo"
              onClick={() => fileInputRef.current?.click()}
              title="Upload a different photo"
            >
              <RefreshCw size={13} />
              <span>Change</span>
            </button>
            <button
              type="button"
              className="btn-remove-photo"
              onClick={handleRemove}
              title="Remove photo"
              aria-label="Remove photo"
            >
              <Trash2 size={14} />
            </button>
          </div>
        </div>
      ) : (
        /* Compact clean dropzone when no photo is loaded */
        <div
          className={`dropzone compact-dropzone ${isDragging ? 'is-dragging' : ''}`}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={() => fileInputRef.current?.click()}
        >
          <div className="dropzone-content compact">
            <div className="dropzone-icon-circle compact">
              <UploadCloud size={20} />
            </div>
            <div className="dropzone-text">
              <p className="dropzone-title">Upload Your Portrait Photo</p>
              <p className="dropzone-hint">Tap to select from camera or gallery (JPG, PNG)</p>
            </div>
          </div>
        </div>
      )}

      {isValidating && (
        <div className="status-message validating">
          <div className="spinner-mini" />
          <span>Processing photo...</span>
        </div>
      )}

      {errorMessage && (
        <div className="status-message error" role="alert">
          <AlertTriangle size={15} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successInfo && !errorMessage && (
        <div className="status-message success compact">
          <CheckCircle2 size={14} />
          <span>{successInfo}</span>
        </div>
      )}
    </div>
  );
};

