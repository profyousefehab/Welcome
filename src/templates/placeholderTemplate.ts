import { TemplateConfig } from '../types/template';
import {
  PLACEHOLDER_BACKGROUND_SVG,
  PLACEHOLDER_FRAME_OVERLAY_SVG,
  PLACEHOLDER_CIRCULAR_STAMP_SVG,
  PLACEHOLDER_DEFAULT_AVATAR_SVG,
} from '../assets/placeholderAssets';

/**
 * Development Placeholder Template Configuration
 * 
 * CRITICAL ARCHITECTURE SPECIFICATION:
 * This template configuration is completely isolated from the application logic.
 * When the final Photoshop design (e.g., Black & Gold or Vintage Postage Stamp)
 * is selected and approved:
 * 1. Place the exported PNG/WebP files in the assets directory.
 * 2. Update the layer coordinates, dimensions, fonts, and colors here.
 * 3. Set `isDevPlaceholder: false` and disable the watermark layer.
 * 
 * The rest of the application (upload, validation, controls, preview, export,
 * caption generator) will adapt automatically without any code changes!
 */
export const DEVELOPMENT_PLACEHOLDER_TEMPLATE: TemplateConfig = {
  id: 'dev-placeholder-v1',
  name: 'Development Placeholder Template (Pending Final Design Selection)',
  description: 'Temporary functional template featuring Enactus color palette, photo slot with rounded clipping, overlapping decorative frame, and verified circular member stamp.',
  version: '1.0.0-dev',
  isDevPlaceholder: true,
  dimensions: {
    width: 1080,
    height: 1350,
    displayAspectRatio: 1080 / 1350, // 0.8 (4:5 portrait social standard)
  },
  layers: [
    // Layer 1: Background Asset
    {
      id: 'layer-background',
      name: 'Background Layer',
      type: 'background',
      zIndex: 10,
      source: PLACEHOLDER_BACKGROUND_SVG,
      fallbackColor: '#070F2B',
    },

    // Layer 2: Member Photo Slot (clipped to rounded rectangle)
    {
      id: 'layer-photo',
      name: 'Member Portrait Slot',
      type: 'photo',
      zIndex: 20,
      slot: {
        x: 140,
        y: 220,
        width: 800,
        height: 720,
        clipping: {
          shape: 'rounded-rect',
          borderRadius: 24,
        },
        placeholderImage: PLACEHOLDER_DEFAULT_AVATAR_SVG,
        defaultZoom: 1.0,
        minZoom: 0.5,
        maxZoom: 3.0,
      },
    },

    // Layer 3: Foreground Decorative Frame Overlay (overlaps photo edges)
    {
      id: 'layer-frame-overlay',
      name: 'Decorative Gold Frame Overlay',
      type: 'overlay',
      zIndex: 30,
      source: PLACEHOLDER_FRAME_OVERLAY_SVG,
      x: 120,
      y: 200,
      width: 840,
      height: 760,
      opacity: 1.0,
      blendMode: 'source-over',
    },

    // Layer 4: Foreground Circular Stamp Overlay (overlaps bottom-right of photo)
    {
      id: 'layer-stamp-overlay',
      name: 'Verified Member Circular Stamp',
      type: 'overlay',
      zIndex: 35,
      source: PLACEHOLDER_CIRCULAR_STAMP_SVG,
      x: 740,
      y: 760,
      width: 240,
      height: 240,
      opacity: 1.0,
      blendMode: 'source-over',
    },

    // Layer 5: Member Name Typography
    {
      id: 'layer-member-name',
      name: 'Member Full Name',
      type: 'text',
      zIndex: 40,
      role: 'name',
      config: {
        x: 540,
        y: 1040,
        align: 'center',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 52,
        fontWeight: 800,
        color: '#FFFFFF',
        letterSpacing: 2,
        textTransform: 'uppercase',
        maxWidth: 860,
        autoScaleDown: true,
        minFontSize: 24,
        shadow: {
          color: 'rgba(0, 0, 0, 0.6)',
          blur: 12,
          offsetX: 0,
          offsetY: 3,
        },
      },
    },

    // Layer 6: Committee Typography
    {
      id: 'layer-committee',
      name: 'Selected Committee Name',
      type: 'text',
      zIndex: 45,
      role: 'committee',
      config: {
        x: 540,
        y: 1115,
        align: 'center',
        fontFamily: "'Montserrat', sans-serif",
        fontSize: 30,
        fontWeight: 700,
        color: '#FFC20E', // Enactus Yellow
        letterSpacing: 4,
        textTransform: 'uppercase',
        maxWidth: 860,
        autoScaleDown: true,
        minFontSize: 18,
        shadow: {
          color: 'rgba(0, 0, 0, 0.5)',
          blur: 8,
          offsetX: 0,
          offsetY: 2,
        },
      },
    },

    // Layer 7: Clearly Labeled Development Watermark
    {
      id: 'layer-watermark',
      name: 'Development Placeholder Badge',
      type: 'watermark',
      zIndex: 99,
      bannerText: 'DEVELOPMENT PLACEHOLDER TEMPLATE • FINAL ARTWORK PENDING',
      badgeText: 'DEV PREVIEW',
      enabled: true,
    },
  ],
  exportSettings: {
    filenamePrefix: 'Enactus_MembershipCard_',
    mimeType: 'image/png',
    multiplier: 1, // Output exact 1080x1350 high-resolution PNG
    quality: 1.0,
  },
};

