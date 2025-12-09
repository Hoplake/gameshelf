export interface Game {
  title: string;
  coverImage: string;
  playerCount: [number, number];
  recommendedPlayerCount?: [number, number];
  playTime: [number, number];
  complexity: number;
  bggLink: string;
  tags: string[];
  slug: string;
  content: string;
  recommendedForTwoPlayers?: boolean;
  played?: boolean;
  description?: string;
}

export interface GameFilters {
  playerCount?: number;
  maxComplexity?: number;
  maxPlayTime?: number;
  tags?: string[];
  recommendedForTwoPlayers?: boolean;
  playedStatus?: 'played' | 'unplayed' | 'all';
}

export type SortOption = 
  | 'title-asc'
  | 'title-desc'
  | 'complexity-asc'
  | 'complexity-desc'
  | 'playTime-asc'
  | 'playTime-desc';
