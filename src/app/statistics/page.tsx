import { getAllGames } from '@/lib/games-server';
import { calculateStats } from '@/lib/statistics';
import { StatisticsPage } from '@/components/StatisticsPage';

export default function Statistics() {
  const allGames = getAllGames();
  const stats = calculateStats(allGames);

  return <StatisticsPage stats={stats} allGames={allGames} />;
}

