import type { Metadata } from 'next';
import { Clock, MapPin, MessageCircle, Phone } from 'lucide-react';
import { STORE_CONTACTS } from '@gul/shared';
import { MobileShell } from '@/components/MobileShell';
import { buildLocalBusinessJsonLd } from '@/lib/seo-helpers';

export const metadata: Metadata = {
  title: 'Kontaktlar va manzil',
  description: `${STORE_CONTACTS.legalName} manzili: ${STORE_CONTACTS.address}. Telefon: ${STORE_CONTACTS.phoneDisplay}.`,
  alternates: { canonical: '/kontaktlar' },
};

export default function ContactsPage() {
  const jsonLd = buildLocalBusinessJsonLd();

  return (
    <MobileShell activeHref="/kontaktlar">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <div className="space-y-3 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h1 className="text-lg font-bold">{STORE_CONTACTS.legalName}</h1>
        <div className="flex items-start gap-2 text-sm">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
          <div>
            <div className="font-semibold">{STORE_CONTACTS.address}</div>
            <div className="text-xs text-[var(--text-muted)]">{STORE_CONTACTS.landmark}</div>
          </div>
        </div>
        <div className="flex items-start gap-2 text-xs text-[var(--text-muted)]">
          <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--leaf)]" />
          <span>{STORE_CONTACTS.workingHours}</span>
        </div>

        <div className="space-y-2 pt-2">
          <a
            href={STORE_CONTACTS.phoneHref}
            className="flex h-11 items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <Phone className="h-4 w-4 text-[var(--leaf)]" /> Qo'ng'iroq qilish
            </span>
            <span className="font-mono">{STORE_CONTACTS.phoneDisplay}</span>
          </a>

          <a
            href={`https://t.me/${STORE_CONTACTS.telegramUsername}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-11 items-center justify-between rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3.5 text-xs font-semibold"
          >
            <span className="flex items-center gap-2">
              <MessageCircle className="h-4 w-4 text-[var(--brand)]" /> Telegram menejer
            </span>
            <span className="text-[var(--brand)]">@{STORE_CONTACTS.telegramUsername}</span>
          </a>
        </div>
      </div>
    </MobileShell>
  );
}
