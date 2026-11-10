import { describe, it, expect } from 'vitest';
import { VINTAGE_POSTAGE_STAMP_TEMPLATE } from '../templates/vintagePostageTemplate';
import { renderCardToCanvas } from '../services/renderingEngine';
import { TemplateLayer } from '../types/template';

describe('Vintage Postage Stamp Template (Card2.psd)', () => {
  it('has 1080x1440 canvas dimensions matching Card2.psd', () => {
    expect(VINTAGE_POSTAGE_STAMP_TEMPLATE.dimensions.width).toBe(1080);
    expect(VINTAGE_POSTAGE_STAMP_TEMPLATE.dimensions.height).toBe(1440);
    expect(VINTAGE_POSTAGE_STAMP_TEMPLATE.dimensions.displayAspectRatio).toBeCloseTo(1080 / 1440);
  });

  it('contains the photo slot matching Rectangle 1 in Card2.psd', () => {
    const photoLayer = VINTAGE_POSTAGE_STAMP_TEMPLATE.layers.find(
      (l) => l.type === 'photo'
    );
    expect(photoLayer).toBeDefined();
    if (photoLayer && photoLayer.type === 'photo') {
      expect(photoLayer.slot.x).toBe(270);
      expect(photoLayer.slot.y).toBe(288);
      expect(photoLayer.slot.width).toBe(571);
      expect(photoLayer.slot.height).toBe(736);
      expect(photoLayer.slot.clipping.shape).toBe('rectangle');
    }
  });

  it('contains overlapping overlays (welcome ribbon, circular stamp, committee script)', () => {
    const overlays = VINTAGE_POSTAGE_STAMP_TEMPLATE.layers.filter(
      (l) => l.type === 'overlay'
    );
    expect(overlays.length).toBe(3);

    const stamp = overlays.find((o) => o.name.includes('Seal'));
    expect(stamp).toBeDefined();
    if (stamp && stamp.type === 'overlay') {
      expect(stamp.x).toBe(726);
      expect(stamp.y).toBe(800);
      expect(stamp.width).toBe(245);
      expect(stamp.height).toBe(248);
    }

    const committeeOverlay = overlays.find((o) => o.id === 'layer-committee-overlay');
    expect(committeeOverlay).toBeDefined();
    if (committeeOverlay && committeeOverlay.type === 'overlay') {
      expect(committeeOverlay.x).toBe(484);
      expect(committeeOverlay.y).toBe(1133);
    }
  });

  it('has name and committee text layers configured with SF Pro Display Bold Italic typography', () => {
    const textLayers = VINTAGE_POSTAGE_STAMP_TEMPLATE.layers.filter(
      (l) => l.type === 'text'
    );
    const nameLayer = textLayers.find((l) => l.role === 'name');
    const committeeLayer = textLayers.find((l) => l.role === 'committee');

    expect(nameLayer).toBeDefined();
    expect(committeeLayer).toBeDefined();

    if (nameLayer && nameLayer.type === 'text') {
      expect(nameLayer.config.color).toBe('#FFFFFF');
      expect(nameLayer.config.align).toBe('center');
      expect(nameLayer.config.fontFamily).toContain('SF Pro Display Bold Italic');
      expect(nameLayer.config.fontStyle).toBe('italic');
    }

    if (committeeLayer && committeeLayer.type === 'text') {
      expect(committeeLayer.config.color).toBe('#503323');
      expect(committeeLayer.config.align).toBe('center');
      expect(committeeLayer.config.fontFamily).toContain('SF Pro Display Bold Italic');
      expect(committeeLayer.config.fontStyle).toBe('italic');
    }
  });

  it('renders custom nameFontSize when specified in userData', () => {
    const assignedFonts: string[] = [];
    const mockCtx = {
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      scale: () => {},
      fillRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      clip: () => {},
      rect: () => {},
      measureText: () => ({ width: 100 }),
      fillText: () => {},
      strokeText: () => {},
      drawImage: () => {},
      set font(value: string) {
        assignedFonts.push(value);
      },
      get font() {
        return assignedFonts[assignedFonts.length - 1] || '';
      },
    };

    const mockCanvas = {
      getContext: () => mockCtx,
      width: 0,
      height: 0,
    } as unknown as HTMLCanvasElement;

    renderCardToCanvas(
      mockCanvas,
      VINTAGE_POSTAGE_STAMP_TEMPLATE,
      {
        fullName: 'Test Student',
        nameFontSize: 46,
        committee: 'SOCIAL MEDIA & DESIGN',
        photoImage: null,
        photoUrl: null,
        photoPosition: { x: 0, y: 0, zoom: 1 },
      },
      1.0
    );

    // Name text layer should have used the custom 46px font size
    expect(assignedFonts.some((f) => f.includes('46px'))).toBe(true);
  });

  it('applies namePosition and committeePosition offsets to text rendering coordinates', () => {
    const filledTexts: { text: string; x: number; y: number }[] = [];
    const mockCtx = {
      save: () => {},
      restore: () => {},
      clearRect: () => {},
      scale: () => {},
      fillRect: () => {},
      beginPath: () => {},
      closePath: () => {},
      clip: () => {},
      rect: () => {},
      measureText: () => ({ width: 100 }),
      fillText: (text: string, x: number, y: number) => {
        filledTexts.push({ text, x, y });
      },
      strokeText: () => {},
      drawImage: () => {},
      set font(_: string) {},
      get font() {
        return '';
      },
    };

    const mockCanvas = {
      getContext: () => mockCtx,
      width: 0,
      height: 0,
    } as unknown as HTMLCanvasElement;

    // Default template coordinates: name is at (557, 1079), committee is at (557, 1150)
    renderCardToCanvas(
      mockCanvas,
      VINTAGE_POSTAGE_STAMP_TEMPLATE,
      {
        fullName: 'Offset Student',
        nameFontSize: 80,
        namePosition: { x: 12, y: -8 },
        committee: 'SOCIAL MEDIA & DESIGN',
        committeePosition: { x: -6, y: 4 },
        photoImage: null,
        photoUrl: null,
        photoPosition: { x: 0, y: 0, zoom: 1 },
      },
      1.0
    );

    const nameRender = filledTexts.find((t) => t.text.toLowerCase().includes('offset student'));
    expect(nameRender).toBeDefined();
    // Expected x = 557 + 12 = 569, y = 1079 - 8 = 1071
    expect(nameRender?.x).toBe(557 + 12);
    expect(nameRender?.y).toBe(1079 - 8);

    const committeeRender = filledTexts.find((t) => t.text.includes('SOCIAL MEDIA & DESIGN'));
    expect(committeeRender).toBeDefined();
    // Expected x = 557 - 6 = 551, y = 1150 + 4 = 1154
    expect(committeeRender?.x).toBe(557 - 6);
    expect(committeeRender?.y).toBe(1150 + 4);
  });

  it('provides a clean silhouette placeholder without "+ UPLOAD PHOTO" button', () => {
    const photoLayer = VINTAGE_POSTAGE_STAMP_TEMPLATE.layers.find(
      (l) => l.type === 'photo'
    ) as Extract<TemplateLayer, { type: 'photo' }>;

    expect(photoLayer).toBeDefined();
    expect(photoLayer.slot.placeholderImage).toBeDefined();

    const decodedSvg = decodeURIComponent(photoLayer.slot.placeholderImage!);
    // Silhouette head & torso must be present
    expect(decodedSvg).toContain('circle cx="0" cy="-60" r="80"');
    expect(decodedSvg).toContain('fill="#A89D8C"');

    // "+ UPLOAD PHOTO" badge must be completely removed
    expect(decodedSvg).not.toContain('UPLOAD PHOTO');
  });
});

