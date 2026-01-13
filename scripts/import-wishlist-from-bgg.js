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
    
    // Parse status with all wishlist fields - more flexible regex
    // Status can have attributes in any order
    const statusEl = content.match(/<status[^>]*>([\s\S]*?)<\/status>/);
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
  const complexity = game.averageweight || 0;
  const playTime = game.playingtime || game.maxplaytime || game.minplaytime || 30;
  const playerCount = [
    game.minplayers || 1,
    game.maxplayers || game.minplayers || 4,
  ];
  
  const tags = [];
  if (game.minplayers === 2 && game.maxplayers === 2) {
    tags.push('Two Player');
  }
  if (game.maxplayers && game.maxplayers >= 5) {
    tags.push('Party Game');
  }
  if (tags.length === 0) {
    tags.push('Board Game');
  }

  // Add wishlist priority to frontmatter (as number)
  const wishlistPriorityField = game.wishlistPriority 
    ? `wishlistPriority: ${game.wishlistPriority}\n` 
    : '';

  const frontmatter = `---
title: '${game.name.replace(/'/g, "''")}'
coverImage: '/images/covers/${slug}_cover.jpg'
playerCount: [${playerCount[0]}, ${playerCount[1]}]
playTime: [${playTime}, ${playTime}]
complexity: ${complexity.toFixed(2)}
bggLink: 'https://boardgamegeek.com/boardgame/${game.id}/${slug}'
tags: [${tags.map(t => `'${t}'`).join(', ')}]
description: '${game.name} - tuotu BGG:stä'
${wishlistPriorityField}---

*${game.name}* on lautapeli, joka on tuotu BoardGameGeekistä. Lisää pelin kuvaus tähän.

`;

  return frontmatter;
}

async function importWishlist() {
  const username = process.env.BGG_USERNAME;
  const authToken = process.env.BGG_AUTH_TOKEN; // Optional authorization token
  
  if (!username) {
    console.error('❌ Virhe: BGG_USERNAME puuttuu .env-tiedostosta');
    console.log('Lisää .env-tiedostoon: BGG_USERNAME=yourusername');
    console.log('Vaihtoehtoisesti lisää BGG_AUTH_TOKEN jos BGG vaatii autorisointia');
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
    
    // Group games by wishlist priority
    const grouped = {
      'Must have': [],
      'Love to have': [],
      'Like to have': [],
      'Thinking about it': [],
      'Other': [],
    };
    
    games.forEach(game => {
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
    
    for (const game of games) {
      const slug = gameToSlug(game.name);
      const filePath = path.join(wishlistDirectory, `${slug}.md`);
      
      const markdown = generateWishlistMarkdown(game);
      
      if (fs.existsSync(filePath)) {
        // Check if file needs updating (compare wishlist status)
        const existingContent = fs.readFileSync(filePath, 'utf8');
        const existingStatusMatch = existingContent.match(/wishlistStatus:\s*(\w+)/);
        const existingStatus = existingStatusMatch ? existingStatusMatch[1] : null;
        
        // Match both old string format and new number format
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
        
        if (existingPriorityNum !== game.wishlistPriority) {
          // Update file with new priority
          fs.writeFileSync(filePath, markdown, 'utf8');
          console.log(`🔄 Päivitetty: ${game.name} (priority: ${game.wishlistPriority || 'none'})`);
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
  } catch (error) {
    console.error('❌ Virhe:', error.message);
    process.exit(1);
  }
}

importWishlist();
