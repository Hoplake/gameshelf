#!/usr/bin/env node

/**
 * Script to import wishlist from BoardGameGeek API
 * Usage: node scripts/import-wishlist-from-bgg.js
 * 
 * Requires .env file with BGG_USERNAME
 * 
 * IMPORTANT: Your BGG collection must be PUBLIC for this to work!
 * To make it public: BGG Account Settings > Privacy > Collection Privacy > Public
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const https = require('https');

const wishlistDirectory = path.join(process.cwd(), 'content/wishlist');

// Parse XML response from BGG API
function parseXML(xmlText) {
  const items = [];
  const itemMatches = xmlText.matchAll(/<item[^>]*objectid="(\d+)"[^>]*>([\s\S]*?)<\/item>/g);
  
  for (const match of itemMatches) {
    const id = match[1];
    const content = match[2];
    
    const nameMatch = content.match(/<name[^>]*>([^<]+)<\/name>/);
    const name = nameMatch ? nameMatch[1] : '';
    
    const yearMatch = content.match(/<yearpublished>(\d+)<\/yearpublished>/);
    const yearpublished = yearMatch ? yearMatch[1] : null;
    
    const imageMatch = content.match(/<image>([^<]+)<\/image>/);
    const image = imageMatch ? imageMatch[1] : null;
    
    const thumbnailMatch = content.match(/<thumbnail>([^<]+)<\/thumbnail>/);
    const thumbnail = thumbnailMatch ? thumbnailMatch[1] : null;
    
    const statsMatch = content.match(/<stats[^>]*minplayers="(\d+)"[^>]*maxplayers="(\d+)"[^>]*minplaytime="(\d+)"[^>]*maxplaytime="(\d+)"[^>]*playingtime="(\d+)"[^>]*minage="(\d+)"[^>]*>/);
    const minplayers = statsMatch ? parseInt(statsMatch[1]) : null;
    const maxplayers = statsMatch ? parseInt(statsMatch[2]) : null;
    const minplaytime = statsMatch ? parseInt(statsMatch[3]) : null;
    const maxplaytime = statsMatch ? parseInt(statsMatch[4]) : null;
    const playingtime = statsMatch ? parseInt(statsMatch[5]) : null;
    const minage = statsMatch ? parseInt(statsMatch[6]) : null;
    
    const avgMatch = content.match(/<average[^>]*value="([^"]+)"/);
    const average = avgMatch ? parseFloat(avgMatch[1]) : null;
    
    const weightMatch = content.match(/<averageweight[^>]*value="([^"]+)"/);
    const averageweight = weightMatch ? parseFloat(weightMatch[1]) : null;
    
    // Parse status with all wishlist fields - handle both self-closing and closing tags
    // Status can have attributes in any order
    const statusEl = content.match(/<status[^>]*\/?>/) || content.match(/<status[^>]*>([\s\S]*?)<\/status>/);
    let own = false;
    let prevowned = false;
    let want = false;
    let wanttoplay = false;
    let wanttobuy = false;
    let wishlist = false;
    let wishlistpriority = null;
    
    if (statusEl) {
      const statusContent = statusEl[0];
      own = statusContent.includes('own="1"');
      prevowned = statusContent.includes('prevowned="1"');
      want = statusContent.includes('want="1"');
      wanttoplay = statusContent.includes('wanttoplay="1"');
      wanttobuy = statusContent.includes('wanttobuy="1"');
      wishlist = statusContent.includes('wishlist="1"');
      
      // Extract wishlistpriority value
      const priorityMatch = statusContent.match(/wishlistpriority="(\d+)"/);
      if (priorityMatch) {
        wishlistpriority = parseInt(priorityMatch[1]);
      }
    }
    
    const ratingMatch = content.match(/<rating[^>]*value="([^"]+)"/);
    const rating = ratingMatch ? parseFloat(ratingMatch[1]) : null;
    
    // Extract wishlist comment if available
    const wishlistCommentMatch = content.match(/<wishlistcomment>([^<]+)<\/wishlistcomment>/);
    const wishlistcomment = wishlistCommentMatch ? wishlistCommentMatch[1].trim() : null;
    
    // Store wishlist priority as number (1-5)
    // 1 = Must have, 2 = Love to have, 3 = Like to have, 4 = Thinking about it, 5 = Don't buy this
    const wishlistPriority = wishlistpriority || null;
    
    // Determine wishlist status (legacy field, but we'll use priority instead)
    let wishlistStatus = 'none';
    if (wanttobuy) wishlistStatus = 'wanttobuy';
    else if (wanttoplay) wishlistStatus = 'wanttoplay';
    else if (want) wishlistStatus = 'want';
    else if (wishlist) wishlistStatus = 'wishlist';
    
    items.push({
      id,
      name,
      yearpublished,
      image,
      thumbnail,
      minplayers,
      maxplayers,
      minplaytime,
      maxplaytime,
      playingtime,
      minage,
      average,
      averageweight,
      own,
      prevowned,
      want,
      wanttoplay,
      wanttobuy,
      wishlist,
      wishlistpriority,
      wishlistPriority,
      wishlistStatus,
      wishlistcomment,
      rating,
    });
  }
  
  return items;
}

function fetchBGGWishlist(username, authToken) {
  return new Promise((resolve, reject) => {
    // Use XML API 2 - exact URL format as specified
    const url = `https://boardgamegeek.com/xmlapi2/collection?username=${encodeURIComponent(username)}&wishlist=1`;
    
    console.log(`📡 Haetaan toivelistaa BGG:stä käyttäjältä: ${username}`);
    if (authToken) {
      console.log(`🔑 Käytetään autorisointitokenia`);
    }
    console.log(`🔗 URL: ${url}`);
    
    const options = {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Accept': 'application/xml, text/xml, */*',
        'Accept-Language': 'en-US,en;q=0.9',
        'Accept-Encoding': 'identity',
        'Connection': 'keep-alive',
        'Referer': 'https://boardgamegeek.com/',
        ...(authToken && { 'Authorization': `Bearer ${authToken}` }), // Add auth token if provided
      }
    };
    
    let pollCount = 0;
    const maxPolls = 30; // Maximum number of polling attempts (30 * 3s = 90s max wait)
    
    const makeRequest = (urlToTry) => {
      https.get(urlToTry, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          console.log(`📡 API vastaus: ${res.statusCode}`);
          
          // BGG API returns 202 when request is queued, 200 when ready
          if (res.statusCode === 202) {
            pollCount++;
            if (pollCount > maxPolls) {
              reject(new Error('BGG API pyyntö kesti liian kauan. Yritä myöhemmin uudelleen.'));
              return;
            }
            console.log(`⏳ Pyyntö jonossa (${pollCount}/${maxPolls}), odotetaan 3 sekuntia...`);
            setTimeout(() => {
              makeRequest(urlToTry);
            }, 3000);
            return;
          }
          
          // Handle 401/403 errors (private collection)
          if (res.statusCode === 401 || res.statusCode === 403) {
            console.error(`\n❌ ${res.statusCode} Unauthorized/Forbidden`);
            console.error(`\n💡 Tämä tarkoittaa että:`);
            console.error(`   1. BGG-kokoelma on todennäköisesti YKSITYINEN`);
            console.error(`   2. API ei voi lukea yksityisiä kokoelmia\n`);
            console.error(`✅ RATKAISU:`);
            console.error(`   1. Mene BGG:hen: https://boardgamegeek.com/account/edit`);
            console.error(`   2. Valitse "Privacy" välilehti`);
            console.error(`   3. Etsi "Collection Privacy" asetus`);
            console.error(`   4. Vaihda se "Public" (Julkinen)`);
            console.error(`   5. Tallenna muutokset`);
            console.error(`   6. Yritä skriptiä uudelleen\n`);
            console.error(`📝 Tarkista myös että käyttäjänimi "${username}" on oikein\n`);
            if (data.length > 0) {
              console.error(`📄 API-vastaus: ${data.substring(0, 200)}\n`);
            }
            reject(new Error(`${res.statusCode} - kokoelma on yksityinen. Aseta kokoelma julkiseksi BGG:n asetuksissa.`));
            return;
          } else {
            console.error(`❌ Odottamaton statuskoodi: ${res.statusCode}`);
            if (data.length > 0) {
              console.error(`📄 Vastaus: ${data.substring(0, 500)}`);
            }
            reject(new Error(`API palautti statuskoodin ${res.statusCode}`));
            return;
          }
          
          // Process data when status is 200
          if (res.statusCode === 200) {
            console.log(`📦 Vastauksen koko: ${data.length} merkkiä`);
            
            // Check for API errors in response
            if (data.includes('<error')) {
              const errorMatch = data.match(/<error[^>]*message="([^"]+)"/);
              const errorMsg = errorMatch ? errorMatch[1] : 'Tuntematon virhe';
              console.error(`❌ BGG API virhe: ${errorMsg}`);
              if (data.length > 0) {
                console.error(`📄 Vastaus (ensimmäinen 500 merkkiä): ${data.substring(0, 500)}`);
              }
              reject(new Error(`BGG API virhe: ${errorMsg}`));
              return;
            }
            
            // Check if response is empty or has no items
            if (!data.includes('<item')) {
              if (data.length > 0) {
                console.log(`⚠️  Vastaus ei sisällä <item> elementtejä`);
                console.log(`📄 Vastaus (ensimmäinen 1000 merkkiä): ${data.substring(0, 1000)}`);
              } else {
                console.log(`⚠️  Vastaus on tyhjä`);
              }
              resolve([]);
              return;
            }
            
            try {
              const allItems = parseXML(data);
              // Filter to only wishlist items (where wishlist="1" or wishlistpriority is set)
              const wishlistItems = allItems.filter(item => {
                return item.wishlist || item.wishlistpriority !== null;
              });
              
              console.log(`✅ Parsittu ${allItems.length} peliä kokoelmasta, ${wishlistItems.length} toivelistalla`);
              resolve(wishlistItems);
            } catch (error) {
              console.error(`❌ XML-parsinta virhe:`, error.message);
              if (data.length > 0) {
                console.error(`📄 Vastaus (ensimmäinen 1000 merkkiä): ${data.substring(0, 1000)}`);
              }
              reject(error);
            }
          } else {
            // Unexpected status code (should have been handled above)
            console.error(`❌ Odottamaton statuskoodi: ${res.statusCode}`);
            if (data.length > 0) {
              console.error(`📄 Vastaus: ${data.substring(0, 500)}`);
            }
            reject(new Error(`API palautti statuskoodin ${res.statusCode}`));
          }
        });
      }).on('error', (error) => {
        console.error(`❌ Verkkovirhe:`, error.message);
        reject(error);
      });
    };
    
    makeRequest(url);
  });
}

