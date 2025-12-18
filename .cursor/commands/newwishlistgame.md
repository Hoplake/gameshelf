# Add New Wishlist Game Command

This command helps you add a new board game to your wishlist. Wishlist games have brief overviews instead of full rules, making them perfect for games you're interested in but haven't played yet.

## Usage

When you want to add a new wishlist game, provide the following information:

1. **Game Title** (in Finnish or English)
2. **Basic Game Information** (player count, playtime, complexity, BGG link)
3. **Brief Overview** (short description of why you want this game or what it's about)

## Required Information

### Metadata Fields:
- `title`: Game title (use single quotes, e.g., 'Game Name')
- `coverImage`: Path to cover image (e.g., '/images/covers/game_name_cover.jpg' or '.png')
- `playerCount`: Array with min and max players (e.g., [2, 4])
- `recommendedPlayerCount`: Optional array with recommended player count (e.g., [2, 3])
- `playTime`: Array with min and max playtime in minutes (e.g., [30, 45])
- `complexity`: Number from 1.0 to 5.0 (e.g., 2.4)
- `bggLink`: BoardGameGeek URL (e.g., 'https://boardgamegeek.com/boardgame/12345/game-name')
- `tags`: Array of tags (e.g., ['Cooperative', 'Hand Management', 'Dice Rolling'])
- `recommendedForTwoPlayers`: Optional boolean (true if recommended for two players)
- `partyGame`: Optional boolean (true if it's a party game, good for larger groups)
- `goodWithFivePlus`: Optional boolean (true if the game works well with 5+ players)
- `description`: Brief description in Finnish (one sentence)
- `bggValue`: Optional number (estimated value in EUR based on BGG market prices)

### Content Structure:
1. **Overview Paragraph**: Brief overview explaining why you want this game, what interests you about it, or what makes it appealing (instead of full rules)

## Template Structure

```markdown
---
title: 'Game Name'
coverImage: '/images/covers/game_name_cover.jpg'
playerCount: [min, max]
recommendedPlayerCount: [min, max]
playTime: [min, max]
complexity: X.X
bggLink: 'https://boardgamegeek.com/boardgame/XXXXX/game-name'
tags: ['Tag1', 'Tag2', 'Tag3']
recommendedForTwoPlayers: true/false
partyGame: true/false
goodWithFivePlus: true/false
description: 'Brief description in Finnish.'
bggValue: 25
---

*Game Name* on [game type] [player count] pelaajalle. [Brief overview explaining why you want this game, what interests you about it, or what makes it appealing. This is NOT full rules, just a brief overview of the game and why it's on your wishlist].
```

## Instructions

1. **Create the file**: Create a new file in `content/wishlist/` directory with the filename format: `game_name.md` (lowercase, underscores for spaces)

2. **Fill in metadata**: Use the template above and fill in all required fields

3. **Write overview**: Write a brief overview paragraph (italic format) that explains:
   - What the game is about
   - Why you want it
   - What interests you about it
   - What makes it appealing

4. **Cover image**: Make sure the cover image path matches the actual file location. Use `.jpg` or `.png` extension as appropriate.

## Example

When adding a new wishlist game, you can say:

"Add a new wishlist game: [Game Name]. It's a [game type] for [X-Y] players, takes [X-Y] minutes, complexity [X.X]. [Brief description]. I want it because [reason]."

The command will generate the properly formatted file with all sections filled in.

## Notes

- All content should be in Finnish
- Keep overview brief and focused on why you want the game
- Use consistent formatting across all wishlist games
- Check that the BGG link is correct
- Verify complexity rating matches BGG rating
- Wishlist games don't need full rules - just a brief overview
- Use `partyGame: true` for games that work well with larger groups (typically 5+ players, light rules, social interaction)
- Use `goodWithFivePlus: true` for games that support and work well with 5+ players
- Add `bggValue` (in EUR) based on BGG market prices for collection value tracking

