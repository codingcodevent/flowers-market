import type { MetadataRoute } from 'next';
import { CATALOG, CATEGORIES } from '@gul/shared';
import { getSiteUrl } from '@/lib/seo-helpers';

export default function sitemap(): MetadataRoute.Sitemap {
  const base = getSiteUrl();
  const now = new Date();

  const staticRoutes = ['', '/dostavka', '/kontaktlar', '/zayavka'].map((path) => ({
    url: `${base}${path}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: path === '' ? 1 : 0.8,
  }));

  const categoryRoutes = CATEGORIES.map((c) => ({
    url: `${base}/${c.slug}`,
    lastModified: now,
    changeFrequency: 'daily' as const,
    priority: 0.9,
  }));

  const productRoutes = CATALOG.map((p) => ({
    url: `${base}/mahsulot/${p.slug}`,
    lastModified: now,
    changeFrequency: 'weekly' as const,
    priority: 0.85,
  }));

  return [...staticRoutes, ...categoryRoutes, ...productRoutes];
}