function gameToSlug(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
}

function generateWishlistMarkdown(game) {
  const slug = gameToSlug(game.name);
  
  // Use detailed stats if available, otherwise fall back to defaults
  const complexity = game.averageweight || 0;
  
  // Calculate playtime range
  let playTimeMin = game.minplaytime || game.playingtime || 30;
  let playTimeMax = game.maxplaytime || game.playingtime || playTimeMin;
  if (playTimeMin === playTimeMax) {
    playTimeMax = playTimeMin; // Keep as single value if same
  }
  
  // Calculate player count range
  const playerCountMin = game.minplayers || 1;
  const playerCountMax = game.maxplayers || game.minplayers || 4;
  
  const playerCount = [playerCountMin, playerCountMax];
  const playTime = [playTimeMin, playTimeMax];
  
  // Determine if it's a two-player game
  const isTwoPlayer = playerCountMin === 2 && playerCountMax === 2;
  const recommendedForTwoPlayers = isTwoPlayer;
  // Use BGG recommended player count if available, otherwise infer
  const recommendedPlayerCount = game.recommendedPlayerCount || (isTwoPlayer ? [2, 2] : null);
  
  // Determine if it's a party game or good with 5+
  const partyGame = playerCountMax && playerCountMax >= 5;
  const goodWithFivePlus = playerCountMax && playerCountMax >= 5;
  
  // Generate tags - use BGG tags if available, otherwise infer from game characteristics
  let tags = [];
  if (game.bggTags && game.bggTags.length > 0) {
    // Use BGG categories and mechanics as tags
    tags = game.bggTags;
  } else {
    // Fallback to inferred tags
    if (isTwoPlayer) {
      tags.push('Two Player');
    }
    if (partyGame) {
      tags.push('Party Game');
    }
    if (tags.length === 0) {
      tags.push('Board Game');
    }
  }

  // Build BGG link using objectid from XML
  const bggLink = `https://boardgamegeek.com/boardgame/${game.id}/${slug}`;
  
  // Generate Finnish description (one sentence) - like newwishlistgame command
  let description = '';
  if (game.wishlistcomment) {
    // Use wishlist comment if available
    description = game.wishlistcomment.replace(/'/g, "''");
  } else {
    // Generate description based on game characteristics
    const playerText = isTwoPlayer ? 'kaksinpeli' : `${playerCountMin}-${playerCountMax} pelaajalle`;
    const timeText = playTimeMin === playTimeMax ? `${playTimeMin} minuuttia` : `${playTimeMin}-${playTimeMax} minuuttia`;
    const mainTag = tags.length > 0 && tags[0] !== 'Board Game' ? tags[0] : 'lautapeli';
    const typeText = mainTag.toLowerCase();
    description = `${typeText.charAt(0).toUpperCase() + typeText.slice(1)}, ${playerText}, peliaika ${timeText}.`;
  }

  // Generate Finnish overview paragraph - like newwishlistgame command
  function generateFinnishOverview(game) {
    const playerText = isTwoPlayer 
      ? 'kaksinpeli' 
      : playerCountMin === playerCountMax 
        ? `${playerCountMin} pelaajalle` 
        : `${playerCountMin}-${playerCountMax} pelaajalle`;
    
    const timeText = playTimeMin === playTimeMax 
      ? `${playTimeMin} minuuttia` 
      : `${playTimeMin}-${playTimeMax} minuuttia`;
    
    const complexityText = complexity > 0 
      ? `Monimutkaisuus ${complexity.toFixed(1)}/5.0. ` 
      : '';
    
    // Get main category/mechanic for description
    const mainTag = tags.length > 0 && tags[0] !== 'Board Game' ? tags[0] : null;
    const typeText = mainTag ? mainTag.toLowerCase() : 'lautapeli';
    
    let overview = `*${game.name}* on ${typeText} ${playerText}. `;
    
    if (game.bggDescription) {
      // Use BGG description (cleaned and shortened)
      const bggDesc = game.bggDescription
        .replace(/<[^>]+>/g, '')
        .replace(/&nbsp;/g, ' ')
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .substring(0, 300)
        .trim();
      overview += bggDesc + ' ';
    } else {
      // Generate basic description
      overview += `Peli kestää ${timeText}. `;
      if (complexityText) {
        overview += complexityText;
      }
    }
    
    // Add why it's on wishlist (if wishlist comment exists)
    if (game.wishlistcomment) {
      overview += game.wishlistcomment + ' ';
    } else {
      // Generic appeal text based on game type
      if (isTwoPlayer) {
        overview += 'Erinomainen valinta kaksinpelaamiseen. ';
      } else if (partyGame) {
        overview += 'Sopii hyvin isommille porukoille. ';
      }
      overview += 'Peli on toivelistalla, koska se vaikuttaa mielenkiintoiselta ja sopivalta pelikokemukselta.';
    }
    
    return overview.trim();
  }

  const overview = generateFinnishOverview(game);

  // Build optional fields
  const optionalFields = [];
  
  if (recommendedPlayerCount) {
    optionalFields.push(`recommendedPlayerCount: [${recommendedPlayerCount[0]}, ${recommendedPlayerCount[1]}]`);
  }
  
  if (recommendedForTwoPlayers) {
    optionalFields.push(`recommendedForTwoPlayers: true`);
  }
  
  if (partyGame) {
    optionalFields.push(`partyGame: true`);
  }
  
  if (goodWithFivePlus) {
    optionalFields.push(`goodWithFivePlus: true`);
  }

  // Add wishlist priority to frontmatter (as number)
  if (game.wishlistPriority) {
    optionalFields.push(`wishlistPriority: ${game.wishlistPriority}`);
  }

  const optionalFieldsStr = optionalFields.length > 0 ? '\n' + optionalFields.join('\n') : '';

  const frontmatter = `---
title: '${game.name.replace(/'/g, "''")}'
coverImage: '/images/covers/${slug}_cover.jpg'
playerCount: [${playerCount[0]}, ${playerCount[1]}]
playTime: [${playTime[0]}, ${playTime[1]}]
complexity: ${complexity.toFixed(2)}
bggLink: '${bggLink}'
tags: [${tags.map(t => `'${t}'`).join(', ')}]
description: '${description}'${optionalFieldsStr}
---

${overview}

`;

  return frontmatter;
}

async function fetchGameDetails(gameIds) {
  return new Promise((resolve, reject) => {
    if (gameIds.length === 0) {
      resolve({});
      return;
    }
    
    // BGG API allows up to 100 IDs per request
    const chunks = [];
    for (let i = 0; i < gameIds.length; i += 100) {
      chunks.push(gameIds.slice(i, i + 100));
    }
    
    const allDetails = {};
    let completed = 0;
    
    chunks.forEach((chunk, chunkIndex) => {
      const ids = chunk.join(',');
      const url = `https://boardgamegeek.com/xmlapi2/thing?id=${ids}&stats=1`;
      
      console.log(`📡 Haetaan pelin tietoja (${chunkIndex + 1}/${chunks.length}): ${chunk.length} peliä...`);
      
      const options = {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        },
      };
      
      https.get(url, options, (res) => {
        let data = '';
        
        res.on('data', (chunk) => {
          data += chunk;
        });
        
        res.on('end', () => {
          if (res.statusCode !== 200) {
            console.warn(`⚠️  Varoitus: Pelin tietojen haku epäonnistui (status: ${res.statusCode})`);
            completed++;
            if (completed === chunks.length) {
              resolve(allDetails);
            }
            return;
          }
          
          // Parse game details from XML
          const itemMatches = data.matchAll(/<item[^>]*id="(\d+)"[^>]*>([\s\S]*?)<\/item>/g);
          
          for (const match of itemMatches) {
            const id = match[1];
            const content = match[2];
            
            const gameDetails = {};
            
            // Parse stats
            const statsMatch = content.match(/<statistics[^>]*>([\s\S]*?)<\/statistics>/);
            if (statsMatch) {
              const statsContent = statsMatch[1];
              
              const minplayersMatch = statsContent.match(/<minplayers[^>]*value="(\d+)"/);
              const maxplayersMatch = statsContent.match(/<maxplayers[^>]*value="(\d+)"/);
              const minplaytimeMatch = statsContent.match(/<minplaytime[^>]*value="(\d+)"/);
              const maxplaytimeMatch = statsContent.match(/<maxplaytime[^>]*value="(\d+)"/);
              const playingtimeMatch = statsContent.match(/<playingtime[^>]*value="(\d+)"/);
              const weightMatch = statsContent.match(/<averageweight[^>]*value="([^"]+)"/);
              
              gameDetails.minplayers = minplayersMatch ? parseInt(minplayersMatch[1]) : null;
              gameDetails.maxplayers = maxplayersMatch ? parseInt(maxplayersMatch[1]) : null;
              gameDetails.minplaytime = minplaytimeMatch ? parseInt(minplaytimeMatch[1]) : null;
              gameDetails.maxplaytime = maxplaytimeMatch ? parseInt(maxplaytimeMatch[1]) : null;
              gameDetails.playingtime = playingtimeMatch ? parseInt(playingtimeMatch[1]) : null;
              gameDetails.averageweight = weightMatch ? parseFloat(weightMatch[1]) : null;
            }
            
            // Parse description
            const descriptionMatch = content.match(/<description[^>]*>([\s\S]*?)<\/description>/);
            if (descriptionMatch) {
              // Clean HTML tags and decode entities
              let description = descriptionMatch[1]
                .replace(/<[^>]+>/g, '') // Remove HTML tags
                .replace(/&nbsp;/g, ' ')
                .replace(/&amp;/g, '&')
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>')
                .replace(/&quot;/g, '"')
                .replace(/&#10;/g, '\n')
                .trim();
              
              // Take first paragraph or first 500 characters
              const firstParagraph = description.split('\n\n')[0] || description;
              gameDetails.description = firstParagraph.substring(0, 500).trim();
            }
            
            // Parse categories and mechanics for tags
            const categories = [];
            const categoryMatches = content.matchAll(/<link[^>]*type="boardgamecategory"[^>]*value="([^"]+)"/g);
            for (const catMatch of categoryMatches) {
              categories.push(catMatch[1]);
            }
            
            const mechanics = [];
            const mechanicMatches = content.matchAll(/<link[^>]*type="boardgamemechanic"[^>]*value="([^"]+)"/g);
            for (const mechMatch of mechanicMatches) {
              mechanics.push(mechMatch[1]);
            }
            
            // Combine categories and mechanics for tags
            gameDetails.tags = [...categories, ...mechanics].slice(0, 10); // Limit to 10 tags
            
            // Parse recommended player count from polls
            const pollsMatch = content.match(/<poll[^>]*name="suggested_numplayers"[^>]*>([\s\S]*?)<\/poll>/);
            if (pollsMatch) {
              const pollContent = pollsMatch[1];
              // Find the player count with highest "Best" votes
              const resultMatches = pollContent.matchAll(/<result[^>]*numplayers="(\d+)"[^>]*>([\s\S]*?)<\/result>/g);
              let bestPlayerCount = null;
              let maxBestVotes = 0;
              
              for (const resultMatch of resultMatches) {
                const numPlayers = parseInt(resultMatch[1]);
                const resultContent = resultMatch[2];
                const bestMatch = resultContent.match(/<result[^>]*value="Best"[^>]*numvotes="(\d+)"/);
                if (bestMatch) {
                  const bestVotes = parseInt(bestMatch[1]);
                  if (bestVotes > maxBestVotes) {
                    maxBestVotes = bestVotes;
                    bestPlayerCount = numPlayers;
                  }
                }
              }
              
              if (bestPlayerCount) {
                gameDetails.recommendedPlayerCount = [bestPlayerCount, bestPlayerCount];
              }
            }
            
            allDetails[id] = gameDetails;
          }
          
          completed++;
          if (completed === chunks.length) {
            resolve(allDetails);
          }
        });
      }).on('error', (err) => {
        console.warn(`⚠️  Varoitus: Pelin tietojen haku epäonnistui: ${err.message}`);
        completed++;
        if (completed === chunks.length) {
          resolve(allDetails);
        }
      });
    });
  });
}

