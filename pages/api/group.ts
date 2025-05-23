import type { NextApiRequest, NextApiResponse } from 'next';
import { groupNotes } from '../../utils/groupNotes';
import { GroupResponse } from '../../types';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config();

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GroupResponse | { error: string }>
) {
  // Only allow POST method
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed. Use POST.' });
  }

  try {
    // Validate OpenAI API key
    if (!process.env.OPENAI_KEY) {
      return res.status(500).json({ error: 'OpenAI API key not found. Please set OPENAI_KEY in your .env.local file.' });
    }

    // Get raw text from request body
    const { rawText } = req.body;
    
    if (!rawText || typeof rawText !== 'string') {
      return res.status(400).json({ error: 'Invalid request body. Expected { rawText: string }.' });
    }

    // Group notes using the utility function
    const clusters = await groupNotes(rawText);
    
    // Return the clusters
    return res.status(200).json({ 
      clusters,
      notes: [] // Note: actual note objects would be returned here in a real implementation
    });
  } catch (error) {
    console.error('Error processing request:', error);
    return res.status(500).json({ error: error instanceof Error ? error.message : 'Unknown error' });
  }
}