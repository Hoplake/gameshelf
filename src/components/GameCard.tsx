import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types/game';
import { Users, Clock, Brain, ExternalLink, UserCheck } from 'lucide-react';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { title, coverImage, playerCount, playTime, complexity, tags, slug, recommendedForTwoPlayers } = game;
  
  // Add safety checks for required data
  if (!title || !playerCount || !playTime || !complexity || !tags) {
    return null;
  }

  return (
    <Link href={`/games/${slug}`} className="group">
      <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-105 bg-white dark:bg-gray-800">
        <div className="relative aspect-[3/4] overflow-hidden">
          <Image
            src={coverImage}
            alt={`${title} pelin kansi`}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-110"
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
          />
          <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
          {recommendedForTwoPlayers && (
            <div className="absolute top-2 right-2 bg-blue-600 text-white rounded-full p-1.5 shadow-lg">
              <UserCheck className="h-4 w-4" />
            </div>
          )}
        </div>
        
        <CardContent className="p-5 space-y-4">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors flex-1">
              {title}
            </h3>
            {recommendedForTwoPlayers && (
              <Badge variant="default" className="flex-shrink-0 text-xs bg-blue-600 hover:bg-blue-700">
                <UserCheck className="h-3 w-3 mr-1" />
                2p
              </Badge>
            )}
          </div>
          
          <div className="grid grid-cols-3 gap-2 text-xs text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{playerCount[0]}-{playerCount[1]}</span>
            </div>
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{playTime[0]}-{playTime[1]}m</span>
            </div>
            <div className="flex items-center gap-1">
              <Brain className="h-4 w-4 flex-shrink-0" />
              <span className="truncate">{complexity <= 2 ? 'Helppo' : complexity <= 3.5 ? 'Keskitaso' : 'Vaikea'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1">
            {tags.slice(0, 3).map((tag) => (
              <Badge key={tag} variant="secondary" className="text-xs">
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              Klikkaa nähdäksesi tiedot
            </span>
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
