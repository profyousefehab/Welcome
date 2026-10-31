/**
 * Placeholder Vector Assets for Development Template
 * 
 * NOTE: These are strictly temporary functional development assets.
 * When the final Photoshop design (e.g. Black & Gold or Vintage Postage Stamp)
 * is approved, these will be replaced with the exported PNG/WebP layers.
 */

// Helper to encode SVG strings to clean Data URIs for canvas drawing
function svgToDataUri(svgString: string): string {
  return `data:image/svg+xml;utf8,${encodeURIComponent(svgString)}`;
}

/**
 * 1. Background Placeholder Asset (1080 x 1350)
 * Deep navy with gold grid lines, Enactus accents, and dev watermark notes.
 */
export const PLACEHOLDER_BACKGROUND_SVG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="1080" height="1350" viewBox="0 0 1080 1350">
  <defs>
    <!-- Background Gradient -->
    <linearGradient id="bgGrad" x1="0" y1="0" x2="1080" y2="1350" gradientUnits="userSpaceOnUse">
      <stop offset="0%" stop-color="#070F2B"/>
      <stop offset="40%" stop-color="#0B192C"/>
      <stop offset="100%" stop-color="#1B1A55"/>
    </linearGradient>

    <!-- Gold Accent Gradient -->
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFE072"/>
      <stop offset="50%" stop-color="#FFC20E"/>
      <stop offset="100%" stop-color="#C68B00"/>
    </linearGradient>

    <!-- Subtle Diagonal Pattern -->
    <pattern id="diagGrid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 0 40 L 40 0 M 0 0 L 40 40" fill="none" stroke="#FFFFFF" stroke-width="0.5" stroke-opacity="0.04"/>
    </pattern>
  </defs>

  <!-- Background Base -->
  <rect width="1080" height="1350" fill="url(#bgGrad)"/>
  <rect width="1080" height="1350" fill="url(#diagGrid)"/>

  <!-- Geometric Decorative Borders -->
  <rect x="40" y="40" width="1000" height="1270" fill="none" stroke="url(#goldGrad)" stroke-width="2" stroke-opacity="0.4"/>
  <rect x="52" y="52" width="976" height="1246" fill="none" stroke="#FFFFFF" stroke-width="1" stroke-opacity="0.1"/>

  <!-- Corner Brackets -->
  <g stroke="url(#goldGrad)" stroke-width="4" fill="none">
    <path d="M 40 80 L 40 40 L 80 40"/>
    <path d="M 1000 40 L 1040 40 L 1040 80"/>
    <path d="M 40 1270 L 40 1310 L 80 1310"/>
    <path d="M 1000 1310 L 1040 1310 L 1040 1270"/>
  </g>

  <!-- Top Brand Header Block -->
  <g transform="translate(540, 120)" text-anchor="middle">
    <!-- Enactus Stylized Logo Mark -->
    <circle cx="0" cy="0" r="32" fill="#FFC20E"/>
    <path d="M -16 -12 L 16 -12 L 16 -5 L -8 -5 L -8 0 L 12 0 L 12 7 L -8 7 L -8 12 L 16 12 L 16 19 L -16 19 Z" fill="#070F2B"/>
    
    <text y="54" font-family="'Montserrat', sans-serif" font-size="28" font-weight="800" fill="#FFFFFF" letter-spacing="8">ENACTUS</text>
    <text y="78" font-family="'Montserrat', sans-serif" font-size="14" font-weight="500" fill="#FFC20E" letter-spacing="4">WELCOME TO THE MOVEMENT</text>
  </g>

  <!-- Bottom Brand Footer -->
  <g transform="translate(540, 1250)" text-anchor="middle">
    <line x1="-300" y1="0" x2="300" y2="0" stroke="url(#goldGrad)" stroke-width="1" stroke-opacity="0.4"/>
    <text y="28" font-family="'Montserrat', sans-serif" font-size="13" font-weight="600" fill="#94A3B8" letter-spacing="5">LEADERSHIP • ACTION • COMMUNITY</text>
  </g>
