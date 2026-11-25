import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { CATALOG, CATEGORIES, CATEGORY_MAP, formatSum, type CategorySlug } from '@gul/shared';
import { MobileShell } from '@/components/MobileShell';
import { getTelegramMiniAppUrl } from '@/lib/seo-helpers';

export const dynamicParams = false;

export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ category: string }>;
}): Promise<Metadata> {
  const { category } = await params;
  const meta = CATEGORY_MAP[category as CategorySlug];
  if (!meta) return {};
  return {
    title: meta.seoTitle,
    description: meta.seoDescription,
    alternates: { canonical: `/${meta.slug}` },
  };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ category: string }>;
}) {
  const { category } = await params;
  const meta = CATEGORY_MAP[category as CategorySlug];
  if (!meta) notFound();

  const items = CATALOG.filter((p) => p.category === meta.slug);

  return (
    <MobileShell activeHref={`/${meta.slug}`}>
      <section className="mb-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
        <h1 className="text-lg font-bold text-[var(--text)]">{meta.label}</h1>
        <p className="mt-1 text-xs leading-relaxed text-[var(--text-muted)]">
          {meta.seoDescription}
        </p>
      </section>

      <div className="grid grid-cols-2 gap-2.5">
        {items.map((product, index) => (
          <Link
            key={product.id}
            href={`/mahsulot/${product.slug}`}
            className="flex flex-col justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-2"
          >
            <div>
              <div className="relative aspect-square overflow-hidden rounded-xl bg-[var(--surface-muted)]">
                <Image
                  src={product.image}
                  alt={product.title}
                  width={400}
                  height={400}
                  priority={index < 2}
                  className="h-full w-full object-cover"
                />
                {product.badge && (
                  <span className="absolute left-2 top-2 rounded-full bg-[var(--brand)] px-2 py-0.5 text-[11px] font-semibold text-white">
                    {product.badge}
                  </span>
                )}
              </div>
              <h2 className="mt-2 line-clamp-1 text-sm font-semibold text-[var(--text)]">
                {product.title}
              </h2>
              <p className="line-clamp-1 text-xs text-[var(--text-muted)]">{product.subtitle}</p>
            </div>
            <div className="mt-2 flex items-center justify-between border-t border-[var(--border)] pt-1.5">
              <span className="text-sm font-bold text-[var(--text)]">
                {formatSum(product.price)}
              </span>
              <span className="text-[11px] font-medium text-[var(--brand)]">Batafsil</span>
            </div>
          </Link>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center text-xs">
        <a
          href={getTelegramMiniAppUrl()}
          target="_blank"
          rel="noopener noreferrer"
          className="font-semibold text-[var(--brand)] underline"
        >
          {meta.label} bo'limini Telegram Mini App'da ochish →
        </a>
      </div>
    </MobileShell>
  );
}
