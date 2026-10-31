import { describe, it, expect } from 'vitest';
import { VINTAGE_POSTAGE_STAMP_TEMPLATE } from '../templates/vintagePostageTemplate';

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

  it('contains both overlapping overlays (welcome ribbon and circular stamp)', () => {
    const overlays = VINTAGE_POSTAGE_STAMP_TEMPLATE.layers.filter(
      (l) => l.type === 'overlay'
    );
    expect(overlays.length).toBe(2);

    const stamp = overlays.find((o) => o.name.includes('Seal'));
    expect(stamp).toBeDefined();
    if (stamp && stamp.type === 'overlay') {
      expect(stamp.x).toBe(668);
      expect(stamp.y).toBe(752);
    }
  });

  it('has name and committee text layers configured', () => {
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
    }

    if (committeeLayer && committeeLayer.type === 'text') {
      expect(committeeLayer.config.color).toBe('#503323');
      expect(committeeLayer.config.align).toBe('center');
    }
  });
});

