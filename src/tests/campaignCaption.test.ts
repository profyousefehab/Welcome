import { describe, it, expect } from 'vitest';
import { generateCampaignCaption } from '../constants/campaignCaption';
import { APPROVED_COMMITTEES } from '../constants/committees';

describe('Campaign Caption Generator', () => {
  it('correctly inserts each approved committee into the fixed caption', () => {
    APPROVED_COMMITTEES.forEach((committee) => {
      const caption = generateCampaignCaption(committee);
      expect(caption).toContain(`member of the ${committee}! 🚀`);
      expect(caption).toContain('#WeAreEnactus');
      expect(caption).toContain('#Enactus');
    });
  });

  it('provides a sensible fallback if committee is empty string', () => {
    const caption = generateCampaignCaption('');
    expect(caption).toContain('member of the ENACTUS TEAM! 🚀');
  });

  it('keeps caption content standardized and fixed', () => {
    const caption = generateCampaignCaption('IT COMMITTEE');
    expect(caption).toContain('🌟 New Journey, Greater Purpose! 🌟');
    expect(caption).toContain('creating positive change through entrepreneurial action');
    expect(caption).toContain('transformative impact! 💡✨');
  });
});
