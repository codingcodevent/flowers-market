import { RefreshCw, ShieldCheck, X } from 'lucide-react';
import {
  formatTelegramDisplayName,
  getTelegramInitials,
  type TelegramUser,
} from '@gul/shared';

interface ProfileSheetProps {
  user: TelegramUser;
  isInsideTelegram: boolean;
  onClose: () => void;
  onSwitchDemoUser: () => void;
}

export function ProfileSheet({
  user,
  isInsideTelegram,
  onClose,
  onSwitchDemoUser,
}: ProfileSheetProps) {
  const fullName = formatTelegramDisplayName(user);
  const initials = getTelegramInitials(user);

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/50 backdrop-blur-[2px]"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label="Telegram profili"
    >
      <div
        className="animate-sheet-up w-full max-w-[480px] rounded-t-3xl bg-[var(--surface)] p-4 pb-safe shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf)]">
            <ShieldCheck className="h-4 w-4" />
            <span>Ro'yxatdan o'tishsiz Telegram avtorizatsiyasi</span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-[var(--surface-muted)]"
            aria-label="Yopish"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex items-center gap-3 rounded-2xl border border-[var(--border)] bg-[var(--bg)] p-3.5">
          {user.photo_url ? (
            <img
              src={user.photo_url}
              alt={fullName}
              width={52}
              height={52}
              className="h-13 w-13 rounded-full object-cover"
            />
          ) : (
            <div className="flex h-13 w-13 items-center justify-center rounded-full bg-[var(--brand)] text-base font-bold text-white">
              {initials}
            </div>
          )}
          <div className="min-w-0 flex-1">
            <h2 className="truncate text-base font-bold text-[var(--text)]">{fullName}</h2>
            <p className="text-xs text-[var(--text-muted)]">
              {user.username ? `@${user.username}` : 'Username kiritilmagan'} · ID: {user.id}
            </p>
            <p className="mt-1 text-[11px] text-[var(--leaf)]">
              {isInsideTelegram
                ? 'Telegram WebApp initData orqali avtomatik aniqlandi'
                : 'Brauzer test rejimi (Telegram tashqarisida demo profil)'}
            </p>
          </div>
        </div>

        <div className="mt-3 space-y-2 rounded-2xl bg-[var(--surface-muted)] p-3 text-xs text-[var(--text-muted)]">
          <div className="flex justify-between">
            <span>Til kodi:</span>
            <strong className="text-[var(--text)]">{user.language_code || 'uz'}</strong>
          </div>
          <div className="flex justify-between">
            <span>Parol / SMS kod:</span>
            <strong className="text-[var(--leaf)]">Kerak emas</strong>
          </div>
          <p className="pt-1 leading-relaxed">
            Telegram Mini App orqali kirganingizda buyurtma va zayavkalar avtomatik ravishda ushbu
            Telegram profilingizga bog'lanadi.
          </p>
        </div>

        {!isInsideTelegram && (
          <button
            type="button"
            onClick={onSwitchDemoUser}
            className="mt-3 flex h-11 w-full items-center justify-center gap-2 rounded-2xl border border-[var(--border)] bg-[var(--bg)] text-xs font-semibold text-[var(--text)] active:scale-[0.98]"
          >
            <RefreshCw className="h-3.5 w-3.5" />
            Demo Telegram profilini almashtirish
          </button>
        )}
      </div>
    </div>
  );
}
