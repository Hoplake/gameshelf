import { Game, GameFilters, SortOption } from '@/types/game';

/**
 * Removes common articles from the beginning of a title for sorting purposes.
 * This allows titles like "The Quest for El Dorado" to be sorted under "Q" instead of "T".
 */
function getSortTitle(title: string): string {
  const trimmed = title.trim();
  const articles = ['the ', 'a ', 'an '];
  
  for (const article of articles) {
    if (trimmed.toLowerCase().startsWith(article)) {
      return trimmed.slice(article.length).trim();
    }
  }
  
  return trimmed;
}

export function filterGames(games: Game[], filters: GameFilters): Game[] {
  return games.filter((game) => {
    // Played status filter
    if (filters.playedStatus !== undefined && filters.playedStatus !== 'all') {
      const isPlayed = game.played === true;
      if (filters.playedStatus === 'played' && !isPlayed) {
        return false;
      }
      if (filters.playedStatus === 'unplayed' && isPlayed) {
        return false;
      }
    }

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

    // Recommended for two players filter
    if (filters.recommendedForTwoPlayers === true) {
      if (!game.recommendedForTwoPlayers) {
        return false;
      }
    }

    // Party game filter
    if (filters.partyGame === true) {
      if (!game.partyGame) {
        return false;
      }
    }

    // Good with 5+ players filter
    if (filters.goodWithFivePlus === true) {
      if (!game.goodWithFivePlus) {
        return false;
      }
    }

    // Favorite filter
    if (filters.favorite === true) {
      if (!game.favorite) {
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
      return sortedGames.sort((a, b) => 
        getSortTitle(a.title).localeCompare(getSortTitle(b.title))
      );
    case 'title-desc':
      return sortedGames.sort((a, b) => 
        getSortTitle(b.title).localeCompare(getSortTitle(a.title))
      );
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
