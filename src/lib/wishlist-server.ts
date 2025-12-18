import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { WishlistGame } from '@/types/wishlist';

const wishlistDirectory = path.join(process.cwd(), 'content/wishlist');

export function getAllWishlistGames(): WishlistGame[] {
  try {
    // Create directory if it doesn't exist
    if (!fs.existsSync(wishlistDirectory)) {
      fs.mkdirSync(wishlistDirectory, { recursive: true });
      return [];
    }

    const fileNames = fs.readdirSync(wishlistDirectory);
    const allWishlistGames = fileNames
      .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.(md|mdx)$/, '');
          const fullPath = path.join(wishlistDirectory, fileName);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);

          // Validate required fields
          if (!data.title || !data.playerCount || !data.playTime || !data.complexity || !data.tags) {
            console.warn(`Skipping ${fileName} - missing required fields`);
            return null;
          }

          return {
            ...data,
            slug,
            overview: content || data.overview || '', // Use content as overview
          } as WishlistGame;
        } catch (error) {
          console.error(`Error processing ${fileName}:`, error);
          return null;
        }
      })
      .filter((game): game is WishlistGame => game !== null);

    return allWishlistGames;
  } catch (error) {
    console.error('Error reading wishlist directory:', error);
    return [];
  }
}

export function getWishlistGameBySlug(slug: string): WishlistGame | null {
  try {
    const fullPath = path.join(wishlistDirectory, `${slug}.md`);
    const mdxPath = path.join(wishlistDirectory, `${slug}.mdx`);
    
    let filePath = fullPath;
    if (!fs.existsSync(fullPath) && fs.existsSync(mdxPath)) {
      filePath = mdxPath;
    }
    
    if (!fs.existsSync(filePath)) {
      return null;
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    return {
      ...data,
      slug,
      overview: content || data.overview || '',
    } as WishlistGame;
  } catch (error) {
    console.error(`Error reading wishlist game ${slug}:`, error);
    return null;
  }
}

