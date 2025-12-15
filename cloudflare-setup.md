# Cloudflare Pages Setup Guide

## Option 1: Static Export (Recommended for your use case)

Your Next.js app can be exported as a static site since it uses `generateStaticParams()`.

### Steps:

1. **Update `next.config.mjs`** to enable static export:

```javascript
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export', // Enable static export
  pageExtensions: ['js', 'jsx', 'md', 'mdx', 'ts', 'tsx'],
  images: {
    unoptimized: true, // Required for static export
  },
  // ... rest of your config
};

export default nextConfig;
```

2. **Update `package.json`** build script:

```json
{
  "scripts": {
    "build": "next build",
    "export": "next build"
  }
}
```

3. **Deploy to Cloudflare Pages:**
   - Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
   - Navigate to **Pages** → **Create a project**
   - Connect your Git repository (GitHub/GitLab/Bitbucket)
   - Build settings:
     - **Framework preset:** Next.js (Static HTML Export)
     - **Build command:** `npm run build`
     - **Build output directory:** `out`
     - **Root directory:** `/` (or leave empty)

## Option 2: Cloudflare Next.js Adapter (Full Next.js support)

If you want full Next.js features (including server components at runtime):

1. **Install Cloudflare adapter:**

```bash
npm install @cloudflare/next-on-pages
```

2. **Add build script to `package.json`:**

```json
{
  "scripts": {
    "build": "next build",
    "pages:build": "npx @cloudflare/next-on-pages"
  }
}
```

3. **Deploy to Cloudflare Pages:**
   - Framework preset: **Next.js**
   - Build command: `npm run pages:build`
   - Build output directory: `.vercel/output/static`

## Configuration Files Needed

### `wrangler.toml` (optional, for advanced config):

```toml
name = "gameshelf"
compatibility_date = "2024-01-01"

[env.production]
routes = [
  { pattern = "yourdomain.com", custom_domain = true }
]
```

## Notes:

- **Static Export (Option 1)** is simpler and works perfectly for your use case since all pages are statically generated
- **Cloudflare Adapter (Option 2)** gives you full Next.js features but is more complex
- Your `vercel.json` won't be used on Cloudflare, but you can create equivalent redirects/rules in Cloudflare Pages settings
- Images in `/public` will be served automatically
- All your game markdown files will be included in the build

## Free Tier Limits:

- ✅ Unlimited sites
- ✅ Unlimited requests
- ✅ 500 builds/month (plenty for personal projects)
- ✅ Global CDN included
- ✅ Custom domains
- ✅ Automatic SSL certificates

## Automatic Deployments from Git

Cloudflare Pages automatically deploys when you push to your repository!

### Setup Automatic Deployments:

1. **Connect Your Repository:**
   - In Cloudflare Pages dashboard, click **"Create a project"**
   - Choose **"Connect to Git"**
   - Select your Git provider (GitHub, GitLab, or Bitbucket)
   - Authorize Cloudflare to access your repositories
   - Select your `gameshelf` repository

2. **Configure Build Settings:**
   - **Production branch:** `main` or `master` (your main branch)
   - **Build command:** `npm run build`
   - **Build output directory:** `out` (for static export)
   - **Root directory:** `/` (leave empty if repo root)

3. **Automatic Deployments:**
   - ✅ **Every push to production branch** → Deploys to production
   - ✅ **Every push to other branches** → Creates preview deployment
   - ✅ **Pull requests** → Creates preview deployment automatically

### Branch-Specific Deployments:

You can configure different build settings per branch:

1. Go to **Pages** → Your project → **Settings** → **Builds & deployments**
2. Click **"Add build configuration"**
3. Set:
   - **Branch name:** `develop` (or any branch you want)
   - **Build command:** `npm run build`
   - **Output directory:** `out`

### Preview Deployments:

- **Pull Requests:** Automatically creates preview URLs
- **Other branches:** Creates preview deployments with unique URLs
- **Preview URLs:** Format: `https://<branch-name>.<project-name>.pages.dev`

### Deployment Settings:

In **Settings** → **Builds & deployments**, you can:
- Enable/disable automatic deployments
- Set which branches trigger production deployments
- Configure build environment variables
- Set build timeout (default: 20 minutes)

### Example Workflow:

```
main branch (push) → Production deployment → yourdomain.com
develop branch (push) → Preview deployment → develop.gameshelf.pages.dev
feature/new-game branch (PR) → Preview deployment → pr-123.gameshelf.pages.dev
```

## Migration from Vercel:

If you're currently on Vercel, the migration is straightforward:
1. Keep your code the same
2. Add `output: 'export'` to next.config.mjs
3. Deploy to Cloudflare Pages
4. Connect your Git repository for automatic deployments
5. Update your domain DNS if needed

**Note:** Cloudflare Pages works very similarly to Vercel for Git-based deployments!

