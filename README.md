# Game Shelf - Board Game Collection Website

A modern, fast, and mobile-first website for showcasing your personal board game collection with quick reference rules and homebrew variations.

## Features

- **Visual Gallery**: Browse your collection with beautiful box art displays
- **Advanced Filtering**: Filter by player count, complexity, play time, and tags
- **Smart Sorting**: Sort games by title, complexity, or play time
- **Quick Reference**: Each game has its own page with condensed rules, homebrew variations, and clarifications
- **Mobile-First Design**: Fully responsive and optimized for mobile devices
- **Dark Mode**: Toggle between light and dark themes
- **Fast Performance**: Built with Next.js for optimal speed and SEO
- **Easy Content Management**: Simply edit Markdown files to update game information

## Tech Stack

- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with shadcn/ui components
- **Content**: Markdown/MDX files with YAML frontmatter
- **Deployment**: Vercel (recommended)
- **Theme**: next-themes for dark mode support

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository:
```bash
git clone <your-repo-url>
cd gameshelf
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Content Management

### Adding a New Game

1. Create a new Markdown file in `content/games/` (e.g., `my-game.md` or `my-game.mdx`)
2. Add the required YAML frontmatter:

```yaml
---
title: 'Game Title'
coverImage: '/images/covers/game-title.jpg'
playerCount: [1, 4]
playTime: [30, 60]
complexity: 2.5
bggLink: 'https://boardgamegeek.com/boardgame/123456/game-title'
tags: ['Category 1', 'Category 2', 'Category 3']
---

## 🎲 Condensed Rules
Your game rules content here...

## 🏡 Homebrew Rules
Your custom rules here...

## 🤔 Rule Clarifications
Common questions and clarifications here...
```

3. Add the game's box art image to `public/images/covers/`
4. The game will automatically appear in your collection!

### File Structure

```
content/
└── games/
    ├── wingspan.mdx
    ├── terraforming-mars.md
    └── dune-imperium.md

public/
└── images/
    └── covers/
        ├── wingspan.jpg
        ├── terraforming-mars.jpg
        └── dune-imperium.jpg
```

### Frontmatter Fields

- `title`: The game's name
- `coverImage`: Path to the box art image (relative to `/public`)
- `playerCount`: Array with min and max player count `[min, max]`
- `playTime`: Array with min and max play time in minutes `[min, max]`
- `complexity`: BGG complexity rating (1-5)
- `bggLink`: Link to the game's BoardGameGeek page
- `tags`: Array of category tags for filtering

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub/GitLab
2. Connect your repository to Vercel
3. Deploy automatically on every push to main

### Other Platforms

The site can be deployed to any platform that supports Next.js static export:

```bash
npm run build
npm run export
```

## Customization

### Styling

The site uses Tailwind CSS with custom CSS variables. You can customize colors and themes by editing `src/app/globals.css`.

### Components

All UI components are built with shadcn/ui and can be customized in the `src/components/ui/` directory.

### Content Styling

Game content uses custom prose styles defined in `globals.css`. You can modify these to change how your Markdown content appears.

## Development

### Project Structure

```
src/
├── app/                 # Next.js app directory
│   ├── games/[slug]/   # Dynamic game pages
│   ├── globals.css     # Global styles
│   ├── layout.tsx      # Root layout
│   └── page.tsx        # Home page
├── components/         # React components
│   ├── ui/            # shadcn/ui components
│   ├── GameCard.tsx   # Game card component
│   ├── GameFilters.tsx # Filtering component
│   ├── ThemeProvider.tsx # Theme context
│   └── ThemeToggle.tsx # Dark mode toggle
├── lib/               # Utility functions
│   └── games.ts       # Game data processing
└── types/             # TypeScript types
    └── game.ts        # Game interface definitions
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- Styled with [Tailwind CSS](https://tailwindcss.com/)
- Components from [shadcn/ui](https://ui.shadcn.com/)
- Icons from [Lucide React](https://lucide.dev/)