# Enactus Membership Card Generator

A modern, high-performance Single Page Application (SPA) designed to generate official Enactus membership announcement cards and campaign copy for new members.

> **Design Status:** The visual design selection is currently pending between two candidate concepts (**Black & Gold** vs. **Vintage Postage Stamp**). This application uses an isolated **Development Placeholder Template** with multi-layer vector placeholder assets. The core architecture is completely decoupled from the final artwork so the approved design can be dropped in without rewriting application logic.

---

## Key Features Implemented

1. **Client-Side Photo Upload & Validation**:
   - Supports JPG, PNG, and WebP.
   - Enforces 12 MB max file size and minimum resolution checks (200×200px) to guarantee export quality.
   - Decodes images in memory to guard against corrupted files.
   - Clear visual feedback for errors, loading, and successful validation.

2. **Interactive Photo Positioning & Zoom**:
   - Continuous Zoom slider (50% to 300%).
   - Horizontal (X) and Vertical (Y) panning sliders with real-time numeric readout.
   - Direct on-canvas dragging (mouse and touch pointer capture) for fluid positioning.
   - Directional nudge buttons for pixel-level fine-tuning + one-click center/reset buttons.

3. **Member Identity & Committee Selection**:
   - Member full-name input with live uppercase formatting and automatic canvas font-scaling if names exceed frame limits.
   - Strict dropdown selector with the 7 approved committees:
     - `SOCIAL MEDIA COMMITTEE`
     - `PHOTO & VIDEO COMMITTEE`
     - `IT COMMITTEE`
     - `HUMAN RESOURCES`
     - `PUBLIC RELATIONS`
     - `PRESENTATION`
     - `PROJECT`
   - Design lock: Members cannot alter fonts, colors, or template geometry.

4. **Multi-Layer Live Card Preview**:
   - Real-time rendering on an HTML5 canvas scaled to 4:5 portrait aspect ratio.
   - Correct layer compositing supporting overlapping foreground elements (decorative frame + circular verified member stamp overlapping the portrait).
   - Clear development watermark notice badge.

5. **High-Resolution PNG Export**:
   - Generates pixel-perfect 1080 × 1350 PNG export directly from an off-screen canvas.
   - Automatically names files cleanly: `Enactus_MembershipCard_[Member_Name]_[Committee].png`.
   - Celebratory visual feedback upon successful generation.

6. **Standardized Campaign Caption & One-Click Copy**:
   - Fixed campaign announcement copy standardized for all members.
   - Automatically substitutes the member's selected committee into the copy and hashtags.
   - One-click copy to clipboard with instant visual confirmation.

7. **Responsive Layout**:
   - Desktop: Side-by-side sticky preview card alongside interactive controls.
   - Mobile: Responsive stacked view optimized for touch input.

---

## How to Run the Application

### Prerequisites
- Node.js (v18+ recommended, verified on v25.6.1)
- npm (v9+ recommended, verified on v11.14.1)

### Installation & Development
```bash
# Install dependencies
npm install

# Run the local development server (Vite)
npm run dev

# Run the automated Vitest test suite
npm test

# Build for production
npm run build

# Preview production build locally
npm run preview
```

---

## Development Placeholder Assets in Use

