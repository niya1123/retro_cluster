import Papa from 'papaparse';
import { Cluster, NoteParsed } from '../types';

/**
 * Generate CSV content from clusters
 */
export function generateCSV(clusters: Cluster[], notes: NoteParsed[]): string {
  // Create a map for quick lookup of notes by ID
  const notesMap = new Map<string, NoteParsed>();
  notes.forEach(note => notesMap.set(note.id, note));
  
  // Prepare data for CSV
  const csvData = clusters.map(cluster => {
    // Get all note IDs in this cluster as a comma-separated string
    const members = cluster.noteIds.join(',');
    
    return {
      group_id: cluster.id,
      category: cluster.category,
      representative_note: cluster.representative,
      members
    };
  });
  
  // Generate CSV using papaparse
  return Papa.unparse(csvData);
}

/**
 * Create a downloadable Blob for CSV data
 */
export function createCSVBlob(csvContent: string): Blob {
  return new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
}

/**
 * Trigger CSV download in the browser
 */
export function downloadCSV(csvContent: string, filename: string = 'retro_clusters.csv'): void {
  if (typeof window !== 'undefined') {
    const blob = createCSVBlob(csvContent);
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    
    link.setAttribute('href', url);
    link.setAttribute('download', filename);
    link.style.visibility = 'hidden';
    
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }
}