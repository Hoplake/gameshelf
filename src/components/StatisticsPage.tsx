'use client';

import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { CollectionStats } from '@/lib/statistics';
import { Game } from '@/types/game';
import { 
  Gamepad2, 
  CheckCircle2, 
  Circle, 
  Brain, 
  Clock, 
  Users, 
  TrendingUp,
  BarChart3,
  ArrowLeft,
  Award,
  Calendar,
  Target,
  Zap,
  BookOpen,
  Star
} from 'lucide-react';
import { ThemeToggle } from '@/components/ThemeToggle';

interface StatisticsPageProps {
  stats: CollectionStats;
  allGames: Game[];
}

export function StatisticsPage({ stats, allGames }: StatisticsPageProps) {
  const playedPercentage = stats.totalGames > 0
    ? Math.round((stats.playedGames / stats.totalGames) * 100)
    : 0;
  
  const complexityPercentage = {
    easy: stats.totalGames > 0 ? Math.round((stats.complexityDistribution.easy / stats.totalGames) * 100) : 0,
    medium: stats.totalGames > 0 ? Math.round((stats.complexityDistribution.medium / stats.totalGames) * 100) : 0,
    hard: stats.totalGames > 0 ? Math.round((stats.complexityDistribution.hard / stats.totalGames) * 100) : 0,
  };

  // Calculate play time distribution
  const playTimeRanges = {
    quick: allGames.filter(g => g.playTime[1] <= 30).length,
    medium: allGames.filter(g => g.playTime[1] > 30 && g.playTime[1] <= 60).length,
    long: allGames.filter(g => g.playTime[1] > 60 && g.playTime[1] <= 120).length,
    epic: allGames.filter(g => g.playTime[1] > 120).length,
  };

  // Calculate player count distribution
  const playerCountRanges = {
    solo: allGames.filter(g => g.playerCount[0] === 1).length,
    two: allGames.filter(g => g.playerCount[0] <= 2 && g.playerCount[1] >= 2).length,
    threeToFour: allGames.filter(g => g.playerCount[0] <= 3 && g.playerCount[1] >= 4).length,
    fivePlus: allGames.filter(g => g.playerCount[1] >= 5).length,
  };

  // Find most complex and simplest games
  const mostComplex = [...allGames].sort((a, b) => b.complexity - a.complexity).slice(0, 5);
  const simplest = [...allGames].sort((a, b) => a.complexity - b.complexity).slice(0, 5);

  // Find longest and shortest games
  const longest = [...allGames].sort((a, b) => b.playTime[1] - a.playTime[1]).slice(0, 5);
  const shortest = [...allGames].sort((a, b) => a.playTime[1] - b.playTime[1]).slice(0, 5);

  // Calculate tag diversity
  const uniqueTags = new Set(allGames.flatMap(g => g.tags)).size;
  const avgTagsPerGame = allGames.length > 0
    ? allGames.reduce((sum, g) => sum + g.tags.length, 0) / allGames.length
    : 0;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
      {/* Header */}
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="hover:bg-blue-50 dark:hover:bg-blue-950">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Takaisin kokoelmaan
                </Button>
              </Link>
              <div className="h-6 w-px bg-gray-300 dark:bg-gray-600" />
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent">
                  Tilastot
                </h1>
                <p className="text-lg text-gray-600 dark:text-gray-400 mt-1">
                  Kokoelman analyysi ja tilastot
                </p>
              </div>
            </div>
            <ThemeToggle />
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 border-blue-200 dark:border-blue-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-blue-900 dark:text-blue-100">
                  Kokoelma
                </CardTitle>
                <Gamepad2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">
                {stats.totalGames}
              </div>
              <p className="text-sm text-blue-700 dark:text-blue-300 mt-1">
                peliä yhteensä
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-50 to-green-100 dark:from-green-950 dark:to-green-900 border-green-200 dark:border-green-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-green-900 dark:text-green-100">
                  Pelatut
                </CardTitle>
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-green-900 dark:text-green-100">
                {stats.playedGames}
              </div>
              <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                {playedPercentage}% kokoelmasta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 border-orange-200 dark:border-orange-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-orange-900 dark:text-orange-100">
                  Pelaamattomat
                </CardTitle>
                <Circle className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">
                {stats.unplayedGames}
              </div>
              <p className="text-sm text-orange-700 dark:text-orange-300 mt-1">
                {stats.totalGames > 0 ? Math.round((stats.unplayedGames / stats.totalGames) * 100) : 0}% kokoelmasta
              </p>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-pink-900 dark:text-pink-100">
                  Kahden pelaajan
                </CardTitle>
                <Users className="h-5 w-5 text-pink-600 dark:text-pink-400" />
              </div>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold text-pink-900 dark:text-pink-100">
                {stats.twoPlayerGames}
              </div>
              <p className="text-sm text-pink-700 dark:text-pink-300 mt-1">
                suositeltu kahdelle
              </p>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          {/* Complexity Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <BarChart3 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle>Monimutkaisuuden jakauma</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Helppo (≤2.0)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.complexityDistribution.easy} ({complexityPercentage.easy}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${complexityPercentage.easy}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Keskitaso (2.1-3.5)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.complexityDistribution.medium} ({complexityPercentage.medium}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${complexityPercentage.medium}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Vaikea (&gt;3.5)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {stats.complexityDistribution.hard} ({complexityPercentage.hard}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${complexityPercentage.hard}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Keskimääräinen monimutkaisuus</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {stats.averageComplexity.toFixed(2)}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Play Time Distribution */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <CardTitle>Peliajan jakauma</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Nopeat (≤30 min)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {playTimeRanges.quick} ({stats.totalGames > 0 ? Math.round((playTimeRanges.quick / stats.totalGames) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-green-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalGames > 0 ? (playTimeRanges.quick / stats.totalGames) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Keskimääräiset (31-60 min)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {playTimeRanges.medium} ({stats.totalGames > 0 ? Math.round((playTimeRanges.medium / stats.totalGames) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-yellow-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalGames > 0 ? (playTimeRanges.medium / stats.totalGames) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Pitkät (61-120 min)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {playTimeRanges.long} ({stats.totalGames > 0 ? Math.round((playTimeRanges.long / stats.totalGames) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-orange-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalGames > 0 ? (playTimeRanges.long / stats.totalGames) * 100 : 0}%` }}
                    />
                  </div>
                </div>
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Eepokset (&gt;120 min)</span>
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      {playTimeRanges.epic} ({stats.totalGames > 0 ? Math.round((playTimeRanges.epic / stats.totalGames) * 100) : 0}%)
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div
                      className="bg-red-500 h-3 rounded-full transition-all duration-500"
                      style={{ width: `${stats.totalGames > 0 ? (playTimeRanges.epic / stats.totalGames) * 100 : 0}%` }}
                    />
                  </div>
                </div>
              </div>
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Keskimääräinen peliaika</span>
                  <span className="text-2xl font-bold text-gray-900 dark:text-white">
                    {Math.round(stats.averagePlayTime)} min
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Player Count Distribution */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
              <CardTitle>Pelaajamäärän jakauma</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center p-4 bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-950 dark:to-blue-900 rounded-lg">
                <div className="text-3xl font-bold text-blue-900 dark:text-blue-100">{playerCountRanges.solo}</div>
                <div className="text-sm text-blue-700 dark:text-blue-300 mt-1">Solo-pelit</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 rounded-lg">
                <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">{playerCountRanges.two}</div>
                <div className="text-sm text-purple-700 dark:text-purple-300 mt-1">Kahden pelaajan</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 rounded-lg">
                <div className="text-3xl font-bold text-pink-900 dark:text-pink-100">{playerCountRanges.threeToFour}</div>
                <div className="text-sm text-pink-700 dark:text-pink-300 mt-1">3-4 pelaajaa</div>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-orange-50 to-orange-100 dark:from-orange-950 dark:to-orange-900 rounded-lg">
                <div className="text-3xl font-bold text-orange-900 dark:text-orange-100">{playerCountRanges.fivePlus}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300 mt-1">5+ pelaajaa</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Top Tags */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              <CardTitle>Suosituimmat tunnisteet</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2 mb-6">
              {stats.topTags.map(({ tag, count }) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-sm px-3 py-1.5 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900 dark:to-purple-900 border-blue-200 dark:border-blue-700"
                >
                  {tag}
                  <span className="ml-2 text-xs opacity-70">({count})</span>
                </Badge>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-6 border-t border-gray-200 dark:border-gray-700">
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Yksilöllisiä tunnisteita</span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{uniqueTags}</div>
              </div>
              <div>
                <span className="text-sm text-gray-600 dark:text-gray-400">Keskimäärin tunnisteita per peli</span>
                <div className="text-2xl font-bold text-gray-900 dark:text-white">{avgTagsPerGame.toFixed(1)}</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Game Lists */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Most Complex Games */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Award className="h-5 w-5 text-red-600 dark:text-red-400" />
                <CardTitle>Monimutkaisimmat pelit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {mostComplex.map((game, index) => (
                  <div key={game.slug} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-red-500 to-red-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <Link href={`/games/${game.slug}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {game.title}
                        </Link>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-red-100 dark:bg-red-900 text-red-900 dark:text-red-100">
                      {game.complexity.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Simplest Games */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Zap className="h-5 w-5 text-green-600 dark:text-green-400" />
                <CardTitle>Yksinkertaisimmat pelit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {simplest.map((game, index) => (
                  <div key={game.slug} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-green-500 to-green-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <Link href={`/games/${game.slug}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {game.title}
                        </Link>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-green-100 dark:bg-green-900 text-green-900 dark:text-green-100">
                      {game.complexity.toFixed(1)}
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Longest Games */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <CardTitle>Pisimmät pelit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {longest.map((game, index) => (
                  <div key={game.slug} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-orange-500 to-orange-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <Link href={`/games/${game.slug}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {game.title}
                        </Link>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-orange-100 dark:bg-orange-900 text-orange-900 dark:text-orange-100">
                      {game.playTime[1]} min
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Shortest Games */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <Target className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <CardTitle>Lyhimmät pelit</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {shortest.map((game, index) => (
                  <div key={game.slug} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-blue-600 text-white flex items-center justify-center font-bold text-sm">
                        {index + 1}
                      </div>
                      <div>
                        <Link href={`/games/${game.slug}`} className="font-medium hover:text-blue-600 dark:hover:text-blue-400 transition-colors">
                          {game.title}
                        </Link>
                      </div>
                    </div>
                    <Badge variant="secondary" className="bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100">
                      {game.playTime[1]} min
                    </Badge>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