All placeholder assets are vector SVGs located in [`src/assets/placeholderAssets.ts`](file:///F:/Enactus/Welcome/src/assets/placeholderAssets.ts) and configured in [`src/templates/placeholderTemplate.ts`](file:///F:/Enactus/Welcome/src/templates/placeholderTemplate.ts):

| Asset Name | Internal Identifier | Format | Dimensions | Purpose |
|------------|---------------------|--------|------------|---------|
| **Background Base** | `PLACEHOLDER_BACKGROUND_SVG` | Vector SVG | 1080 × 1350 px | Navy gradient with geometric gold grid, Enactus emblem, and development watermark markers. |
| **Portrait Slot** | Layer `layer-photo` | Dynamic Canvas Clip | 800 × 720 px | Clipped with a 24px rounded rectangle (`x: 140, y: 220`). |
| **Decorative Frame Overlay** | `PLACEHOLDER_FRAME_OVERLAY_SVG` | Transparent SVG | 840 × 760 px | Overlays the photo perimeter at `x: 120, y: 200` with gold filigree and double border lines. |
| **Circular Stamp Overlay** | `PLACEHOLDER_CIRCULAR_STAMP_SVG` | Transparent SVG | 240 × 240 px | Overlaps the bottom-right corner of the portrait at `x: 740, y: 760` with verified 2026 seal. |
| **Avatar Fallback** | `PLACEHOLDER_DEFAULT_AVATAR_SVG` | Vector SVG | 800 × 720 px | Placeholder silhouette shown when no user photo has been uploaded yet. |
| **Watermark Strip** | Layer `layer-watermark` | Procedural Canvas | 1080 × 42 px | Distinct yellow development banner: "DEVELOPMENT PLACEHOLDER TEMPLATE • FINAL ARTWORK PENDING". |

---

## Photoshop Handover Guide: Integrating the Final Design

When either the **Black & Gold** or the **Vintage Postage Stamp** design is approved, follow these steps to integrate the final design with **zero changes to application code**:

### 1. Required Asset Exports from Adobe Photoshop
Export the following individual files at **1080 × 1350 px**, RGB color mode, sRGB profile:
1. `background.png` (or `.webp`):
   - Flattened base artwork containing the background textures, Enactus branding header, card borders, and static graphics.
   - **Do not include** the member photo, member name, or committee name.
2. `frame_overlay.png`:
   - 24-bit PNG with transparent alpha channel.
   - Contains any decorative borders, corner ornaments, or inner bevels that must overlap the member's photo.
3. `circular_stamp.png`:
   - 24-bit PNG with transparent alpha channel.
   - The circular rubber stamp, postage seal, or Enactus verification mark that overlaps the photo corner.
4. `default_avatar.png` *(Optional)*:
   - Silhouette graphic shown before a member uploads their photo.

### 2. Exact Coordinates & Measurements Needed from Photoshop Info Panel (F8)
Provide the following pixel values (measured at 100% scale in Photoshop with rulers set to Pixels):

```
PORTRAIT SLOT:
- X Coordinate: [e.g. 140 px]
- Y Coordinate: [e.g. 220 px]
- Width: [e.g. 800 px]
- Height: [e.g. 720 px]
- Corner Radius: [e.g. 24 px, or 0 for sharp rectangular postage stamp]

FRAME OVERLAY:
- X: [px], Y: [px], Width: [px], Height: [px]

STAMP OVERLAY:
- X: [px], Y: [px], Width: [px], Height: [px]

MEMBER NAME TYPOGRAPHY:
- Anchor X: [e.g. 540 px]
- Anchor Y: [e.g. 1040 px]
- Alignment: Center / Left / Right
- Font Family: [e.g. 'Montserrat', 'Cinzel', or custom font]
- Font Weight: [e.g. 800 / Bold]
- Font Size: [e.g. 52 px]
- Letter Spacing / Tracking: [e.g. 2 px]
- Text Color: [e.g. #FFFFFF]
- Max Available Width: [e.g. 860 px]

COMMITTEE TYPOGRAPHY:
- Anchor X: [e.g. 540 px]
- Anchor Y: [e.g. 1115 px]
- Alignment: Center / Left / Right
- Font Family: [e.g. 'Montserrat']
- Font Weight: [e.g. 700]
- Font Size: [e.g. 30 px]
- Letter Spacing / Tracking: [e.g. 4 px]
- Text Color: [e.g. #FFC20E]
```

### 3. Applying the Final Template
Place the exported assets in `src/assets/` and update [`src/templates/placeholderTemplate.ts`](file:///F:/Enactus/Welcome/src/templates/placeholderTemplate.ts) (or create `src/templates/finalTemplate.ts`):
```typescript
export const FINAL_ENACTUS_TEMPLATE: TemplateConfig = {
  id: 'enactus-card-official-2026',
  name: 'Enactus Membership Card 2026 (Official)',
  isDevPlaceholder: false, // Automatically removes dev watermark
  dimensions: { width: 1080, height: 1350, displayAspectRatio: 0.8 },
  layers: [
    { type: 'background', source: finalBackgroundUrl, zIndex: 10, ... },
    { type: 'photo', slot: { x: 140, y: 220, width: 800, height: 720, ... }, zIndex: 20 },
    { type: 'overlay', source: finalFrameUrl, x: 120, y: 200, width: 840, height: 760, zIndex: 30 },
    { type: 'overlay', source: finalStampUrl, x: 740, y: 760, width: 240, height: 240, zIndex: 35 },
    { type: 'text', role: 'name', config: { x: 540, y: 1040, ... }, zIndex: 40 },
    { type: 'text', role: 'committee', config: { x: 540, y: 1115, ... }, zIndex: 45 },
  ],
  exportSettings: {
    filenamePrefix: 'Enactus_MembershipCard_',
    mimeType: 'image/png',
    multiplier: 1,
  }
};
```
The application will instantly render the final design without touching any UI or business logic components.

---

## Project Structure

```
├── index.html                   # HTML entry point with Google Fonts preconnect
├── package.json                 # Dependencies and build scripts
├── tsconfig.json                # Strict TypeScript configuration
├── vite.config.ts               # Vite & Vitest configuration
├── src/
│   ├── assets/
│   │   └── placeholderAssets.ts # Vector SVG assets (Background, Frame, Stamp, Avatar)
│   ├── components/
│   │   ├── ArchitectureHandoverGuide.tsx # In-app modal with handover checklist
│   │   ├── CaptionBox.tsx                # Fixed campaign caption & clipboard copy
│   │   ├── CardPreview.tsx               # Canvas preview with direct photo dragging
│   │   ├── FormControls.tsx              # Name input, Committee select, PNG export CTA
│   │   ├── PhotoAdjuster.tsx             # Zoom, Pan X/Y sliders, nudge pad, reset
│   │   └── PhotoUploader.tsx             # Dropzone, validation, file size check
│   ├── constants/
│   │   ├── campaignCaption.ts   # Campaign caption generator
│   │   └── committees.ts        # The 7 approved committee constants
│   ├── services/
│   │   ├── imageValidation.ts   # Client-side file & dimension validation
│   │   └── renderingEngine.ts   # Multi-layer canvas rendering and PNG export
│   ├── styles/
│   │   └── app.css              # Responsive stylesheet (Desktop & Mobile)
│   ├── templates/
│   │   └── placeholderTemplate.ts # Declarative template configuration
│   ├── tests/
│   │   ├── campaignCaption.test.ts # Tests for caption & committee substitution
│   │   ├── committees.test.ts      # Tests for the 7 approved committees
│   │   ├── imageValidation.test.ts # Tests for image MIME, size, and corruption checks
│   │   └── template.test.ts        # Tests for layer ordering and overlapping specs
│   ├── types/
│   │   └── template.ts          # Template schema and user data types
│   ├── App.tsx                  # Main application orchestrator
│   └── main.tsx                 # React entry point
```

