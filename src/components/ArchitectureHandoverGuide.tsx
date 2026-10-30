import React, { useState } from 'react';
import { Layers, FileCode, X, Info, Check, Image } from 'lucide-react';

export const ArchitectureHandoverGuide: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <button
        type="button"
        className="btn-handover-trigger"
        onClick={() => setIsOpen(true)}
      >
        <Layers size={16} />
        <span>Photoshop Integration Guide & Architecture</span>
      </button>

      {isOpen && (
        <div className="modal-backdrop" onClick={() => setIsOpen(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title-area">
                <Layers size={22} className="modal-title-icon" />
                <div>
                  <h2 className="modal-title">Template Engine & Photoshop Handover Guide</h2>
                  <p className="modal-subtitle">
                    How the decoupled rendering system accepts the approved candidate design
                  </p>
                </div>
              </div>
              <button
                type="button"
                className="btn-close-modal"
                onClick={() => setIsOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="modal-body">
              {/* Notice Banner */}
              <div className="handover-alert-banner">
                <Info size={20} className="banner-icon" />
                <div>
                  <strong>Development Placeholder in Use:</strong>
                  <span>
                    Neither the <em>Black & Gold</em> design nor the <em>Vintage Postage Stamp</em> design has been locked in. The current preview uses clearly labeled vector placeholder assets. Once the team selects and exports the winner from Adobe Photoshop, follow the checklist below.
                  </span>
                </div>
              </div>

              {/* Step 1: Exports from Photoshop */}
              <div className="guide-card">
                <h3 className="guide-card-title">
                  <Image size={18} />
                  <span>1. Required Photoshop Layer Exports</span>
                </h3>
                <p className="guide-card-text">
                  To preserve replaceable member photos, typography, and overlapping seals, export these separate assets at 1080 × 1350px (RGB, sRGB profile):
                </p>
                <table className="handover-table">
                  <thead>
                    <tr>
                      <th>Asset</th>
                      <th>Format</th>
                      <th>Recommended Dimensions</th>
                      <th>Description</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td><code>background.png</code></td>
                      <td>PNG-24 or WebP</td>
                      <td>1080 × 1350 px</td>
                      <td>Base artwork, textures, Enactus branding, cards borders (no portrait, no name).</td>
                    </tr>
                    <tr>
                      <td><code>frame_overlay.png</code></td>
                      <td>PNG-24 (Transparent)</td>
                      <td>840 × 760 px</td>
                      <td>Decorative frame or filigree that sits <em>above</em> the cropped photo.</td>
                    </tr>
                    <tr>
                      <td><code>circular_stamp.png</code></td>
                      <td>PNG-24 (Transparent)</td>
                      <td>240 × 240 px (or as designed)</td>
                      <td>Official verified member stamp or vintage seal that overlaps the portrait corner.</td>
                    </tr>
                    <tr>
                      <td><code>default_avatar.png</code></td>
                      <td>PNG / SVG</td>
                      <td>800 × 720 px</td>
                      <td>Fallback silhouette graphic displayed before photo upload.</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              {/* Step 2: Coordinates from Photoshop Info Panel */}
              <div className="guide-card">
                <h3 className="guide-card-title">
                  <FileCode size={18} />
                  <span>2. Measurements Needed from Photoshop Info Panel (F8)</span>
                </h3>
                <p className="guide-card-text">
                  Set Photoshop measurement units to <strong>Pixels</strong> (Edit &gt; Preferences &gt; Units & Rulers) and record the following coordinates:
                </p>
                <ul className="guide-specs-list">
                  <li>
                    <strong>Portrait Slot:</strong> <code>x</code>, <code>y</code>, <code>width</code>, <code>height</code>, and corner radius if rounded.
                  </li>
                  <li>
                    <strong>Frame Overlay:</strong> <code>x</code>, <code>y</code>, <code>width</code>, <code>height</code>.
                  </li>
                  <li>
                    <strong>Circular Stamp:</strong> <code>x</code>, <code>y</code>, <code>width</code>, <code>height</code>.
                  </li>
                  <li>
                    <strong>Member Name:</strong> Center point <code>x</code>, <code>y</code>, Font Family, Font Weight, Size (px), Tracking/Letter Spacing, and Color (Hex).
                  </li>
                  <li>
                    <strong>Committee:</strong> Center point <code>x</code>, <code>y</code>, Font Family, Font Weight, Size (px), Tracking, and Color (Hex).
                  </li>
                </ul>
              </div>

              {/* Step 3: Zero-Rewrite Integration */}
              <div className="guide-card">
                <h3 className="guide-card-title">
                  <Check size={18} />
                  <span>3. Zero-Rewrite Integration in Code</span>
                </h3>
                <p className="guide-card-text">
                  All rendering settings are isolated in <code>src/templates/placeholderTemplate.ts</code>. You simply replace the asset paths and coordinates in that single config object:
                </p>
                <div className="code-snippet-box">
                  <pre>
{`// Example: Updating to the final Black & Gold or Vintage Postage Stamp template
export const APPROVED_FINAL_TEMPLATE: TemplateConfig = {
  id: 'enactus-card-final-2026',
  name: 'Enactus Official Membership Card 2026',
  isDevPlaceholder: false, // Disables placeholder watermarks
  dimensions: { width: 1080, height: 1350, displayAspectRatio: 0.8 },
  layers: [
    { type: 'background', source: '/assets/final/bg.png', zIndex: 10 },
    { type: 'photo', slot: { x: 140, y: 220, width: 800, height: 720 }, zIndex: 20 },
    { type: 'overlay', source: '/assets/final/frame.png', x: 120, y: 200, zIndex: 30 },
    { type: 'overlay', source: '/assets/final/stamp.png', x: 740, y: 760, zIndex: 35 },
    { type: 'text', role: 'name', config: { x: 540, y: 1040, fontSize: 52, color: '#F1C40F' }, zIndex: 40 },
    { type: 'text', role: 'committee', config: { x: 540, y: 1115, fontSize: 30, color: '#FFFFFF' }, zIndex: 45 },
  ],
  exportSettings: { filenamePrefix: 'Enactus_MembershipCard_', mimeType: 'image/png', multiplier: 1 }
};`}
                  </pre>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                type="button"
                className="btn-modal-done"
                onClick={() => setIsOpen(false)}
              >
                Close Guide
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
