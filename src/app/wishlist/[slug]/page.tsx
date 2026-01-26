import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getWishlistGameBySlug, getAllWishlistGames } from '@/lib/wishlist-server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Users, Clock, Brain, Tag, UserCheck, Sparkles, UsersRound, Gift } from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';
import { MoveToGameshelfButton } from '@/components/MoveToGameshelfButton';

interface WishlistGamePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const games = getAllWishlistGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default async function WishlistGamePage({ params }: WishlistGamePageProps) {
  const { slug } = await params;
  const game = getWishlistGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const { title, coverImage, playerCount, recommendedPlayerCount, playTime, complexity, bggLink, bgaLink, tags, description, overview, recommendedForTwoPlayers, partyGame, goodWithFivePlus, bggValue } = game;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/wishlist">
                <Button variant="outline" size="sm" className="hover:bg-purple-50 dark:hover:bg-purple-950">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Takaisin toivelistalle
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div className="flex items-center gap-2">
                <Gift className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                <h1 className="text-xl md:text-2xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                  Toivelista
                </h1>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Game Info Sidebar */}
          <div className="lg:col-span-1">
            <Card className="sticky top-8">
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg group cursor-zoom-in">
                <Image
                  src={coverImage}
                  alt={`${title} pelin kansi`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              <CardContent className="p-6 space-y-6">
                <div>
                  <h2 className="text-2xl font-bold mb-4 bg-gradient-to-r from-purple-600 to-pink-600 dark:from-purple-400 dark:to-pink-400 bg-clip-text text-transparent">
                    {title}
                  </h2>
                  
                  <div className="space-y-3">
                    <div className="flex items-center gap-3">
                      <Users className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {playerCount[0]}-{playerCount[1]} pelaajaa
                        </div>
                        {recommendedPlayerCount && (
                          <div className="text-sm text-gray-600 dark:text-gray-400">
                            Suositeltu: {recommendedPlayerCount[0]}-{recommendedPlayerCount[1]} pelaajaa
                          </div>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-pink-600 dark:text-pink-400" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          {playTime[0]}-{playTime[1]} minuuttia
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <Brain className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
                      <div>
                        <div className="font-semibold text-gray-900 dark:text-white">
                          Monimutkaisuus: {complexity.toFixed(2)} / 5.0
                        </div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {complexity <= 2 ? 'Helppo' : complexity <= 3.5 ? 'Keskitaso' : 'Vaikea'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {bggValue && (
                  <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="text-sm text-gray-600 dark:text-gray-400 mb-1">Arvioitu arvo</div>
                    <div className="text-2xl font-bold text-purple-600 dark:text-purple-400">
                      ~{bggValue}€
                    </div>
                  </div>
                )}

                <div className="pt-4 border-t border-gray-200 dark:border-gray-700">
                  <div className="flex flex-wrap gap-2 mb-4">
                    {recommendedForTwoPlayers && (
                      <Badge className="bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-0">
                        <UserCheck className="h-3 w-3 mr-1" />
                        Suositeltu kahdelle
                      </Badge>
                    )}
                    {partyGame && (
                      <Badge className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 border-0">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Juhlapeli
                      </Badge>
                    )}
                    {goodWithFivePlus && (
                      <Badge className="bg-gradient-to-r from-teal-500 to-teal-600 hover:from-teal-600 hover:to-teal-700 border-0">
                        <UsersRound className="h-3 w-3 mr-1" />
                        Hyvä 5+ pelaajalle
                      </Badge>
                    )}
                  </div>
                  
                  <Link href={bggLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-700 hover:to-pink-700 border-0 mb-3">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Näytä BoardGameGeekissä
                    </Button>
                  </Link>
                  
                  {bgaLink && (
                    <Link href={bgaLink} target="_blank" rel="noopener noreferrer">
                      <Button className="w-full bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-700 hover:to-blue-700 border-0 mb-4">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Pelaa Board Game Arenassa
                      </Button>
                    </Link>
                  )}
                  
                  <MoveToGameshelfButton slug={slug} title={title} />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {description && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Kuvaus</h3>
                  <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{description}</p>
                </CardContent>
              </Card>
            )}

            {overview && (
              <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold mb-3 text-gray-900 dark:text-white">Yleiskuvaus</h3>
                  <div className="prose prose-gray dark:prose-invert max-w-none">
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                      {overview}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}

            <Card className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm border-gray-200 dark:border-gray-700">
              <CardContent className="p-6">
                <h3 className="text-lg font-semibold mb-4 flex items-center gap-2 text-gray-900 dark:text-white">
                  <Tag className="h-5 w-5" />
                  Tunnisteet
                </h3>
                <div className="flex flex-wrap gap-2">
                  {tags.map((tag) => (
                    <Badge
                      key={tag}
                      variant="secondary"
                      className="bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-950 dark:to-pink-950 border-purple-200 dark:border-purple-800 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900 dark:hover:to-pink-900 transition-colors"
                    >
                      {tag}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

