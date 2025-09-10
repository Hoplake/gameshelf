import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { Game } from '@/types/game';

const gamesDirectory = path.join(process.cwd(), 'content/games');

export function getAllGames(): Game[] {
  try {
    const fileNames = fs.readdirSync(gamesDirectory);
    const allGamesData = fileNames
      .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
      .map((fileName) => {
        try {
          const slug = fileName.replace(/\.(md|mdx)$/, '');
          const fullPath = path.join(gamesDirectory, fileName);
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
            content: content || '',
          } as Game;
        } catch (error) {
          console.error(`Error processing ${fileName}:`, error);
          return null;
        }
      })
      .filter((game): game is Game => game !== null);

    return allGamesData;
  } catch (error) {
    console.error('Error reading games directory:', error);
    return [];
  }
}

export function getGameBySlug(slug: string): Game | null {
  try {
    const fullPath = path.join(gamesDirectory, `${slug}.md`);
    const mdxPath = path.join(gamesDirectory, `${slug}.mdx`);
    
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
      content,
    } as Game;
  } catch (error) {
    console.error(`Error reading game ${slug}:`, error);
    return null;
  }
}

export function getAllTags(games: Game[]): string[] {
  const allTags = games.flatMap((game) => game.tags);
  return Array.from(new Set(allTags)).sort();
}
