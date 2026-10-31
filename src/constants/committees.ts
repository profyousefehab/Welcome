/**
 * Approved Enactus Committees
 * 
 * Strict list of authorized committees as defined in project requirements.
 */
export const APPROVED_COMMITTEES = [
  'SOCIAL MEDIA',
  'PHOTO & VIDEO',
  'IT',
  'HUMAN RESOURCES',
  'PUBLIC RELATIONS',
  'PRESENTATION',
  'PROJECT',
] as const;

export type CommitteeType = typeof APPROVED_COMMITTEES[number];

/**
 * Default selected committee for initial state
 */
export const DEFAULT_COMMITTEE: CommitteeType = 'SOCIAL MEDIA';

