# SEO & Environment Variables Guide

## Environment Variables Template

Create a `.env.local` file in the `frontend` directory with these variables:

```bash
# Site Configuration
NUXT_PUBLIC_SITE_URL=https://your-domain.com
NUXT_PUBLIC_SITE_NAME=Your Business Name

# Sanity CMS
SANITY_PROJECT_ID=your_project_id
SANITY_DATASET=production
SANITY_API_TOKEN=your_token_here

# Analytics (After setup)
NUXT_PUBLIC_GA_ID=G-XXXXXXXXXX  # Google Analytics 4 ID

# Email Configuration
NUXT_PUBLIC_CONTACT_EMAIL=contact@your-domain.com
```

## SEO Environment Variables Explained

### NUXT_PUBLIC_SITE_URL

- **Purpose**: Base URL for your website
- **Used for**: Sitemaps, canonical URLs, Open Graph tags
- **Example**: `https://your-domain.com`
- **Important**: No trailing slash, must include protocol

### NUXT_PUBLIC_SITE_NAME

- **Purpose**: Your business name
- **Used for**: Meta titles, structured data
- **Example**: `Your Business Name`

## Production vs Development

### Development (.env.local)

```bash
NUXT_PUBLIC_SITE_URL=http://localhost:3000
```

### Production (.env.production)

```bash
NUXT_PUBLIC_SITE_URL=https://your-domain.com
```

## Where These Variables Are Used

1. **Sitemaps**: Generated at `/sitemap.xml`
   - Uses `NUXT_PUBLIC_SITE_URL` to build absolute URLs for all pages

2. **Structured Data**: JSON-LD schemas
   - Uses `NUXT_PUBLIC_SITE_URL` for organization URL
   - Uses `NUXT_PUBLIC_SITE_NAME` for business name

3. **Meta Tags**: Dynamic page title and descriptions
   - Uses `NUXT_PUBLIC_SITE_NAME` for title fallback
   - Uses `NUXT_PUBLIC_SITE_URL` for canonical tags

4. **Open Graph**: Social media previews
   - Uses `NUXT_PUBLIC_SITE_URL` for og:url
   - Uses `NUXT_PUBLIC_SITE_NAME` for og:site_name

## Accessing Variables in Code

```typescript
// In any component or composable
const config = useRuntimeConfig();

// Public variables (accessible everywhere)
const siteUrl = config.public.siteUrl; // https://your-domain.com
const siteName = config.public.siteName; // Your Business Name

// Usage example
const canonicalUrl = `${config.public.siteUrl}/products/your-slug`;
```

## Required Before Launch

✅ **MUST HAVE**:

- `NUXT_PUBLIC_SITE_URL` - Set to production domain
- `SANITY_PROJECT_ID` - Your Sanity project ID
- `SANITY_DATASET` - Your Sanity dataset name

⚠️ **SHOULD HAVE**:

- `SANITY_API_TOKEN` - For API access (can be empty if read-only access)
- `NUXT_PUBLIC_CONTACT_EMAIL` - For contact forms

## Dynamic Sitemap Configuration

The sitemap automatically uses `NUXT_PUBLIC_SITE_URL` to build full URLs:

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://your-domain.com/</loc>
    <changefreq>weekly</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://your-domain.com/products/your-product</loc>
    <changefreq>monthly</changefreq>
    <priority>0.7</priority>
  </url>
  <!-- ... more pages ... -->
</urlset>
```

## Testing Environment Variables

### Verify they're loaded correctly:

1. **In Terminal**:

   ```bash
   echo $NUXT_PUBLIC_SITE_URL
   ```

2. **In App** (add temporarily to page):

   ```vue
   <script setup>
     const config = useRuntimeConfig();
     console.log("Site URL:", config.public.siteUrl);
     console.log("Site Name:", config.public.siteName);
   </script>
   ```

3. **In Build** (check console):
   - Should print with correct values

## Common Issues

### Issue: Sitemap shows localhost

**Solution**: Check `NUXT_PUBLIC_SITE_URL` is set to production domain

### Issue: SEO meta tags show wrong site name

**Solution**: Ensure `NUXT_PUBLIC_SITE_NAME` is set in env variables

### Issue: Canonical URLs are wrong

**Solution**: Verify `NUXT_PUBLIC_SITE_URL` has no trailing slash

### Issue: Social media previews show wrong image

**Solution**: Create `/public/og-image.png` (1200x630px)

## Security Notes

🔒 **SAFE** (These are Public):

- `NUXT_PUBLIC_SITE_URL`
- `NUXT_PUBLIC_SITE_NAME`
- These are exposed in client-side code

🔐 **SENSITIVE** (Never expose):

- `SANITY_API_TOKEN`
- Keep this server-side only
- Use `.server.ts` files to access it

## After Deployment

Once your site is live, verify environment variables are correctly set:

```bash
# SSH into your production server
ssh user@your-server.com

# Check env variables are loaded
env | grep NUXT_PUBLIC

# Should output:
# NUXT_PUBLIC_SITE_URL=https://your-domain.com
# NUXT_PUBLIC_SITE_NAME=Your Business Name
```

## Hosting Platform Specific Instructions

### Vercel

1. Go to Project Settings → Environment Variables
2. Add variables for Production, Preview, Development
3. Deploy will automatically use them

### Netlify

1. Go to Site Settings → Build & Deploy → Environment
2. Add variables
3. Deploy to apply changes

### Traditional VPS (AWS, DigitalOcean, etc.)

1. Create `.env.production` file on server
2. Source it before starting the app
3. Or export variables in systemd service file

---

**Last Updated**: March 8, 2026
