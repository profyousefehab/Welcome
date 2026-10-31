import React, { useState, useRef, DragEvent, ChangeEvent } from 'react';
import { validateUploadedPhoto } from '../services/imageValidation';
import { UploadCloud, CheckCircle2, AlertTriangle, Trash2, Image as ImageIcon } from 'lucide-react';

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
        `Photo validated (${result.dimensions?.width}×${result.dimensions?.height}px, ${(file.size / (1024 * 1024)).toFixed(2)} MB)`
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
      <div className="section-header">
        <label className="section-label">
          <ImageIcon size={18} className="section-icon" />
          <span>Member Photo</span>
        </label>
        {hasPhoto && (
          <button
            type="button"
            className="btn-text-danger"
            onClick={handleRemove}
            title="Remove uploaded photo"
          >
            <Trash2 size={14} />
            <span>Remove</span>
          </button>
        )}
      </div>

      <div
        className={`dropzone ${isDragging ? 'is-dragging' : ''} ${hasPhoto ? 'has-file' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        <div className="dropzone-content">
          <div className="dropzone-icon-circle">
            <UploadCloud size={24} />
          </div>
          <div className="dropzone-text">
            <p className="dropzone-title">
              {hasPhoto ? 'Click or drop to replace photo' : 'Upload portrait photo'}
            </p>
            <p className="dropzone-hint">
              JPG, PNG, or WebP &bull; Max 12 MB &bull; High resolution recommended
            </p>
          </div>
        </div>
      </div>

      {isValidating && (
        <div className="status-message validating">
          <div className="spinner-mini" />
          <span>Validating image resolution and format...</span>
        </div>
      )}

      {errorMessage && (
        <div className="status-message error" role="alert">
          <AlertTriangle size={16} />
          <span>{errorMessage}</span>
        </div>
      )}

      {successInfo && !errorMessage && (
        <div className="status-message success">
          <CheckCircle2 size={16} />
          <span>{successInfo}</span>
        </div>
      )}
    </div>
  );
};

