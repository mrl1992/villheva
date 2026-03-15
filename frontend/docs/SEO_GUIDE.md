# Villheva SEO Implementation Guide

## Overview

This document outlines all SEO improvements implemented in your Nuxt 3 application and recommendations for ongoing optimization.

## ✅ Implemented SEO Features

### 1. **global Meta Tags & Head Configuration**

- **File**: `nuxt.config.ts`
- **Features**:
  - Language tag set to Norwegian (`lang="no"`)
  - Viewport meta tag for responsive design
  - X-UA-Compatible for IE10+
  - Global canonical URL setup
  - Site URL and name in runtime config

### 2. **SEO Composables**

#### `useSeo.ts` - Dynamic Meta Tag Management

**Usage**: Apply page-specific meta tags to any page

```typescript
useSeo({
  title: "Page Title",
  description: "Page description for search engines",
  image: "og-image-url.jpg",
  type: "website" | "article" | "product",
});
```

**Automatically Handles**:

- Page `<title>` tag
- Meta description
- Open Graph tags (og:title, og:description, og:image, og:type, og:url)
- Twitter tags (twitter:title, twitter:description, twitter:image)
- Canonical URLs

#### `useStructuredData.ts` - JSON-LD Schema

**Usage**: Add structured data for search engine understanding

```typescript
// Product schema
useStructuredData(createProductSchema(product, siteUrl));

// Organization schema
useStructuredData(createOrganizationSchema(site, siteUrl));

// Breadcrumb navigation schema
useStructuredData(createBreadcrumbSchema(breadcrumbs, siteUrl));
```

### 3. **Page-Specific SEO**

#### Homepage (`pages/index.vue`)

✅ Organization structured data
✅ Compelling meta description
✅ Brand-focused title tag

#### Products Page (`pages/products/index.vue`)

✅ Category-specific meta tags
✅ Descriptive title and description
✅ Improved image alt attributes

#### Product Detail Page (`pages/products/[slug].vue`)

✅ Dynamic product meta tags
✅ Product structured data (JSON-LD)
✅ Breadcrumb schema
✅ Dynamic image alt attributes
✅ Price and availability data

#### About Page (`pages/about/index.vue`)

✅ Brand story meta tags
✅ Semantic HTML with proper alt text

### 4. **Sitemap**

- **Location**: Automatically generated at `/sitemap.xml`
- **Features**:
  - Includes all static pages
  - Lists all product pages dynamically
  - Proper change frequency
  - Priority hierarchy
  - Updates automatically when products change

### 5. **Robots.txt**

- **Location**: `/public/robots.txt`
- **Features**:
  - Allows all bots by default
  - Prevents crawling of admin and build folders
  - Links to sitemap
  - Specific rules for Googlebot and Bingbot

### 6. **Image Optimization**

✅ Descriptive alt attributes on all product images
✅ Alt text format: "Product Name - bakevare fra Villheva"
✅ Proper image loading placeholders

## 🚀 Recommended Next Steps

### High Priority (Implement ASAP)

1. **Open Graph Image**
   - Create a branded OG image (1200x630px)
   - Save as `/public/og-image.png`
   - Will be used for social media previews

   ```typescript
   // In nuxt.config.ts
   image: "https://villheva.no/og-image.png";
   ```

