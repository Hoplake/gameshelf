import { getAllGames } from '@/lib/games-server';
import { getAllWishlistGames } from '@/lib/wishlist-server';
import { BGAPageClient } from '@/components/BGAPageClient';

export default function BGAPage() {
  const allGames = getAllGames();
  const wishlistGames = getAllWishlistGames();
  
  // Filter games that have bgaLink defined
  const gamesWithBGA = allGames.filter(game => game.bgaLink);
  const wishlistGamesWithBGA = wishlistGames.filter(game => game.bgaLink);

  return <BGAPageClient games={gamesWithBGA} wishlistGames={wishlistGamesWithBGA} />;
}
