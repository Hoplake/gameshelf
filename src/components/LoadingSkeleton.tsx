import { Card, CardContent, CardHeader } from '@/components/ui/card';

export function GameCardSkeleton() {
  return (
    <Card className="overflow-hidden bg-white dark:bg-gray-800 animate-pulse">
      <div className="aspect-[3/4] bg-gray-200 dark:bg-gray-700" />
      <CardContent className="p-6 space-y-4">
        <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-3/4" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-full" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6" />
        <div className="space-y-2">
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
          <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/3" />
        </div>
        <div className="flex gap-2">
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-16" />
          <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-20" />
        </div>
      </CardContent>
    </Card>
  );
}

export function StatisticsCardSkeleton() {
  return (
    <Card className="animate-pulse">
      <CardHeader className="pb-3">
        <div className="h-5 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </CardHeader>
      <CardContent>
        <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-1/3 mb-2" />
        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2" />
      </CardContent>
    </Card>
  );
}

export function HomePageSkeleton() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30 dark:from-gray-900 dark:via-blue-950/30 dark:to-purple-950/30">
      <header className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-sm shadow-sm border-b border-gray-200 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col gap-4">
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-1/3 animate-pulse" />
            <div className="h-10 bg-gray-200 dark:bg-gray-700 rounded w-full animate-pulse" />
            <div className="flex gap-2">
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-24 animate-pulse" />
              <div className="h-9 bg-gray-200 dark:bg-gray-700 rounded w-32 animate-pulse" />
            </div>
          </div>
        </div>
      </header>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {Array.from({ length: 4 }).map((_, i) => (
            <StatisticsCardSkeleton key={i} />
          ))}
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <GameCardSkeleton key={i} />
          ))}
        </div>
      </div>
    </div>
  );
}

