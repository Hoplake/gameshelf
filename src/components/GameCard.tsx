import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types/game';
import { Users, Clock, Brain, ExternalLink, UserCheck, AlertCircle, Star, UsersRound, Sparkles } from 'lucide-react';
import { useState } from 'react';

interface GameCardProps {
  game: Game;
}

export function GameCard({ game }: GameCardProps) {
  const { title, coverImage, playerCount, playTime, complexity, tags, slug, recommendedForTwoPlayers, partyGame, goodWithFivePlus, favorite, played, description } = game;
  const [imageError, setImageError] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  
  // Add safety checks for required data
  if (!title || !playerCount || !playTime || !complexity || !tags) {
    return null;
  }

  return (
    <Link href={`/games/${slug}`} className="group">
      <Card className={`overflow-hidden transition-all duration-300 hover:shadow-xl hover:scale-[1.02] bg-white dark:bg-gray-800 ${
        favorite 
          ? 'border-2 border-yellow-500 dark:border-yellow-500 hover:border-yellow-600 dark:hover:border-yellow-400 shadow-md shadow-yellow-500/20' 
          : 'border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-700'
      }`}>
        <div 
          className="relative aspect-[3/4] overflow-hidden cursor-zoom-in"
          onMouseEnter={() => setIsZoomed(true)}
          onMouseLeave={() => setIsZoomed(false)}
        >
          {!imageError ? (
            <Image
              src={coverImage}
              alt={`${title} pelin kansi`}
              fill
              className={`object-cover transition-transform duration-500 ${isZoomed ? 'scale-125' : 'group-hover:scale-110'}`}
              sizes="(max-width: 768px) 50vw, (max-width: 1024px) 50vw, 33vw"
              onError={() => setImageError(true)}
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-br from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 flex items-center justify-center">
              <div className="text-center p-4">
                <div className="text-4xl mb-2">🎲</div>
                <div className="text-sm font-medium text-gray-600 dark:text-gray-400 line-clamp-2">{title}</div>
              </div>
            </div>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/0 to-black/0 group-hover:from-black/70 transition-all duration-300" />
          <div className="absolute top-3 right-3 flex flex-col gap-2">
            {favorite && (
              <div className="bg-gradient-to-br from-yellow-500 to-yellow-600 text-white rounded-full p-2 shadow-lg backdrop-blur-sm" title="Suosikkipeli">
                <Star className="h-4 w-4 fill-white" />
              </div>
            )}
            {recommendedForTwoPlayers && (
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-full p-2 shadow-lg backdrop-blur-sm" title="Suositeltu kahdelle pelaajalle">
                <UserCheck className="h-4 w-4" />
              </div>
            )}
            {partyGame && (
              <div className="bg-gradient-to-br from-cyan-500 to-cyan-600 text-white rounded-full p-2 shadow-lg backdrop-blur-sm" title="Juhlapeli">
                <Sparkles className="h-4 w-4" />
              </div>
            )}
            {goodWithFivePlus && (
              <div className="bg-gradient-to-br from-teal-500 to-teal-600 text-white rounded-full p-2 shadow-lg backdrop-blur-sm" title="Hyvä 5+ pelaajalle">
                <UsersRound className="h-4 w-4" />
              </div>
            )}
            {played === false && (
              <div className="bg-gradient-to-br from-orange-500 to-orange-600 text-white rounded-full p-2 shadow-lg backdrop-blur-sm" title="Pelaamattomat">
                <AlertCircle className="h-4 w-4" />
              </div>
            )}
          </div>
        </div>
        
        <CardContent className="p-6 space-y-5">
          <div className="space-y-3">
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-bold text-xl line-clamp-2 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-purple-600 dark:group-hover:from-blue-400 dark:group-hover:to-purple-400 group-hover:bg-clip-text transition-all duration-300 flex-1 leading-tight">
                {title}
              </h3>
              {recommendedForTwoPlayers && (
                <Badge variant="default" className="text-xs bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 flex-shrink-0 border-0">
                  <UserCheck className="h-3 w-3 mr-1" />
                  2p
                </Badge>
              )}
            </div>
            {played === false && (
              <div>
                <Badge variant="default" className="text-xs bg-gradient-to-r from-orange-500 to-orange-600 hover:from-orange-600 hover:to-orange-700 border-0">
                  <AlertCircle className="h-3 w-3 mr-1" />
                  Pelaamaton
                </Badge>
              </div>
            )}
          </div>
          
          {description && (
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3 leading-relaxed">
              {description}
            </p>
          )}
          
          <div className="flex flex-col gap-2.5 text-sm text-gray-600 dark:text-gray-400">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 flex-shrink-0 text-blue-600 dark:text-blue-400" />
              <span className="truncate font-medium">{playerCount[0]}-{playerCount[1]} pelaajaa</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 flex-shrink-0 text-purple-600 dark:text-purple-400" />
              <span className="truncate font-medium">{playTime[0]}-{playTime[1]} minuuttia</span>
            </div>
            <div className="flex items-center gap-2">
              <Brain className="h-4 w-4 flex-shrink-0 text-indigo-600 dark:text-indigo-400" />
              <span className="truncate font-medium">{complexity <= 2 ? 'Helppo' : complexity <= 3.5 ? 'Keskitaso' : 'Vaikea'}</span>
            </div>
          </div>
          
          <div className="flex flex-wrap gap-1.5 pt-2">
            {tags.slice(0, 3).map((tag) => (
              <Badge 
                key={tag} 
                variant="secondary" 
                className="text-xs bg-gradient-to-r from-blue-50 to-purple-50 dark:from-blue-950 dark:to-purple-950 border-blue-200 dark:border-blue-800 hover:from-blue-100 hover:to-purple-100 dark:hover:from-blue-900 dark:hover:to-purple-900 transition-colors"
              >
                {tag}
              </Badge>
            ))}
            {tags.length > 3 && (
              <Badge variant="secondary" className="text-xs bg-gradient-to-r from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900">
                +{tags.length - 3}
              </Badge>
            )}
          </div>
          
          <div className="flex justify-between items-center pt-3 border-t border-gray-200 dark:border-gray-700">
            <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">
              Klikkaa nähdäksesi tiedot
            </span>
            <ExternalLink className="h-4 w-4 text-gray-400 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors" />
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}
