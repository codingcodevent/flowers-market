import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft, Clock, Send } from 'lucide-react';
import { CATALOG, CATEGORY_MAP, formatSum, getProductBySlug } from '@gul/shared';
import { MobileShell } from '@/components/MobileShell';
import { buildProductJsonLd, getTelegramMiniAppUrl } from '@/lib/seo-helpers';

export const dynamicParams = false;

export function generateStaticParams() {
  return CATALOG.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) return {};
  return {
    title: `${product.title} — ${formatSum(product.price)}`,
    description: product.description,
    alternates: { canonical: `/mahsulot/${product.slug}` },
    openGraph: {
      title: `${product.title} — ${formatSum(product.price)}`,
      description: product.description,
      images: [{ url: product.image, width: 560, height: 560 }],
    },
  };
}

export default async function ProductDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const product = getProductBySlug(slug);
  if (!product) notFound();

  const category = CATEGORY_MAP[product.category];
  const jsonLd = buildProductJsonLd(product);

  return (
    <MobileShell activeHref={`/${product.category}`}>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <Link
        href={`/${category.slug}`}
        className="mb-3 inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--text-muted)]"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        {category.label} bo'limiga qaytish
      </Link>

      <article className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-[var(--surface-muted)]">
          <Image
            src={product.image}
            alt={product.title}
            width={600}
            height={600}
            priority
            className="h-full w-full object-cover"
          />
        </div>

        <div className="mt-3.5 space-y-2.5">
          <h1 className="text-xl font-bold text-[var(--text)]">{product.title}</h1>
          <p className="text-xs text-[var(--text-muted)]">{product.subtitle}</p>

          <div className="flex flex-wrap items-center gap-1.5">
            <span className="inline-flex items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-xs font-medium text-[var(--leaf)]">
              <Clock className="h-3.5 w-3.5" />~{product.deliveryMinutes} daqiqada yetkaziladi
            </span>
            {product.occasions.map((occ) => (
              <span
                key={occ}
                className="rounded-full border border-[var(--border)] px-2.5 py-1 text-xs text-[var(--text-muted)]"
              >
                {occ}
              </span>
            ))}
          </div>

          <p className="text-sm leading-relaxed text-[var(--text-muted)]">
            {product.description}
          </p>

          <div className="border-t border-[var(--border)] pt-3">
            {product.oldPrice && (
              <div className="text-xs text-[var(--text-muted)] line-through">
                {formatSum(product.oldPrice)}
              </div>
            )}
            <div className="text-2xl font-bold text-[var(--text)]">
              {formatSum(product.price)}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-2 pt-1">
            <a
              href={getTelegramMiniAppUrl(`product_${product.id}`)}
              target="_blank"
              rel="noopener noreferrer"
              className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] text-sm font-semibold text-white"
            >
              <Send className="h-4 w-4" />
              Telegram Mini App'da buyurtma berish
            </a>
            <Link
              href="/zayavka"
              className="flex h-11 items-center justify-center rounded-2xl border border-[var(--border)] bg-[var(--bg)] text-xs font-semibold text-[var(--text)]"
            >
              Sayt orqali tez zayavka qoldirish
            </Link>
          </div>
        </div>
      </article>
    </MobileShell>
  );
}
