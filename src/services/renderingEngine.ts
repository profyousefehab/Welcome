import { TemplateConfig, UserCardData, TemplateLayer } from '../types/template';

// Image cache to prevent re-decoding SVGs and images on every frame
const imageCache = new Map<string, HTMLImageElement>();
let fontsLoadedPromise: Promise<void> | null = null;

/**
 * Ensure custom typography fonts (Neulis suite) are preloaded and registered
 */
export async function ensureCustomFontsLoaded(): Promise<void> {
  if (typeof document === 'undefined') return;

  if (!fontsLoadedPromise) {
    fontsLoadedPromise = (async () => {
      try {
        if (typeof FontFace !== 'undefined') {
          const fontDefinitions = [
            new FontFace('SF Pro Display Bold Italic', 'url(/SF-Pro-Display-BoldItalic.otf)', {
              weight: '700',
              style: 'italic',
            }),
            new FontFace('SF Pro Display Bold Italic', 'url(/SF-Pro-Display-BoldItalic.otf)', {
              weight: '400',
              style: 'normal',
            }),
            new FontFace('SFProDisplay-BoldItalic', 'url(/SF-Pro-Display-BoldItalic.otf)', {
              weight: '700',
              style: 'italic',
            }),
            new FontFace('SFProDisplay-BoldItalic', 'url(/SF-Pro-Display-BoldItalic.otf)', {
              weight: '400',
              style: 'normal',
            }),
            new FontFace('SF Pro Display', 'url(/SF-Pro-Display-BoldItalic.otf)', {
              weight: '700',
              style: 'italic',
            }),
            new FontFace('SF Pro Display', 'url(/SF-Pro-Display-Bold.otf)', {
              weight: '700',
              style: 'normal',
            }),
            new FontFace('SF Pro Display', 'url(/SF-Pro-Display-Medium.otf)', {
              weight: '500',
              style: 'normal',
            }),
            new FontFace('SF Pro Display', 'url(/SF-Pro-Display-Regular.otf)', {
              weight: '400',
              style: 'normal',
            }),
          ];

          await Promise.allSettled(
            fontDefinitions.map(async (font) => {
              const loaded = await font.load();
              document.fonts.add(loaded);
            })
          );
        }

        if ('fonts' in document) {
          await Promise.allSettled([
            document.fonts.load('italic 700 80px "SF Pro Display Bold Italic"'),
            document.fonts.load('italic 700 80px "SFProDisplay-BoldItalic"'),
            document.fonts.load('italic 700 38px "SF Pro Display Bold Italic"'),
            document.fonts.load('italic 700 38px "SFProDisplay-BoldItalic"'),
            document.fonts.load('80px "SF Pro Display Bold Italic"'),
            document.fonts.load('38px "SF Pro Display Bold Italic"'),
            document.fonts.load('700 80px "SF Pro Display"'),
            document.fonts.load('400 16px "SF Pro Display"'),
          ]);
          await document.fonts.ready;
        }
      } catch (err) {
        console.warn('[RenderingEngine] Font preloading warning:', err);
      }
    })();
  }

  return fontsLoadedPromise;
}

/**
 * Preload an image URL into memory and cache it
 */
export function preloadImage(url: string): Promise<HTMLImageElement> {
  if (imageCache.has(url)) {
    return Promise.resolve(imageCache.get(url)!);
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      imageCache.set(url, img);
      resolve(img);
    };
    img.onerror = (err) => {
      console.warn(`[RenderingEngine] Failed to load image asset: ${url.substring(0, 40)}...`, err);
      reject(err);
    };
    img.src = url;
  });
}

/**
 * Preload all static assets declared in the template layers
 */
export async function preloadTemplateAssets(template: TemplateConfig): Promise<void> {
  const promises: Promise<HTMLImageElement>[] = [];

  for (const layer of template.layers) {
    if (layer.type === 'background' && layer.source) {
      promises.push(preloadImage(layer.source));
    } else if (layer.type === 'photo' && layer.slot.placeholderImage) {
      promises.push(preloadImage(layer.slot.placeholderImage));
    } else if (layer.type === 'overlay' && layer.source) {
      promises.push(preloadImage(layer.source));
    }
  }

  await Promise.allSettled([...promises, ensureCustomFontsLoaded()]);
}

