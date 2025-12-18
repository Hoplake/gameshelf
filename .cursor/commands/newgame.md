# Add New Game Command

This command helps you add a new board game to the collection. It will create a properly formatted game file with all required metadata and structure.

## Usage

When you want to add a new game, provide the following information:

1. **Game Title** (in Finnish or English)
2. **Basic Game Information** (player count, playtime, complexity, BGG link)
3. **Game Description** (brief summary)
4. **Game Rules** (condensed Finnish rules)

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
- `favorite`: Optional boolean (true if it's one of your favorite games)
- `played`: Boolean (true if already played, false if unplayed)
- `description`: Brief description in Finnish (one sentence)
- `bggValue`: Optional number (estimated value in EUR based on BGG market prices)

### Content Structure:
1. **Description Paragraph**: Longer description paragraph (italic format) explaining the game
2. **Setup Section**: Step-by-step setup instructions
3. **Gameplay Section**: How to play the game
4. **End Game Section**: How the game ends and who wins
5. **Strategy Section**: Tips and strategies
6. **Comparison**: A metaphor/comparison at the end

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
favorite: true/false
played: false
bggValue: 25
description: 'Brief description in Finnish.'
---

*Game Name* on [game type] [player count] pelaajalle. [Longer description paragraph explaining the game, its theme, and main mechanics].

***

### Valmistelut (Setup)

1. **Step 1:** Description
2. **Step 2:** Description
...

***

### Pelin Pelaaminen

[Detailed gameplay instructions]

***

### Pelin Loppuminen

[End game conditions and victory conditions]

***

### Strategia ja Vinkit

- **Tip 1:** Description
- **Tip 2:** Description
...

***

**Vertauskuva:** *Game Name* on kuin [metaphor/comparison that helps understand the game]!
```

## Instructions

1. **Create the file**: Create a new file in `content/games/` directory with the filename format: `game_name.md` (lowercase, underscores for spaces)

2. **Fill in metadata**: Use the template above and fill in all required fields

3. **Write description**: Start with an italic description paragraph that gives an overview of the game

4. **Add rules**: Write condensed Finnish rules following the structure:
   - Setup (Valmistelut)
   - Gameplay (Pelin Pelaaminen)
   - End Game (Pelin Loppuminen)
   - Strategy Tips (Strategia ja Vinkit)
   - Comparison (Vertauskuva)

5. **Formatting guidelines**:
   - Use `***` to separate major sections
   - Use `###` for section headers
   - Use `####` for subsections
   - Use bullet points (`*`) for lists
   - Use bold (`**text**`) for emphasis
   - Use italic (`*text*`) for game name in description

6. **Cover image**: Make sure the cover image path matches the actual file location. Use `.jpg` or `.png` extension as appropriate.

## Example

When adding a new game, you can say:

"Add a new game: [Game Name]. It's a [game type] for [X-Y] players, takes [X-Y] minutes, complexity [X.X]. [Brief description]. Here are the rules: [rules]"

The command will generate the properly formatted file with all sections filled in.

## Notes

- All content should be in Finnish
- Keep rules condensed but comprehensive
- Use consistent formatting across all games
- Make sure the `played` field is set correctly (false for new games)
- Check that the BGG link is correct
- Verify complexity rating matches BGG rating
- Use `partyGame: true` for games that work well with larger groups (typically 5+ players, light rules, social interaction)
- Use `goodWithFivePlus: true` for games that support and work well with 5+ players
- Use `favorite: true` to mark your favorite games
- Add `bggValue` (in EUR) based on BGG market prices for collection value tracking

