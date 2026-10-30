/**
 * Client-Side Photo Validation Service
 */

export interface ValidationResult {
  isValid: boolean;
  errorMessage?: string;
  image?: HTMLImageElement;
  dimensions?: { width: number; height: number };
}

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const MAX_FILE_SIZE_BYTES = 12 * 1024 * 1024; // 12 MB
const MIN_DIMENSION_PX = 200;

export async function validateUploadedPhoto(file: File): Promise<ValidationResult> {
  // 1. Check file existence
  if (!file) {
    return { isValid: false, errorMessage: 'No file provided.' };
  }

  // 2. Validate MIME type
  if (!ALLOWED_MIME_TYPES.includes(file.type)) {
    return {
      isValid: false,
      errorMessage: `Unsupported file format (${file.type || 'unknown'}). Please upload a JPG, PNG, or WebP photo.`,
    };
  }

  // 3. Validate File Size
  if (file.size > MAX_FILE_SIZE_BYTES) {
    const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);
    return {
      isValid: false,
      errorMessage: `File is too large (${sizeInMB} MB). Maximum allowed size is 12 MB.`,
    };
  }

  if (file.size === 0) {
    return {
      isValid: false,
      errorMessage: 'The selected file is empty (0 bytes).',
    };
  }

  // 4. Validate Image Decoding and Dimensions
  try {
    const image = await loadImageFromFile(file);
    
    if (image.naturalWidth < MIN_DIMENSION_PX || image.naturalHeight < MIN_DIMENSION_PX) {
      return {
        isValid: false,
        errorMessage: `Photo resolution is too low (${image.naturalWidth}×${image.naturalHeight}px). Minimum recommended is ${MIN_DIMENSION_PX}×${MIN_DIMENSION_PX}px for high-resolution card export.`,
      };
    }

    return {
      isValid: true,
      image,
      dimensions: {
        width: image.naturalWidth,
        height: image.naturalHeight,
      },
    };
  } catch {
    return {
      isValid: false,
      errorMessage: 'Failed to decode image. The file may be corrupted or not a valid image.',
    };
  }
}

export function loadImageFromFile(file: File): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error('Image failed to decode'));
      img.src = e.target?.result as string;
    };
    reader.onerror = () => reject(new Error('File reading failed'));
    reader.readAsDataURL(file);
  });
}
