import { describe, it, expect } from 'vitest';
import { validateUploadedPhoto } from '../services/imageValidation';

describe('Photo Validation Service', () => {
  it('rejects unsupported MIME types', async () => {
    const fakePdfFile = new File(['%PDF-1.4'], 'document.pdf', { type: 'application/pdf' });
    const result = await validateUploadedPhoto(fakePdfFile);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('Unsupported file format');
  });

  it('rejects files exceeding 12MB limit', async () => {
    // 13MB dummy file
    const largeBlob = new Uint8Array(13 * 1024 * 1024);
    const oversizedFile = new File([largeBlob], 'huge.png', { type: 'image/png' });
    const result = await validateUploadedPhoto(oversizedFile);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('File is too large');
  });

  it('rejects 0-byte empty files', async () => {
    const emptyFile = new File([], 'empty.jpg', { type: 'image/jpeg' });
    const result = await validateUploadedPhoto(emptyFile);
    expect(result.isValid).toBe(false);
    expect(result.errorMessage).toContain('empty (0 bytes)');
  });
});

