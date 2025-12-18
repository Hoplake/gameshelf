export interface WishlistGame {
  title: string;
  coverImage: string;
  playerCount: [number, number];
  recommendedPlayerCount?: [number, number];
  playTime: [number, number];
  complexity: number;
  bggLink: string;
  tags: string[];
  slug: string;
  description?: string;
  overview?: string; // Brief overview instead of full rules
  recommendedForTwoPlayers?: boolean;
  partyGame?: boolean;
  goodWithFivePlus?: boolean;
  bggValue?: number;
}

