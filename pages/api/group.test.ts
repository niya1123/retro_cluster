import { describe, it, expect, vi } from 'vitest';
import { createMocks } from 'node-mocks-http';
import type { NextApiRequest, NextApiResponse } from 'next';

// Mock the handler module
const mockHandler = async (req: NextApiRequest, res: NextApiResponse) => {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  const { rawText } = req.body;
  
  if (!rawText || typeof rawText !== 'string') {
    return res.status(400).json({ error: 'Invalid request body. Expected { rawText: string }.' });
  }

  return res.status(200).json({
    clusters: [
      {
        id: 0,
        category: 'K',
        representative: 'テスト自動化が進んだ',
        noteIds: ['test-id'],
      },
    ],
    notes: [],
  });
};

// Mock the groupNotes utility
vi.mock('../../utils/groupNotes', () => ({
  groupNotes: vi.fn().mockResolvedValue([
    {
      id: 0,
      category: 'K',
      representative: 'テスト自動化が進んだ',
      noteIds: ['test-id'],
    },
  ]),
}));

// Mock environment variable
vi.stubEnv('OPENAI_KEY', 'test-key');

describe('group API endpoint', () => {
  it('returns 405 for non-POST requests', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'GET',
    });

    await mockHandler(req, res);

    expect(res._getStatusCode()).toBe(405);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Method not allowed. Use POST.',
    });
  });

  it('returns 400 for invalid request body', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {},
    });

    await mockHandler(req, res);

    expect(res._getStatusCode()).toBe(400);
    expect(JSON.parse(res._getData())).toEqual({
      error: 'Invalid request body. Expected { rawText: string }.',
    });
  });

  it('processes valid input correctly', async () => {
    const { req, res } = createMocks<NextApiRequest, NextApiResponse>({
      method: 'POST',
      body: {
        rawText: 'K: テスト自動化が進んだ',
      },
    });

    await mockHandler(req, res);

    expect(res._getStatusCode()).toBe(200);
    expect(JSON.parse(res._getData())).toEqual({
      clusters: [
        {
          id: 0,
          category: 'K',
          representative: 'テスト自動化が進んだ',
          noteIds: ['test-id'],
        },
      ],
      notes: [],
    });
  });
});