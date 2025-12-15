'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CollectionStats } from '@/lib/statistics';
import { 
  Gamepad2, 
  CheckCircle2, 
  Circle, 
  Brain, 
  Clock, 
  Users, 
  TrendingUp,
  BarChart3
} from 'lucide-react';

interface StatisticsDashboardProps {
  stats: CollectionStats;
}

export function StatisticsDashboard({ stats }: StatisticsDashboardProps) {
  const playedPercentage = stats.totalGames > 0
    ? Math.round((stats.playedGames / stats.totalGames) * 100)
    : 0;
  
  const complexityPercentage = {
    easy: stats.totalGames > 0 ? Math.round((stats.complexityDistribution.easy / stats.totalGames) * 100) : 0,
    medium: stats.totalGames > 0 ? Math.round((stats.complexityDistribution.medium / stats.totalGames) * 100) : 0,
    hard: stats.totalGames > 0 ? Math.round((stats.complexityDistribution.hard / stats.totalGames) * 100) : 0,
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
      {/* Total Games */}
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

      {/* Played Games */}
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

      {/* Unplayed Games */}
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

      {/* Average Complexity */}
      <Card className="bg-gradient-to-br from-purple-50 to-purple-100 dark:from-purple-950 dark:to-purple-900 border-purple-200 dark:border-purple-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-purple-900 dark:text-purple-100">
              Keskimääräinen monimutkaisuus
            </CardTitle>
            <Brain className="h-5 w-5 text-purple-600 dark:text-purple-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-purple-900 dark:text-purple-100">
            {stats.averageComplexity.toFixed(1)}
          </div>
          <p className="text-sm text-purple-700 dark:text-purple-300 mt-1">
            / 5.0
          </p>
        </CardContent>
      </Card>

      {/* Average Play Time */}
      <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100 dark:from-indigo-950 dark:to-indigo-900 border-indigo-200 dark:border-indigo-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-indigo-900 dark:text-indigo-100">
              Keskimääräinen peliaika
            </CardTitle>
            <Clock className="h-5 w-5 text-indigo-600 dark:text-indigo-400" />
          </div>
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold text-indigo-900 dark:text-indigo-100">
            {Math.round(stats.averagePlayTime)}
          </div>
          <p className="text-sm text-indigo-700 dark:text-indigo-300 mt-1">
            minuuttia
          </p>
        </CardContent>
      </Card>

      {/* Two Player Games */}
      <Card className="bg-gradient-to-br from-pink-50 to-pink-100 dark:from-pink-950 dark:to-pink-900 border-pink-200 dark:border-pink-800">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <CardTitle className="text-sm font-medium text-pink-900 dark:text-pink-100">
              Kahden pelaajan pelit
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

      {/* Complexity Distribution */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <BarChart3 className="h-5 w-5" />
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
        </CardContent>
      </Card>

      {/* Top Tags */}
      <Card className="md:col-span-2 lg:col-span-3">
        <CardHeader>
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            <CardTitle>Suosituimmat tunnisteet</CardTitle>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
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
        </CardContent>
      </Card>
    </div>
  );
}