/**
 * Renders the membership card onto the provided canvas.
 */
export function renderCardToCanvas(
  canvas: HTMLCanvasElement,
  template: TemplateConfig,
  userData: UserCardData,
  renderScale: number = 1.0
): void {
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const targetWidth = Math.round(template.dimensions.width * renderScale);
  const targetHeight = Math.round(template.dimensions.height * renderScale);

  if (canvas.width !== targetWidth || canvas.height !== targetHeight) {
    canvas.width = targetWidth;
    canvas.height = targetHeight;
  }

  // Clear canvas
  ctx.save();
  ctx.clearRect(0, 0, targetWidth, targetHeight);
  ctx.scale(renderScale, renderScale);

  // Sort layers by zIndex ascending
  const sortedLayers = [...template.layers].sort((a, b) => a.zIndex - b.zIndex);

  for (const layer of sortedLayers) {
    renderLayer(ctx, layer, userData, template);
  }

  ctx.restore();
}

/**
 * Dispatch rendering of an individual layer
 */
function renderLayer(
  ctx: CanvasRenderingContext2D,
  layer: TemplateLayer,
  userData: UserCardData,
  template: TemplateConfig
): void {
  switch (layer.type) {
    case 'background':
      renderBackgroundLayer(ctx, layer, template);
      break;
    case 'photo':
      renderPhotoLayer(ctx, layer, userData);
      break;
    case 'overlay':
      renderOverlayLayer(ctx, layer, userData);
      break;
    case 'text':
      renderTextLayer(ctx, layer, userData);
      break;
    case 'watermark':
      if (layer.enabled) {
        renderWatermarkLayer(ctx, layer, template);
      }
      break;
  }
}

/**
 * Render Background Layer
 */
function renderBackgroundLayer(
  ctx: CanvasRenderingContext2D,
  layer: Extract<TemplateLayer, { type: 'background' }>,
  template: TemplateConfig
): void {
  if (layer.fallbackColor) {
    ctx.fillStyle = layer.fallbackColor;
    ctx.fillRect(0, 0, template.dimensions.width, template.dimensions.height);
  }

  if (layer.source && imageCache.has(layer.source)) {
    const img = imageCache.get(layer.source)!;
    ctx.drawImage(img, 0, 0, template.dimensions.width, template.dimensions.height);
  }
}

/**
 * Render Photo Slot with Clipping and Position/Zoom Transforms
 */
function renderPhotoLayer(
  ctx: CanvasRenderingContext2D,
  layer: Extract<TemplateLayer, { type: 'photo' }>,
  userData: UserCardData
): void {
  const { slot } = layer;

  ctx.save();

  // 1. Establish clipping path
  ctx.beginPath();
  if (slot.clipping.shape === 'rounded-rect') {
    const radius = slot.clipping.borderRadius ?? 20;
    if (typeof ctx.roundRect === 'function') {
      ctx.roundRect(slot.x, slot.y, slot.width, slot.height, radius);
    } else {
      // Fallback for older roundRect environments
      drawRoundRectPath(ctx, slot.x, slot.y, slot.width, slot.height, radius);
    }
  } else if (slot.clipping.shape === 'circle') {
    const cx = slot.x + slot.width / 2;
    const cy = slot.y + slot.height / 2;
    const r = Math.min(slot.width, slot.height) / 2;
    ctx.arc(cx, cy, r, 0, Math.PI * 2);
  } else {
    ctx.rect(slot.x, slot.y, slot.width, slot.height);
  }
  ctx.closePath();
  ctx.clip();

  // 2. Render Photo or Placeholder
  if (userData.photoImage) {
    const img = userData.photoImage;
    const zoom = Math.max(slot.minZoom ?? 0.5, Math.min(slot.maxZoom ?? 3.0, userData.photoPosition.zoom));

    // Calculate base 'cover' scale so photo covers the slot completely at zoom = 1.0
    const baseScale = Math.max(slot.width / img.naturalWidth, slot.height / img.naturalHeight);
    const finalScale = baseScale * zoom;

    const scaledWidth = img.naturalWidth * finalScale;
    const scaledHeight = img.naturalHeight * finalScale;

    // Center photo in slot + user panning offset
    const centerX = slot.x + slot.width / 2 + userData.photoPosition.x;
    const centerY = slot.y + slot.height / 2 + userData.photoPosition.y;

    const drawX = centerX - scaledWidth / 2;
    const drawY = centerY - scaledHeight / 2;

    ctx.drawImage(img, drawX, drawY, scaledWidth, scaledHeight);
  } else if (slot.placeholderImage && imageCache.has(slot.placeholderImage)) {
    // Render placeholder avatar
    const placeholderImg = imageCache.get(slot.placeholderImage)!;
    ctx.drawImage(placeholderImg, slot.x, slot.y, slot.width, slot.height);
  } else {
    // Neutral fallback
    ctx.fillStyle = '#1E293B';
    ctx.fillRect(slot.x, slot.y, slot.width, slot.height);
  }

  ctx.restore();
}

