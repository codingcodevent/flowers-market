import { MapPin, ShoppingBag } from 'lucide-react';
import {
  STORE_CONTACTS,
  formatTelegramDisplayName,
  getTelegramInitials,
  type TelegramUser,
} from '@gul/shared';

export type ActiveTab =
  | 'gullar'
  | 'buketlar'
  | 'sovgalar'
  | 'dostavka'
  | 'kontaktlar'
  | 'zayavka';

interface TopHeaderProps {
  user: TelegramUser;
  isInsideTelegram: boolean;
  cartCount: number;
  activeTab: ActiveTab;
  onOpenProfile: () => void;
  onOpenCart: () => void;
  onSelectContacts: () => void;
}

export function TopHeader({
  user,
  isInsideTelegram,
  cartCount,
  activeTab,
  onOpenProfile,
  onOpenCart,
  onSelectContacts,
}: TopHeaderProps) {
  const displayName = formatTelegramDisplayName(user);
  const initials = getTelegramInitials(user);

  return (
    <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--bg)]/95 backdrop-blur-md">
      <div className="flex items-center justify-between gap-2 px-3.5 py-2.5">
        {/* Telegram Auto-Profile (Ro'yxatdan o'tishsiz) */}
        <button
          type="button"
          onClick={onOpenProfile}
          className="flex min-w-0 items-center gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-2.5 py-1.5 text-left transition active:scale-[0.98]"
          aria-label="Telegram profili ma'lumotlari"
        >
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={displayName}
              width={32}
              height={32}
              className="h-8 w-8 shrink-0 rounded-full object-cover"
            />
          ) : (
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
              {initials}
            </span>
          )}
          <div className="min-w-0">
            <div className="flex items-center gap-1.5">
              <span className="truncate text-xs font-semibold text-[var(--text)]">
                {displayName}
              </span>
              <span className="inline-flex shrink-0 items-center gap-1 rounded-full bg-[var(--leaf-soft)] px-1.5 py-0.5 text-[10px] font-semibold text-[var(--leaf)]">
                <span className="h-1.5 w-1.5 rounded-full bg-[var(--leaf)]" />
                {isInsideTelegram ? 'TG Profil' : 'TG Demo'}
              </span>
            </div>
            <p className="truncate text-[11px] text-[var(--text-muted)]">
              {user.username ? `@${user.username}` : `ID: ${user.id}`} · {STORE_CONTACTS.brandName}
            </p>
          </div>
        </button>

        {/* Kontaktlar & Savat */}
        <div className="flex shrink-0 items-center gap-1.5">
          <button
            type="button"
            onClick={onSelectContacts}
            className={`flex h-10 items-center gap-1 rounded-2xl border px-2.5 text-xs font-medium transition active:scale-95 ${
              activeTab === 'kontaktlar'
                ? 'border-[var(--brand)] bg-[var(--brand-soft)] text-[var(--brand)]'
                : 'border-[var(--border)] bg-[var(--surface)] text-[var(--text)]'
            }`}
            aria-label="Kontaktlar"
          >
            <MapPin className="h-3.5 w-3.5" />
            <span>Kontakt</span>
          </button>

          <button
            type="button"
            onClick={onOpenCart}
            className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-[var(--brand)] text-white shadow-sm transition active:scale-95"
            aria-label="Savatni ochish"
          >
            <ShoppingBag className="h-4 w-4" />
            {cartCount > 0 && (
              <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--text)] px-1 text-[11px] font-bold text-[var(--bg)]">
                {cartCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
