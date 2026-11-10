/**
 * Official Campaign Announcement Copy
 * 
 * Standardized announcement text for incoming Enactus Assiut Beta Members.
 */

export const ENACTUS_LINKEDIN_URL = 'https://www.linkedin.com/company/enactus-assiut/';

export function formatCommitteeForCaption(committee: string): string {
  const raw = committee?.trim() || 'Enactus Team';
  if (raw.toUpperCase() === 'IT') return 'IT';

  const clean = raw.replace(/\s+committee$/i, '');
  return clean
    .toLowerCase()
    .split(' ')
    .map((word) => (word === 'it' ? 'IT' : word.charAt(0).toUpperCase() + word.slice(1)))
    .join(' ');
}

export function generateCampaignCaption(committee: string): string {
  const formattedCommittee = formatCommitteeForCaption(committee);
  const article = /^[aeiou]/i.test(formattedCommittee) ? 'an' : 'a';

  return `I'm thrilled to announce that I've officially joined @Enactus Assiut as ${article} ${formattedCommittee} Beta Member!

This is more than just joining a team; it's an opportunity to grow, challenge myself, develop new skills, and contribute to something bigger.

I'm looking forward to an incredible journey filled with learning, collaboration, unforgettable experiences, and positive change.

The journey starts now. ⚡

${ENACTUS_LINKEDIN_URL}

#Enactusau #Enactusassiut #Enactus #NewBeginnings #NewMember #Leadership #Teamwork #MakingAnImpact`;
}
