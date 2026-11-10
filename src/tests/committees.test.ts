import { describe, it, expect } from 'vitest';
import { APPROVED_COMMITTEES, DEFAULT_COMMITTEE } from '../constants/committees';

describe('Approved Committees List', () => {
  it('contains exactly the 7 approved committees', () => {
    const expected = [
      'SOCIAL MEDIA & DESIGN',
      'PHOTO & VIDEO',
      'IT',
      'HUMAN RESOURCES',
      'PUBLIC RELATIONS',
      'PRESENTATION',
      'PROJECT',
    ];

    expect(APPROVED_COMMITTEES).toEqual(expected);
    expect(APPROVED_COMMITTEES.length).toBe(7);
  });

  it('sets a valid default committee', () => {
    expect(APPROVED_COMMITTEES).toContain(DEFAULT_COMMITTEE);
  });
});

