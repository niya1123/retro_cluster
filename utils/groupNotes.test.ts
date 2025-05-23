import { describe, it, expect, vi } from 'vitest';
import { __test__ } from '../utils/groupNotes';

// Mock uuid to return predictable values
vi.mock('uuid', () => ({
  v4: vi.fn().mockReturnValue('test-uuid')
}));

// Mock OpenAI to avoid actual API calls
vi.mock('openai', () => {
  return {
    default: vi.fn().mockImplementation(() => {
      return {};
    })
  };
});

const { parseNotes, calculateK } = __test__();

describe('parseNotes', () => {
  it('should parse notes correctly', () => {
    const rawNotes = [
      'K: something good',
      'P: something bad',
      'T: something to try'
    ];
    
    const result = parseNotes(rawNotes);
    
    expect(result).toEqual([
      { id: 'test-uuid', category: 'K', content: 'something good' },
      { id: 'test-uuid', category: 'P', content: 'something bad' },
      { id: 'test-uuid', category: 'T', content: 'something to try' }
    ]);
  });
  
  it('should ignore empty lines', () => {
    const rawNotes = [
      'K: something good',
      '',
      'P: something bad',
      '   ',
      'T: something to try'
    ];
    
    const result = parseNotes(rawNotes);
    
    expect(result.length).toBe(3);
  });
  
  it('should throw error for invalid format', () => {
    const rawNotes = ['X: invalid format'];
    
    expect(() => parseNotes(rawNotes)).toThrow('Invalid note format');
  });
});

describe('calculateK', () => {
  it('should return at least 2', () => {
    expect(calculateK(1)).toBe(2);
    expect(calculateK(2)).toBe(2);
    expect(calculateK(3)).toBe(2);
  });
  
  it('should return ceiling of square root for larger values', () => {
    expect(calculateK(4)).toBe(2);
    expect(calculateK(9)).toBe(3);
    expect(calculateK(10)).toBe(4);
    expect(calculateK(16)).toBe(4);
    expect(calculateK(17)).toBe(5);
    expect(calculateK(100)).toBe(10);
  });
});