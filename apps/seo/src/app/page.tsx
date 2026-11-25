import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Clock, Send, ShieldCheck } from 'lucide-react';
import { CATALOG, CATEGORIES, STORE_CONTACTS, formatSum } from '@gul/shared';
import { MobileShell } from '@/components/MobileShell';
import { buildLocalBusinessJsonLd, getTelegramMiniAppUrl } from '@/lib/seo-helpers';

export default function HomePage() {
  const jsonLd = buildLocalBusinessJsonLd();
  const featured = CATALOG.slice(0, 6);

  return (
    <MobileShell>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <section className="rounded-3xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-[var(--leaf-soft)] px-2.5 py-1 text-xs font-semibold text-[var(--leaf)]">
          <Clock className="h-3.5 w-3.5" />
          60 daqiqada Toshkent bo'ylab yetkazamiz
        </span>
        <h1 className="mt-2.5 text-xl font-bold leading-snug text-[var(--text)]">
          {STORE_CONTACTS.brandName} — Yangi gullar, mualliflik buketlari va sovg'alar
        </h1>
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-muted)]">
          Telegram Web App orqali ro'yxatdan o'tmasdan buyurtma bering — profilingiz avtomatik
          aniqlanadi, tayyor buket rasmi yuborishdan oldin ko'rsatiladi.
        </p>
        <div className="mt-3.5 grid grid-cols-2 gap-2">
          <a
            href={getTelegramMiniAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl bg-[var(--brand)] text-xs font-semibold text-white"
          >
            <Send className="h-3.5 w-3.5" />
            Telegramda ochish
          </a>
          <Link
            href="/zayavka"
            className="flex h-11 items-center justify-center gap-1.5 rounded-xl border border-[var(--border)] bg-[var(--bg)] text-xs font-semibold text-[var(--text)]"
          >
            Tez zayavka berish
          </Link>
        </div>
      </section>

      {/* Kategoriyalar */}
      <section className="mt-4 space-y-2">
        <h2 className="text-sm font-bold text-[var(--text)]">Asosiy bo'limlar</h2>
        <div className="grid grid-cols-3 gap-2">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.slug}
              href={`/${cat.slug}`}
              className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-center transition active:scale-[0.98]"
            >
              <div className="text-sm font-bold text-[var(--text)]">{cat.label}</div>
              <div className="mt-0.5 text-[11px] text-[var(--brand)]">Ko'rish →</div>
            </Link>
          ))}
        </div>
      </section>

      {/* Mashhur mahsulotlar */}
      <section className="mt-5 space-y-2.5">
        <div className="flex items-center justify-between">
          <h2 className="text-sm font-bold text-[var(--text)]">Mashhur tanlovlar</h2>
          <Link href="/buketlar" className="inline-flex items-center gap-1 text-xs font-semibold text-[var(--brand)]">
            Barchasi <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          {featured.map((product, i) => (
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
                    priority={i < 2}
                    className="h-full w-full object-cover"
                  />
                </div>
                <h3 className="mt-2 line-clamp-1 text-sm font-semibold text-[var(--text)]">
                  {product.title}
                </h3>
                <p className="line-clamp-1 text-xs text-[var(--text-muted)]">{product.subtitle}</p>
              </div>
              <div className="mt-2 border-t border-[var(--border)] pt-1.5 text-sm font-bold text-[var(--text)]">
                {formatSum(product.price)}
              </div>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5 text-xs">
        <div className="flex items-center gap-1.5 font-bold text-[var(--leaf)]">
          <ShieldCheck className="h-4 w-4" />
          Sifat va yangilik kafolati
        </div>
        <p className="mt-1 leading-relaxed text-[var(--text-muted)]">
          Gullarimiz har kuni ertalab Ekvador va Gollandiyadan keltiriladi. Buket yig'ilgach,
          kuryerga berishdan oldin sizga Telegram orqali suratini yuboramiz.
        </p>
      </section>
    </MobileShell>
  );
}
