# SEO Implementation Quick Reference

## ✅ What's Been Implemented

### 1. **SEO Composables** (Auto-imported via Nuxt)

- `useSeo()` - Set meta tags for any page
- `useStructuredData()` - Add JSON-LD schema
- `createProductSchema()` - Product structured data
- `createOrganizationSchema()` - Business info schema
- `createBreadcrumbSchema()` - Navigation breadcrumbs
- `SEO_CONFIG` - Central configuration file

### 2. **Pages Updated with SEO**

- ✅ Homepage `/` - Organization schema + meta tags
- ✅ Products `/products` - Category meta tags
- ✅ Product Details `/products/[slug]` - Product schema + breadcrumbs + dynamic meta
- ✅ About Page `/about` - Brand story meta tags
- ✅ Improved all image alt attributes

### 3. **Technical SEO**

- ✅ Updated `nuxt.config.ts` with head configuration
- ✅ Created `/sitemap.xml` - Dynamic sitemap (auto-updates)
- ✅ Enhanced `/robots.txt` - Proper crawl directives
- ✅ Language tags set to Norwegian
- ✅ Canonical URLs configured
- ✅ Open Graph tags for social sharing
- ✅ Twitter Card tags

### 4. **Files Created/Modified**

```
✨ NEW FILES:
  - composables/useSeo.ts
  - composables/useStructuredData.ts
  - server/routes/sitemap.xml.ts
  - config/seo.config.ts
  - docs/SEO_GUIDE.md (comprehensive guide)

📝 MODIFIED FILES:
  - nuxt.config.ts
  - public/robots.txt
  - pages/index.vue
  - pages/products/index.vue
  - pages/products/[slug].vue
  - pages/about/index.vue
```

## 🚀 Quick Usage Examples

### Add SEO to a New Page

```vue
<script setup lang="ts">
  useSeo({
    title: "Page Title",
    description: "Page description for search results",
    image: "/path/to/image.jpg",
    type: "website",
  });
</script>
```

### Add Product Schema

```vue
const product = ref({...}); watch(product, (newProduct) => { if (newProduct) {
useStructuredData( createProductSchema(newProduct, config.public.siteUrl) ); }
}, { immediate: true });
```

## 📋 Before Going Live Checklist

**Phase 1: This Week**

- [x] Create OG image (1200x630px) and save to `/public/og-image.png` (done)
- [ ] Update `SITE_URL` environment variable to your domain
- [ ] Verify all pages have proper meta descriptions (unique for every page)
- [ ] Test mobile responsiveness on actual device
- [ ] Run Lighthouse audit (target >90 score)
  - Use Chrome DevTools: `Lighthouse` tab → Analyze page
  - Address any issues in Performance, Accessibility, Best Practices, SEO
  - Focus on Core Web Vitals (LCP, FID, CLS)

**Phase 2: Deployment Week**

- [ ] Set up Google Search Console
- [ ] Set up Bing Webmaster Tools
- [ ] Submit sitemap to both tools
- [ ] Set up Google Analytics 4
  - Go to [Google Analytics](https://analytics.google.com)
  - Create property, get Measurement ID, and add to your app (see Nuxt docs or use a plugin)
- [ ] Set up Google Tag Manager
  - Go to [Google Tag Manager](https://tagmanager.google.com)
  - Create container, get GTM ID, and add to your app
- [ ] Verify HTTPS is configured
- [ ] Test sitemap.xml loads correctly
- [ ] Test robots.txt blocks unwanted areas

**Phase 3: Post-Launch**

- [ ] Monitor Google Search Console for errors
- [ ] Check Core Web Vitals
- [ ] Verify products are indexable
- [ ] Check click-through rates
- [ ] Set up alerts for ranking changes
- [ ] Review structured data for all products and organization (use [schema.org validator](https://validator.schema.org/))
- [ ] Review accessibility: alt text, headings, ARIA labels, keyboard navigation

## 🔍 Testing Your SEO

### Test Sitemap

```bash
# Visit in browser or curl
curl https://villheva.no/sitemap.xml
```

### Test Robots.txt

```bash
curl https://villheva.no/robots.txt
```

### Test Meta Tags (Chrome DevTools)

1. Open DevTools (F12)
2. Use the "Accessibility" panel to check alt text, headings, and ARIA labels
3. Test keyboard navigation (Tab, Shift+Tab, Enter, Space)
2. Go to Elements tab
3. Look in `<head>` section
4. Check for `<meta>` tags and `<title>`

### Test Structured Data

1. Go to [https://validator.schema.org/](https://validator.schema.org/)
2. Paste your page URL or HTML
3. Check for valid schema

### Test Social Sharing

- Twitter: [https://twitter.com/search?q=villheva.no](https://twitter.com)
- Facebook: [https://developers.facebook.com/tools/debug/](https://developers.facebook.com/tools/debug/)
- LinkedIn: [https://www.linkedin.com/feed/](https://www.linkedin.com)

## 📊 Key Metrics to Track

### In Google Search Console

- **Impressions** - How often your site appears in search results
- **Clicks** - How many people click your results
- **CTR** (Click-Through Rate) - Percentage of impressions that are clicked
- **Average Position** - Where you rank on average
- **Coverage** - Which pages are indexed

### In Google Analytics 4

- **Organic traffic** - Visitors from search engines
- **Bounce rate** - Percentage who leave without action
- **Average session duration** - How long people stay
- **Conversion rate** - Percentage completing your goals

## 🎯 Next Priority: Image Optimization

Once you've verified the basic SEO works:

```bash
npm install @nuxt/image
```

Then update `nuxt.config.ts`:

```typescript
export default defineNuxtConfig({
  modules: ["@nuxt/image"],
  image: {
    quality: 80,
    format: ["webp", "jpeg"],
  },
});
```

This will:

- Automatically optimize images
- Lazy load images
- Serve WebP format when supported
- Dramatically improve page speed

## 📞 SEO Support Resources

- [Nuxt Head Documentation](https://nuxt.com/docs/guide/features/head-management)
- [Schema.org Documentation](https://schema.org/)
- [Google Search Central](https://developers.google.com/search)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)

## 💡 Pro Tips

1. **Keywords**: Include your main keywords naturally in:
   - Page title
   - Meta description
   - First paragraph of content
   - Image alt text
   - Headings (H1, H2)

2. **Content**: Write for humans first, search engines second
   - Use clear, descriptive language
   - Organize with proper headings
   - Keep paragraphs short
   - Include relevant internal links

3. **Speed**: Page speed is a ranking factor
   - Test with [PageSpeed Insights](https://pagespeed.web.dev/)
   - Compress images
   - Minimize CSS/JavaScript
   - Enable caching

4. **Mobile**: Most searches are mobile
   - Ensure responsive design (you have this ✓)
   - Test on actual mobile devices
   - Check touch targets are adequate

---

**Status**: ✅ Implementation Complete
**Build**: Ready for production
**Next Steps**: Create OG image → Deploy → Monitor
