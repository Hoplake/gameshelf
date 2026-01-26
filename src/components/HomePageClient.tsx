'use client';

import { useState, useMemo, useEffect } from 'react';
import Link from 'next/link';
import { GameCard } from '@/components/GameCard';
import { GameFilters } from '@/components/GameFilters';
import { RandomGamePicker } from '@/components/RandomGamePicker';
import { HomePageSkeleton } from '@/components/LoadingSkeleton';
import { filterGames, sortGames } from '@/lib/games';
import { calculateStats } from '@/lib/statistics';
import { Game, GameFilters as GameFiltersType, SortOption } from '@/types/game';
import { Search, Grid, List, Shuffle, BarChart3, Gift, ShoppingBag, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HomePageClientProps {
  allGames: Game[];
  availableTags: string[];
}

export function HomePageClient({ allGames, availableTags }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<GameFiltersType>({ playedStatus: 'played' });
  const [sortBy, setSortBy] = useState<SortOption>('title-asc');
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [isMounted, setIsMounted] = useState(false);
  const [showRandomPicker, setShowRandomPicker] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  // Filter and sort games
  const filteredAndSortedGames = useMemo(() => {
    let filtered = filterGames(allGames, filters);
    
    // Apply search filter
    if (searchQuery) {
      filtered = filtered.filter((game) =>
        game.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        game.tags.some((tag) =>
          tag.toLowerCase().includes(searchQuery.toLowerCase())
        )
      );
    }
    
    return sortGames(filtered, sortBy);
  }, [allGames, filters, searchQuery, sortBy]);

  // Calculate statistics
  const stats = useMemo(() => calculateStats(allGames), [allGames]);

  const handleClearFilters = () => {
    setFilters({ playedStatus: 'played' });
    setSearchQuery('');
  };

  if (!isMounted) {
    return <HomePageSkeleton />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            {/* Title Section */}
            <div>
              <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-1">
                Pelihylly
              </h1>
              <p className="text-base sm:text-lg text-gray-600 dark:text-gray-400">
                Henkilökohtainen lautapelikokoelma
              </p>
            </div>
            
            {/* Search Bar - Full Width on Mobile */}
            <div className="w-full">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                <input
                  type="text"
                  placeholder="Etsi pelejä..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:focus:border-blue-500 transition-all duration-200 shadow-sm hover:shadow-md"
                />
              </div>
            </div>

            {/* Action Buttons Row */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-4">
              {/* Statistics Link */}
              <Link href="/statistics" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto hover:bg-blue-50 dark:hover:bg-blue-950 border-gray-300 dark:border-gray-600"
                  title="Näytä tilastot"
                >
                  <BarChart3 className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Tilastot</span>
                </Button>
              </Link>

              {/* Wishlist Link */}
              <Link href="/wishlist" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto hover:bg-purple-50 dark:hover:bg-purple-950 border-gray-300 dark:border-gray-600"
                  title="Näytä toivelista"
                >
                  <Gift className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Toivelista</span>
                </Button>
              </Link>

              {/* Stores Link */}
              <Link href="/stores" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto hover:bg-green-50 dark:hover:bg-green-950 border-gray-300 dark:border-gray-600"
                  title="Etsi pelejä kaupoista"
                >
                  <ShoppingBag className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">Kaupat</span>
                </Button>
              </Link>

              {/* BGA Link */}
              <Link href="/bga" className="flex-1 sm:flex-none">
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full sm:w-auto hover:bg-cyan-50 dark:hover:bg-cyan-950 border-gray-300 dark:border-gray-600"
                  title="Näytä Board Game Arena -pelit"
                >
                  <ExternalLink className="h-4 w-4 sm:mr-2" />
                  <span className="hidden sm:inline">BGA</span>
                </Button>
              </Link>

              {/* Random Game Picker */}
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowRandomPicker(true)}
                className="flex-1 sm:flex-none bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg hover:shadow-xl transition-all duration-300"
                title="Valitse satunnainen peli"
              >
                <Shuffle className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">Mitä pelataan?</span>
                <span className="sm:hidden">Satunnainen</span>
              </Button>
              
              {/* View Mode Toggle */}
              <div className="flex border border-gray-300 dark:border-gray-600 rounded-lg">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                  title="Ruudukkonäkymä"
                >
                  <Grid className="h-4 w-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                  title="Listanäkymä"
                >
                  <List className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Theme Toggle */}
              <ThemeToggle />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Quick Stats Summary */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Link href="/statistics" className="group">
            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-blue-900 dark:text-blue-100 group-hover:scale-110 transition-transform">
                  {stats.totalGames}
                </div>
                <div className="text-xs text-blue-700 dark:text-blue-300 mt-1">Peliä yhteensä</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/statistics" className="group">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-green-900 dark:text-green-100 group-hover:scale-110 transition-transform">
                  {stats.playedGames}
                </div>
                <div className="text-xs text-green-700 dark:text-green-300 mt-1">Pelattua</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/statistics" className="group">
            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-purple-900 dark:text-purple-100 group-hover:scale-110 transition-transform">
                  {stats.averageComplexity.toFixed(1)}
                </div>
                <div className="text-xs text-purple-700 dark:text-purple-300 mt-1">Keskim. monimutkaisuus</div>
              </CardContent>
            </Card>
          </Link>
          <Link href="/statistics" className="group">
            <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800 hover:shadow-lg transition-all duration-300 cursor-pointer">
              <CardContent className="p-4">
                <div className="text-2xl font-bold text-pink-900 dark:text-pink-100 group-hover:scale-110 transition-transform">
                  {stats.twoPlayerGames}
                </div>
                <div className="text-xs text-pink-700 dark:text-pink-300 mt-1">Kahden pelaajan</div>
              </CardContent>
            </Card>
          </Link>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Filters Sidebar */}
          <div className="lg:w-80 flex-shrink-0">
            <GameFilters
              filters={filters}
              onFiltersChange={setFilters}
              sortBy={sortBy}
              onSortChange={setSortBy}
              availableTags={availableTags}
              onClearFilters={handleClearFilters}
            />
          </div>

          {/* Games Grid */}
          <div className="flex-1">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                {filteredAndSortedGames.length} peli{filteredAndSortedGames.length !== 1 ? 'ä' : ''} löytyi
              </h2>
            </div>

            {filteredAndSortedGames.length === 0 ? (
              <div className="text-center py-12">
                <div className="text-gray-400 dark:text-gray-600 mb-4">
                  <Search className="h-12 w-12 mx-auto" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                  Pelejä ei löytynyt
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Kokeile muuttaa suodattimia tai hakua
                </p>
                <Button
                  variant="outline"
                  onClick={handleClearFilters}
                  className="mt-4"
                >
                  Tyhjennä kaikki suodattimet
                </Button>
              </div>
            ) : (
              <div className={
                viewMode === 'grid'
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6'
                  : 'space-y-4'
              }>
                {filteredAndSortedGames.map((game) => (
                  <GameCard key={game.slug} game={game} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Random Game Picker Modal */}
      {showRandomPicker && filteredAndSortedGames.length > 0 && (
        <RandomGamePicker
          games={filteredAndSortedGames}
          onClose={() => setShowRandomPicker(false)}
        />
      )}
    </div>
  );
}
