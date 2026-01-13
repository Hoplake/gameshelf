import { getAllGames } from '@/lib/games-server';
import { getAllWishlistGames } from '@/lib/wishlist-server';
import { StoresPageClient } from '@/components/StoresPageClient';

export default function StoresPage() {
  const allGames = getAllGames();
  const wishlistGames = getAllWishlistGames();
  
  // Get game titles for quick search suggestions
  const gameTitles = [
    ...allGames.map(g => g.title),
    ...wishlistGames.map(g => g.title)
  ].slice(0, 20); // Limit to 20 for performance

  return <StoresPageClient gameTitles={gameTitles} />;
}
