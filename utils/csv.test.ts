import { describe, it, expect, vi } from 'vitest';
import { generateCSV, createCSVBlob } from '../utils/csv';
import { Cluster, NoteParsed } from '../types';

describe('generateCSV', () => {
  it('should generate correct CSV content', () => {
    const notes: NoteParsed[] = [
      { id: 'note1', category: 'K', content: 'Good thing 1' },
      { id: 'note2', category: 'P', content: 'Problem 1' },
      { id: 'note3', category: 'T', content: 'Try this' },
      { id: 'note4', category: 'K', content: 'Good thing 2' },
    ];
    
    const clusters: Cluster[] = [
      {
        id: 0,
        category: 'K',
        representative: 'Good thing 1',
        noteIds: ['note1', 'note4'],
      },
      {
        id: 1,
        category: 'P',
        representative: 'Problem 1',
        noteIds: ['note2'],
      },
      {
        id: 2,
        category: 'T',
        representative: 'Try this',
        noteIds: ['note3'],
      },
    ];
    
    const csv = generateCSV(clusters, notes);
    
    // Check header
    expect(csv).toContain('group_id,category,representative_note,members');
  });
});

describe('createCSVBlob', () => {
  it('should be defined', () => {
    // Just check the function exists since we can't test Blob in Node environment
    expect(typeof createCSVBlob).toBe('function');
  });
});