#!/usr/bin/env node

/**
 * Script to move a game from wishlist to gameshelf
 * Usage: node scripts/move-to-gameshelf.js <slug>
 * Example: node scripts/move-to-gameshelf.js catan
 */

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

const wishlistDirectory = path.join(process.cwd(), 'content/wishlist');
const gamesDirectory = path.join(process.cwd(), 'content/games');

function moveToGameshelf(slug) {
  try {
    // Read the wishlist file
    const wishlistFilePath = path.join(wishlistDirectory, `${slug}.md`);
    const wishlistMdxPath = path.join(wishlistDirectory, `${slug}.mdx`);
    
    let filePath = wishlistFilePath;
    if (!fs.existsSync(wishlistFilePath) && fs.existsSync(wishlistMdxPath)) {
      filePath = wishlistMdxPath;
    }
    
    if (!fs.existsSync(filePath)) {
      console.error(`❌ Error: Wishlist file not found for slug: ${slug}`);
      process.exit(1);
    }

    const fileContents = fs.readFileSync(filePath, 'utf8');
    const { data, content } = matter(fileContents);

    // Validate required fields
    if (!data.title || !data.playerCount || !data.playTime || !data.complexity || !data.tags) {
      console.error(`❌ Error: Missing required fields in ${slug}`);
      process.exit(1);
    }

    // Prepare game data - ensure played field
    const gameData = {
      ...data,
      played: data.played !== undefined ? data.played : false,
    };

    // Remove overview field if it exists (games use content instead)
    if (gameData.overview !== undefined) {
      delete gameData.overview;
    }

    // Create the frontmatter string
    const frontmatter = `---\n${Object.entries(gameData)
      .map(([key, value]) => {
        if (value === undefined || value === null) return '';
        if (Array.isArray(value)) {
          return `${key}: [${value.map(v => typeof v === 'string' ? `'${v.replace(/'/g, "''")}'` : v).join(', ')}]`;
        }
        if (typeof value === 'string') {
          // Escape single quotes in strings
          const escaped = value.replace(/'/g, "''");
          return `${key}: '${escaped}'`;
        }
        if (typeof value === 'boolean') {
          return `${key}: ${value}`;
        }
        return `${key}: ${value}`;
      })
      .filter(Boolean)
      .join('\n')}\n---\n\n`;

    // Use content if available, otherwise use overview, otherwise empty string
    const gameContent = content || data.overview || '';

    // Write to games directory
    const gameFilePath = path.join(gamesDirectory, `${slug}.md`);
    
    // Check if game already exists
    if (fs.existsSync(gameFilePath)) {
      console.error(`❌ Error: Game already exists in gameshelf: ${slug}`);
      process.exit(1);
    }

    // Ensure games directory exists
    if (!fs.existsSync(gamesDirectory)) {
      fs.mkdirSync(gamesDirectory, { recursive: true });
    }

    fs.writeFileSync(gameFilePath, frontmatter + gameContent, 'utf8');

    // Delete the wishlist file
    fs.unlinkSync(filePath);

    console.log(`✅ Successfully moved "${data.title}" from wishlist to gameshelf!`);
    console.log(`   Game file: ${gameFilePath}`);
    console.log(`   Wishlist file removed: ${filePath}`);
  } catch (error) {
    console.error('❌ Error moving game to gameshelf:', error.message);
    process.exit(1);
  }
}

// Get slug from command line arguments
const slug = process.argv[2];

if (!slug) {
  console.error('❌ Error: Please provide a game slug');
  console.log('Usage: node scripts/move-to-gameshelf.js <slug>');
  console.log('Example: node scripts/move-to-gameshelf.js catan');
  process.exit(1);
}

moveToGameshelf(slug);
