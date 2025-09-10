import { getAllGames, getAllTags } from '@/lib/games-server';
import { HomePageClient } from '@/components/HomePageClient';

export default function HomePage() {
  // Get all games on the server side
  const allGames = getAllGames();
  const availableTags = getAllTags(allGames);

  return <HomePageClient allGames={allGames} availableTags={availableTags} />;
}