/**
 * Render Foreground Overlay (Frame, Stamp, Badge)
 */
function renderOverlayLayer(
  ctx: CanvasRenderingContext2D,
  layer: Extract<TemplateLayer, { type: 'overlay' }>,
  userData: UserCardData
): void {
  if (!layer.source || !imageCache.has(layer.source)) return;

  const img = imageCache.get(layer.source)!;

  ctx.save();
  if (layer.opacity !== undefined) {
    ctx.globalAlpha = Math.max(0, Math.min(1, layer.opacity));
  }
  if (layer.blendMode) {
    ctx.globalCompositeOperation = layer.blendMode;
  }

  let posX = layer.x;
  let posY = layer.y;
  if (layer.id === 'layer-committee-overlay' && userData.committeePosition) {
    posX += userData.committeePosition.x;
    posY += userData.committeePosition.y;
  }

  ctx.drawImage(img, posX, posY, layer.width, layer.height);
  ctx.restore();
}

/**
 * Render Typography (Name, Committee, Static)
 */
function renderTextLayer(
  ctx: CanvasRenderingContext2D,
  layer: Extract<TemplateLayer, { type: 'text' }>,
  userData: UserCardData
): void {
  const { config, role } = layer;

  // Determine text content
  let text = '';
  if (role === 'name') {
    text = userData.fullName?.trim() || 'MEMBER FULL NAME';
  } else if (role === 'committee') {
    text = userData.committee?.trim() || 'COMMITTEE NAME';
  } else if (role === 'static') {
    text = layer.staticText || '';
  }

  if (!text) return;

  // Text Transform
  if (config.textTransform === 'uppercase') {
    text = text.toUpperCase();
  } else if (config.textTransform === 'lowercase') {
    text = text.toLowerCase();
  } else if (config.textTransform === 'capitalize') {
    text = text.replace(/\b\w/g, (char) => char.toUpperCase());
  }

  ctx.save();

  let fontSize = config.fontSize;
  if (role === 'name' && userData.nameFontSize) {
    fontSize = userData.nameFontSize;
  }

  const fontStyle = config.fontStyle ? `${config.fontStyle} ` : '';
  ctx.font = `${fontStyle}${config.fontWeight} ${fontSize}px ${config.fontFamily}`;

  // Apply letterSpacing if canvas API supports it
  if ('letterSpacing' in ctx && config.letterSpacing) {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = `${config.letterSpacing}px`;
  }

  // Auto-scale font down if text exceeds maxWidth
  if (config.maxWidth && config.autoScaleDown) {
    let measuredWidth = ctx.measureText(text).width;
    const minSize = config.minFontSize || 16;

    if (measuredWidth > config.maxWidth) {
      const scaleFactor = config.maxWidth / measuredWidth;
      fontSize = Math.max(minSize, Math.floor(fontSize * scaleFactor));
      ctx.font = `${fontStyle}${config.fontWeight} ${fontSize}px ${config.fontFamily}`;
    }
  }

  ctx.textAlign = config.align;
  ctx.textBaseline = 'middle';

  // Calculate dynamic position with user offset
  let posX = config.x;
  let posY = config.y;

  if (role === 'name' && userData.namePosition) {
    posX += userData.namePosition.x;
    posY += userData.namePosition.y;
  } else if (role === 'committee' && userData.committeePosition) {
    posX += userData.committeePosition.x;
    posY += userData.committeePosition.y;
  }

  // Apply Shadow
  if (config.shadow) {
    ctx.shadowColor = config.shadow.color;
    ctx.shadowBlur = config.shadow.blur;
    ctx.shadowOffsetX = config.shadow.offsetX;
    ctx.shadowOffsetY = config.shadow.offsetY;
  }

  // Draw Stroke if configured
  if (config.stroke) {
    ctx.strokeStyle = config.stroke.color;
    ctx.lineWidth = config.stroke.width;
    ctx.strokeText(text, posX, posY);
  }

  // Fill Text
  ctx.fillStyle = config.color;
  ctx.fillText(text, posX, posY);

  ctx.restore();
}

