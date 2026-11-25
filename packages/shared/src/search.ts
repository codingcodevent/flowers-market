import { CATALOG } from './catalog.ts';
import type { CategorySlug, Product } from './types.ts';

const CYRILLIC_TO_LATIN: Record<string, string> = {
  а: 'a',
  б: 'b',
  в: 'v',
  г: 'g',
  д: 'd',
  е: 'e',
  ё: 'yo',
  ж: 'j',
  з: 'z',
  и: 'i',
  й: 'y',
  к: 'k',
  л: 'l',
  м: 'm',
  н: 'n',
  о: 'o',
  п: 'p',
  р: 'r',
  с: 's',
  т: 't',
  у: 'u',
  ф: 'f',
  х: 'x',
  ц: 'ts',
  ч: 'ch',
  ш: 'sh',
  ъ: '',
  ь: '',
  э: 'e',
  ю: 'yu',
  я: 'ya',
  ў: 'o',
  қ: 'q',
  ғ: 'g',
  ҳ: 'h',
};

/**
 * O'zbek lotin va kirill matnlarini yagona ko'rinishga keltiradi.
 * Masalan: "Sovg'a", "sovgʻa", "sovga", "совға" -> "sovga".
 */
export function normalizeUzbekText(input: string): string {
  const lowered = input.toLowerCase();
  let transliterated = '';
  for (const ch of lowered) {
    transliterated += CYRILLIC_TO_LATIN[ch] ?? ch;
  }
  return transliterated
    .replace(/['‘’ʻʼ`"]/g, '')
    .replace(/[^a-z0-9\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

interface IndexedProduct {
  product: Product;
  titleNorm: string;
  subtitleNorm: string;
  tagsNorm: string;
  fullNorm: string;
  words: string[];
}

const SEARCH_INDEX: IndexedProduct[] = CATALOG.map((product) => {
  const titleNorm = normalizeUzbekText(product.title);
  const subtitleNorm = normalizeUzbekText(product.subtitle);
  const tagsNorm = normalizeUzbekText(
    [...product.tags, ...product.occasions, product.category].join(' '),
  );
  const descNorm = normalizeUzbekText(product.description);
  const fullNorm = `${titleNorm} ${subtitleNorm} ${tagsNorm} ${descNorm}`;
  return {
    product,
    titleNorm,
    subtitleNorm,
    tagsNorm,
    fullNorm,
    words: fullNorm.split(' ').filter(Boolean),
  };
});

export interface SearchOptions {
  category?: CategorySlug | 'all';
  sortBy?: 'relevance' | 'price-asc' | 'price-desc';
  maxPrice?: number;
}

export interface SearchResult {
  items: Product[];
  elapsedMs: number;
  totalCount: number;
}

/**
 * Oldindan tayyorlangan indeks asosida mahsulotlarni < 1ms ichida qidiradi va reytinglaydi.
 */
export function searchCatalog(query: string, options: SearchOptions = {}): SearchResult {
  const t0 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  const { category = 'all', sortBy = 'relevance', maxPrice } = options;
  const qNorm = normalizeUzbekText(query);
  const tokens = qNorm ? qNorm.split(' ').filter(Boolean) : [];

  const scored: Array<{ product: Product; score: number }> = [];

  for (const entry of SEARCH_INDEX) {
    if (category !== 'all' && entry.product.category !== category) continue;
    if (typeof maxPrice === 'number' && entry.product.price > maxPrice) continue;

    if (tokens.length === 0) {
      scored.push({ product: entry.product, score: entry.product.badge ? 10 : 1 });
      continue;
    }

    let score = 0;
    let allTokensMatched = true;

    for (const token of tokens) {
      let tokenScore = 0;
      if (entry.titleNorm.startsWith(token)) {
        tokenScore = 120;
      } else if (entry.titleNorm.includes(token)) {
        tokenScore = 80;
      } else if (entry.words.some((w) => w.startsWith(token))) {
        tokenScore = 55;
      } else if (entry.tagsNorm.includes(token)) {
        tokenScore = 40;
      } else if (entry.subtitleNorm.includes(token)) {
        tokenScore = 25;
      } else if (entry.fullNorm.includes(token)) {
        tokenScore = 10;
      }

      if (tokenScore === 0) {
        allTokensMatched = false;
        break;
      }
      score += tokenScore;
    }

    if (allTokensMatched) {
      scored.push({ product: entry.product, score });
    }
  }

  if (sortBy === 'price-asc') {
    scored.sort((a, b) => a.product.price - b.product.price);
  } else if (sortBy === 'price-desc') {
    scored.sort((a, b) => b.product.price - a.product.price);
  } else if (tokens.length > 0) {
    scored.sort((a, b) => b.score - a.score || a.product.price - b.product.price);
  }

  const t1 = typeof performance !== 'undefined' ? performance.now() : Date.now();
  return {
    items: scored.map((s) => s.product),
    elapsedMs: Number(Math.max(0.05, t1 - t0).toFixed(2)),
    totalCount: scored.length,
  };
}

export function getProductBySlug(slug: string): Product | undefined {
  return CATALOG.find((item) => item.slug === slug);
}

export function getProductById(id: string): Product | undefined {
  return CATALOG.find((item) => item.id === id);
}