</svg>
`);

/**
 * 2. Decorative Frame Foreground Overlay (overlaps photo slot)
 * Positioned to overlap the photo slot at x: 120, y: 200, width: 840, height: 760
 */
export const PLACEHOLDER_FRAME_OVERLAY_SVG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="840" height="760" viewBox="0 0 840 760">
  <defs>
    <linearGradient id="frameGold" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFE79A"/>
      <stop offset="40%" stop-color="#FFC20E"/>
      <stop offset="100%" stop-color="#B8860B"/>
    </linearGradient>
  </defs>

  <!-- Outer Frame Line with rounded corners -->
  <rect x="4" y="4" width="832" height="752" rx="28" fill="none" stroke="url(#frameGold)" stroke-width="4" stroke-opacity="0.95"/>
  <rect x="14" y="14" width="812" height="732" rx="22" fill="none" stroke="#FFFFFF" stroke-width="1.5" stroke-opacity="0.3"/>

  <!-- Ornate Corner Accents -->
  <g stroke="url(#frameGold)" stroke-width="3" fill="none">
    <!-- Top-Left -->
    <path d="M 4 50 Q 50 50 50 4"/>
    <circle cx="50" cy="50" r="4" fill="#FFC20E"/>
    <!-- Top-Right -->
    <path d="M 836 50 Q 790 50 790 4"/>
    <circle cx="790" cy="50" r="4" fill="#FFC20E"/>
    <!-- Bottom-Left -->
    <path d="M 4 710 Q 50 710 50 756"/>
    <circle cx="50" cy="710" r="4" fill="#FFC20E"/>
    <!-- Bottom-Right -->
    <path d="M 836 710 Q 790 710 790 756"/>
    <circle cx="790" cy="710" r="4" fill="#FFC20E"/>
  </g>
</svg>
`);

/**
 * 3. Circular Stamp Seal Foreground Overlay
 * Overlaps the bottom-right corner of the member portrait.
 * Sized 240 x 240, circular, transparent background.
 */
export const PLACEHOLDER_CIRCULAR_STAMP_SVG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="240" height="240" viewBox="0 0 240 240">
  <defs>
    <!-- Circular Path for Text -->
    <path id="stampTextPath" d="M 120, 120 m -86, 0 a 86,86 0 1,1 172,0 a 86,86 0 1,1 -172,0" />
    <path id="stampBottomPath" d="M 120, 120 m 86, 0 a 86,86 0 0,1 -172,0 a 86,86 0 0,1 172,0" />
    <linearGradient id="stampGrad" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#FFE072"/>
      <stop offset="100%" stop-color="#FFB300"/>
    </linearGradient>
  </defs>

  <g transform="rotate(-10 120 120)">
    <!-- Stamp Semi-transparent Background Disc -->
    <circle cx="120" cy="120" r="110" fill="#070F2B" fill-opacity="0.88"/>
    
    <!-- Outer Serrated / Dashed Stamp Border -->
    <circle cx="120" cy="120" r="110" fill="none" stroke="url(#stampGrad)" stroke-width="3" stroke-dasharray="6,4"/>
    <circle cx="120" cy="120" r="98" fill="none" stroke="url(#stampGrad)" stroke-width="1.5"/>
    <circle cx="120" cy="120" r="70" fill="none" stroke="url(#stampGrad)" stroke-width="2"/>

    <!-- Circular Curved Text -->
    <text font-family="'Montserrat', sans-serif" font-size="12.5" font-weight="800" fill="#FFC20E" letter-spacing="3.2">
      <textPath href="#stampTextPath" startOffset="50%" text-anchor="middle">
        ★ OFFICIAL MEMBER ★
      </textPath>
    </text>

    <!-- Center Icon & Year -->
    <g transform="translate(120, 120)" text-anchor="middle">
      <polygon points="0,-22 6,-8 22,-8 10,2 14,18 0,8 -14,18 -10,2 -22,-8 -6,-8" fill="#FFC20E"/>
      <text y="28" font-family="'Montserrat', sans-serif" font-size="13" font-weight="900" fill="#FFFFFF" letter-spacing="2">2026</text>
    </g>
  </g>
</svg>
`);

/**
 * 4. Default Avatar Placeholder
 * Displayed when user hasn't uploaded a photo yet.
 */
export const PLACEHOLDER_DEFAULT_AVATAR_SVG = svgToDataUri(`
<svg xmlns="http://www.w3.org/2000/svg" width="800" height="720" viewBox="0 0 800 720">
  <defs>
    <linearGradient id="avatarBg" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#1E293B"/>
      <stop offset="100%" stop-color="#0F172A"/>
    </linearGradient>
  </defs>
  <rect width="800" height="720" rx="20" fill="url(#avatarBg)"/>
  
  <!-- Silhouette -->
  <g transform="translate(400, 310)" fill="#334155">
    <circle cx="0" cy="-60" r="90"/>
    <path d="M -180 180 C -180 80 -100 60 0 60 C 100 60 180 80 180 180 Z"/>
  </g>

  <!-- Upload Guide Badge -->
  <g transform="translate(400, 520)" text-anchor="middle">
    <rect x="-160" y="-30" width="320" height="60" rx="30" fill="#FFC20E" fill-opacity="0.15" stroke="#FFC20E" stroke-width="2"/>
    <text y="7" font-family="'Montserrat', sans-serif" font-size="20" font-weight="700" fill="#FFC20E" letter-spacing="1">
      + UPLOAD PHOTO
    </text>
  </g>
</svg>
`);

