import Link from 'next/link';
import { Flower2, Send } from 'lucide-react';
import { STORE_CONTACTS } from '@gul/shared';
import { getTelegramMiniAppUrl } from '@/lib/seo-helpers';

const NAV_LINKS = [
  { href: '/gullar', label: 'Gullar' },
  { href: '/buketlar', label: 'Buketlar' },
  { href: '/sovgalar', label: "Sovg'alar" },
  { href: '/dostavka', label: 'Dostavka' },
  { href: '/kontaktlar', label: 'Kontaktlar' },
  { href: '/zayavka', label: 'Zayavka' },
];

export function MobileShell({
  children,
  activeHref,
}: {
  children: React.ReactNode;
  activeHref?: string;
}) {
  return (
    <div className="mx-auto min-h-[100dvh] w-full max-w-[480px] bg-[var(--bg)] pb-20 shadow-[0_0_40px_rgba(0,0,0,0.04)]">
      <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md">
        <div className="flex items-center justify-between px-3.5 py-2.5">
          <Link href="/" className="flex items-center gap-2">
            <span className="flex h-8 w-8 items-center justify-center rounded-xl bg-[var(--brand)] text-white">
              <Flower2 className="h-4 w-4" />
            </span>
            <div>
              <div className="text-sm font-bold leading-tight text-[var(--text)]">
                {STORE_CONTACTS.brandName}
              </div>
              <div className="text-[11px] text-[var(--text-muted)]">
                Toshkent gul do'koni
              </div>
            </div>
          </Link>

          <a
            href={getTelegramMiniAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex h-9 items-center gap-1.5 rounded-xl bg-[var(--brand)] px-3 text-xs font-semibold text-white"
          >
            <Send className="h-3.5 w-3.5" />
            <span>Telegram Web App</span>
          </a>
        </div>

        <nav
          aria-label="SEO menyular"
          className="flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-[var(--border)] px-3.5 py-2"
        >
          {NAV_LINKS.map((item) => {
            const active = activeHref === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`shrink-0 rounded-full border px-3 py-1 text-xs font-medium transition ${
                  active
                    ? 'border-[var(--brand)] bg-[var(--brand)] text-white'
                    : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text-muted)]'
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
      </header>

      <main className="px-3.5 py-4">{children}</main>

      <footer className="mt-6 border-t border-[var(--border)] px-3.5 py-5 text-xs text-[var(--text-muted)]">
        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3.5">
          <div className="font-semibold text-[var(--text)]">
            Ro'yxatdan o'tmasdan Telegramda buyurtma bering
          </div>
          <p className="mt-1 leading-relaxed">
            Telegram Mini App orqali kirganingizda profilingiz avtomatik aniqlanadi — parol va
            SMS kod shart emas.
          </p>
          <a
            href={getTelegramMiniAppUrl()}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex h-10 w-full items-center justify-center gap-2 rounded-xl bg-[var(--brand)] text-xs font-semibold text-white"
          >
            <Send className="h-3.5 w-3.5" />
            Telegram ilovada ochish
          </a>
        </div>
        <p className="mt-3 text-center">
          © {new Date().getFullYear()} {STORE_CONTACTS.legalName} · {STORE_CONTACTS.phoneDisplay}
        </p>
      </footer>
    </div>
  );
}
