import { describe, it, expect } from 'vitest';
import { generateCampaignCaption } from '../constants/campaignCaption';
import { APPROVED_COMMITTEES } from '../constants/committees';

describe('Campaign Caption Generator', () => {
  it('correctly inserts each approved committee into the fixed caption', () => {
    APPROVED_COMMITTEES.forEach((committee) => {
      const caption = generateCampaignCaption(committee);
      expect(caption).toContain(`member of the ${committee}.`);
      expect(caption).toContain('#WeAreEnactus');
      expect(caption).toContain('#EnactusAU');
    });
  });

  it('provides a sensible fallback if committee is empty string', () => {
    const caption = generateCampaignCaption('');
    expect(caption).toContain('member of the ENACTUS TEAM.');
  });

  it('keeps caption content standardized and free of emojis', () => {
    const caption = generateCampaignCaption('IT');
    expect(caption).toContain('officially joined Enactus Assiut University');
    expect(caption).toContain('creating positive social and economic impact');
    // Ensure no emojis
    expect(caption).not.toMatch(/[\u{1F300}-\u{1F9FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/u);
  });
});
