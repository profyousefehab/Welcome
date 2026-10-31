/**
 * Official Campaign Announcement Copy
 * 
 * Standardized announcement text for all incoming members.
 * Free of emojis and excessive hype.
 */

export function generateCampaignCaption(committee: string): string {
  const committeeName = committee?.trim() || 'ENACTUS TEAM';
  
  return `I am pleased to announce that I have officially joined Enactus Assiut University as a member of the ${committeeName}.

Together with an inspiring team of changemakers, we are dedicated to creating positive social and economic impact through innovation, entrepreneurial action, and community empowerment.

Looking forward to a productive season of leadership and meaningful initiatives.

#WeAreEnactus #EnactusEgypt #EnactusAU #Leadership #SocialImpact #CommunityEmpowerment`;
}