async function processGames(games) {
  // Fetch detailed game stats from BGG API
  const gameIds = games.map(g => g.id).filter(Boolean);
  console.log(`\n📡 Haetaan yksityiskohtaisia tietoja ${gameIds.length} pelistä BGG:stä...`);
  const gameDetails = await fetchGameDetails(gameIds);
  console.log(`✅ Haettu tietoja ${Object.keys(gameDetails).length} pelistä\n`);
  
  // Merge game details with collection data
  const enrichedGames = games.map(game => {
    const details = gameDetails[game.id] || {};
    return {
      ...game,
      minplayers: game.minplayers || details.minplayers,
      maxplayers: game.maxplayers || details.maxplayers,
      minplaytime: game.minplaytime || details.minplaytime,
      maxplaytime: game.maxplaytime || details.maxplaytime,
      playingtime: game.playingtime || details.playingtime,
      averageweight: game.averageweight || details.averageweight,
      bggDescription: details.description || null,
      bggTags: details.tags || [],
      recommendedPlayerCount: details.recommendedPlayerCount || null,
    };
  });
  
  // Group games by wishlist priority
  const grouped = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
  };
  
  enrichedGames.forEach(game => {
    const priority = game.wishlistPriority;
    if (priority && grouped[priority]) {
      grouped[priority].push(game);
    }
  });
  
  // Print grouping summary
  console.log('📊 Ryhmittely wishlist-prioriteetin mukaan:');
  const priorityLabels = {
    1: 'Pakko saada',
    2: 'Rakastaisin saada',
    3: 'Haluaisin saada',
    4: 'Mietin vielä',
    5: 'Älä osta tätä',
  };
  Object.entries(grouped).forEach(([priority, items]) => {
    if (items.length > 0) {
      const priorityLabel = priorityLabels[Number(priority)] || `Priority ${priority}`;
      console.log(`   ${priorityLabel}: ${items.length} peliä`);
    }
  });
  console.log('');
  
  // Ensure directory exists
  if (!fs.existsSync(wishlistDirectory)) {
    fs.mkdirSync(wishlistDirectory, { recursive: true });
  }
  
  let imported = 0;
  let skipped = 0;
  let updated = 0;
  
  for (const game of enrichedGames) {
    const slug = gameToSlug(game.name);
    const filePath = path.join(wishlistDirectory, `${slug}.md`);
    
    const markdown = generateWishlistMarkdown(game);
    
    if (fs.existsSync(filePath)) {
      // Check if file needs updating
      const existingContent = fs.readFileSync(filePath, 'utf8');
      
      // Check if file has valid complexity (not 0.00) and proper playTime
      const complexityMatch = existingContent.match(/complexity:\s*([\d.]+)/);
      const existingComplexity = complexityMatch ? parseFloat(complexityMatch[1]) : 0;
      
      const playTimeMatch = existingContent.match(/playTime:\s*\[(\d+),\s*(\d+)\]/);
      const existingPlayTime = playTimeMatch ? [parseInt(playTimeMatch[1]), parseInt(playTimeMatch[2])] : null;
      
      // Check if playTime is just default [30, 30]
      const hasDefaultPlayTime = existingPlayTime && existingPlayTime[0] === 30 && existingPlayTime[1] === 30;
      
      // Check priority
      const existingPriorityMatch = existingContent.match(/wishlistPriority:\s*(?:'([^']+)'|(\d+))/);
      const existingPriority = existingPriorityMatch 
        ? (existingPriorityMatch[2] ? Number(existingPriorityMatch[2]) : existingPriorityMatch[1])
        : null;
      
      // Convert old string format to number for comparison
      let existingPriorityNum = null;
      if (typeof existingPriority === 'number') {
        existingPriorityNum = existingPriority;
      } else if (typeof existingPriority === 'string') {
        const priorityMap = {
          'Must have': 1,
          'Love to have': 2,
          'Like to have': 3,
          'Thinking about it': 4,
          "Don't buy this": 5,
        };
        existingPriorityNum = priorityMap[existingPriority] || null;
      }
      
      // Update if priority changed, complexity is 0, or playTime is default
      const needsUpdate = existingPriorityNum !== game.wishlistPriority || 
                         existingComplexity === 0 || 
                         hasDefaultPlayTime ||
                         !playTimeMatch;
      
      if (needsUpdate) {
        fs.writeFileSync(filePath, markdown, 'utf8');
        const reasons = [];
        if (existingPriorityNum !== game.wishlistPriority) reasons.push('priority');
        if (existingComplexity === 0) reasons.push('complexity');
        if (hasDefaultPlayTime || !playTimeMatch) reasons.push('playTime');
        console.log(`🔄 Päivitetty: ${game.name} (${reasons.join(', ')})`);
        updated++;
      } else {
        console.log(`⏭️  Ohitettu (on jo olemassa): ${game.name}`);
        skipped++;
      }
    } else {
      fs.writeFileSync(filePath, markdown, 'utf8');
      console.log(`✅ Tuotu: ${game.name} (priority: ${game.wishlistPriority || 'none'}) -> ${slug}.md`);
      imported++;
    }
  }
  
  console.log(`\n✨ Valmis!`);
  console.log(`   Tuotu: ${imported} peliä`);
  console.log(`   Päivitetty: ${updated} peliä`);
  console.log(`   Ohitettu: ${skipped} peliä`);
}

