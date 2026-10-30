/**
 * Fixed Campaign Caption
 * 
 * The copy text is strictly fixed for all members, with only the selected committee
 * automatically substituted in place.
 */

export function generateCampaignCaption(committee: string): string {
  const committeeName = committee?.trim() || 'ENACTUS TEAM';
  
  return `🌟 New Journey, Greater Purpose! 🌟

I am thrilled to announce that I have officially joined Enactus as a member of the ${committeeName}! 🚀

Enactus is all about creating positive change through entrepreneurial action, innovation, and teamwork. I cannot wait to collaborate with our passionate leaders and drive meaningful impact in our community.

Here's to a season of leadership, innovation, and transformative impact! 💡✨

#WeAreEnactus #Enactus #Leadership #SocialImpact #Innovation #CommunityEmpowerment`;
}
