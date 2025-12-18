import { getAllWishlistGames } from '@/lib/wishlist-server';
import { WishlistPageClient } from '@/components/WishlistPageClient';

export default function WishlistPage() {
  const wishlistGames = getAllWishlistGames();

  return <WishlistPageClient wishlistGames={wishlistGames} />;
}

