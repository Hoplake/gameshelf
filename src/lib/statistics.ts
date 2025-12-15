import { Game } from '@/types/game';

export interface CollectionStats {
  totalGames: number;
  playedGames: number;
  unplayedGames: number;
  averageComplexity: number;
  averagePlayTime: number;
  complexityDistribution: {
    easy: number;
    medium: number;
    hard: number;
  };
  topTags: Array<{ tag: string; count: number }>;
  twoPlayerGames: number;
}

export function calculateStats(games: Game[]): CollectionStats {
  const totalGames = games.length;
  const playedGames = games.filter(g => g.played === true).length;
  const unplayedGames = games.filter(g => g.played === false).length;
  
  const averageComplexity = games.length > 0
    ? games.reduce((sum, g) => sum + g.complexity, 0) / games.length
    : 0;
  
  const averagePlayTime = games.length > 0
    ? games.reduce((sum, g) => sum + (g.playTime[0] + g.playTime[1]) / 2, 0) / games.length
    : 0;
  
  const complexityDistribution = {
    easy: games.filter(g => g.complexity <= 2).length,
    medium: games.filter(g => g.complexity > 2 && g.complexity <= 3.5).length,
    hard: games.filter(g => g.complexity > 3.5).length,
  };
  
  // Count tag occurrences
  const tagCounts: Record<string, number> = {};
  games.forEach(game => {
    game.tags.forEach(tag => {
      tagCounts[tag] = (tagCounts[tag] || 0) + 1;
    });
  });
  
  const topTags = Object.entries(tagCounts)
    .map(([tag, count]) => ({ tag, count }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 10);
  
  const twoPlayerGames = games.filter(g => g.recommendedForTwoPlayers === true).length;
  
  return {
    totalGames,
    playedGames,
    unplayedGames,
    averageComplexity,
    averagePlayTime,
    complexityDistribution,
    topTags,
    twoPlayerGames,
  };
}

