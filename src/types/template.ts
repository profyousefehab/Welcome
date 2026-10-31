/**
 * Template Rendering Engine Type Definitions
 * 
 * Provides a fully decoupled, declarative configuration schema for membership cards.
 * When Photoshop assets arrive (e.g. Black & Gold or Vintage Postage Stamp),
 * designers/developers only update the template configuration file without touching UI/logic.
 */

export type ClippingShape = 'rectangle' | 'rounded-rect' | 'circle' | 'ellipse';

export interface PhotoSlotConfig {
  x: number;
  y: number;
  width: number;
  height: number;
  clipping: {
    shape: ClippingShape;
    borderRadius?: number; // for rounded-rect
  };
  placeholderImage?: string;
  defaultZoom?: number;
  minZoom?: number;
  maxZoom?: number;
}

export interface TextTypographyConfig {
  x: number;
  y: number;
  align: 'left' | 'center' | 'right';
  fontFamily: string;
  fontSize: number;
  fontWeight: string | number;
  color: string;
  letterSpacing?: number;
  lineHeight?: number;
  textTransform?: 'uppercase' | 'capitalize' | 'lowercase' | 'none';
  maxWidth?: number;
  autoScaleDown?: boolean;
  minFontSize?: number;
  stroke?: {
    color: string;
    width: number;
  };
  shadow?: {
    color: string;
    blur: number;
    offsetX: number;
    offsetY: number;
  };
  prefix?: string;
  suffix?: string;
}

export interface BackgroundLayerConfig {
  id: string;
  name: string;
  type: 'background';
  zIndex: number;
  source?: string; // Image path or data URI
  fallbackColor?: string;
}

export interface PhotoLayerConfig {
  id: string;
  name: string;
  type: 'photo';
  zIndex: number;
  slot: PhotoSlotConfig;
}

export interface OverlayLayerConfig {
  id: string;
  name: string;
  type: 'overlay';
  zIndex: number;
  source: string; // Transparent PNG / SVG
  x: number;
  y: number;
  width: number;
  height: number;
  opacity?: number;
  blendMode?: GlobalCompositeOperation;
}

export interface TextLayerConfig {
  id: string;
  name: string;
  type: 'text';
  zIndex: number;
  role: 'name' | 'committee' | 'static';
  config: TextTypographyConfig;
  staticText?: string;
}

export interface WatermarkLayerConfig {
  id: string;
  name: string;
  type: 'watermark';
  zIndex: number;
  bannerText: string;
  badgeText: string;
  enabled: boolean;
}

export type TemplateLayer =
  | BackgroundLayerConfig
  | PhotoLayerConfig
  | OverlayLayerConfig
  | TextLayerConfig
  | WatermarkLayerConfig;

export interface ExportSettings {
  filenamePrefix: string;
  mimeType: 'image/png' | 'image/jpeg';
  multiplier: number; // 1 for 1x native canvas size, 2 for ultra-HD
  quality?: number;
}

export interface TemplateConfig {
  id: string;
  name: string;
  description: string;
  version: string;
  isDevPlaceholder: boolean;
  dimensions: {
    width: number;
    height: number;
    displayAspectRatio: number; // width / height
  };
  layers: TemplateLayer[];
  exportSettings: ExportSettings;
}

export interface UserCardData {
  photoImage: HTMLImageElement | null;
  photoUrl: string | null;
  photoPosition: {
    x: number; // offset from center in px
    y: number; // offset from center in px
    zoom: number; // scale multiplier, 1.0 = fit
  };
  fullName: string;
  committee: string;
}

