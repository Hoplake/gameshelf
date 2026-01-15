'use client';

import { useState, useMemo } from 'react';
import { WishlistGame } from '@/types/wishlist';
import { WishlistGameCard } from './WishlistGameCard';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, Gift } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

interface WishlistPageClientProps {
  wishlistGames: WishlistGame[];
}

type SortOption = 'title-asc' | 'title-desc' | 'complexity-asc' | 'complexity-desc' | 'playTime-asc' | 'playTime-desc';

function sortWishlistGames(games: WishlistGame[], sortBy: SortOption): WishlistGame[] {
  const sorted = [...games];
  
  switch (sortBy) {
    case 'title-asc':
      return sorted.sort((a, b) => {
        const titleA = a.title.replace(/^(the|a|an)\s+/i, '').trim();
        const titleB = b.title.replace(/^(the|a|an)\s+/i, '').trim();
        return titleA.localeCompare(titleB, 'fi');
      });
    case 'title-desc':
      return sorted.sort((a, b) => {
        const titleA = a.title.replace(/^(the|a|an)\s+/i, '').trim();
        const titleB = b.title.replace(/^(the|a|an)\s+/i, '').trim();
        return titleB.localeCompare(titleA, 'fi');
      });
    case 'complexity-asc':
      return sorted.sort((a, b) => a.complexity - b.complexity);
    case 'complexity-desc':
      return sorted.sort((a, b) => b.complexity - a.complexity);
    case 'playTime-asc':
      return sorted.sort((a, b) => a.playTime[0] - b.playTime[0]);
    case 'playTime-desc':
      return sorted.sort((a, b) => b.playTime[1] - a.playTime[1]);
    default:
      return sorted;
  }
}

export function WishlistPageClient({ wishlistGames }: WishlistPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');

  // Group games by wishlist priority
  const groupedGames = useMemo(() => {
    const groups: Record<number, WishlistGame[]> = {
      1: [],
      2: [],
      3: [],
      4: [],
      5: [],
    };

    wishlistGames.forEach((game) => {
      const priority = game.wishlistPriority;
      if (priority && groups[priority]) {
        groups[priority].push(game);
      }
    });

    // Sort each group
    Object.keys(groups).forEach((key) => {
      groups[Number(key)] = sortWishlistGames(groups[Number(key)], sortBy);
    });

    return groups;
  }, [wishlistGames, sortBy]);

  const filteredAndSortedGames = useMemo(() => {
    let filtered = wishlistGames;
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return sortWishlistGames(filtered, sortBy);
  }, [wishlistGames, searchQuery, sortBy]);

  // Priority labels in Finnish
  const priorityLabels: Record<number, string> = {
    1: 'Pitää ostaa',
    2: 'Haluaisin ostaa',
    3: 'Näyttää kivalta',
    4: 'Pitää tutustua lisää',
    5: 'Ei kiinnostakkaan',
  };

  // Priority order for display
  const priorityOrder = [1, 2, 3, 4, 5];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700 sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                  <Home className="h-4 w-4 mr-2" />
                  Kokoelma
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Toivelista
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Card */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <CardContent className="p-6">
            <div className="flex flex-wrap items-center gap-6">
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {wishlistGames.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Pelia toivelistalla
                </div>
              </div>
              {wishlistGames.length > 0 && (
                <div>
                  <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                    {wishlistGames.reduce((sum, game) => sum + (game.bggValue || 0), 0).toFixed(0)}€
                  </div>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    Arvioitu arvo
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Filters */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Haku ja lajittelu
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">Hae</label>
              <Input
                type="text"
                placeholder="Hae pelin nimellä, tunnisteella tai kuvauksella..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-900 dark:text-white">Lajittele</label>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortOption)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="title-asc">Nimi (A-Ö)</SelectItem>
                  <SelectItem value="title-desc">Nimi (Ö-A)</SelectItem>
                  <SelectItem value="complexity-asc">Monimutkaisuus (Helppo → Vaikea)</SelectItem>
                  <SelectItem value="complexity-desc">Monimutkaisuus (Vaikea → Helppo)</SelectItem>
                  <SelectItem value="playTime-asc">Peliaika (Lyhyt → Pitkä)</SelectItem>
                  <SelectItem value="playTime-desc">Peliaika (Pitkä → Lyhyt)</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Games Grid - Grouped by Priority */}
        {searchQuery ? (
          // Show filtered results when searching
          filteredAndSortedGames.length === 0 ? (
            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
              <CardContent className="p-12 text-center">
                <Gift className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Ei tuloksia
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Kokeile muuttaa hakusanaa
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredAndSortedGames.map((game) => (
                <WishlistGameCard key={game.slug} game={game} />
              ))}
            </div>
          )
        ) : (
          // Show grouped results when not searching
          (() => {
            const hasAnyGames = priorityOrder.some(priority => groupedGames[priority]?.length > 0);
            
            if (!hasAnyGames) {
              return (
                <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                  <CardContent className="p-12 text-center">
                    <Gift className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                      Toivelista on tyhjä
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400">
                      Lisää pelejä toivelistalle käyttämällä newwishlistgame -komentoa tai tuo BGG:stä
                    </p>
                  </CardContent>
                </Card>
              );
            }
            
            return priorityOrder.map((priority) => {
              const games = groupedGames[priority];
              if (games.length === 0) return null;

              const isThinkingAboutIt = priority === 4;
              
              return (
                <div key={priority} className="mb-8">
                  <div className={`mb-4 pb-2 border-b-2 ${
                    isThinkingAboutIt 
                      ? 'border-purple-400 dark:border-purple-600' 
                      : 'border-gray-300 dark:border-gray-600'
                  }`}>
                    <h2 className={`text-2xl font-bold ${
                      isThinkingAboutIt
                        ? 'text-purple-600 dark:text-purple-400'
                        : 'text-gray-900 dark:text-white'
                    }`}>
                      {priorityLabels[priority]}
                      <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
                        ({games.length})
                      </span>
                    </h2>
                    {isThinkingAboutIt && (
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                        Pelit, joita harkitsen vielä
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {games.map((game) => (
                      <WishlistGameCard key={game.slug} game={game} />
                    ))}
                  </div>
                </div>
              );
            });
          })()
        )}
      </div>
    </div>
  );
}