async function importWishlist() {
  const localXmlPath = path.join(process.cwd(), 'content/wishlist.xml');
  
  // Check if local XML file exists
  if (fs.existsSync(localXmlPath)) {
    console.log('📄 Löytyi paikallinen XML-tiedosto, käytetään sitä...');
    console.log(`📂 Tiedosto: ${localXmlPath}`);
    
    try {
      const xmlContent = fs.readFileSync(localXmlPath, 'utf8');
      const games = parseXML(xmlContent);
      
      if (games.length === 0) {
        console.log('❌ Ei löytynyt pelejä XML-tiedostosta');
        return;
      }
      
      console.log(`✅ Luettu ${games.length} peliä XML-tiedostosta\n`);
      
      // Continue with processing...
      await processGames(games);
      return;
    } catch (error) {
      console.error('❌ Virhe luettaessa XML-tiedostoa:', error.message);
      console.log('Yritetään hakea BGG:stä sen sijaan...\n');
    }
  }
  
  // Fall back to API if no local file
  const username = process.env.BGG_USERNAME;
  const authToken = process.env.BGG_AUTH_TOKEN; // Optional authorization token
  
  if (!username) {
    console.error('❌ Virhe: BGG_USERNAME puuttuu .env-tiedostosta');
    console.log('Lisää .env-tiedostoon: BGG_USERNAME=yourusername');
    console.log('Vaihtoehtoisesti lisää BGG_AUTH_TOKEN jos BGG vaatii autorisointia');
    console.log('\n💡 Vinkki: Voit myös ladata XML-tiedoston content/wishlist.xml ja skripti käyttää sitä automaattisesti!');
    process.exit(1);
  }
  
  if (authToken) {
    console.log('🔑 Käytetään autorisointitokenia');
  }

  try {
    const games = await fetchBGGWishlist(username, authToken);
    
    if (games.length === 0) {
      console.log('❌ Ei löytynyt pelejä toivelistalta');
      return;
    }
    
    console.log(`✅ Löydettiin ${games.length} peliä toivelistalta\n`);
    
    await processGames(games);
  } catch (error) {
    console.error('❌ Virhe:', error.message);
    process.exit(1);
  }
}

importWishlist();
