// Input type for the API
export type NoteInput = { rawText: string }[];

// Parsed note with ID and category
export interface NoteParsed {
  id: string;                  // uuid v4
  category: "K" | "P" | "T";   // Keep, Problem, Try
  content: string;             // Prefix removed content
}

// Cluster output from the API
export interface Cluster {
  id: number;                  // 0, 1, 2, ...
  category: "K" | "P" | "T";   // Category of the representative
  representative: string;      // Content of the representative note
  noteIds: string[];           // IDs of all notes in this cluster
}

// API response type
export interface GroupResponse {
  clusters: Cluster[];
  notes: NoteParsed[];
}