export interface Game {
  title: string;
  coverImage: string;
  playerCount: [number, number];
  playTime: [number, number];
  complexity: number;
  bggLink: string;
  tags: string[];
  slug: string;
  content: string;
}

export interface GameFilters {
  playerCount?: number;
  maxComplexity?: number;
  maxPlayTime?: number;
  tags?: string[];
}

export type SortOption = 
  | 'title-asc'
  | 'title-desc'
  | 'complexity-asc'
  | 'complexity-desc'
  | 'playTime-asc'
  | 'playTime-desc';
