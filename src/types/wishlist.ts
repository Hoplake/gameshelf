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
  wishlistPriority?: number; // 1 = Must have, 2 = Love to have, 3 = Like to have, 4 = Thinking about it, 5 = Don't buy this
  bgaLink?: string; // Board Game Arena link
}

