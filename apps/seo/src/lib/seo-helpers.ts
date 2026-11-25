import { STORE_CONTACTS, type Product } from '@gul/shared';

export function getSiteUrl(): string {
  return (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
}

export function getBotUsername(): string {
  return process.env.NEXT_PUBLIC_BOT_USERNAME || STORE_CONTACTS.botUsername;
}

export function getTelegramMiniAppUrl(startParam?: string): string {
  const bot = getBotUsername();
  if (startParam) {
    return `https://t.me/${bot}?startapp=${encodeURIComponent(startParam)}`;
  }
  return `https://t.me/${bot}/app`;
}

export function buildLocalBusinessJsonLd() {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Florist',
    name: STORE_CONTACTS.legalName,
    url: siteUrl,
    telephone: STORE_CONTACTS.phoneDisplay,
    address: {
      '@type': 'PostalAddress',
      streetAddress: STORE_CONTACTS.address,
      addressLocality: 'Toshkent',
      addressCountry: 'UZ',
    },
    openingHours: 'Mo-Su 08:00-23:00',
    priceRange: 'UZS',
    sameAs: [`https://t.me/${STORE_CONTACTS.telegramUsername}`],
  };
}

export function buildProductJsonLd(product: Product) {
  const siteUrl = getSiteUrl();
  return {
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.title,
    description: product.description,
    image: `${siteUrl}${product.image}`,
    sku: product.id,
    brand: {
      '@type': 'Brand',
      name: STORE_CONTACTS.brandName,
    },
    offers: {
      '@type': 'Offer',
      url: `${siteUrl}/mahsulot/${product.slug}`,
      priceCurrency: 'UZS',
      price: product.price,
      availability: product.inStock
        ? 'https://schema.org/InStock'
        : 'https://schema.org/OutOfStock',
    },
  };
}
