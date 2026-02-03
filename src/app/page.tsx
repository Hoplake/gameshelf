import { Suspense } from 'react';
import { getAllGames, getAllTags } from '@/lib/games-server';
import { HomePageClient } from '@/components/HomePageClient';
import { HomePageSkeleton } from '@/components/LoadingSkeleton';

export default function HomePage() {
  const allGames = getAllGames();
  const availableTags = getAllTags(allGames);

  return (
    <Suspense fallback={<HomePageSkeleton />}>
      <HomePageClient allGames={allGames} availableTags={availableTags} />
    </Suspense>
  );
}