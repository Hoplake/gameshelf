'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ThemeToggle } from './ThemeToggle';
import { Home, Search, ExternalLink, ShoppingBag } from 'lucide-react';

interface Store {
  name: string;
  url: string;
  description?: string;
}

const stores: Store[] = [
  {
    name: 'Lautapelit.fi',
    url: 'https://www.lautapelit.fi/search/?q={search}',
    description: 'Suomen suurin lautapelikauppa',
  },
  {
    name: 'Puolenkuunpelit',
    url: 'https://www.puolenkuunpelit.com/kauppa/advanced_search_result.php?keywords={search}',
    description: 'Laaja valikoima lautapelejä',
  },
  {
    name: 'Poromagia',
    url: 'https://lautapelit.poromagia.com/fi/search?q={search}',
    description: 'Lautapelit ja korttipelit',
  },
  {
    name: 'SpelExperten',
    url: 'https://www.spelexperten.fi/cgi-bin/ibutik/AIR_ibutik.fcgi?funk=gor_sokning&AvanceradSokning=N&Sprak_Suffix=FI&term={searchparameter}',
    description: 'Ruotsalainen lautapelikauppa',
  },
  {
    name: 'Fantasiapelit',
    url: 'https://www.fantasiapelit.com/index.php?main=ai&mista=*&yhteen=eri&etsittava={searchparameter}&hae=HAE',
    description: 'Suomalainen lautapelikauppa',
  },
  {
    name: 'Philibert',
    url: 'https://www.philibertnet.com/en/search?search_query={searchparameter}',
    description: 'Ranskalainen lautapelikauppa',
  },
  {
    name: 'Pelipeikko',
    url: 'https://www.pelipeikko.fi/fi/etsi?controller=search&s={searchparameter}',
    description: 'Suomalainen lautapelikauppa',
  },
  {
    name: 'Amazon',
    url: 'https://www.amazon.de/s?k={searchparameter}&i=toys',
    description: 'Amazon Saksa - lelut ja pelit',
  },
];

export function StoresPageClient() {
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (store: Store) => {
    if (!searchQuery.trim()) return;
    const encodedQuery = encodeURIComponent(searchQuery.trim());
    // Handle both {search} and {searchparameter} placeholders
    const url = store.url.replace('{searchparameter}', encodedQuery).replace('{search}', encodedQuery);
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleKeyPress = (e: React.KeyboardEvent, store: Store) => {
    if (e.key === 'Enter') {
      handleSearch(store);
    }
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
                <Input
                  type="text"
                  placeholder="Kirjoita pelin nimi..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && stores.length > 0) {
                      handleSearch(stores[0]);
                    }
                  }}
                  className="w-full"
                />
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Kirjoita hakusana yllä ja klikkaa kaupan nimeä avataksesi haun kyseisessä kaupassa.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Stores List */}
        <div className="space-y-4">
          {stores.map((store) => (
            <Card
              key={store.name}
              className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700 hover:shadow-lg transition-all duration-300 cursor-pointer"
              onClick={() => handleSearch(store)}
              onKeyPress={(e) => handleKeyPress(e, store)}
              tabIndex={0}
              role="button"
              aria-label={`Hae ${store.name} kaupasta: ${searchQuery || 'tyhjä haku'}`}
            >
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {store.name}
                      </h3>
                      <ExternalLink className="h-4 w-4 text-gray-400" />
                    </div>
                    {store.description && (
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {store.description}
                      </p>
                    )}
                    {searchQuery && (
                      <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">
                        Haku: <span className="font-medium">{searchQuery}</span>
                      </p>
                    )}
                  </div>
                  <Button
                    variant="default"
                    size="sm"
                    className="ml-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSearch(store);
                    }}
                    disabled={!searchQuery.trim()}
                  >
                    Hae
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

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
