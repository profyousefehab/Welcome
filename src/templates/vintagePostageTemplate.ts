import { TemplateConfig } from '../types/template';
import vintageBgUrl from '../assets/vintage/vintage_bg_clean.webp';
import welcomeOverlayUrl from '../assets/vintage/welcome_overlay_clean.webp';
import sealStampUrl from '../assets/vintage/seal_stamp.webp';
import committeeScriptUrl from '../assets/vintage/committee_script.webp';

const VINTAGE_AVATAR_PLACEHOLDER = `data:image/svg+xml;utf8,${encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="571" height="736" viewBox="0 0 571 736">
  <defs>
    <linearGradient id="vAvGrad" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#E8E2D5"/>
      <stop offset="100%" stop-color="#D6CDBF"/>
    </linearGradient>
  </defs>
  <rect width="571" height="736" fill="url(#vAvGrad)"/>
  
  <g transform="translate(285, 330)" fill="#A89D8C">
    <circle cx="0" cy="-60" r="80"/>
    <path d="M -150 170 C -150 80 -85 60 0 60 C 85 60 150 80 150 170 Z"/>
  </g>
</svg>
`)}`;

/**
 * Enactus Vintage Postage Stamp Template (Season 2027)
 * Extracted directly from Card2.psd
 */
export const VINTAGE_POSTAGE_STAMP_TEMPLATE: TemplateConfig = {
  id: 'enactus-vintage-postage-stamp-2027',
  name: 'Enactus Vintage Postage Stamp (Card2 Design)',
  description: 'Official Enactus Assiut University Vintage Postage Stamp template with parchment texture, perforated stamp window, overlapping distressed red seal, and Welcome ribbon.',
  version: '2.0.0',
  isDevPlaceholder: false, // Approved final design from Card2.psd
  dimensions: {
    width: 1080,
    height: 1440,
    displayAspectRatio: 1080 / 1440, // 0.75 (3:4 ratio)
  },
  layers: [
    // 1. Static Vintage Parchment & Yellow Perforated Stamp Base
    {
      id: 'layer-vintage-bg',
      name: 'Vintage Parchment & Stamp Base',
      type: 'background',
      zIndex: 10,
      source: vintageBgUrl,
      fallbackColor: '#F4EFE6',
    },

    // 2. Member Photo Slot (clipped to the exact stamp inner window from Rectangle 1 in Card2.psd)
    {
      id: 'layer-member-photo',
      name: 'Member Portrait Window',
      type: 'photo',
      zIndex: 20,
      slot: {
        x: 270,
        y: 288,
        width: 571,
        height: 736,
        clipping: {
          shape: 'rectangle', // Sharp stamp inner rectangle
        },
        placeholderImage: VINTAGE_AVATAR_PLACEHOLDER,
        defaultZoom: 1.0,
        minZoom: 0.5,
        maxZoom: 3.0,
      },
    },

    // 3. Foreground Welcome Ribbon Overlay (overlaps top-left corner of the photo)
    {
      id: 'layer-welcome-overlay',
      name: 'Welcome Ribbon Overlay',
      type: 'overlay',
      zIndex: 30,
      source: welcomeOverlayUrl,
      x: 0,
      y: 0,
      width: 1080,
      height: 1440,
      opacity: 1.0,
      blendMode: 'source-over',
    },

    // 4. Foreground Distressed Red Stamp Seal (overlaps bottom-right corner of the photo)
    {
      id: 'layer-seal-stamp',
      name: 'Distressed Enactus AU Season 2027 Seal',
      type: 'overlay',
      zIndex: 35,
      source: sealStampUrl,
      x: 726,
      y: 800,
      width: 245,
      height: 248,
      opacity: 1.0,
      blendMode: 'source-over',
    },

    // 5. Member Full Name (Layer 'Yousef Ehab' in Card2.psd using SF Pro Display Bold Italic)
    {
      id: 'layer-member-name',
      name: 'Member Full Name',
      type: 'text',
      zIndex: 40,
      role: 'name',
      config: {
        x: 557,
        y: 1079,
        align: 'center',
        fontFamily: "'SF Pro Display Bold Italic', 'SFProDisplay-BoldItalic', 'SF Pro Display', sans-serif",
        fontStyle: 'italic',
        fontSize: 78, // Exact Card2.psd updated size
        fontWeight: 700,
        color: '#FFFFFF',
        letterSpacing: 0.5,
        textTransform: 'capitalize',
        maxWidth: 580,
        autoScaleDown: true,
        minFontSize: 28,
      },
    },

    // 6. Selected Committee (Layer 'SOCIAL MEDIA' in Card2.psd using SF Pro Display Bold Italic)
    {
      id: 'layer-committee',
      name: 'Assigned Committee',
      type: 'text',
      zIndex: 45,
      role: 'committee',
      config: {
        x: 557,
        y: 1150,
        align: 'center',
        fontFamily: "'SF Pro Display Bold Italic', 'SFProDisplay-BoldItalic', 'SF Pro Display', sans-serif",
        fontStyle: 'italic',
        fontSize: 34, // Exact Card2.psd updated size
        fontWeight: 700,
        color: '#503323', // Deep rustic brown from Card2.psd
        letterSpacing: 1,
        textTransform: 'uppercase',
        maxWidth: 600,
        autoScaleDown: true,
        minFontSize: 18,
      },
    },

    // 7. Committee Script Overlay (Cursive 'Committee' layer from Card2.psd)
    {
      id: 'layer-committee-overlay',
      name: 'Committee Script Overlay',
      type: 'overlay',
      zIndex: 46,
      source: committeeScriptUrl,
      x: 484,
      y: 1133,
      width: 145,
      height: 68,
      opacity: 1.0,
      blendMode: 'source-over',
    },
  ],
  exportSettings: {
    filenamePrefix: 'Enactus_AU_Season2027_',
    mimeType: 'image/png',
    multiplier: 1,
    quality: 1.0,
  },
};

