'use client';

import { useState, useEffect, useMemo } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ThemeToggle } from './ThemeToggle';
import { Home, Search, ExternalLink, ShoppingBag, X, Copy, Check } from 'lucide-react';

interface Store {
  name: string;
  url: string;
  description?: string;
  country?: string;
}

interface StoresPageClientProps {
  gameTitles?: string[];
}

const stores: Store[] = [
  {
    name: 'Lautapelit.fi',
    url: 'https://www.lautapelit.fi/search/?q={search}',
    description: 'Suomen suurin lautapelikauppa',
    country: 'FI',
  },
  {
    name: 'Puolenkuunpelit',
    url: 'https://www.puolenkuunpelit.com/kauppa/advanced_search_result.php?keywords={search}',
    description: 'Laaja valikoima lautapelejä',
    country: 'FI',
  },
  {
    name: 'Poromagia',
    url: 'https://lautapelit.poromagia.com/fi/search?q={search}',
    description: 'Lautapelit ja korttipelit',
    country: 'FI',
  },
  {
    name: 'Fantasiapelit',
    url: 'https://www.fantasiapelit.com/index.php?main=ai&mista=*&yhteen=eri&etsittava={searchparameter}&hae=HAE',
    description: 'Suomalainen lautapelikauppa',
    country: 'FI',
  },
  {
    name: 'Pelipeikko',
    url: 'https://www.pelipeikko.fi/fi/etsi?controller=search&s={searchparameter}',
    description: 'Suomalainen lautapelikauppa',
    country: 'FI',
  },
  {
    name: 'SpelExperten',
    url: 'https://www.spelexperten.fi/cgi-bin/ibutik/AIR_ibutik.fcgi?funk=gor_sokning&AvanceradSokning=N&Sprak_Suffix=FI&term={searchparameter}',
    description: 'Ruotsalainen lautapelikauppa',
    country: 'SE',
  },
  {
    name: 'Philibert',
    url: 'https://www.philibertnet.com/en/search?search_query={searchparameter}',
    description: 'Ranskalainen lautapelikauppa',
    country: 'FR',
  },
  {
    name: 'Amazon',
    url: 'https://www.amazon.de/s?k={searchparameter}&i=toys',
    description: 'Amazon Saksa - lelut ja pelit',
    country: 'DE',
  },
];

const countryLabels: Record<string, string> = {
  FI: 'Suomi',
  SE: 'Ruotsi',
  FR: 'Ranska',
  DE: 'Saksa',
};

