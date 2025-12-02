'use client';

import { useState, useMemo, useEffect } from 'react';
import { GameCard } from '@/components/GameCard';
import { GameFilters } from '@/components/GameFilters';
import { RandomGamePicker } from '@/components/RandomGamePicker';
import { filterGames, sortGames } from '@/lib/games';
import { Game, GameFilters as GameFiltersType, SortOption } from '@/types/game';
import { Search, Grid, List, Shuffle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/ThemeToggle';

interface HomePageClientProps {
  allGames: Game[];
  availableTags: string[];
}

export function HomePageClient({ allGames, availableTags }: HomePageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState<GameFiltersType>({});
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

  const handleClearFilters = () => {
    setFilters({});
    setSearchQuery('');
  };

  if (!isMounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            <div className="animate-pulse">
              <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-4"></div>
              <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="animate-pulse space-y-6">
            <div className="h-32 bg-gray-200 dark:bg-gray-700 rounded"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-64 bg-gray-200 dark:bg-gray-700 rounded"></div>
              ))}
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                Pelihylly
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Henkilökohtainen lautapelikokoelma
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              {/* Random Game Picker */}
              <Button
                variant="default"
                size="sm"
                onClick={() => setShowRandomPicker(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white"
                title="Valitse satunnainen peli"
              >
                <Shuffle className="h-4 w-4 mr-2" />
                <span className="hidden sm:inline">Mitä pelataan?</span>
                <span className="sm:hidden">Satunnainen</span>
              </Button>

              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  type="text"
                  placeholder="Etsi pelejä..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              
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
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
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
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
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
