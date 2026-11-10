import { describe, it, expect } from 'vitest';
import { generateCampaignCaption, ENACTUS_LINKEDIN_URL } from '../constants/campaignCaption';
import { APPROVED_COMMITTEES } from '../constants/committees';

describe('Campaign Caption Generator', () => {
  it('correctly inserts each approved committee into the updated Beta Member caption', () => {
    APPROVED_COMMITTEES.forEach((committee) => {
      const caption = generateCampaignCaption(committee);
      expect(caption).toContain("@Enactus Assiut");
      expect(caption).toContain("Beta Member!");
      expect(caption).toContain(ENACTUS_LINKEDIN_URL);
      expect(caption).toContain('#Enactusau #Enactusassiut #Enactus #NewBeginnings #NewMember #Leadership #Teamwork #MakingAnImpact');
    });
  });

  it('correctly formats IT with indefinite article "an"', () => {
    const caption = generateCampaignCaption('IT');
    expect(caption).toContain("as an IT Beta Member!");
  });

  it('provides a sensible fallback if committee is empty string', () => {
    const caption = generateCampaignCaption('');
    expect(caption).toContain("as an Enactus Team Beta Member!");
  });

  it('includes lightning bolt emoji and official Enactus LinkedIn link', () => {
    const caption = generateCampaignCaption('SOCIAL MEDIA');
    expect(caption).toContain("The journey starts now. ⚡");
    expect(caption).toContain("https://www.linkedin.com/company/enactus-assiut/");
  });
});
