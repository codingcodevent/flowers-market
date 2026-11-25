import { useState, type FormEvent } from 'react';
import { CheckCircle2, Send, ShieldCheck } from 'lucide-react';
import {
  DELIVERY_ZONES,
  formatSum,
  formatTelegramDisplayName,
  getTelegramInitials,
  isValidUzPhone,
  type CartLineItem,
  type OrderResponse,
  type TelegramUser,
} from '@gul/shared';
import { hapticNotify } from '../lib/telegram';

interface OrderFormViewProps {
  user: TelegramUser;
  initData: string;
  isInsideTelegram: boolean;
  cartItems: CartLineItem[];
  cartTotal: number;
  selectedZoneId: string;
  onSelectZone: (zoneId: string) => void;
  onClearCart: () => void;
  onBrowseCatalog: () => void;
}

const API_BASE = (import.meta.env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export function OrderFormView({
  user,
  initData,
  isInsideTelegram,
  cartItems,
  cartTotal,
  selectedZoneId,
  onSelectZone,
  onClearCart,
  onBrowseCatalog,
}: OrderFormViewProps) {
  const [orderType, setOrderType] = useState<'cart' | 'custom'>(
    cartItems.length > 0 ? 'cart' : 'custom',
  );
  const [phone, setPhone] = useState('+998 ');
  const [address, setAddress] = useState('');
  const [deliveryTime, setDeliveryTime] = useState('Eng yaqin 60–90 daqiqa');
  const [recipientName, setRecipientName] = useState('');
  const [cardMessage, setCardMessage] = useState('');
  const [customOccasion, setCustomOccasion] = useState("Tug'ilgan kun uchun buket");
  const [customBudget, setCustomBudget] = useState("300 000 – 500 000 so'm");
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [result, setResult] = useState<OrderResponse | null>(null);

  const selectedZone =
    DELIVERY_ZONES.find((z) => z.id === selectedZoneId) ?? DELIVERY_ZONES[0];
  const deliveryFee =
    selectedZone.price === 0 ||
    (selectedZone.freeFrom !== undefined && cartTotal >= selectedZone.freeFrom)
      ? 0
      : selectedZone.price;

  const displayName = formatTelegramDisplayName(user);
  const initials = getTelegramInitials(user);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!isValidUzPhone(phone)) {
      setErrorMsg("Iltimos, to'g'ri telefon raqam kiriting (masalan: +998 90 123 45 67).");
      hapticNotify('error');
      return;
    }
    if (address.trim().length < 4) {
      setErrorMsg("Manzil yoki mo'ljalni batafsilroq kiriting.");
      hapticNotify('error');
      return;
    }
    if (orderType === 'cart' && cartItems.length === 0) {
      setErrorMsg("Savat bo'sh. Mahsulot tanlang yoki Individual zayavka rejimini tanlang.");
      hapticNotify('error');
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch(`${API_BASE}/api/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderType,
          phone,
          address,
          deliveryZoneId: selectedZone.id,
          deliveryTime,
          recipientName: recipientName || undefined,
          cardMessage: cardMessage || undefined,
          comment: comment || undefined,
          customBudget: orderType === 'custom' ? customBudget : undefined,
          customOccasion: orderType === 'custom' ? customOccasion : undefined,
          items: orderType === 'cart' ? cartItems : [],
          telegramUser: user,
          initData,
          source: 'tma',
        }),
      });

      const data = (await response.json()) as OrderResponse & { error?: string };
      if (!response.ok || !data.ok) {
        throw new Error(data.error || "Zayavkani yuborishda xatolik yuz berdi.");
      }

      setResult(data);
      hapticNotify('success');
      if (orderType === 'cart') {
        onClearCart();
      }
    } catch (err) {
      setErrorMsg(err instanceof Error ? err.message : "Tarmoq xatosi. Qayta urinib ko'ring.");
      hapticNotify('error');
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <section className="px-3.5 py-4">
        <div className="rounded-3xl border border-[var(--leaf)]/40 bg-[var(--surface)] p-5 text-center shadow-sm">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--leaf-soft)] text-[var(--leaf)]">
            <CheckCircle2 className="h-6 w-6" />
          </div>
          <h1 className="mt-3 text-lg font-bold text-[var(--text)]">
            Zayavkangiz qabul qilindi!
          </h1>
          <p className="mt-1 font-mono text-sm font-semibold text-[var(--brand)]">
            #{result.orderId}
          </p>
          <p className="mt-2 text-xs leading-relaxed text-[var(--text-muted)]">
            {result.message}
          </p>
          <div className="mt-4 space-y-1.5 rounded-2xl bg-[var(--surface-muted)] p-3 text-left text-xs">
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Telegram profil:</span>
              <span className="font-semibold text-[var(--text)]">
                {displayName} {user.username ? `(@${user.username})` : ''}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[var(--text-muted)]">Rejim:</span>
              <span className="font-semibold text-[var(--text)]">
                {result.mode === 'telegram-bot' ? 'Telegram Bot yuborildi' : 'Lokal Demo Saqlandi'}
              </span>
            </div>
            {result.totalAmount > 0 && (
              <div className="flex justify-between">
                <span className="text-[var(--text-muted)]">Mahsulotlar summasi:</span>
                <span className="font-bold text-[var(--text)]">
                  {formatSum(result.totalAmount)}
                </span>
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2">
            <button
              type="button"
              onClick={() => setResult(null)}
              className="h-11 rounded-2xl border border-[var(--border)] bg-[var(--bg)] text-xs font-semibold text-[var(--text)]"
            >
              Yana zayavka berish
            </button>
            <button
              type="button"
              onClick={onBrowseCatalog}
              className="h-11 rounded-2xl bg-[var(--brand)] text-xs font-semibold text-white"
            >
              Katalogga qaytish
            </button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="space-y-3 px-3.5 py-3" aria-label="Zayavka formasi">
      {/* Avtomatik Telegram Profil Kartasi (Ro'yxatdan o'tishsiz) */}
      <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
        <div className="flex items-center justify-between gap-2 pb-2 border-b border-[var(--border)]">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-[var(--leaf)]">
            <ShieldCheck className="h-4 w-4" />
            Telegram profilingiz avtomatik ulandi
          </span>
          <span className="text-[11px] text-[var(--text-muted)]">
            {isInsideTelegram ? 'Tasdiqlangan' : 'Demo'}
          </span>
        </div>
        <div className="mt-2.5 flex items-center gap-2.5">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[var(--brand)] text-xs font-bold text-white">
            {initials}
          </div>
          <div className="min-w-0">
            <div className="truncate text-sm font-bold text-[var(--text)]">{displayName}</div>
            <div className="text-xs text-[var(--text-muted)]">
              {user.username ? `@${user.username}` : 'Username yo‘q'} · TG ID: {user.id}
            </div>
          </div>
        </div>
      </div>

      {/* Zayavka turini tanlash */}
      <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-1">
        <button
          type="button"
          onClick={() => setOrderType('cart')}
          className={`h-10 rounded-xl text-xs font-semibold transition ${
            orderType === 'cart'
              ? 'bg-[var(--brand)] text-white'
              : 'text-[var(--text-muted)]'
          }`}
        >
          Savat buyurtmasi ({cartItems.length})
        </button>
        <button
          type="button"
          onClick={() => setOrderType('custom')}
          className={`h-10 rounded-xl text-xs font-semibold transition ${
            orderType === 'custom'
              ? 'bg-[var(--brand)] text-white'
              : 'text-[var(--text-muted)]'
          }`}
        >
          Individual zayavka
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-3">
        {orderType === 'cart' ? (
          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3 text-xs">
            {cartItems.length === 0 ? (
              <div className="flex items-center justify-between gap-2">
                <span className="text-[var(--text-muted)]">Savat hozircha bo'sh</span>
                <button
                  type="button"
                  onClick={onBrowseCatalog}
                  className="font-semibold text-[var(--brand)] underline"
                >
                  Gul tanlash
                </button>
              </div>
            ) : (
              <div className="space-y-1.5">
                {cartItems.map((item) => (
                  <div key={item.productId} className="flex justify-between">
                    <span className="truncate text-[var(--text)]">
                      {item.title} × {item.quantity}
                    </span>
                    <span className="shrink-0 font-semibold tabular-nums">
                      {formatSum(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
                <div className="flex justify-between border-t border-[var(--border)] pt-1.5 text-[var(--text-muted)]">
                  <span>Dostavka ({selectedZone.name}):</span>
                  <span>{deliveryFee === 0 ? 'Bepul' : formatSum(deliveryFee)}</span>
                </div>
                <div className="flex justify-between text-sm font-bold text-[var(--text)]">
                  <span>Jami to'lov:</span>
                  <span>{formatSum(cartTotal + deliveryFee)}</span>
                </div>
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
            <label className="block space-y-1">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Tadbir yoki buket turi
              </span>
              <input
                type="text"
                value={customOccasion}
                onChange={(e) => setCustomOccasion(e.target.value)}
                placeholder="Masalan: Tug'ilgan kun, kelin buketi, korporativ"
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
              />
            </label>
            <label className="block space-y-1">
              <span className="text-xs font-medium text-[var(--text-muted)]">
                Mo'ljallangan byudjet
              </span>
              <select
                value={customBudget}
                onChange={(e) => setCustomBudget(e.target.value)}
                className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
              >
                <option value="200 000 – 350 000 so'm">200 000 – 350 000 so'm</option>
                <option value="350 000 – 600 000 so'm">350 000 – 600 000 so'm</option>
                <option value="600 000 – 1 200 000 so'm">600 000 – 1 200 000 so'm</option>
                <option value="1 200 000+ so'm (VIP)">1 200 000+ so'm (VIP)</option>
              </select>
            </label>
          </div>
        )}

        <div className="space-y-2.5 rounded-2xl border border-[var(--border)] bg-[var(--surface)] p-3">
          <label className="block space-y-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              Telefon raqamingiz *
            </span>
            <input
              required
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+998 90 123 45 67"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              Yetkazib berish hududi
            </span>
            <select
              value={selectedZone.id}
              onChange={(e) => onSelectZone(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            >
              {DELIVERY_ZONES.map((z) => (
                <option key={z.id} value={z.id}>
                  {z.name} ({z.eta})
                </option>
              ))}
            </select>
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              Manzil yoki mo'ljal *
            </span>
            <input
              required
              type="text"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              placeholder="Masalan: Yunusobod 4-kvartal, 18-uy"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            />
          </label>

          <label className="block space-y-1">
            <span className="text-xs font-medium text-[var(--text-muted)]">
              Yetkazib berish vaqti
            </span>
            <select
              value={deliveryTime}
              onChange={(e) => setDeliveryTime(e.target.value)}
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            >
              <option value="Eng yaqin 60–90 daqiqa">Eng yaqin 60–90 daqiqa</option>
              <option value="Bugun 14:00 – 18:00">Bugun 14:00 – 18:00</option>
              <option value="Bugun 18:00 – 22:00">Bugun 18:00 – 22:00</option>
              <option value="Ertaga 09:00 – 12:00">Ertaga 09:00 – 12:00</option>
            </select>
          </label>

          <div className="grid grid-cols-1 gap-2.5">
            <input
              type="text"
              value={recipientName}
              onChange={(e) => setRecipientName(e.target.value)}
              placeholder="Qabul qiluvchi ismi (agar boshqa odamga bo'lsa)"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            />
            <input
              type="text"
              value={cardMessage}
              onChange={(e) => setCardMessage(e.target.value)}
              placeholder="Tabriknoma matni (bepul otkritka uchun)"
              className="h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] px-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            />
            <textarea
              rows={2}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Qo'shimcha izoh (rang, o'ram yoki qo'ng'iroq haqida)"
              className="w-full rounded-xl border border-[var(--border)] bg-[var(--bg)] p-3 text-sm text-[var(--text)] focus:border-[var(--brand)] focus:outline-none"
            />
          </div>
        </div>

        {errorMsg && (
          <p className="rounded-xl bg-red-500/10 px-3 py-2 text-xs font-medium text-red-600">
            {errorMsg}
          </p>
        )}

        <button
          type="submit"
          disabled={submitting}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-[var(--brand)] text-sm font-semibold text-white shadow-sm transition active:scale-[0.98] disabled:opacity-60"
        >
          <Send className="h-4 w-4" />
          <span>{submitting ? 'Yuborilmoqda...' : 'Zayavkani yuborish'}</span>
        </button>
      </form>
    </section>
  );
}
