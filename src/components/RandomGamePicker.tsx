'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogClose } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Game } from '@/types/game';
import { Users, Clock, Brain, ExternalLink, Shuffle, Sparkles } from 'lucide-react';
import Image from 'next/image';

interface RandomGamePickerProps {
  games: Game[];
  onClose: () => void;
}

export function RandomGamePicker({ games, onClose }: RandomGamePickerProps) {
  const router = useRouter();
  const [pickedGame, setPickedGame] = useState<Game | null>(null);
  const [isPicking, setIsPicking] = useState(false);

  const pickRandomGame = () => {
    if (games.length === 0) return;

    setIsPicking(true);
    
    // Add a small delay for animation effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * games.length);
      const game = games[randomIndex];
      setPickedGame(game);
      setIsPicking(false);
    }, 500);
  };

  const handleViewGame = () => {
    if (pickedGame) {
      router.push(`/games/${pickedGame.slug}`);
      onClose();
    }
  };

  // Auto-pick on mount
  useEffect(() => {
    if (games.length === 0) return;

    setIsPicking(true);
    
    // Add a small delay for animation effect
    setTimeout(() => {
      const randomIndex = Math.floor(Math.random() * games.length);
      const game = games[randomIndex];
      setPickedGame(game);
      setIsPicking(false);
    }, 500);
  }, [games]);

  return (
    <Dialog open={true} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between w-full">
            <DialogTitle className="flex items-center gap-2">
              <Shuffle className="h-6 w-6 text-blue-600" />
              Satunnainen peli
            </DialogTitle>
            <DialogClose onClose={onClose} />
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {isPicking ? (
            <div className="flex flex-col items-center justify-center py-12 space-y-4">
              <div className="relative">
                <Sparkles className="h-16 w-16 text-blue-600 animate-pulse" />
                <div className="absolute inset-0 bg-blue-600/20 rounded-full animate-ping" />
              </div>
              <p className="text-lg font-medium text-gray-700 dark:text-gray-300">
                Valitaan peliä...
              </p>
            </div>
          ) : pickedGame ? (
            <div className="space-y-6">
              <div className="text-center">
                <p className="text-gray-600 dark:text-gray-400 mb-4">
                  Suosittelemme sinulle:
                </p>
              </div>

              <Card className="overflow-hidden transition-all duration-300 hover:shadow-lg bg-white dark:bg-gray-800">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
                  <div className="relative aspect-[3/4] overflow-hidden">
                    <Image
                      src={pickedGame.coverImage}
                      alt={`${pickedGame.title} pelin kansi`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                  </div>
                  
                  <CardContent className="p-6 space-y-4 flex flex-col justify-between">
                    <div className="space-y-4">
                      <div>
                        <h3 className="font-bold text-2xl text-gray-900 dark:text-white mb-2">
                          {pickedGame.title}
                        </h3>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <Users className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Pelaajat</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {pickedGame.playerCount[0]}-{pickedGame.playerCount[1]}
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <Clock className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Aika</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {pickedGame.playTime[0]}-{pickedGame.playTime[1]}m
                          </span>
                        </div>
                        <div className="flex flex-col items-center gap-1 p-2 bg-gray-50 dark:bg-gray-700 rounded">
                          <Brain className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                          <span className="text-xs text-gray-600 dark:text-gray-400">Vaikeus</span>
                          <span className="font-semibold text-gray-900 dark:text-white">
                            {pickedGame.complexity <= 2 ? 'Helppo' : pickedGame.complexity <= 3.5 ? 'Keskitaso' : 'Vaikea'}
                          </span>
                        </div>
                      </div>
                      
                      <div className="flex flex-wrap gap-2">
                        {pickedGame.tags.slice(0, 4).map((tag) => (
                          <Badge key={tag} variant="secondary" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                        {pickedGame.tags.length > 4 && (
                          <Badge variant="secondary" className="text-xs">
                            +{pickedGame.tags.length - 4}
                          </Badge>
                        )}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2 pt-4 border-t border-gray-200 dark:border-gray-700">
                      <Button
                        onClick={handleViewGame}
                        className="w-full"
                      >
                        Näytä pelin tiedot
                        <ExternalLink className="h-4 w-4 ml-2" />
                      </Button>
                      <Button
                        variant="outline"
                        onClick={pickRandomGame}
                        className="w-full"
                      >
                        <Shuffle className="h-4 w-4 mr-2" />
                        Valitse toinen peli
                      </Button>
                    </div>
                  </CardContent>
                </div>
              </Card>
            </div>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-600 dark:text-gray-400">
                Ei pelejä saatavilla valittavaksi.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

