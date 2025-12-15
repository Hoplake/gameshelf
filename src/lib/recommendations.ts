import { Game } from '@/types/game';

/**
 * Calculate similarity score between two games based on:
 * - Shared tags (weight: 40%)
 * - Complexity similarity (weight: 30%)
 * - Player count overlap (weight: 20%)
 * - Play time similarity (weight: 10%)
 */
export function calculateSimilarity(game1: Game, game2: Game): number {
  // Shared tags score (0-1)
  const tags1 = new Set(game1.tags.map(t => t.toLowerCase()));
  const tags2 = new Set(game2.tags.map(t => t.toLowerCase()));
  const sharedTags = [...tags1].filter(t => tags2.has(t)).length;
  const totalUniqueTags = new Set([...tags1, ...tags2]).size;
  const tagScore = totalUniqueTags > 0 ? sharedTags / totalUniqueTags : 0;
  
  // Complexity similarity (0-1)
  const complexityDiff = Math.abs(game1.complexity - game2.complexity);
  const maxComplexityDiff = 4; // Assuming complexity ranges from 1-5
  const complexityScore = 1 - Math.min(complexityDiff / maxComplexityDiff, 1);
  
  // Player count overlap (0-1)
  const [min1, max1] = game1.playerCount;
  const [min2, max2] = game2.playerCount;
  const overlapStart = Math.max(min1, min2);
  const overlapEnd = Math.min(max1, max2);
  const overlap = Math.max(0, overlapEnd - overlapStart + 1);
  const totalRange = Math.max(max1 - min1 + 1, max2 - min2 + 1);
  const playerCountScore = overlap / totalRange;
  
  // Play time similarity (0-1)
  const avgTime1 = (game1.playTime[0] + game1.playTime[1]) / 2;
  const avgTime2 = (game2.playTime[0] + game2.playTime[1]) / 2;
  const timeDiff = Math.abs(avgTime1 - avgTime2);
  const maxTimeDiff = 120; // Assuming max play time difference
  const playTimeScore = 1 - Math.min(timeDiff / maxTimeDiff, 1);
  
  // Weighted combination
  const similarity = (
    tagScore * 0.4 +
    complexityScore * 0.3 +
    playerCountScore * 0.2 +
    playTimeScore * 0.1
  );
  
  return similarity;
}

/**
 * Get recommended games similar to the given game
 */
export function getRecommendedGames(
  targetGame: Game,
  allGames: Game[],
  limit: number = 6
): Game[] {
  const otherGames = allGames.filter(g => g.slug !== targetGame.slug);
  
  const gamesWithSimilarity = otherGames.map(game => ({
    game,
    similarity: calculateSimilarity(targetGame, game),
  }));
  
  return gamesWithSimilarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit)
    .map(item => item.game);
}

