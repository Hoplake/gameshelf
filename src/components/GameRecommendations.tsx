'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types/game';
import { Sparkles, ExternalLink } from 'lucide-react';

interface GameRecommendationsProps {
  games: Game[];
  currentGameSlug: string;
}

export function GameRecommendations({ games, currentGameSlug }: GameRecommendationsProps) {
  if (games.length === 0) {
    return null;
  }

  return (
    <Card className="mt-8 bg-gradient-to-br from-purple-50/50 to-blue-50/50 dark:from-purple-950/30 dark:to-blue-950/30 border-purple-200 dark:border-purple-800">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          <CardTitle>Sinä saatat myös pitää näistä</CardTitle>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {games.map((game) => (
            <Link
              key={game.slug}
              href={`/games/${game.slug}`}
              className="group"
            >
              <Card className="h-full transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                  <Image
                    src={game.coverImage}
                    alt={`${game.title} pelin kansi`}
                    fill
                    className="object-cover transition-transform duration-300 group-hover:scale-110"
                    sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 33vw"
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors mb-2">
                    {game.title}
                  </h3>
                  <div className="flex flex-wrap gap-1 mb-2">
                    {game.tags.slice(0, 2).map((tag) => (
                      <Badge key={tag} variant="secondary" className="text-xs">
                        {tag}
                      </Badge>
                    ))}
                    {game.tags.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{game.tags.length - 2}
                      </Badge>
                    )}
                  </div>
                  <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400">
                    <span>{game.playerCount[0]}-{game.playerCount[1]} pelaajaa</span>
                    <ExternalLink className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

