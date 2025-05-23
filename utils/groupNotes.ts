import OpenAI from 'openai';
import { v4 as uuidv4 } from 'uuid';
import { kmeans } from 'ml-kmeans';
import { NoteParsed, Cluster } from '../types';

// Initialize OpenAI client
const openai = new OpenAI({
  apiKey: process.env.OPENAI_KEY,
});

// Parse raw text notes into structured format
export function parseNotes(rawNotes: string[]): NoteParsed[] {
  return rawNotes
    .filter(note => note.trim() !== '')
    .map(note => {
      const match = note.match(/^([KPT]):(.+)$/i);
      if (!match) {
        throw new Error(`Invalid note format: ${note}. Must start with K:, P:, or T:.`);
      }
      
      const category = match[1].toUpperCase() as 'K' | 'P' | 'T';
      const content = match[2].trim();
      
      return {
        id: uuidv4(),
        category,
        content,
      };
    });
}

// Generate embeddings for notes using OpenAI
export async function generateEmbeddings(notes: NoteParsed[]): Promise<{
  notes: NoteParsed[],
  embeddings: number[][]
}> {
  const embeddings = await Promise.all(
    notes.map(async (note) => {
      const response = await openai.embeddings.create({
        model: 'text-embedding-3-large',
        input: note.content,
        encoding_format: 'float',
      });
      
      return response.data[0].embedding;
    })
  );
  
  return { notes, embeddings };
}

// Calculate optimal number of clusters based on the square root rule
export function calculateK(n: number): number {
  return Math.max(2, Math.ceil(Math.sqrt(n)));
}

// Find the closest note to the centroid
export function findRepresentative(
  noteIndices: number[],
  embeddings: number[][],
  centroid: number[]
): number {
  let minDistance = Infinity;
  let representativeIdx = -1;
  
  noteIndices.forEach(idx => {
    const embedding = embeddings[idx];
    const distance = calculateEuclideanDistance(embedding, centroid);
    
    if (distance < minDistance) {
      minDistance = distance;
      representativeIdx = idx;
    }
  });
  
  return representativeIdx;
}

// Calculate Euclidean distance between two vectors
function calculateEuclideanDistance(vec1: number[], vec2: number[]): number {
  return Math.sqrt(
    vec1.reduce((sum, val, idx) => sum + Math.pow(val - vec2[idx], 2), 0)
  );
}

// Group notes into clusters
export async function groupNotes(rawText: string): Promise<Cluster[]> {
  // Split input by new lines
  const rawNotes = rawText.split('\n').filter(line => line.trim() !== '');
  
  // Parse notes
  const parsedNotes = parseNotes(rawNotes);
  
  // Generate embeddings
  const { notes, embeddings } = await generateEmbeddings(parsedNotes);
  
  // Calculate optimal k
  const k = calculateK(notes.length);
  
  // Perform k-means clustering
  const result = kmeans(embeddings, k);
  
  // Create clusters with representatives
  const clusters: Cluster[] = [];
  
  for (let i = 0; i < k; i++) {
    // Get all notes in this cluster
    const clusterIndices = notes
      .map((_, idx) => idx)
      .filter(idx => result.clusters[idx] === i);
    
    if (clusterIndices.length > 0) {
      // Find the representative note (closest to centroid)
      const repIndex = findRepresentative(
        clusterIndices,
        embeddings,
        result.centroids[i]
      );
      
      // Get note IDs for this cluster
      const noteIds = clusterIndices.map(idx => notes[idx].id);
      
      // Create cluster object
      clusters.push({
        id: i,
        category: notes[repIndex].category,
        representative: notes[repIndex].content,
        noteIds,
      });
    }
  }
  
  return clusters;
}

// For testing purposes
export function __test__ () {
  return {
    parseNotes,
    calculateK,
    findRepresentative,
    calculateEuclideanDistance: calculateEuclideanDistance,
  };
}