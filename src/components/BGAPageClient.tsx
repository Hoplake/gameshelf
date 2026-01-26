'use client';

import { useState, useMemo } from 'react';
import { Game } from '@/types/game';
import { WishlistGame } from '@/types/wishlist';
import { GameCard } from './GameCard';
import { WishlistGameCard } from './WishlistGameCard';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Search, ExternalLink, Gift, Package } from 'lucide-react';
import { ThemeToggle } from './ThemeToggle';
import Link from 'next/link';
import { Button } from './ui/button';
import { Home } from 'lucide-react';

interface BGAPageClientProps {
  games: Game[];
  wishlistGames: WishlistGame[];
}

type SortOption = 'title-asc' | 'title-desc' | 'complexity-asc' | 'complexity-desc' | 'playTime-asc' | 'playTime-desc';

function sortGames<T extends Game | WishlistGame>(games: T[], sortBy: SortOption): T[] {
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

export function BGAPageClient({ games, wishlistGames }: BGAPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');

  const filteredAndSortedWishlistGames = useMemo(() => {
    let filtered = wishlistGames;
    
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return sortGames(filtered, sortBy);
  }, [wishlistGames, searchQuery, sortBy]);

  const filteredAndSortedGames = useMemo(() => {
    let filtered = games;
    
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        ) ||
        (game.description && game.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
    }
    
    return sortGames(filtered, sortBy);
  }, [games, searchQuery, sortBy]);

  const totalGames = wishlistGames.length + games.length;

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
                <ExternalLink className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-blue-600 to-cyan-600 dark:from-blue-400 dark:to-cyan-400 bg-clip-text text-transparent">
                  Board Game Arena
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
                <div className="text-3xl font-bold text-blue-600 dark:text-blue-400">
                  {totalGames}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Peliä saatavilla BGA:ssa
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-purple-600 dark:text-purple-400">
                  {wishlistGames.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Toivelistalla
                </div>
              </div>
              <div>
                <div className="text-3xl font-bold text-green-600 dark:text-green-400">
                  {games.length}
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-400">
                  Omistamassamme
                </div>
              </div>
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

        {/* Wishlist Games Section */}
        {wishlistGames.length > 0 && (
          <div className="mb-12">
            <div className="mb-4 pb-2 border-b-2 border-purple-300 dark:border-purple-600">
              <div className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h2 className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                  Toivelista
                  <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
                    ({filteredAndSortedWishlistGames.length})
                  </span>
                </h2>
              </div>
            </div>
            {filteredAndSortedWishlistGames.length === 0 ? (
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
                {filteredAndSortedWishlistGames.map((game) => (
                  <WishlistGameCard key={game.slug} game={game} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Owned Games Section */}
        {games.length > 0 && (
          <div>
            <div className="mb-4 pb-2 border-b-2 border-green-300 dark:border-green-600">
              <div className="flex items-center gap-2">
                <Package className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h2 className="text-2xl font-bold text-green-600 dark:text-green-400">
                  Omistamamme pelit
                  <span className="ml-2 text-lg font-normal text-gray-500 dark:text-gray-400">
                    ({filteredAndSortedGames.length})
                  </span>
                </h2>
              </div>
            </div>
            {filteredAndSortedGames.length === 0 ? (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                <CardContent className="p-12 text-center">
                  <Package className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
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
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Empty State */}
        {totalGames === 0 && (
          <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
            <CardContent className="p-12 text-center">
              <ExternalLink className="h-16 w-16 mx-auto text-gray-400 dark:text-gray-600 mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                Ei pelejä BGA:ssa
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                Lisää bgaLink-kenttä pelin tiedostoihin, jotta ne näkyvät tässä
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