export function StoresPageClient({ gameTitles = [] }: StoresPageClientProps) {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Load recent searches from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('storeSearchHistory');
    if (saved) {
      try {
        setRecentSearches(JSON.parse(saved).slice(0, 5));
      } catch {
        // Ignore parse errors
      }
    }
  }, []);

  // Filter game titles for suggestions
  const suggestions = useMemo(() => {
    if (!searchQuery.trim() || !showSuggestions) return [];
    const query = searchQuery.toLowerCase();
    return gameTitles
      .filter(title => title.toLowerCase().includes(query))
      .slice(0, 5);
  }, [searchQuery, gameTitles, showSuggestions]);

  const handleSearch = (store: Store) => {
    if (!searchQuery.trim()) return;
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    // Handle both {search} and {searchparameter} placeholders
    const url = store.url.replace('{searchparameter}', encodedQuery).replace('{search}', encodedQuery);
    
    // Save to recent searches
    const newRecent = [searchQuery.trim(), ...recentSearches.filter(s => s !== searchQuery.trim())].slice(0, 5);
    setRecentSearches(newRecent);
    localStorage.setItem('storeSearchHistory', JSON.stringify(newRecent));
    
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleQuickSearch = (title: string) => {
    setSearchQuery(title);
    setShowSuggestions(false);
  };

  const handleCopyUrl = (store: Store) => {
    if (!searchQuery.trim()) return;
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    const url = store.url.replace('{searchparameter}', encodedQuery).replace('{search}', encodedQuery);
    navigator.clipboard.writeText(url);
    setCopiedUrl(store.name);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  // Group stores by country
  const groupedStores = useMemo(() => {
    const groups: Record<string, Store[]> = {};
    stores.forEach(store => {
      const country = store.country || 'OTHER';
      if (!groups[country]) {
        groups[country] = [];
      }
      groups[country].push(store);
    });
    return groups;
  }, []);

  const clearSearch = () => {
    setSearchQuery('');
    setShowSuggestions(false);
  };

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
                <ShoppingBag className="h-6 w-6 text-green-600 dark:text-green-400" />
                <h1 className="text-2xl md:text-3xl font-bold bg-gradient-to-r from-green-600 to-emerald-600 dark:from-green-400 dark:to-emerald-400 bg-clip-text text-transparent">
                  Kaupat
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Card */}
        <Card className="mb-8 bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Search className="h-5 w-5" />
              Etsi pelejä kaupoista
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-gray-900 dark:text-white">
                  Hakusana
                </label>
                <div className="relative">
                  <Input
                    type="text"
                    placeholder="Kirjoita pelin nimi..."
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setShowSuggestions(true);
                    }}
                    onFocus={() => setShowSuggestions(true)}
                    onKeyPress={(e) => {
                      if (e.key === 'Enter' && stores.length > 0) {
                        handleSearch(stores[0]);
                      }
                    }}
                    className="w-full pr-10"
                  />
                  {searchQuery && (
                    <button
                      onClick={clearSearch}
                      className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-gray-100 dark:hover:bg-gray-700 rounded"
                      aria-label="Tyhjennä haku"
                    >
                      <X className="h-4 w-4 text-gray-400" />
                    </button>
                  )}
                  {/* Suggestions dropdown */}
                  {showSuggestions && suggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                      {suggestions.map((title) => (
                        <button
                          key={title}
                          onClick={() => handleQuickSearch(title)}
                          className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 text-sm"
                        >
                          {title}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              
              {/* Recent searches */}
              {recentSearches.length > 0 && !searchQuery && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Viimeisimmät haut
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((search) => (
                      <Badge
                        key={search}
                        variant="secondary"
                        className="cursor-pointer hover:bg-gray-200 dark:hover:bg-gray-700"
                        onClick={() => handleQuickSearch(search)}
                      >
                        {search}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              {/* Quick search buttons */}
              {gameTitles.length > 0 && !searchQuery && (
                <div className="space-y-2">
                  <label className="text-xs font-semibold text-gray-600 dark:text-gray-400">
                    Pikahaku kokoelmasta
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {gameTitles.slice(0, 8).map((title) => (
                      <Badge
                        key={title}
                        variant="outline"
                        className="cursor-pointer hover:bg-green-50 dark:hover:bg-green-950 hover:border-green-300 dark:hover:border-green-700"
                        onClick={() => handleQuickSearch(title)}
                      >
                        {title}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}

              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kirjoita hakusana yllä ja klikkaa kaupan nimeä avataksesi haun kyseisessä kaupassa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stores List - Grouped by Country */}
        {Object.entries(groupedStores).map(([country, countryStores]) => (
          <div key={country} className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                {countryLabels[country] || 'Muut'}
              </h2>
              <Badge variant="secondary" className="text-xs">
                {countryStores.length}
              </Badge>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {countryStores.map((store) => (
                <Card
                  key={store.name}
                  className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300"
                >
                  <CardContent className="p-5">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white truncate">
                            {store.name}
                          </h3>
                          <ExternalLink className="h-3.5 w-3.5 text-gray-400 flex-shrink-0" />
                        </div>
                        {store.description && (
                          <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {store.description}
                          </p>
                        )}
                        {searchQuery && (
                          <p className="text-xs text-gray-500 dark:text-gray-500 truncate">
                            Haku: <span className="font-medium">{searchQuery}</span>
                          </p>
                        )}
                      </div>
                      <div className="flex flex-col gap-2 flex-shrink-0">
                        <Button
                          variant="default"
                          size="sm"
                          className="bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 whitespace-nowrap"
                          onClick={() => handleSearch(store)}
                          disabled={!searchQuery.trim()}
                        >
                          Hae
                        </Button>
                        {searchQuery && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-8 w-8 p-0"
                            onClick={() => handleCopyUrl(store)}
                            title="Kopioi URL"
                          >
                            {copiedUrl === store.name ? (
                              <Check className="h-3.5 w-3.5 text-green-600" />
                            ) : (
                              <Copy className="h-3.5 w-3.5" />
                            )}
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        ))}

        {!searchQuery && (
          <Card className="mt-8 bg-blue-50/80 dark:bg-blue-950/80 backdrop-blur-sm border-blue-200 dark:border-blue-800">
            <CardContent className="p-6">
              <p className="text-sm text-blue-900 dark:text-blue-200 text-center">
                💡 Kirjoita hakusana yllä olevaan kenttään ja klikkaa kaupan nimeä tai &quot;Hae&quot;-nappia avataksesi haun kyseisessä kaupassa.
              </p>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