/**
 * Render Clearly Labeled Development Placeholder Watermark
 */
function renderWatermarkLayer(
  ctx: CanvasRenderingContext2D,
  layer: Extract<TemplateLayer, { type: 'watermark' }>,
  template: TemplateConfig
): void {
  ctx.save();

  const width = template.dimensions.width;

  // 1. Top banner strip
  ctx.fillStyle = 'rgba(255, 194, 14, 0.95)'; // Enactus Yellow with high opacity
  ctx.fillRect(0, 0, width, 42);

  ctx.fillStyle = '#070F2B';
  ctx.font = '700 15px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  if ('letterSpacing' in ctx) {
    (ctx as unknown as { letterSpacing: string }).letterSpacing = '2px';
  }
  ctx.fillText(layer.bannerText, width / 2, 21);

  // 2. Corner badge tag in top left
  ctx.save();
  ctx.fillStyle = 'rgba(7, 15, 43, 0.85)';
  ctx.beginPath();
  if (typeof ctx.roundRect === 'function') {
    ctx.roundRect(40, 52, 160, 32, 6);
  } else {
    ctx.rect(40, 52, 160, 32);
  }
  ctx.fill();
  ctx.strokeStyle = '#FFC20E';
  ctx.lineWidth = 1.5;
  ctx.stroke();

  ctx.fillStyle = '#FFC20E';
  ctx.font = '700 11px "Montserrat", sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText(layer.badgeText, 120, 68);
  ctx.restore();

  ctx.restore();
}

/**
 * Polyfill for roundRect path
 */
function drawRoundRectPath(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  r: number
): void {
  ctx.beginPath();
  ctx.moveTo(x + r, y);
  ctx.lineTo(x + w - r, y);
  ctx.quadraticCurveTo(x + w, y, x + w, y + r);
  ctx.lineTo(x + w, y + h - r);
  ctx.quadraticCurveTo(x + w, y + h, x + w - r, y + h);
  ctx.lineTo(x + r, y + h);
  ctx.quadraticCurveTo(x, y + h, x, y + h - r);
  ctx.lineTo(x, y + r);
  ctx.quadraticCurveTo(x, y, x + r, y);
  ctx.closePath();
}

/**
 * Export high-resolution PNG blob
 */
export async function exportHighResolutionPng(
  template: TemplateConfig,
  userData: UserCardData
): Promise<{ blob: Blob; filename: string }> {
  // Ensure template assets are preloaded
  await preloadTemplateAssets(template);

  const offscreenCanvas = document.createElement('canvas');
  const multiplier = template.exportSettings.multiplier || 1;
  const width = template.dimensions.width * multiplier;
  const height = template.dimensions.height * multiplier;

  offscreenCanvas.width = width;
  offscreenCanvas.height = height;

  renderCardToCanvas(offscreenCanvas, template, userData, multiplier);

  return new Promise((resolve, reject) => {
    offscreenCanvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error('Failed to generate high-resolution PNG blob.'));
          return;
        }

        const sanitizedName = (userData.fullName || 'Member')
          .trim()
          .replace(/[^a-zA-Z0-9_-]/g, '_');
        const sanitizedCommittee = (userData.committee || 'Enactus')
          .trim()
          .replace(/[^a-zA-Z0-9_-]/g, '_');
        const filename = `${template.exportSettings.filenamePrefix}${sanitizedName}_${sanitizedCommittee}.png`;

        resolve({ blob, filename });
      },
      template.exportSettings.mimeType,
      template.exportSettings.quality ?? 1.0
    );
  });
}
