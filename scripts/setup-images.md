# Image Setup Guide

## How to Add Your Game Cover Images

### 1. Image Requirements
- **Format**: JPG, JPEG, PNG, WebP, or SVG
- **Recommended Size**: 300x400 pixels (3:4 aspect ratio)
- **File Size**: Keep under 500KB for best performance
- **PNG Support**: Fully supported for cover images

### 2. File Naming Convention
Name your image files using the game's slug (filename without .md extension):
- `splendor.jpg` for Splendor
- `wingspan.jpg` for Wingspan
- `terraforming-mars.jpg` for Terraforming Mars
- `push.jpg` for Push

### 3. Where to Place Images
Put your image files in: `public/images/covers/`

### 4. Supported File Extensions
- `.jpg` or `.jpeg` - Best for photos
- `.png` - Best for images with transparency
- `.webp` - Best compression
- `.svg` - Vector graphics (requires special configuration)

### 5. Example File Structure
```
public/
└── images/
    └── covers/
        ├── splendor.jpg
        ├── wingspan.jpg
        ├── terraforming-mars.jpg
        ├── push.jpg
        └── your-new-game.jpg
```

### 6. Updating Game Files
In your game's markdown file, use:
```yaml
---
title: 'Your Game'
coverImage: '/images/covers/your-game.jpg'
# ... other fields
---
```

### 7. Image Optimization Tips
- Use tools like [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/) to compress images
- Consider using WebP format for better compression
- Next.js will automatically optimize images for different screen sizes

### 8. Testing
After adding images, restart the development server:
```bash
npm run dev
```

The images should appear in your game cards and individual game pages.
