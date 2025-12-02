import { notFound } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { getGameBySlug, getAllGames } from '@/lib/games-server';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, ExternalLink, Users, Clock, Brain, Tag } from 'lucide-react';
import { MDXRemote } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { ThemeToggle } from '@/components/ThemeToggle';

interface GamePageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const games = getAllGames();
  return games.map((game) => ({
    slug: game.slug,
  }));
}

export default async function GamePage({ params }: GamePageProps) {
  const { slug } = await params;
  const game = getGameBySlug(slug);

  if (!game) {
    notFound();
  }

  const { title, coverImage, playerCount, recommendedPlayerCount, playTime, complexity, bggLink, tags, content } = game;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Takaisin kokoelmaan
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {title}
              </h1>
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
              <div className="relative aspect-[3/4] overflow-hidden rounded-t-lg">
                <Image
                  src={coverImage}
                  alt={`${title} pelin kansi`}
                  fill
                  className="object-cover"
                  sizes="(max-width: 768px) 100vw, 33vw"
                />
              </div>
              
              <CardContent className="p-6 space-y-6">
                {/* Game Stats */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <Users className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Pelaajat</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {playerCount[0]}-{playerCount[1]}
                        {recommendedPlayerCount && (
                          <span className="ml-2 text-xs text-gray-500 dark:text-gray-500">
                            (suositus: {recommendedPlayerCount[0]}-{recommendedPlayerCount[1]})
                          </span>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Clock className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Peliaika</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {playTime[0]}-{playTime[1]} minuuttia
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    <Brain className="h-5 w-5 text-gray-500" />
                    <div>
                      <div className="font-medium">Monimutkaisuus</div>
                      <div className="text-sm text-gray-600 dark:text-gray-400">
                        {complexity <= 2 ? 'Helppo' : complexity <= 3.5 ? 'Keskitaso' : 'Vaikea'}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tags */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Tag className="h-4 w-4 text-gray-500" />
                    <span className="font-medium">Tunnisteet</span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {tags.map((tag) => (
                      <Badge key={tag} variant="secondary">
                        {tag}
                      </Badge>
                    ))}
                  </div>
                </div>

                {/* BGG Link */}
                <div className="pt-4 border-t">
                  <Link href={bggLink} target="_blank" rel="noopener noreferrer">
                    <Button className="w-full" variant="outline">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      Näytä BoardGameGeekissä
                    </Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Game Content */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-8">
                <div className="prose prose-lg max-w-none dark:prose-invert">
                  <MDXRemote source={content} options={{
                    mdxOptions: {
                      remarkPlugins: [remarkGfm],
                    },
                  }} />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
