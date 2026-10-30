import { describe, it, expect } from 'vitest';
import { DEVELOPMENT_PLACEHOLDER_TEMPLATE } from '../templates/placeholderTemplate';

describe('Development Placeholder Template Configuration', () => {
  it('is explicitly marked as a development placeholder', () => {
    expect(DEVELOPMENT_PLACEHOLDER_TEMPLATE.isDevPlaceholder).toBe(true);
    expect(DEVELOPMENT_PLACEHOLDER_TEMPLATE.name).toContain('Placeholder');
  });

  it('has valid high-resolution 1080x1350 canvas dimensions', () => {
    expect(DEVELOPMENT_PLACEHOLDER_TEMPLATE.dimensions.width).toBe(1080);
    expect(DEVELOPMENT_PLACEHOLDER_TEMPLATE.dimensions.height).toBe(1350);
    expect(DEVELOPMENT_PLACEHOLDER_TEMPLATE.dimensions.displayAspectRatio).toBeCloseTo(1080 / 1350);
  });

  it('contains all required layer types and explicit layer ordering', () => {
    const layers = DEVELOPMENT_PLACEHOLDER_TEMPLATE.layers;
    const layerTypes = layers.map((l) => l.type);

    expect(layerTypes).toContain('background');
    expect(layerTypes).toContain('photo');
    expect(layerTypes).toContain('overlay');
    expect(layerTypes).toContain('text');
    expect(layerTypes).toContain('watermark');

    // Check z-indices are ordered properly
    for (let i = 0; i < layers.length - 1; i++) {
      expect(layers[i].zIndex).toBeLessThanOrEqual(layers[i + 1].zIndex);
    }
  });

  it('supports foreground overlays that overlap the portrait slot', () => {
    const photoLayer = DEVELOPMENT_PLACEHOLDER_TEMPLATE.layers.find(
      (l) => l.type === 'photo'
    );
    const overlayLayers = DEVELOPMENT_PLACEHOLDER_TEMPLATE.layers.filter(
      (l) => l.type === 'overlay'
    );

    expect(photoLayer).toBeDefined();
    expect(overlayLayers.length).toBeGreaterThanOrEqual(2); // Frame and Stamp

    if (photoLayer && photoLayer.type === 'photo') {
      const slot = photoLayer.slot;
      // Stamp overlay (x: 740, y: 760) should overlap portrait slot (x: 140..940, y: 220..940)
      const stampOverlay = overlayLayers.find((o) => o.name.includes('Stamp'));
      expect(stampOverlay).toBeDefined();
      if (stampOverlay && stampOverlay.type === 'overlay') {
        const overlapsX = stampOverlay.x < slot.x + slot.width && stampOverlay.x + stampOverlay.width > slot.x;
        const overlapsY = stampOverlay.y < slot.y + slot.height && stampOverlay.y + stampOverlay.height > slot.y;
        expect(overlapsX).toBe(true);
        expect(overlapsY).toBe(true);
      }
    }
  });

  it('defines replaceable name and committee text layers', () => {
    const textLayers = DEVELOPMENT_PLACEHOLDER_TEMPLATE.layers.filter((l) => l.type === 'text');
    const nameLayer = textLayers.find((l) => l.role === 'name');
    const committeeLayer = textLayers.find((l) => l.role === 'committee');

    expect(nameLayer).toBeDefined();
    expect(committeeLayer).toBeDefined();

    if (nameLayer && nameLayer.type === 'text') {
      expect(nameLayer.config.autoScaleDown).toBe(true);
      expect(nameLayer.config.maxWidth).toBeGreaterThan(500);
    }
    if (committeeLayer && committeeLayer.type === 'text') {
      expect(committeeLayer.config.autoScaleDown).toBe(true);
      expect(committeeLayer.config.color).toBe('#FFC20E'); // Enactus Yellow
    }
  });
});
