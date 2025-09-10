import { Game, GameFilters, SortOption } from '@/types/game';

export function filterGames(games: Game[], filters: GameFilters): Game[] {
  return games.filter((game) => {
    // Player count filter
    if (filters.playerCount !== undefined) {
      const [min, max] = game.playerCount;
      if (filters.playerCount < min || filters.playerCount > max) {
        return false;
      }
    }

    // Complexity filter
    if (filters.maxComplexity !== undefined) {
      if (game.complexity > filters.maxComplexity) {
        return false;
      }
    }

    // Play time filter
    if (filters.maxPlayTime !== undefined) {
      const [, maxTime] = game.playTime;
      if (maxTime > filters.maxPlayTime) {
        return false;
      }
    }

    // Tags filter
    if (filters.tags && filters.tags.length > 0) {
      const hasMatchingTag = filters.tags.some((tag) =>
        game.tags.some((gameTag) =>
          gameTag.toLowerCase().includes(tag.toLowerCase())
        )
      );
      if (!hasMatchingTag) {
        return false;
      }
    }

    return true;
  });
}

export function sortGames(games: Game[], sortBy: SortOption): Game[] {
  const sortedGames = [...games];

  switch (sortBy) {
    case 'title-asc':
      return sortedGames.sort((a, b) => a.title.localeCompare(b.title));
    case 'title-desc':
      return sortedGames.sort((a, b) => b.title.localeCompare(a.title));
    case 'complexity-asc':
      return sortedGames.sort((a, b) => a.complexity - b.complexity);
    case 'complexity-desc':
      return sortedGames.sort((a, b) => b.complexity - a.complexity);
    case 'playTime-asc':
      return sortedGames.sort((a, b) => {
        const aMaxTime = a.playTime[1];
        const bMaxTime = b.playTime[1];
        return aMaxTime - bMaxTime;
      });
    case 'playTime-desc':
      return sortedGames.sort((a, b) => {
        const aMaxTime = a.playTime[1];
        const bMaxTime = b.playTime[1];
        return bMaxTime - aMaxTime;
      });
    default:
      return sortedGames;
  }
}

export function getAllTags(games: Game[]): string[] {
  const allTags = games.flatMap((game) => game.tags);
  return Array.from(new Set(allTags)).sort();
}