2. **Google Analytics 4 & Tag Manager**
   - Set up [Google Analytics 4](https://analytics.google.com) and [Google Tag Manager](https://tagmanager.google.com)
   - Add Measurement ID and GTM container to your Nuxt app (see Nuxt docs or use a plugin)
   - Verify data is being collected before launch

3. **Lighthouse Audit**
   - Use Chrome DevTools → Lighthouse tab to audit Performance, Accessibility, Best Practices, SEO
   - Address any issues, especially Core Web Vitals

4. **Structured Data & Accessibility Review**
   - Validate all structured data with [schema.org validator](https://validator.schema.org/)
   - Ensure all images have descriptive alt text
   - Check headings, ARIA labels, and keyboard navigation for accessibility

5. **Performance Optimization**
   - Install `@nuxt/image`: `npm install @nuxt/image`
   - Replace all `<img>` and `v-img` with `<NuxtImg>`
   - Automatically optimizes images and lazy loads

   ```typescript
   // nuxt.config.ts
   modules: ["@nuxt/image"];
   ```

6. **Domain Setup**
   - Send Google Search Console verification
   - Update `siteUrl` in environment variables
   - Submit sitemap to Google Search Console and Bing Webmaster Tools

7. **Mobile Responsiveness (Already Good)**
   - Verify all pages look good on mobile (appears to be done)
   - Test with Google's Mobile-Friendly Test tool

### Medium Priority (Next Month)

5. **Page Speed Optimization**
   - Use Nuxt 3's built-in image optimization
   - Minimize JavaScript bundle
   - Enable gzip compression on server
   - Use CDN for static assets

   Test with:
   - Google PageSpeed Insights
   - GTmetrix
   - WebPageTest

6. **Internal Linking Strategy**
   - Add "related products" section on detail pages
   - Create breadcrumb navigation components
   - Link blog articles (if planned) to products
   - Natural internal linking with descriptive anchor text

7. **Blog/Content Strategy** (If Applicable)
   - Add blog section for baking tips, recipes
   - Each post should target specific keywords
   - Link blog posts to related products

   Example SEO for blog post:

   ```typescript
   useSeo({
     title: "Hvordan lage surdeigbrød hjemme - Tips fra Villheva",
     description: "Lær steg-for-steg hvordan du lager autentisk surdeigbrød...",
     image: "/blog/sourdough-guide.jpg",
     type: "article",
     publishedTime: "2026-03-08",
     author: "Villheva Team",
   });
   ```

### Low Priority (Long-term)

8. **Advanced Schema Markup**
   - FAQ schema for common questions
   - Review/Rating schema (if applicable)
   - Local business schema with contact info
   - Video schema (if you add video content)

9. **Content Optimization**
   - A/B test meta descriptions
   - Analyze page ranking with Google Search Console
   - Identify content gaps and opportunities
   - Improve underperforming landing pages

10. **Backlink Building**
    - Submit to Norwegian business directories
    - Get mentioned in local news
    - Partner with food bloggers
    - Guest post on relevant websites

## 📊 Monitoring & Maintenance

### Weekly/Monthly Tasks

- Check Google Search Console for errors
- Monitor click-through rate (CTR) trends
- Review search queries and rankings
- Update product descriptions as inventory changes

### Tools to Use

- [Google Search Console](https://search.google.com/search-console)
- [Google Analytics 4](https://analytics.google.com)
- [Bing Webmaster Tools](https://www.bing.com/webmasters)
- [SEMrush](https://www.semrush.com) or [Ahrefs](https://ahrefs.com) for competitor analysis
- [Lighthouse](https://developers.google.com/web/tools/lighthouse) for performance

## 🔍 SEO Checklist

Use this checklist when launching or updating pages:

- [ ] Page has unique, compelling `<title>` (50-60 characters)
- [ ] Meta description exists and is compelling (150-160 characters)
- [ ] All images have descriptive alt text
- [ ] Page has proper H1 tag (only one per page)
- [ ] Headings follow logical hierarchy (H1, H2, H3...)
- [ ] Internal links use descriptive anchor text
- [ ] Page loads fast (<3 seconds on 4G)
- [ ] Mobile responsiveness tested
- [ ] Schema markup is valid (test with [schema.org validator](https://validator.schema.org/))
- [ ] Robots.txt and sitemap updated
- [ ] URL is clean and descriptive
- [ ] No duplicate content issues
- [ ] Social media meta tags set (OG tags)

## 🛡️ Technical SEO Issues to Monitor

1. **Duplicate Content**
   - Canonical tags are set (implemented ✅)
   - Watch for URL parameters creating duplicates

2. **Crawlability**
   - Robots.txt doesn't block important pages (verified ✅)
   - No redirect chains
   - All CSS/JS loads properly

3. **Core Web Vitals**
   - Largest Contentful Paint (LCP) < 2.5s
   - First Input Delay (FID) < 100ms
   - Cumulative Layout Shift (CLS) < 0.1

## 📝 Environment Variables

Ensure these are set in your `.env.local`:

```
SITE_URL=https://villheva.no
SANITY_PROJECT_ID=u8jecufq
SANITY_DATASET=product
SANITY_API_TOKEN=your_token
```

## 🚀 Deployment Notes

Before going live:

1. **SSL Certificate**
   - Must use HTTPS (impacts SEO)
   - Redirect all HTTP to HTTPS

2. **WWW vs non-WWW**
   - Choose one and redirect the other
   - Currently set to `https://villheva.no` (non-www, good choice)

3. **Server Headers**
   - Test with Security Headers tool
   - Add appropriate headers (CSP, X-Frame-Options, etc.)

4. **DNS Setup**
   - Ensure DNS is properly configured
   - Add DNS records for email if needed
   - Consider adding DMARC for email security

## 📚 SEO Best Practices for Content Updates

When adding new products:

1. Use descriptive product names (include category if relevant)
2. Write unique product descriptions (150-200 words ideal)
3. Upload high-quality, properly named images
4. Fill in all metadata in Sanity CMS
5. Ensure product prices and availability are current
6. Add related products for internal linking
7. Use Norwegian keywords naturally in descriptions

## ✨ Future Enhancements

- [ ] Add `nuxt-yoast` or similar for content optimization hints
- [ ] Implement internationalization (i18n) for multi-language support
- [ ] Add AMP pages for mobile articles (optional)
- [ ] Set up structured data for product ratings/reviews
- [ ] Create XML feed for product listings if needed
- [ ] Implement breadcrumb components across all pages

---

**Last Updated**: March 8, 2026
**Status**: Implementation Complete ✅
**Next Review**: April 8, 2026
