import { Clock, MapPin, MessageCircle, Phone, Send } from 'lucide-react';
import { STORE_CONTACTS } from '@gul/shared';
import { openTelegramChat } from '../lib/telegram';

interface ContactsViewProps {
  onGoOrderForm: () => void;
}

export function ContactsView({ onGoOrderForm }: ContactsViewProps) {
  return (
    <section className="space-y-3 px-3.5 py-3" aria-label="Kontaktlar">
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-4">
        <h1 className="text-base font-bold text-[var(--text)]">{STORE_CONTACTS.legalName}</h1>
        <p className="mt-1 text-xs text-[var(--text-muted)]">
          Savollar, tezkor maslahat yoki studiyadan olib ketish uchun ma'lumotlar:
        </p>

        <div className="mt-3.5 space-y-3 text-sm">
          <div className="flex items-start gap-2.5">
            <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[var(--brand)]" />
            <div>
              <div className="font-semibold text-[var(--text)]">{STORE_CONTACTS.address}</div>
              <div className="text-xs text-[var(--text-muted)]">{STORE_CONTACTS.landmark}</div>
            </div>
          </div>

          <div className="flex items-start gap-2.5">
            <Clock className="mt-0.5 h-4 w-4 shrink-0 text-[var(--leaf)]" />
            <div className="text-xs leading-relaxed text-[var(--text)]">
              {STORE_CONTACTS.workingHours}
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-2">
        <a
          href={STORE_CONTACTS.phoneHref}
          className="flex h-12 items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] active:scale-[0.99]"
        >
          <span className="flex items-center gap-2.5">
            <Phone className="h-4 w-4 text-[var(--leaf)]" />
            Qo'ng'iroq qilish
          </span>
          <span className="font-mono text-xs text-[var(--text-muted)]">
            {STORE_CONTACTS.phoneDisplay}
          </span>
        </a>

        <button
          type="button"
          onClick={() => openTelegramChat(STORE_CONTACTS.telegramUsername)}
          className="flex h-12 items-center justify-between rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm font-semibold text-[var(--text)] active:scale-[0.99]"
        >
          <span className="flex items-center gap-2.5">
            <MessageCircle className="h-4 w-4 text-[var(--brand)]" />
            Telegramda yozish
          </span>
          <span className="text-xs text-[var(--brand)]">@{STORE_CONTACTS.telegramUsername}</span>
        </button>

        <button
          type="button"
          onClick={onGoOrderForm}
          className="flex h-12 items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] text-sm font-semibold text-white shadow-sm active:scale-[0.99]"
        >
          <Send className="h-4 w-4" />
          Zayavka formasi orqali bog'lanish
        </button>
      </div>
    </section>
  );
}
